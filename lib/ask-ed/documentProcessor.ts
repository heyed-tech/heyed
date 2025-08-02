import pdf from 'pdf-parse'
import { promises as fs } from 'fs'
import { DocumentChunk } from './vectorStore'

// Simple text splitter to replace langchain's RecursiveCharacterTextSplitter
class SimpleTextSplitter {
  private chunkSize: number
  private chunkOverlap: number
  private separators: string[]

  constructor(options: { chunkSize: number; chunkOverlap: number; separators: string[] }) {
    this.chunkSize = options.chunkSize
    this.chunkOverlap = options.chunkOverlap
    this.separators = options.separators
  }

  async splitText(text: string): Promise<string[]> {
    // Try each separator in order
    for (const separator of this.separators) {
      if (separator && text.includes(separator)) {
        const splits = text.split(separator)
        const processedChunks = this.processChunks(splits, separator)
        
        // If we got good chunks, return them
        if (processedChunks.every(chunk => chunk.length <= this.chunkSize)) {
          return processedChunks
        }
      }
    }
    
    // Fallback to simple character chunking
    return this.characterSplit(text)
  }

  private processChunks(splits: string[], separator: string): string[] {
    const chunks: string[] = []
    let currentChunk = ''
    
    for (let i = 0; i < splits.length; i++) {
      const split = splits[i]
      const pieceWithSeparator = split + (separator === '' ? '' : separator)
      
      if (currentChunk.length + pieceWithSeparator.length <= this.chunkSize) {
        currentChunk += pieceWithSeparator
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim())
          
          // Add overlap from the end of the previous chunk
          if (this.chunkOverlap > 0 && currentChunk.length > this.chunkOverlap) {
            const overlapText = currentChunk.slice(-this.chunkOverlap)
            currentChunk = overlapText + pieceWithSeparator
          } else {
            currentChunk = pieceWithSeparator
          }
        } else {
          currentChunk = pieceWithSeparator
        }
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim())
    }
    
    return chunks.filter(chunk => chunk.length > 0)
  }

  private characterSplit(text: string): string[] {
    const chunks: string[] = []
    
    for (let i = 0; i < text.length; i += this.chunkSize - this.chunkOverlap) {
      const chunk = text.slice(i, i + this.chunkSize)
      if (chunk.trim()) {
        chunks.push(chunk.trim())
      }
    }
    
    return chunks
  }
}

export class DocumentProcessor {
  private splitter: SimpleTextSplitter

  constructor() {
    this.splitter = new SimpleTextSplitter({
      chunkSize: 1200,
      chunkOverlap: 300,
      separators: [
        '\n\n\n',  // Multiple line breaks (section breaks)
        '\n\n',    // Paragraph breaks
        '\n',      // Line breaks
        '. ',      // Sentence endings
        '? ',      // Question endings
        '! ',      // Exclamation endings
        '; ',      // Semicolon breaks
        ', ',      // Comma breaks (for lists)
        ' ',       // Word breaks
        ''         // Character breaks (last resort)
      ],
    })
  }

async processPDF(filePath: string, documentName: string): Promise<DocumentChunk[]> {
    let dataBuffer: Buffer
    let pdfData: any
    
    try {
      dataBuffer = await fs.readFile(filePath)
    } catch (error) {
      throw new Error(`Failed to read PDF file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    try {
      pdfData = await pdf(dataBuffer)
    } catch (error) {
      throw new Error(`Failed to parse PDF ${documentName}: ${error instanceof Error ? error.message : 'Invalid PDF format'}`)
    }
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      throw new Error(`PDF ${documentName} contains no extractable text`)
    }
    
    const chunks: DocumentChunk[] = []
    const pages = pdfData.text.split('\f')
    
    for (let pageNum = 0; pageNum < pages.length; pageNum++) {
      const pageText = pages[pageNum]
      const textChunks = await this.splitter.splitText(pageText)
      
      for (const chunk of textChunks) {
        if (chunk.trim().length > 50) {
          chunks.push({
            content: chunk.trim(),
            metadata: {
              source: documentName,
              page: pageNum + 1,
              section: this.extractSection(chunk),
            },
          })
        }
      }
    }
    
    return chunks
  }

  private extractSection(text: string): string | undefined {
    const lines = text.split('\n')
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Match numbered sections (e.g., "1.", "2.1", "Annex A")
      if (trimmedLine.match(/^(\d+\.|\d+\.\d+|Annex\s[A-Z]|Schedule\s\d+|Part\s\d+)/i)) {
        return trimmedLine.substring(0, 80)
      }
      
      // Match all caps headings
      if (trimmedLine.match(/^[A-Z][A-Z\s\-:]+$/) && trimmedLine.length > 3 && trimmedLine.length < 60) {
        return trimmedLine
      }
      
      // Match title case headings
      if (trimmedLine.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+){1,6}:?$/) && trimmedLine.length < 60) {
        return trimmedLine
      }
      
      // Match specific compliance terms as section headers
      if (trimmedLine.match(/^(Safeguarding|EYFS|Ratios|Qualifications|Inspections?|Requirements?|Procedures?)/i)) {
        return trimmedLine.substring(0, 50)
      }
    }
    return undefined
  }

  async processMultiplePDFs(pdfPaths: { path: string; name: string }[]): Promise<DocumentChunk[]> {
    const allChunks: DocumentChunk[] = []
    const errors: string[] = []
    
    for (const { path, name } of pdfPaths) {
      try {
        console.log(`Processing ${name}...`)
        const chunks = await this.processPDF(path, name)
        allChunks.push(...chunks)
        console.log(`✓ Processed ${chunks.length} chunks from ${name}`)
      } catch (error) {
        const errorMsg = `Failed to process ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`✗ ${errorMsg}`)
        errors.push(errorMsg)
      }
    }
    
    if (errors.length > 0) {
      console.error(`\nProcessing completed with ${errors.length} error(s):`)
      errors.forEach(error => console.error(`  - ${error}`))
      
      if (allChunks.length === 0) {
        throw new Error('All PDF processing failed. No chunks generated.')
      } else {
        console.warn(`Continuing with ${allChunks.length} chunks from successful documents.`)
      }
    }
    
    return allChunks
  }
}
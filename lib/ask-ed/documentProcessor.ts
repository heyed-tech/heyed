import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import pdf from 'pdf-parse'
import { promises as fs } from 'fs'
import { DocumentChunk } from './vectorStore'

export class DocumentProcessor {
  private splitter: RecursiveCharacterTextSplitter

  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
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
    const dataBuffer = await fs.readFile(filePath)
    const pdfData = await pdf(dataBuffer)
    
    const chunks: DocumentChunk[] = []
    const pages = pdfData.text.split('\n\n')
    
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
    
    for (const { path, name } of pdfPaths) {
      console.log(`Processing ${name}...`)
      const chunks = await this.processPDF(path, name)
      allChunks.push(...chunks)
      console.log(`Processed ${chunks.length} chunks from ${name}`)
    }
    
    return allChunks
  }
}
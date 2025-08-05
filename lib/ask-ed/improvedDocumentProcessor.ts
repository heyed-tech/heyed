import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import pdf from 'pdf-parse'
import { promises as fs } from 'fs'
import { DocumentChunk } from './vectorStore'

interface PDFPage {
  pageNumber: number
  text: string
  sections: Section[]
}

interface Section {
  title: string
  content: string
  level: number
}

export class ImprovedDocumentProcessor {
  private splitter: RecursiveCharacterTextSplitter

  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
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
    const pdfData = await pdf(dataBuffer, {
      // Maintain layout to preserve structure
      normalizeWhitespace: false,
      // Get page info
      pagerender: this.pageRenderCallback
    })
    
    // Process the entire text with page markers
    const pages = this.extractPages(pdfData.text)
    const chunks: DocumentChunk[] = []
    
    for (const page of pages) {
      const sections = this.extractSections(page.text)
      
      for (const section of sections) {
        // Process each section separately to maintain context
        const sectionChunks = await this.processSectionWithContext(
          section,
          page.pageNumber,
          documentName
        )
        chunks.push(...sectionChunks)
      }
      
      // Handle any remaining content not in sections
      const remainingContent = this.extractRemainingContent(page.text, sections)
      if (remainingContent.trim().length > 50) {
        const remainingChunks = await this.processContentWithMetadata(
          remainingContent,
          page.pageNumber,
          documentName,
          'General Content'
        )
        chunks.push(...remainingChunks)
      }
    }
    
    return chunks
  }

  private pageRenderCallback(pageData: any) {
    // Callback to extract additional page information if needed
    return pageData
  }

  private extractPages(fullText: string): PDFPage[] {
    const pages: PDFPage[] = []
    
    // Look for page breaks - PDFs often have form feed characters or specific patterns
    const pageBreakPattern = /\f|(?:Page\s+\d+\s*$)|(?:^\s*\d+\s*$)/gm
    const parts = fullText.split(pageBreakPattern)
    
    // If no clear page breaks found, try to infer from content
    if (parts.length === 1) {
      // Estimate pages by character count (rough approximation)
      const avgCharsPerPage = 3000
      const estimatedPages = Math.ceil(fullText.length / avgCharsPerPage)
      
      for (let i = 0; i < estimatedPages; i++) {
        const start = i * avgCharsPerPage
        const end = Math.min((i + 1) * avgCharsPerPage, fullText.length)
        pages.push({
          pageNumber: i + 1,
          text: fullText.substring(start, end),
          sections: []
        })
      }
    } else {
      parts.forEach((part, index) => {
        if (part.trim()) {
          pages.push({
            pageNumber: index + 1,
            text: part,
            sections: []
          })
        }
      })
    }
    
    return pages
  }

  private extractSections(text: string): Section[] {
    const sections: Section[] = []
    const lines = text.split('\n')
    
    let currentSection: Section | null = null
    let contentBuffer: string[] = []
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      const sectionInfo = this.identifySection(trimmedLine)
      
      if (sectionInfo) {
        // Save previous section if exists
        if (currentSection && contentBuffer.length > 0) {
          currentSection.content = contentBuffer.join('\n').trim()
          sections.push(currentSection)
        }
        
        // Start new section
        currentSection = {
          title: sectionInfo.title,
          content: '',
          level: sectionInfo.level
        }
        contentBuffer = []
      } else if (currentSection) {
        contentBuffer.push(line)
      }
    }
    
    // Save last section
    if (currentSection && contentBuffer.length > 0) {
      currentSection.content = contentBuffer.join('\n').trim()
      sections.push(currentSection)
    }
    
    return sections
  }

  private identifySection(line: string): { title: string; level: number } | null {
    // Priority order for section identification
    
    // 1. Numbered sections with dots (e.g., "1.", "2.1", "2.1.1")
    const numberedMatch = line.match(/^(\d+(?:\.\d+)*)\s+(.+)/)
    if (numberedMatch) {
      const level = numberedMatch[1].split('.').length
      return { title: line, level }
    }
    
    // 2. Special sections (Annex, Appendix, Schedule, Part)
    const specialMatch = line.match(/^(Annex|Appendix|Schedule|Part)\s+([A-Z0-9]+)/i)
    if (specialMatch) {
      return { title: line, level: 1 }
    }
    
    // 3. All caps headings (likely major sections)
    if (line.match(/^[A-Z][A-Z\s\-:]+$/) && line.length > 3 && line.length < 80) {
      return { title: line, level: 1 }
    }
    
    // 4. Title case headings with colon
    if (line.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*:/) && line.length < 80) {
      return { title: line, level: 2 }
    }
    
    // 5. Specific compliance keywords at start of line
    const keywordMatch = line.match(/^(Safeguarding|EYFS|Ratios|Qualifications|Inspection|Requirements?|Procedures?|Responsibilities|Guidance|Definition)/i)
    if (keywordMatch) {
      return { title: line, level: 2 }
    }
    
    return null
  }

  private async processSectionWithContext(
    section: Section,
    pageNumber: number,
    documentName: string
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = []
    
    // For important sections, include the section title in each chunk for context
    const sectionContext = section.level <= 2 ? `${section.title}\n\n` : ''
    const contentToProcess = sectionContext + section.content
    
    const textChunks = await this.splitter.splitText(contentToProcess)
    
    for (const chunk of textChunks) {
      if (chunk.trim().length > 50) {
        chunks.push({
          content: chunk.trim(),
          metadata: {
            source: documentName,
            page: pageNumber,
            section: section.title,
            sectionLevel: section.level,
          },
        })
      }
    }
    
    return chunks
  }

  private async processContentWithMetadata(
    content: string,
    pageNumber: number,
    documentName: string,
    sectionName: string
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = []
    const textChunks = await this.splitter.splitText(content)
    
    for (const chunk of textChunks) {
      if (chunk.trim().length > 50) {
        chunks.push({
          content: chunk.trim(),
          metadata: {
            source: documentName,
            page: pageNumber,
            section: sectionName,
          },
        })
      }
    }
    
    return chunks
  }

  private extractRemainingContent(pageText: string, sections: Section[]): string {
    // Remove all section content from page text to get remaining content
    let remaining = pageText
    
    for (const section of sections) {
      const sectionFullText = section.title + '\n' + section.content
      remaining = remaining.replace(sectionFullText, '')
    }
    
    return remaining.trim()
  }

  async processMultiplePDFs(pdfPaths: { path: string; name: string }[]): Promise<DocumentChunk[]> {
    const allChunks: DocumentChunk[] = []
    
    for (const { path, name } of pdfPaths) {
      console.log(`Processing ${name}...`)
      try {
        const chunks = await this.processPDF(path, name)
        allChunks.push(...chunks)
        console.log(`Processed ${chunks.length} chunks from ${name}`)
      } catch (error) {
        console.error(`Error processing ${name}:`, error)
      }
    }
    
    return allChunks
  }
}
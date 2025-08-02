declare module 'pdf-parse' {
  interface PDFInfo {
    numpages: number
    numrender: number
    info: any
    metadata: any
    version: string
  }

  interface PDFData {
    numpages: number
    numrender: number
    info: any
    metadata: any
    version: string
    text: string
  }

  function pdfParse(buffer: Buffer, options?: any): Promise<PDFData>
  export = pdfParse
}
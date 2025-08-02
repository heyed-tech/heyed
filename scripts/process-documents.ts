import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { DocumentProcessor } from '../lib/ask-ed/documentProcessor'
import { addDocuments } from '../lib/ask-ed/vectorStore'

async function main() {
  console.log('Starting document processing...')
  
  const processor = new DocumentProcessor()
  
  const documents = [
    { path: path.join(__dirname, '../documents/Keeping_children_safe_in_education_2025.pdf'), name: 'KCSiE 2025' },
    { path: path.join(__dirname, '../documents/EYFS_framework_for_group_and_school_based_providers_.pdf'), name: 'EYFS Framework' },
    { path: path.join(__dirname, '../documents/Early years inspection handbook - GOV.UK.pdf'), name: 'Early Years Inspection Handbook' },
  ]
  
  try {
    console.log('Processing PDFs...')
    const chunks = await processor.processMultiplePDFs(documents)
    
    console.log(`Total chunks generated: ${chunks.length}`)
    console.log('Uploading to vector store...')
    
    const batchSize = 50
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      await addDocuments(batch)
      console.log(`Uploaded ${Math.min(i + batchSize, chunks.length)}/${chunks.length} chunks`)
    }
    
    console.log('Document processing complete!')
  } catch (error) {
    console.error('Error processing documents:', error)
    process.exit(1)
  }
}

main()
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { addDocuments } from '../lib/ask-ed/vectorStore'
import { getSupabase } from '../lib/supabase'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

async function main() {
  console.log('🔄 Updating Updates 2025 document with corrected EYFS information...')
  
  const supabase = getSupabase()
  
  try {
    // Step 1: Delete existing "Updates 2025" documents
    console.log('1️⃣ Deleting existing "Updates 2025" documents...')
    const { error: deleteError } = await supabase
      .from('ask_ed_documents')
      .delete()
      .eq('source_document', 'Updates 2025')
    
    if (deleteError) {
      throw new Error(`Failed to delete existing documents: ${deleteError.message}`)
    }
    
    console.log(`✅ Deleted existing "Updates 2025" documents`)
    
    // Step 2: Read the corrected text file
    console.log('2️⃣ Reading corrected Updates 2025 content...')
    const textContent = fs.readFileSync(
      path.join(__dirname, '../documents/Updates 2025.txt'), 
      'utf-8'
    )
    
    // Step 3: Split the text into chunks
    console.log('3️⃣ Splitting text into chunks...')
    const splitter = new RecursiveCharacterTextSplitter({
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
    
    const textChunks = await splitter.splitText(textContent)
    
    // Step 4: Create document chunks with metadata
    const documentChunks = textChunks.map((chunk, index) => {
      let section: string | undefined
      
      // Extract section from the beginning of the chunk
      const lines = chunk.split('\n')
      for (const line of lines) {
        const trimmedLine = line.trim()
        
        // Match section headings
        if (trimmedLine.match(/^(EYFS|Ofsted|Data protection|Childcare entitlements|National wraparound|Safeguarding|Prevent duty|Implementation)/i)) {
          section = trimmedLine.substring(0, 50)
          break
        }
      }
      
      return {
        content: chunk.trim(),
        metadata: {
          source: 'Updates 2025',
          page: Math.floor(index / 3) + 1, // Approximate page numbers
          section: section,
        },
      }
    }).filter(chunk => chunk.content.length > 50) // Filter out very short chunks
    
    console.log(`📄 Generated ${documentChunks.length} chunks from corrected Updates 2025`)
    
    // Step 5: Add the new chunks to the vector store
    console.log('4️⃣ Adding corrected chunks to vector store...')
    const batchSize = 50
    for (let i = 0; i < documentChunks.length; i += batchSize) {
      const batch = documentChunks.slice(i, i + batchSize)
      await addDocuments(batch)
      console.log(`📤 Uploaded ${Math.min(i + batchSize, documentChunks.length)}/${documentChunks.length} chunks`)
    }
    
    // Step 6: Verify the update
    console.log('5️⃣ Verifying update...')
    const { count, error: countError } = await supabase
      .from('ask_ed_documents')
      .select('*', { count: 'exact', head: true })
      .eq('source_document', 'Updates 2025')
    
    if (countError) {
      throw new Error(`Failed to verify update: ${countError.message}`)
    }
    
    console.log(`✅ Updates 2025 update complete! Now contains ${count} chunks with corrected EYFS information.`)
    console.log('🎉 Ask Ed should now provide accurate EYFS 2025 updates!')
    console.log('')
    console.log('Key EYFS updates now available:')
    console.log('• New EYFS statutory framework (effective September 1, 2025)')
    console.log('• Strengthened safeguarding and welfare requirements')  
    console.log('• "Giving Every Child the Best Start in Life" strategy (£1.5 billion)')
    
  } catch (error) {
    console.error('❌ Error updating Updates 2025:', error)
    process.exit(1)
  }
}

main()
import * as dotenv from 'dotenv';
import path from 'path';
import { promises as fs } from 'fs';

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { DocumentProcessor } from '../lib/ask-ed/documentProcessor';
import { addDocuments } from '../lib/ask-ed/vectorStore';

async function main() {
  console.log('Starting document processing...');
  
  const processor = new DocumentProcessor();
  
  // Get documents directory from environment or use default
  const documentsDir = process.env.DOCUMENTS_DIR || path.join(__dirname, '../documents');
  
  const documents = [
    { path: path.join(documentsDir, 'Keeping_children_safe_in_education_2025.pdf'), name: 'KCSiE 2025' },
    { path: path.join(documentsDir, 'EYFS_framework_for_group_and_school_based_providers_.pdf'), name: 'EYFS Framework' },
    { path: path.join(documentsDir, 'Early years inspection handbook - GOV.UK.pdf'), name: 'Early Years Inspection Handbook' },
  ];
  
  console.log(`Looking for documents in: ${documentsDir}`);
  
  try {
    // Validate all files exist before processing
    console.log('Validating PDF files...');
    for (const doc of documents) {
      try {
        await fs.access(doc.path);
        const stats = await fs.stat(doc.path);
        if (!stats.isFile()) {
          throw new Error(`${doc.path} is not a file`);
        }
        console.log(`✓ Found ${doc.name} (${Math.round(stats.size / 1024 / 1024)}MB)`);
      } catch (error) {
        console.error(`✗ Cannot access ${doc.name} at ${doc.path}:`, error);
        throw new Error(`PDF file validation failed for ${doc.name}`);
      }
    }

    console.log('\n📄 Processing PDFs...');
    const startTime = Date.now();
    const chunks = await processor.processMultiplePDFs(documents);
    
    const processingTime = Date.now() - startTime;
    console.log(`\n✅ Total chunks generated: ${chunks.length}`);
    console.log(`⏱️  Processing time: ${Math.round(processingTime / 1000)}s`);
    console.log(`📊 Average: ${Math.round(chunks.length / (processingTime / 1000))} chunks/second`);
    
    console.log('\n🚀 Uploading to vector store...');
    const uploadStart = Date.now();
    await addDocuments(chunks);
    
    const uploadTime = Date.now() - uploadStart;
    const totalTime = Date.now() - startTime;
    
    console.log(`\n🎉 Document processing complete!`);
    console.log(`📈 Upload time: ${Math.round(uploadTime / 1000)}s`);
    console.log(`⏰ Total time: ${Math.round(totalTime / 1000)}s`);
    console.log(`💾 Processed ${chunks.length} chunks from ${documents.length} documents`);
  } catch (error) {
    console.error('Error processing documents:', error);
    process.exit(1);
  }
}

main();
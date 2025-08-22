import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { createClient } from '@supabase/supabase-js'
import { addDocuments } from '../lib/ask-ed/vectorStore'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function fixEYFSChunks() {
  console.log('Fixing EYFS Updates chunks...')
  
  // First, delete the old chunks
  console.log('Removing old EYFS Updates chunks...')
  const { error: deleteError } = await supabase
    .from('ask_ed_documents')
    .delete()
    .eq('metadata->>source', 'EYFS Updates September 2025')
    
  if (deleteError) {
    console.error('Error deleting old chunks:', deleteError)
    return
  }
  
  // Read the full content
  const filePath = path.join(__dirname, '../documents/EYFS Updates September 2025.txt')
  const fullContent = fs.readFileSync(filePath, 'utf-8')
  
  // Create better chunks that include context
  const chunks = [
    {
      // Full overview chunk with all changes
      content: fullContent,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'eyfs-framework',
        year: '2025',
        chunk_type: 'full_document',
        keywords: ['EYFS', 'updates', 'changes', 'September 2025', 'new requirements', 'safeguarding', 'welfare']
      }
    },
    {
      // Safeguarding and recruitment chunk
      content: `EYFS Updates September 2025 - Safeguarding policies

From 1 September 2025, providers must have written safeguarding policies that clearly set out how safer recruitment is carried out. This includes obtaining professional references (not personal or open references), verifying them properly, and keeping records of checks. Policies must also describe how unsuitable individuals are prevented from working with children.`,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'safeguarding',
        year: '2025',
        chunk_type: 'specific_requirement',
        keywords: ['safeguarding', 'recruitment', 'references', 'checks', 'EYFS updates']
      }
    },
    {
      // Whistleblowing chunk
      content: `EYFS Updates September 2025 - Whistleblowing

From 1 September 2025, all settings must provide a clear process for staff and volunteers to raise concerns about practice, leadership, or safeguarding failures. This must include internal reporting routes and external channels, such as contacting Ofsted or the NSPCC, so staff feel safe to speak up.`,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'whistleblowing',
        year: '2025',
        chunk_type: 'specific_requirement',
        keywords: ['whistleblowing', 'raising concerns', 'Ofsted', 'NSPCC', 'EYFS updates']
      }
    },
    {
      // Child absence monitoring chunk
      content: `EYFS Updates September 2025 - Child absence monitoring

From 1 September 2025, providers must actively monitor patterns of absence. Unexplained or frequent absences must be followed up to check on the child's welfare. Each child must have at least two emergency contact details recorded to make sure parents or carers can always be reached.`,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'attendance',
        year: '2025',
        chunk_type: 'specific_requirement',
        keywords: ['absence monitoring', 'emergency contacts', 'welfare', 'EYFS updates']
      }
    },
    {
      // Training chunk
      content: `EYFS Updates September 2025 - Safeguarding training (Annex C)

From 1 September 2025, the framework now sets out more detail on safeguarding training. Providers must show how training is delivered, how often it is refreshed, and how staff embed it in daily practice. Records of training must be kept up to date so it is clear who has received training and when.`,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'training',
        year: '2025',
        chunk_type: 'specific_requirement',
        keywords: ['safeguarding training', 'Annex C', 'training records', 'EYFS updates']
      }
    },
    {
      // PFA chunk
      content: `EYFS Updates September 2025 - Paediatric First Aid (PFA)

From 1 September 2025, students, apprentices, or new staff can only be counted in staff-to-child ratios if they hold a valid paediatric first aid certificate and have been judged competent by their employer. This ensures ratios do not include untrained staff.`,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'first-aid',
        year: '2025',
        chunk_type: 'specific_requirement',
        keywords: ['paediatric first aid', 'PFA', 'ratios', 'students', 'EYFS updates']
      }
    },
    {
      // Safer eating chunk
      content: `EYFS Updates September 2025 - Safer eating

From 1 September 2025, providers must take clear steps to reduce the risk of choking. This includes preparing food safely (e.g. cutting grapes lengthways, avoiding hard or round foods), supervising children closely during meals, and creating calm mealtime environments. All allergies and dietary needs must be recorded, and individual action plans must be in place to support children with medical conditions. Staff must also be trained to respond effectively if a child chokes.`,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'health-safety',
        year: '2025',
        chunk_type: 'specific_requirement',
        keywords: ['safer eating', 'choking', 'food safety', 'allergies', 'EYFS updates']
      }
    },
    {
      // Toileting chunk
      content: `EYFS Updates September 2025 - Toileting and nappy changing

From 1 September 2025, children's privacy must be respected, but staff must balance this with safeguarding. Only one child should be changed at a time, and procedures must prevent opportunities for abuse. Records of nappy changing or toileting must be maintained, and supervision is required to make sure policies are being followed correctly.`,
      metadata: {
        source: 'EYFS Updates September 2025',
        category: 'regulatory-updates',
        type: 'personal-care',
        year: '2025',
        chunk_type: 'specific_requirement',
        keywords: ['toileting', 'nappy changing', 'privacy', 'safeguarding', 'EYFS updates']
      }
    }
  ]
  
  console.log(`Created ${chunks.length} improved chunks`)
  console.log('Uploading to vector store...')
  
  // Upload all chunks
  await addDocuments(chunks)
  
  console.log('EYFS chunks fixed successfully!')
  
  // Verify
  const { count } = await supabase
    .from('ask_ed_documents')
    .select('*', { count: 'exact', head: true })
    .eq('metadata->>source', 'EYFS Updates September 2025')
    
  console.log(`\nVerification: ${count} EYFS Updates chunks now in database`)
}

fixEYFSChunks()
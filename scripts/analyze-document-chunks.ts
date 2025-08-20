import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { getSupabase } from '../lib/supabase'

interface DocumentAnalysis {
  source: string
  totalChunks: number
  sections: string[]
  sampleContent: string[]
  metadata: any[]
  topics: string[]
}

async function analyzeDocumentChunks() {
  console.log('Analyzing Ask Ed document chunks...')
  
  const supabase = getSupabase()
  
  try {
    // Get overall statistics
    const { data: allDocs, error: allError } = await supabase
      .from('ask_ed_documents')
      .select('*')
      .limit(1000) // Get a large sample
    
    if (allError) {
      throw allError
    }
    
    if (!allDocs || allDocs.length === 0) {
      console.log('No documents found in ask_ed_documents table')
      return
    }
    
    console.log(`Total document chunks analyzed: ${allDocs.length}`)
    
    // Group by source document
    const sourceGroups: Record<string, any[]> = {}
    for (const doc of allDocs) {
      const source = (doc.source_document as string) || 'Unknown'
      if (!(source in sourceGroups)) {
        sourceGroups[source] = []
      }
      sourceGroups[source]!.push(doc)
    }
    
    const analyses: DocumentAnalysis[] = []
    
    for (const [source, docs] of Object.entries(sourceGroups)) {
      console.log(`\n=== Analyzing ${source} ===`)
      console.log(`Chunks: ${docs.length}`)
      
      // Extract unique sections
      const sections = [...new Set(docs
        .map(doc => doc.section)
        .filter(Boolean)
        .map(s => s.trim())
      )].sort()
      
      // Get sample content (first few chunks)
      const sampleContent = docs
        .slice(0, 5)
        .map(doc => doc.content.substring(0, 200) + '...')
      
      // Extract metadata patterns
      const metadata = docs
        .slice(0, 10)
        .map(doc => doc.metadata)
      
      // Analyze content for topics (keywords extraction)
      const allContent = docs.map(d => d.content).join(' ')
      const topics = extractTopics(allContent)
      
      const analysis: DocumentAnalysis = {
        source,
        totalChunks: docs.length,
        sections,
        sampleContent,
        metadata,
        topics
      }
      
      analyses.push(analysis)
      
      console.log(`Sections found: ${sections.length}`)
      if (sections.length > 0) {
        console.log('Sample sections:', sections.slice(0, 10).join(', '))
      }
      
      console.log(`Main topics: ${topics.slice(0, 10).join(', ')}`)
    }
    
    // Generate question templates based on analysis
    console.log('\n=== GENERATING QUESTION TEMPLATES ===')
    
    for (const analysis of analyses) {
      console.log(`\n--- ${analysis.source} ---`)
      const questions = generateQuestionTemplates(analysis)
      questions.forEach((q, i) => console.log(`${i + 1}. ${q}`))
    }
    
    // Categorize by setting type
    console.log('\n=== SETTING TYPE CATEGORIZATION ===')
    categorizeBySettingType(analyses)
    
    return analyses
    
  } catch (error) {
    console.error('Error analyzing documents:', error)
    throw error
  }
}

function extractTopics(content: string): string[] {
  // Common compliance terms to look for
  const complianceTerms = [
    'safeguarding', 'child protection', 'dbs check', 'supervision', 'ratio',
    'planning', 'assessment', 'development', 'learning', 'curriculum',
    'health', 'safety', 'wellbeing', 'nutrition', 'medication',
    'record keeping', 'documentation', 'policy', 'procedure',
    'training', 'qualification', 'staff', 'practitioner',
    'observation', 'tracking', 'progress', 'milestone',
    'environment', 'indoor', 'outdoor', 'space', 'equipment',
    'communication', 'partnership', 'parent', 'family',
    'inclusion', 'sen', 'diversity', 'equality',
    'transition', 'school readiness', 'moving on',
    'inspection', 'ofsted', 'quality', 'improvement'
  ]
  
  const foundTerms = complianceTerms.filter(term => 
    content.toLowerCase().includes(term.toLowerCase())
  )
  
  return foundTerms
}

function generateQuestionTemplates(analysis: DocumentAnalysis): string[] {
  const templates: string[] = []
  const source = analysis.source.toLowerCase()
  
  // Document-specific templates
  if (source.includes('kcsie')) {
    templates.push(
      "What are the safeguarding responsibilities for school staff?",
      "How should we handle child protection concerns?",
      "What DBS checks are required for staff?",
      "What is the role of the designated safeguarding lead?",
      "How do we report safeguarding incidents?"
    )
  }
  
  if (source.includes('eyfs')) {
    templates.push(
      "What are the EYFS learning and development requirements?",
      "What staff-to-child ratios are required?",
      "How do we assess children's development?",
      "What are the safeguarding and welfare requirements?",
      "How should we plan activities for different age groups?"
    )
  }
  
  if (source.includes('inspection')) {
    templates.push(
      "How do we prepare for an Ofsted inspection?",
      "What evidence do inspectors look for?",
      "How are early years settings graded?",
      "What happens during an inspection visit?",
      "How do we improve our Ofsted rating?"
    )
  }
  
  // Section-based templates
  analysis.sections.forEach(section => {
    const sectionLower = section.toLowerCase()
    
    if (sectionLower.includes('ratio')) {
      templates.push(`What are the ${section.toLowerCase()} requirements?`)
    }
    if (sectionLower.includes('qualification')) {
      templates.push(`What ${section.toLowerCase()} do we need?`)
    }
    if (sectionLower.includes('assessment')) {
      templates.push(`How do we conduct ${section.toLowerCase()}?`)
    }
  })
  
  // Topic-based templates
  analysis.topics.forEach(topic => {
    if (topic === 'supervision') {
      templates.push("How often should we supervise staff?")
    }
    if (topic === 'planning') {
      templates.push("How do we plan learning activities?")
    }
    if (topic === 'record keeping') {
      templates.push("What records do we need to keep?")
    }
  })
  
  return [...new Set(templates)] // Remove duplicates
}

function categorizeBySettingType(analyses: DocumentAnalysis[]) {
  console.log('\nNursery-specific content:')
  analyses.forEach(analysis => {
    const nurseryTopics = analysis.topics.filter(topic => 
      ['ratio', 'planning', 'assessment', 'development', 'curriculum'].includes(topic)
    )
    if (nurseryTopics.length > 0) {
      console.log(`${analysis.source}: ${nurseryTopics.join(', ')}`)
    }
  })
  
  console.log('\nClub-specific content:')
  analyses.forEach(analysis => {
    const clubTopics = analysis.topics.filter(topic => 
      ['safeguarding', 'supervision', 'dbs check', 'health', 'safety'].includes(topic)
    )
    if (clubTopics.length > 0) {
      console.log(`${analysis.source}: ${clubTopics.join(', ')}`)
    }
  })
  
  console.log('\nUniversal content (both nursery and club):')
  analyses.forEach(analysis => {
    const universalTopics = analysis.topics.filter(topic => 
      ['child protection', 'record keeping', 'training', 'policy', 'inclusion'].includes(topic)
    )
    if (universalTopics.length > 0) {
      console.log(`${analysis.source}: ${universalTopics.join(', ')}`)
    }
  })
}

// Run the analysis
analyzeDocumentChunks()
  .then(() => {
    console.log('\nAnalysis complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Analysis failed:', error)
    process.exit(1)
  })
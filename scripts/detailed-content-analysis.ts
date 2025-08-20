import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { getSupabase } from '../lib/supabase'

async function detailedContentAnalysis() {
  console.log('Performing detailed content analysis...')
  
  const supabase = getSupabase()
  
  try {
    // Get sample from each document type
    const { data: sampleDocs, error } = await supabase
      .from('ask_ed_documents')
      .select('*')
      .limit(50)
    
    if (error) throw error
    
    if (!sampleDocs || sampleDocs.length === 0) {
      console.log('No documents found')
      return
    }
    
    console.log('\n=== METADATA STRUCTURE ANALYSIS ===')
    sampleDocs.slice(0, 5).forEach((doc, i) => {
      console.log(`\nDocument ${i + 1}:`)
      console.log(`Source: ${doc.source_document}`)
      console.log(`Page: ${doc.page_number}`)
      console.log(`Section: ${doc.section}`)
      console.log(`Metadata:`, JSON.stringify(doc.metadata, null, 2))
      console.log(`Content preview: ${(doc.content as string).substring(0, 300)}...`)
      console.log('---')
    })
    
    // Analyze content patterns by document type
    const docTypes = [...new Set(sampleDocs.map(d => d.source_document))]
    
    for (const docType of docTypes) {
      console.log(`\n=== CONTENT PATTERNS FOR ${docType} ===`)
      
      const docsOfType = sampleDocs.filter(d => d.source_document === docType)
      
      // Look for common question patterns in the content
      const questionPatterns = extractQuestionPatterns(docsOfType)
      console.log('Common question/topic patterns found:')
      questionPatterns.forEach((pattern, i) => {
        console.log(`${i + 1}. ${pattern}`)
      })
      
      // Look for specific compliance topics
      const complianceTopics = extractComplianceTopics(docsOfType)
      console.log('\nKey compliance topics:')
      complianceTopics.forEach((topic, i) => {
        console.log(`${i + 1}. ${topic}`)
      })
    }
    
    // Generate comprehensive question templates
    console.log('\n=== COMPREHENSIVE QUESTION TEMPLATES ===')
    
    const templates = {
      safeguarding: [
        "What are the key safeguarding responsibilities?",
        "How do we handle child protection concerns?",
        "What should we do if we suspect abuse?",
        "Who is the designated safeguarding lead?",
        "How do we report safeguarding incidents?",
        "What are the signs of abuse to look for?",
        "How do we keep children safe online?",
        "What safeguarding training is required?"
      ],
      ratios: [
        "What are the required staff-to-child ratios?",
        "How many qualified staff do we need?",
        "Can we include apprentices in ratios?",
        "What happens if staff are absent?",
        "Do volunteers count towards ratios?",
        "What qualifications count for ratios?"
      ],
      assessment: [
        "How do we assess children's development?",
        "What is the reception baseline assessment?",
        "How often should we observe children?",
        "What records do we need to keep?",
        "How do we track children's progress?",
        "What should we include in learning journeys?"
      ],
      inspection: [
        "How do we prepare for Ofsted inspection?",
        "What will inspectors look at?",
        "How long does an inspection take?",
        "What evidence do we need to provide?",
        "How can we improve our rating?",
        "What happens after inspection?"
      ],
      curriculum: [
        "What are the EYFS learning areas?",
        "How do we plan activities?",
        "What is the prime areas of learning?",
        "How do we support school readiness?",
        "What about outdoor learning?",
        "How do we plan for different ages?"
      ],
      health_safety: [
        "What health and safety checks are needed?",
        "How do we administer medication?",
        "What about food allergies?",
        "What first aid requirements apply?",
        "How do we ensure premises are safe?",
        "What about risk assessments?"
      ],
      training: [
        "What training do staff need?",
        "How often is safeguarding training required?",
        "What qualifications do we need?",
        "What about continued professional development?",
        "Who can provide training?",
        "What records of training must we keep?"
      ],
      policies: [
        "What policies must we have?",
        "How often should policies be reviewed?",
        "What should be in our safeguarding policy?",
        "Do we need a behaviour policy?",
        "What about special educational needs policies?",
        "How do we share policies with parents?"
      ]
    }
    
    Object.entries(templates).forEach(([category, questions]) => {
      console.log(`\n${category.toUpperCase().replace('_', ' & ')}:`)
      questions.forEach((q, i) => console.log(`  ${i + 1}. ${q}`))
    })
    
    console.log('\n=== SETTING TYPE SPECIFIC TEMPLATES ===')
    
    console.log('\nNURSERY SPECIFIC:')
    const nurseryQuestions = [
      "What are the EYFS requirements for 2-year-olds?",
      "How do we transition children to school?",
      "What about nappy changing procedures?",
      "How do we handle separation anxiety?",
      "What learning goals should 3-year-olds achieve?",
      "How do we work with parents on potty training?",
      "What about sleep routines for younger children?",
      "How do we adapt activities for different development stages?"
    ]
    nurseryQuestions.forEach((q, i) => console.log(`  ${i + 1}. ${q}`))
    
    console.log('\nCLUB SPECIFIC:')
    const clubQuestions = [
      "What are the requirements for after-school clubs?",
      "How do we supervise children during free play?",
      "What activities are appropriate for school-age children?",
      "How do we handle homework time?",
      "What about children with additional needs?",
      "How do we manage different age groups together?",
      "What are the requirements for holiday clubs?",
      "How do we ensure safe collection of children?"
    ]
    clubQuestions.forEach((q, i) => console.log(`  ${i + 1}. ${q}`))
    
  } catch (error) {
    console.error('Error in detailed analysis:', error)
    throw error
  }
}

function extractQuestionPatterns(docs: any[]): string[] {
  const patterns: string[] = []
  
  docs.forEach(doc => {
    const content = (doc.content as string).toLowerCase()
    
    // Look for question-like phrases or requirements
    if (content.includes('must') || content.includes('should') || content.includes('require')) {
      const sentences = content.split(/[.!?]+/)
      sentences.forEach(sentence => {
        if (sentence.includes('must') && sentence.length < 200) {
          patterns.push(sentence.trim())
        }
      })
    }
  })
  
  return [...new Set(patterns)].slice(0, 10) // Return unique patterns
}

function extractComplianceTopics(docs: any[]): string[] {
  const topics: string[] = []
  
  docs.forEach(doc => {
    const content = (doc.content as string).toLowerCase()
    const section = doc.section || ''
    
    // Extract key compliance terms from content and sections
    const keyTerms = [
      'safeguarding', 'child protection', 'dbs', 'supervision', 'ratios',
      'assessment', 'planning', 'curriculum', 'health', 'safety',
      'qualifications', 'training', 'policies', 'procedures', 'records',
      'inspection', 'ofsted', 'eyfs', 'sen', 'inclusion', 'equality'
    ]
    
    keyTerms.forEach(term => {
      if (content.includes(term) || section.toLowerCase().includes(term)) {
        topics.push(term)
      }
    })
  })
  
  // Count frequency and return most common
  const topicCount = topics.reduce((acc, topic) => {
    acc[topic] = (acc[topic] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(topicCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15)
    .map(([topic]) => topic)
}

// Run the detailed analysis
detailedContentAnalysis()
  .then(() => {
    console.log('\nDetailed analysis complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Detailed analysis failed:', error)
    process.exit(1)
  })
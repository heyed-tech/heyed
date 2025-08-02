// Query preprocessing for better search results

const ACRONYM_EXPANSIONS: Record<string, string> = {
  'DSL': 'Designated Safeguarding Lead',
  'DDSL': 'Deputy Designated Safeguarding Lead',
  'SENCO': 'Special Educational Needs Coordinator',
  'DBS': 'Disclosure and Barring Service',
  'SCR': 'Single Central Record',
  'LAC': 'Looked After Children',
  'PLaC': 'Previously Looked After Children',
  'FGM': 'Female Genital Mutilation',
  'CSE': 'Child Sexual Exploitation',
  'CCE': 'Child Criminal Exploitation',
  'MASH': 'Multi-Agency Safeguarding Hub',
  'LADO': 'Local Authority Designated Officer',
  'NSPCC': 'National Society for the Prevention of Cruelty to Children',
  'CEOP': 'Child Exploitation and Online Protection',
  'CAMHS': 'Child and Adolescent Mental Health Services',
}

const TERM_NORMALIZATIONS: Record<string, string> = {
  'under-2s': 'under 2 years',
  'under 2s': 'under 2 years', 
  '2-3s': '2-3 years',
  '3-4s': '3-4 years',
  'pre-school': 'preschool',
  'childminder': 'childminding',
  'nursery school': 'nursery',
  'early years': 'EYFS',
  'safeguarding lead': 'Designated Safeguarding Lead',
}

const COMMON_VARIATIONS: Record<string, string[]> = {
  'annex': ['annex', 'appendix', 'schedule'],
  'ratio': ['ratios', 'ratio', 'staff ratio', 'adult ratio'],
  'training': ['training', 'professional development', 'CPD'],
  'record': ['records', 'recording', 'documentation'],
  'reporting': ['report', 'reporting', 'referral'],
}

export interface QueryIntent {
  type: 'definition' | 'process' | 'requirement' | 'timing' | 'responsibility' | 'general'
  confidence: number
}

export function preprocessQuery(query: string): string {
  let processedQuery = query.toLowerCase().trim()
  
  // Expand acronyms
  Object.entries(ACRONYM_EXPANSIONS).forEach(([acronym, expansion]) => {
    const regex = new RegExp(`\\b${acronym.toLowerCase()}\\b`, 'gi')
    processedQuery = processedQuery.replace(regex, `${acronym} ${expansion}`)
  })
  
  // Normalize terms
  Object.entries(TERM_NORMALIZATIONS).forEach(([term, normalized]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi')
    processedQuery = processedQuery.replace(regex, normalized)
  })
  
  return processedQuery
}

export function detectQueryIntent(query: string): QueryIntent {
  const lowerQuery = query.toLowerCase()
  
  // Definition questions
  if (lowerQuery.match(/^what is|^what are|^define|^explain/)) {
    return { type: 'definition', confidence: 0.9 }
  }
  
  // Process questions
  if (lowerQuery.match(/^how to|^how do|^what process|^what steps|^procedure/)) {
    return { type: 'process', confidence: 0.9 }
  }
  
  // Requirement questions
  if (lowerQuery.match(/must|required|mandatory|need to|have to|obligation/)) {
    return { type: 'requirement', confidence: 0.8 }
  }
  
  // Timing questions
  if (lowerQuery.match(/when|how often|frequency|deadline|within|days|weeks|months/)) {
    return { type: 'timing', confidence: 0.8 }
  }
  
  // Responsibility questions
  if (lowerQuery.match(/who|whose|responsibility|responsible|role|duty/)) {
    return { type: 'responsibility', confidence: 0.8 }
  }
  
  return { type: 'general', confidence: 0.5 }
}

export function generateSearchVariations(query: string): string[] {
  const variations = [query]
  const lowerQuery = query.toLowerCase()
  
  // Add common variations
  Object.entries(COMMON_VARIATIONS).forEach(([key, variants]) => {
    if (lowerQuery.includes(key)) {
      variants.forEach(variant => {
        if (variant !== key) {
          variations.push(query.replace(new RegExp(key, 'gi'), variant))
        }
      })
    }
  })
  
  return [...new Set(variations)] // Remove duplicates
}

const ANSWER_TEMPLATES: Record<string, string> = {
  definition: `When explaining {term}, provide:
- Clear definition in simple terms
- Why it matters for compliance
- Key points to remember
- Reference to source document`,
  
  process: `When describing {process}, outline:
- Step-by-step procedure
- Who is responsible for each step
- Required timescales
- Documentation needed
- What happens if not followed`,
  
  requirement: `For {requirement} questions, specify:
- What must be done (mandatory vs recommended)
- Legal basis or source document
- Consequences of non-compliance
- How to evidence compliance`,
  
  timing: `For {timing} questions, provide:
- Specific timeframes or deadlines
- When the requirement applies
- Frequency of review/renewal
- Grace periods or exceptions`,
  
  responsibility: `For {responsibility} questions, clarify:
- Primary responsibility holder
- Supporting roles
- When responsibility can be delegated
- Required qualifications/training`
}

export function getResponseTemplate(intent: QueryIntent, query: string): string {
  if (intent.confidence < 0.7) {
    return '' // Use general response for low confidence
  }
  
  const template = ANSWER_TEMPLATES[intent.type]
  if (!template) return ''
  
  // Replace placeholder with query context
  const queryTerm = query.toLowerCase().includes('what is') 
    ? query.replace(/what is\s+/i, '').trim()
    : 'this topic'
    
  return template.replace(/\{(term|process|requirement|timing|responsibility)\}/g, queryTerm)
}

export function enhanceQuery(query: string): {
  processedQuery: string
  intent: QueryIntent
  variations: string[]
  responseTemplate?: string
} {
  const processedQuery = preprocessQuery(query)
  const intent = detectQueryIntent(processedQuery)
  const variations = generateSearchVariations(processedQuery)
  const responseTemplate = getResponseTemplate(intent, query)
  
  return {
    processedQuery,
    intent,
    variations,
    responseTemplate
  }
}
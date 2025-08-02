// Detects if a query is within the scope of compliance topics

const COMPLIANCE_KEYWORDS = [
  // Core compliance topics
  'kcsie', 'eyfs', 'ofsted', 'safeguarding', 'dsl', 'designated safeguarding lead',
  'ratios', 'staff ratio', 'supervision', 'qualifications', 'dbs', 'disclosure',
  'inspection', 'compliance', 'policy', 'procedure', 'framework', 'statutory',
  
  // Childcare specific
  'nursery', 'childcare', 'early years', 'preschool', 'pre-school', 'childminder',
  'holiday club', 'after school', 'out of school', 'wrap around care',
  'children', 'child protection', 'welfare', 'development', 'learning goals',
  
  // Safety and health
  'first aid', 'paediatric', 'risk assessment', 'health and safety', 'accident',
  'incident', 'fire safety', 'emergency', 'evacuation', 'food safety', 'allergy',
  
  // Staff and training
  'training', 'cpd', 'professional development', 'recruitment', 'suitability',
  'supervision', 'appraisal', 'induction', 'probation',
  
  // Documentation
  'record keeping', 'documentation', 'registers', 'forms', 'evidence',
  'assessment', 'observation', 'tracking', 'progress',
  
  // Specific terms
  'annex', 'schedule', 'appendix', 'regulation', 'requirement', 'guidance',
  'best practice', 'standards', 'quality', 'improvement'
]

const OFF_TOPIC_PATTERNS = [
  // General conversation
  /^(hi|hello|hey|good morning|good afternoon)/i,
  /what('s| is) (the|today's) (date|day|time)/i,  
  /how are you/i,
  /who (are you|created you|made you)/i,
  /what can you do/i,
  
  // Personal questions
  /tell me about yourself/i,
  /what('s| is) your (name|age)/i,
  /where (are you|do you live)/i,
  
  // General knowledge
  /what('s| is) the weather/i,
  /who is the (prime minister|president)/i,
  /what year is it/i,
  /how old is/i,
  
  // Technology questions
  /how do i (use|install|download)/i,
  /computer|software|app|phone|internet/i,
  
  // Completely unrelated
  /recipe|cooking|food|restaurant/i,
  /sport|football|cricket|rugby/i,
  /movie|film|tv|television/i,
  /music|song|artist/i,
  /car|driving|transport/i,
  /holiday|vacation|travel/i,
]

export function isTopicInScope(query: string): boolean {
  const normalizedQuery = query.toLowerCase()
  
  // Check for obvious off-topic patterns first
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(normalizedQuery)) {
      return false
    }
  }
  
  // If it contains compliance keywords, it's likely in scope
  const hasComplianceKeywords = COMPLIANCE_KEYWORDS.some(keyword => 
    normalizedQuery.includes(keyword.toLowerCase())
  )
  
  if (hasComplianceKeywords) {
    return true
  }
  
  // Check for question words that might indicate compliance queries
  const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'can', 'should', 'must', 'do', 'does']
  const hasQuestionWord = questionWords.some(word => 
    normalizedQuery.startsWith(word + ' ') || normalizedQuery.includes(' ' + word + ' ')
  )
  
  // If it's a question without obvious off-topic content, give benefit of doubt
  // (might be a compliance question using different terminology)
  if (hasQuestionWord && normalizedQuery.length > 10) {
    return true
  }
  
  // Short queries or obvious non-compliance topics
  return false
}

export function getOffTopicResponse(): string {
  return "I'm Ask Ed, a specialist AI assistant for UK nursery and club compliance. I can help with questions about KCSiE, EYFS, Ofsted inspections, safeguarding, staff ratios, and other compliance topics. Please ask me about nursery or club compliance matters, and I'll be happy to help!"
}
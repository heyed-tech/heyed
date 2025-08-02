// Knowledge base for common edge cases and frequently asked questions
// This helps handle queries that might not be directly covered in documents

export interface KnowledgeBaseEntry {
  id: string
  query: string
  category: 'ratios' | 'safeguarding' | 'eyfs' | 'ofsted' | 'qualifications' | 'general'
  setting: 'nursery' | 'club' | 'both'
  answer: string
  keywords: string[]
  source?: string
}

export const KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
  {
    id: 'ratio-mixed-ages',
    query: 'what ratios do I need for mixed age groups',
    category: 'ratios',
    setting: 'both',
    answer: 'For mixed age groups, use the ratio required for the youngest child present. If you have children aged 2-4 together, you need the 2-year-old ratio (1:4). This ensures adequate supervision for the most vulnerable children.',
    keywords: ['mixed ages', 'different ages', 'age groups', 'ratios', 'youngest child'],
    source: 'EYFS Framework'
  },
  {
    id: 'disclosure-forget-details',
    query: 'what if I forget what a child said in a disclosure',
    category: 'safeguarding',
    setting: 'both',
    answer: 'If you forget details of a disclosure, write down what you can remember immediately and note that some details may be incomplete. Speak to your Designated Safeguarding Lead (DSL) right away - they can help guide you through the process and may suggest speaking with the child again if appropriate. The key is to act quickly rather than waiting to remember everything perfectly.',
    keywords: ['forget', 'disclosure', 'remember', 'details', 'safeguarding', 'child protection'],
    source: 'KCSiE 2025'
  },
  {
    id: 'holiday-club-eyfs',
    query: 'do holiday clubs need to follow EYFS',
    category: 'eyfs',
    setting: 'club',
    answer: 'Holiday clubs caring for children under 5 must follow the EYFS statutory framework. For children aged 5 and over during school holidays, EYFS doesn\'t apply, but you still need to meet Ofsted registration requirements for childcare and ensure activities are age-appropriate and safe.',
    keywords: ['holiday club', 'EYFS', 'under 5', 'school holidays', 'statutory'],
    source: 'EYFS Framework'
  },
  {
    id: 'staff-paediatric-first-aid',
    query: 'how many staff need paediatric first aid',
    category: 'qualifications',
    setting: 'nursery',
    answer: 'At least one person with a current paediatric first aid certificate must be on the premises at all times when children are present. For outings, at least one person with paediatric first aid must accompany the children. The certificate must be renewed every 3 years.',
    keywords: ['first aid', 'paediatric', 'qualified', 'premises', 'outings', '3 years'],
    source: 'EYFS Framework'
  },
  {
    id: 'ofsted-inspection-notice',
    query: 'how much notice do you get for ofsted inspection',
    category: 'ofsted',
    setting: 'both',
    answer: 'Ofsted inspections are usually unannounced, meaning you get no advance notice. Inspectors will arrive and show their identification. For some types of inspection (like initial registrations), you may receive notice, but routine inspections happen without warning to see your normal operations.',
    keywords: ['notice', 'unannounced', 'inspection', 'advance', 'warning', 'identification'],
    source: 'Early Years Inspection Handbook'
  },
  {
    id: 'student-placement-ratios',
    query: 'do students on placement count towards ratios',
    category: 'ratios',
    setting: 'nursery',
    answer: 'Students on placement cannot be counted in your ratios unless they are over 17 and are competent and responsible. They must be supervised at all times and their presence should enhance rather than maintain minimum staffing levels. Students under 17 cannot be left alone with children.',
    keywords: ['students', 'placement', 'ratios', 'over 17', 'supervised', 'competent'],
    source: 'EYFS Framework'
  },
  {
    id: 'dbs-pending',
    query: 'can someone work while DBS is pending',
    category: 'safeguarding',
    setting: 'both',
    answer: 'A person can start work before their DBS certificate is received, but only if you have completed risk assessment procedures and they are appropriately supervised. They must not be left alone with children and a barred list check must be completed first. This should only be done when necessary and for the shortest time possible.',
    keywords: ['DBS', 'pending', 'start work', 'risk assessment', 'supervised', 'barred list'],
    source: 'KCSiE 2025'
  },
  {
    id: 'own-children-ratios',
    query: 'do my own children count in ratios',
    category: 'ratios',
    setting: 'nursery',
    answer: 'Your own children attending the nursery must be counted in the ratios like any other child. However, if a staff member brings their baby who isn\'t in childcare (e.g., breastfeeding), this may be different - check with your local authority for specific guidance.',
    keywords: ['own children', 'staff children', 'ratios', 'count', 'breastfeeding', 'local authority'],
    source: 'EYFS Framework'
  }
]

export function searchKnowledgeBase(query: string, setting?: 'nursery' | 'club'): KnowledgeBaseEntry[] {
  const normalizedQuery = query.toLowerCase()
  
  return KNOWLEDGE_BASE.filter(entry => {
    // Check setting match
    if (setting && entry.setting !== 'both' && entry.setting !== setting) {
      return false
    }
    
    // Check if query matches keywords or the question itself
    const matchesKeywords = entry.keywords.some(keyword => 
      normalizedQuery.includes(keyword.toLowerCase())
    )
    
    const matchesQuery = normalizedQuery.includes(entry.query.toLowerCase()) || 
                        entry.query.toLowerCase().includes(normalizedQuery)
    
    return matchesKeywords || matchesQuery
  })
}

export function getKnowledgeBaseByCategory(category: KnowledgeBaseEntry['category']): KnowledgeBaseEntry[] {
  return KNOWLEDGE_BASE.filter(entry => entry.category === category)
}
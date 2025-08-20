// Dynamic question prompts based on actual document content analysis
export interface QuestionPrompt {
  text: string
  category: string
  settingType?: 'nursery' | 'club'
}

// Universal questions (both nursery and club)
const safeguardingQuestions: QuestionPrompt[] = [
  { text: "What are the key safeguarding responsibilities for our staff?", category: "safeguarding" },
  { text: "How should we handle child protection concerns?", category: "safeguarding" },
  { text: "What should we do if we suspect abuse or neglect?", category: "safeguarding" },
  { text: "Who should be our designated safeguarding lead?", category: "safeguarding" },
  { text: "How do we report safeguarding incidents to authorities?", category: "safeguarding" },
  { text: "What are the signs of different types of abuse?", category: "safeguarding" },
  { text: "How do we keep children safe online and from digital risks?", category: "safeguarding" },
  { text: "What safeguarding training is required and how often?", category: "safeguarding" }
]

const ofstedQuestions: QuestionPrompt[] = [
  { text: "How do we prepare our setting for an Ofsted inspection?", category: "ofsted" },
  { text: "What will inspectors look at during their visit?", category: "ofsted" },
  { text: "How long does a typical inspection take?", category: "ofsted" },
  { text: "What evidence and documentation do we need to provide?", category: "ofsted" },
  { text: "How can we improve our Ofsted rating?", category: "ofsted" },
  { text: "What happens after an inspection is completed?", category: "ofsted" }
]

const healthSafetyQuestions: QuestionPrompt[] = [
  { text: "What health and safety checks are needed daily?", category: "health-safety" },
  { text: "How do we safely administer medication to children?", category: "health-safety" },
  { text: "What procedures do we need for food allergies and dietary needs?", category: "health-safety" },
  { text: "What first aid requirements apply to our setting?", category: "health-safety" },
  { text: "How do we ensure our premises and equipment are safe?", category: "health-safety" },
  { text: "What risk assessments do we need to complete?", category: "health-safety" }
]

const trainingQuestions: QuestionPrompt[] = [
  { text: "What training do our staff members need to complete?", category: "training" },
  { text: "How often is safeguarding training required for staff?", category: "training" },
  { text: "What qualifications do practitioners need for different roles?", category: "training" },
  { text: "What about continued professional development requirements?", category: "training" },
  { text: "Who can provide approved training courses?", category: "training" },
  { text: "What records of training and qualifications must we keep?", category: "training" }
]

const policiesQuestions: QuestionPrompt[] = [
  { text: "What policies must we have in place for our setting?", category: "policies" },
  { text: "How often should we review and update our policies?", category: "policies" },
  { text: "What should be included in our safeguarding policy?", category: "policies" },
  { text: "Do we need a specific behaviour management policy?", category: "policies" },
  { text: "What about special educational needs and inclusion policies?", category: "policies" },
  { text: "How do we share our policies with parents and staff?", category: "policies" }
]

// Nursery-specific questions
const nurseryRatiosQuestions: QuestionPrompt[] = [
  { text: "What are the required staff-to-child ratios for our nursery?", category: "ratios", settingType: "nursery" },
  { text: "How many qualified staff do we need at level 2 and 3?", category: "ratios", settingType: "nursery" },
  { text: "Can we include apprentices or students in our ratios?", category: "ratios", settingType: "nursery" },
  { text: "Do volunteers or parent helpers count towards ratios?", category: "ratios", settingType: "nursery" },
  { text: "What qualifications are accepted for ratio requirements?", category: "ratios", settingType: "nursery" },
  { text: "What are the ratio requirements for mixed age groups?", category: "ratios", settingType: "nursery" }
]

const nurseryAssessmentQuestions: QuestionPrompt[] = [
  { text: "What records do we need to keep for each child?", category: "assessment", settingType: "nursery" },
  { text: "How do we track progress against development milestones?", category: "assessment", settingType: "nursery" },
  { text: "What are the EYFS assessment and reporting requirements?", category: "assessment", settingType: "nursery" },
  { text: "How do we identify and support children with SEND needs?", category: "assessment", settingType: "nursery" },
  { text: "What information must we share with parents about their child's development?", category: "assessment", settingType: "nursery" },
  { text: "How do we ensure accurate and objective assessment practices?", category: "assessment", settingType: "nursery" }
]

const nurseryCurriculumQuestions: QuestionPrompt[] = [
  { text: "What are the seven areas of learning in the EYFS?", category: "curriculum", settingType: "nursery" },
  { text: "How do we plan developmentally appropriate activities?", category: "curriculum", settingType: "nursery" },
  { text: "What are the prime areas vs specific areas of learning?", category: "curriculum", settingType: "nursery" },
  { text: "How do we support children's school readiness?", category: "curriculum", settingType: "nursery" },
  { text: "What about outdoor learning and forest school approaches?", category: "curriculum", settingType: "nursery" },
  { text: "How do we plan for mixed age groups and different stages?", category: "curriculum", settingType: "nursery" }
]

const nurserySpecificQuestions: QuestionPrompt[] = [
  { text: "What are the EYFS requirements for 2-year-old children?", category: "specific", settingType: "nursery" },
  { text: "How do we support children's transition to school?", category: "specific", settingType: "nursery" },
  { text: "What are the procedures for nappy changing and personal care?", category: "specific", settingType: "nursery" },
  { text: "What learning goals should 3-year-olds achieve before school?", category: "specific", settingType: "nursery" },
  { text: "How do we adapt activities for different developmental stages?", category: "specific", settingType: "nursery" },
  { text: "What are the requirements for intimate care and toileting assistance?", category: "specific", settingType: "nursery" }
]

// Club-specific questions
const clubSpecificQuestions: QuestionPrompt[] = [
  { text: "What are the requirements for after-school and holiday clubs?", category: "specific", settingType: "club" },
  { text: "How do we supervise children during free play activities?", category: "specific", settingType: "club" },
  { text: "What about supporting children with additional needs in clubs?", category: "specific", settingType: "club" },
  { text: "How do we manage different age groups together safely?", category: "specific", settingType: "club" },
  { text: "What are the specific requirements for holiday provision?", category: "specific", settingType: "club" },
  { text: "How do we ensure safe collection and handover of children?", category: "specific", settingType: "club" },
  { text: "What are the staff qualification requirements for out-of-school care?", category: "specific", settingType: "club" },
  { text: "How do we maintain child protection standards in club environments?", category: "specific", settingType: "club" }
]

// Combine all questions
const allQuestions: QuestionPrompt[] = [
  ...safeguardingQuestions,
  ...ofstedQuestions,
  ...healthSafetyQuestions,
  ...trainingQuestions,
  ...policiesQuestions,
  ...nurseryRatiosQuestions,
  ...nurseryAssessmentQuestions,
  ...nurseryCurriculumQuestions,
  ...nurserySpecificQuestions,
  ...clubSpecificQuestions
]

// Helper function to get random questions for a setting type
export function getRandomQuestions(settingType: 'nursery' | 'club', count: number = 6): QuestionPrompt[] {
  const relevantQuestions = allQuestions.filter(q => 
    q.settingType === settingType || !q.settingType
  )
  
  // Shuffle and return requested count
  const shuffled = [...relevantQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Helper function to get questions by category
export function getQuestionsByCategory(category: string, settingType?: 'nursery' | 'club'): QuestionPrompt[] {
  let questions = allQuestions.filter(q => q.category === category)
  
  if (settingType) {
    questions = questions.filter(q => q.settingType === settingType || !q.settingType)
  }
  
  return questions
}

// Helper function to get a balanced mix of question categories
export function getBalancedQuestions(settingType: 'nursery' | 'club', isMobile: boolean = false): {
  primary: QuestionPrompt[]
  secondary: QuestionPrompt[]
  quickChecks: QuestionPrompt[]
} {
  const safeguarding = getQuestionsByCategory('safeguarding', settingType)
  const ofsted = getQuestionsByCategory('ofsted', settingType)
  const specific = getQuestionsByCategory('specific', settingType)
  const ratios = getQuestionsByCategory('ratios', settingType)
  const curriculum = getQuestionsByCategory('curriculum', settingType)
  const assessment = getQuestionsByCategory('assessment', settingType)
  const training = getQuestionsByCategory('training', settingType)
  const healthSafety = getQuestionsByCategory('health-safety', settingType)
  
  // Shuffle each category and pick random questions
  const shuffleSample = (arr: QuestionPrompt[], count: number) => 
    [...arr].sort(() => Math.random() - 0.5).slice(0, count)
  
  // Reduce questions on mobile for better UX
  const questionsPerSection = isMobile ? 1 : 2
  
  if (settingType === 'nursery') {
    return {
      primary: [
        ...shuffleSample(ratios, 1),
        ...shuffleSample(curriculum, isMobile ? 0 : 1)
      ].filter(Boolean),
      secondary: [
        ...shuffleSample(assessment, 1),
        ...shuffleSample(specific, isMobile ? 0 : 1)
      ].filter(Boolean),
      quickChecks: [
        ...shuffleSample(safeguarding, 1),
        ...shuffleSample(ofsted, isMobile ? 0 : 1),
        ...shuffleSample(training, isMobile ? 0 : 1)
      ].filter(Boolean)
    }
  } else {
    return {
      primary: [
        ...shuffleSample(specific, questionsPerSection)
      ],
      secondary: [
        ...shuffleSample(healthSafety, questionsPerSection)
      ],
      quickChecks: [
        ...shuffleSample(safeguarding, 1),
        ...shuffleSample(ofsted, isMobile ? 0 : 1),
        ...shuffleSample(training, isMobile ? 0 : 1)
      ].filter(Boolean)
    }
  }
}

export default allQuestions
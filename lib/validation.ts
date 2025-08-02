// Input validation and sanitization for Ask Ed

export interface ValidationResult {
  isValid: boolean
  sanitized?: string
  error?: string
}

// Sanitize user input to prevent XSS and injection attacks
export function sanitizeMessage(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    // Remove null characters
    .replace(/\0/g, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Trim leading/trailing whitespace
    .trim()
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit to reasonable character set (letters, numbers, common punctuation)
    .replace(/[^\w\s\-.,!?()'"@#£$%&+=<>:;/\\[\]{}]/g, '')
}

// Validate message content
export function validateMessage(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Message is required' }
  }

  const sanitized = sanitizeMessage(input)

  if (sanitized.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' }
  }

  if (sanitized.length > 1000) {
    return { isValid: false, error: 'Message too long. Please keep questions under 1,000 characters.' }
  }

  if (sanitized.length < 2) {
    return { isValid: false, error: 'Message too short. Please provide more detail.' }
  }

  // Check for spam patterns
  if (isSpamLike(sanitized)) {
    return { isValid: false, error: 'Message appears to be spam. Please ask a genuine compliance question.' }
  }

  // Check for repeated characters (potential spam)
  if (/(.)\1{10,}/.test(sanitized)) {
    return { isValid: false, error: 'Message contains too many repeated characters.' }
  }

  return { isValid: true, sanitized }
}

// Validate session ID
export function validateSessionId(sessionId: string): ValidationResult {
  if (!sessionId || typeof sessionId !== 'string') {
    return { isValid: false, error: 'Session ID is required' }
  }

  const sanitized = sessionId.trim()

  // Session ID should match the format: session-{timestamp}-{random}
  if (!/^session-\d{13}-[a-zA-Z0-9]+$/.test(sanitized)) {
    return { isValid: false, error: 'Invalid session ID format' }
  }

  return { isValid: true, sanitized }
}

// Validate setting type
export function validateSettingType(settingType: any): ValidationResult {
  if (!settingType) {
    return { isValid: true, sanitized: 'nursery' } // Default to nursery
  }

  if (typeof settingType !== 'string') {
    return { isValid: false, error: 'Setting type must be a string' }
  }

  const sanitized = settingType.toLowerCase().trim()

  if (!['nursery', 'club'].includes(sanitized)) {
    return { isValid: false, error: 'Setting type must be either "nursery" or "club"' }
  }

  return { isValid: true, sanitized: sanitized as 'nursery' | 'club' }
}

// Basic spam detection
function isSpamLike(text: string): boolean {
  const spamPatterns = [
    // Excessive caps
    /[A-Z]{20,}/,
    // Excessive exclamation marks
    /!{5,}/,
    // Common spam phrases
    /\b(buy now|click here|free money|viagra|casino|lottery|winner)\b/i,
    // Excessive URLs (though we should allow some for legitimate questions)
    /(https?:\/\/[^\s]+.*){3,}/,
    // Excessive numbers (phone numbers, etc.)
    /\b\d{10,}\b/
  ]

  return spamPatterns.some(pattern => pattern.test(text))
}

// Validate entire chat request
export interface ChatRequestValidation {
  isValid: boolean
  errors: string[]
  sanitized?: {
    message: string
    sessionId: string
    settingType: 'nursery' | 'club'
  }
}

export function validateChatRequest(data: any): ChatRequestValidation {
  const errors: string[] = []
  const sanitized: any = {}

  // Validate message
  const messageValidation = validateMessage(data.message)
  if (!messageValidation.isValid) {
    errors.push(messageValidation.error!)
  } else {
    sanitized.message = messageValidation.sanitized!
  }

  // Validate session ID
  const sessionIdValidation = validateSessionId(data.sessionId)
  if (!sessionIdValidation.isValid) {
    errors.push(sessionIdValidation.error!)
  } else {
    sanitized.sessionId = sessionIdValidation.sanitized!
  }

  // Validate setting type
  const settingTypeValidation = validateSettingType(data.settingType)
  if (!settingTypeValidation.isValid) {
    errors.push(settingTypeValidation.error!)
  } else {
    sanitized.settingType = settingTypeValidation.sanitized!
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined
  }
}
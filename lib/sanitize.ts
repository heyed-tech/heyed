// HTML sanitization utilities to prevent XSS attacks

// Allowed HTML tags for markdown content
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
]

// Allowed attributes (very restrictive for security)
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  // No attributes allowed for basic markdown content
}

// HTML entities to escape
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
}

// Escape HTML entities
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (match) => HTML_ENTITIES[match] || match)
}

// Simple HTML sanitizer that removes dangerous content
export function sanitizeHtml(html: string): string {
  // Remove dangerous elements and attributes
  let sanitized = html
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove style tags and their content
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Remove dangerous tags
  sanitized = sanitized.replace(/<(iframe|object|embed|form|input|textarea|select|button)\b[^>]*>.*?<\/\1>/gi, '')
  
  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*['"]*[^'"]*['"]*\s*/gi, '')
  
  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/data:/gi, '')
  
  // Remove any tags that aren't in our allowlist
  sanitized = sanitized.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tagName) => {
    if (ALLOWED_TAGS.includes(tagName.toLowerCase())) {
      // For allowed tags, remove any attributes for security
      const isClosing = match.startsWith('</')
      return isClosing ? `</${tagName.toLowerCase()}>` : `<${tagName.toLowerCase()}>`
    }
    return '' // Remove disallowed tags
  })
  
  return sanitized
}

// Safe markdown parser that sanitizes output
export function parseMarkdownSafely(text: string): string {
  let html = text
  
  // First, handle any existing HTML by sanitizing it properly
  // Only escape content outside of allowed tags
  html = sanitizeHtml(html)
  
  // Convert markdown syntax to HTML
  // Convert **bold** to <strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Convert *italic* to <em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Convert headings (### to h3, ## to h2, # to h1)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // Convert bullet points (- text) to list items
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  
  // Wrap consecutive list items in <ul>
  html = html.replace(/(<li>.*?<\/li>(?:\n<li>.*?<\/li>)*)/g, '<ul>$1</ul>')
  
  // Clean up extra newlines within lists
  html = html.replace(/(<ul>)\n+/g, '$1')
  html = html.replace(/\n+(<\/ul>)/g, '$1')
  html = html.replace(/(<\/li>)\n+(<li>)/g, '$1$2')
  
  // Convert double line breaks to paragraph breaks
  html = html.replace(/\n\n/g, '</p><p>')
  
  // Convert single line breaks to <br> tags (but not within lists or headings)
  html = html.replace(/(?<!<\/li>)\n(?!<li>|<\/ul>|<ul>|<h[1-6]>)/g, '<br>')
  
  // Wrap in paragraph tags if content doesn't start with a block element
  if (!html.match(/^<(ul|h[1-6]|p)/)) {
    html = `<p>${html}</p>`
  }
  
  return html
}

// Validate that a string contains only safe content
export function isContentSafe(content: string): boolean {
  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /javascript:/i,
    /data:/i,
    /on\w+\s*=/i // Event handlers
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(content))
}
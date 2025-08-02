import { parseMarkdownSafely, isContentSafe } from '@/lib/sanitize'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Validate content safety before processing
  if (!isContentSafe(content)) {
    console.warn('Potentially unsafe content detected in markdown renderer')
    return (
      <div className={`markdown-content ${className}`}>
        <p>Content blocked for security reasons.</p>
      </div>
    )
  }

  // Use the safe markdown parser
  const safeHtml = parseMarkdownSafely(content)

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  )
}
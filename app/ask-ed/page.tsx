'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Copy, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AskEdLogo } from '@/components/ask-ed-logo'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { getBalancedQuestions, type QuestionPrompt } from '@/lib/ask-ed/questionPrompts'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type SettingType = 'nursery' | 'club'

export default function AskEdPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substring(7)}`)
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null)
  const [settingType, setSettingType] = useState<SettingType>('nursery')
  const [dynamicQuestions, setDynamicQuestions] = useState<{
    primary: QuestionPrompt[]
    secondary: QuestionPrompt[]
    quickChecks: QuestionPrompt[]
  }>({ primary: [], secondary: [], quickChecks: [] })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)


  // Load dynamic questions when component mounts or setting type changes
  useEffect(() => {
    setDynamicQuestions(getBalancedQuestions(settingType))
  }, [settingType])

  // Load messages from database or localStorage on component mount
  useEffect(() => {
    async function loadConversation() {
      try {
        // Try to load from database first
        const response = await fetch(`/api/ask-ed/history/${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages && data.messages.length > 0) {
            const parsedMessages = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
            setMessages(parsedMessages)
            return
          }
        }
      } catch (error) {
        console.error('Error loading from database:', error)
      }
      
      // Fallback to localStorage with session-specific key
      const sessionKey = `ask-ed-messages-${sessionId}`
      const savedMessages = localStorage.getItem(sessionKey)
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(parsedMessages)
        } catch (error) {
          console.error('Failed to load saved messages:', error)
        }
      }
    }
    
    loadConversation()
  }, [sessionId])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const sessionKey = `ask-ed-messages-${sessionId}`
      localStorage.setItem(sessionKey, JSON.stringify(messages))
      // Keep the old key for backwards compatibility temporarily
      localStorage.setItem('ask-ed-messages', JSON.stringify(messages))
    }
  }, [messages, sessionId])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const copyMessage = async (content: string, messageIndex: number) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageIndex(messageIndex)
      setTimeout(() => setCopiedMessageIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const clearConversation = () => {
    setMessages([])
    const sessionKey = `ask-ed-messages-${sessionId}`
    localStorage.removeItem(sessionKey)
    localStorage.removeItem('ask-ed-messages') // Remove old key too
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Get last 8 messages (4 pairs) for better context
      // Include all messages except the one we just added
      const recentMessages = messages.slice(-8).map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
      
      const response = await fetch('/api/ask-ed/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          recentMessages,
          settingType
        })
      })

      if (!response.ok) {
        const error = await response.json()
        const errorMessage = error.error || 'Unable to get a response right now. Please try again.'
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date()
        }])
        setIsLoading(false)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, there was a problem with the response. Please try asking your question again.',
          timestamp: new Date()
        }])
        setIsLoading(false)
        return
      }

      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                assistantMessage += data.content
                setMessages(prev => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.content = assistantMessage
                  } else {
                    newMessages.push({
                      role: 'assistant',
                      content: assistantMessage,
                      timestamp: new Date()
                    })
                  }
                  
                  return newMessages
                })
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please check your internet connection and try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <>
      <style jsx global>{`
        /* Hide Tidio chatbot on Ask Ed page */
        #tidio-chat {
          display: none !important;
        }
        #tidio-chat-iframe {
          display: none !important;
        }
        #tidio-chat-code {
          display: none !important;
        }
        .markdown-content strong {
          font-weight: 600;
          color: inherit;
        }
        .markdown-content em {
          font-style: italic;
        }
        .markdown-content ul {
          margin: 1.25rem 0;
          padding-left: 1.25rem;
          list-style-type: disc;
        }
        .markdown-content li {
          margin: 0;
          padding-left: 0.25rem;
        }
        .markdown-content p {
          margin: 1.25rem 0;
          line-height: 1.5;
        }
        .markdown-content p + ul {
          margin-top: 0.5rem;
        }
        .markdown-content ul + p {
          margin-top: 0.75rem;
        }
        .markdown-content p:first-child {
          margin-top: 0;
        }
        .markdown-content p:last-child {
          margin-bottom: 0;
        }
        .markdown-content h1 {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem 0;
          color: inherit;
        }
        .markdown-content h2 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.875rem 0 0.5rem 0;
          color: inherit;
        }
        .markdown-content h3 {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0.75rem 0 0.25rem 0;
          color: inherit;
        }
      `}</style>
      <div 
        className="h-screen relative flex flex-col overflow-hidden"
        style={{
          backgroundImage: "url('/gradient.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Background Decorative Elements */}
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-teal-100/20 blur-3xl -z-10 animate-pulse"
          style={{ animationDuration: "15s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl -z-10 animate-pulse"
          style={{ animationDuration: "20s" }}
        />
        
        <div className="container mx-auto px-2 py-2 sm:px-4 sm:py-4 max-w-4xl h-full flex flex-col relative z-10">
      <Card className="flex-1 h-full flex flex-col overflow-hidden rounded-card border-0 shadow-xl">
        <CardHeader className="bg-white border-b border-gray-100 rounded-t-card px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between w-full">
            <AskEdLogo />
            
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setSettingType('nursery')}
                  className={`px-3 py-1 text-xs font-medium transition-colours ${
                    settingType === 'nursery'
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Nursery
                </button>
                <button
                  onClick={() => setSettingType('club')}
                  className={`px-3 py-1 text-xs font-medium transition-colours ${
                    settingType === 'club'
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Club
                </button>
              </div>
              
              {messages.length > 0 && (
                <Button
                  onClick={clearConversation}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  title="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-3 sm:p-4 overflow-y-auto" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="inline-block rounded-card bg-teal-100 px-4 py-2 text-sm mb-4">
                    <span className="text-gray-700">Powered by </span>
                    <span className="font-bitter text-gray-700">Hey<span className="text-teal-500">Ed.</span></span>
                  </div>
                  <p className="text-gray-600 mb-6">Your AI compliance assistant for instant guidance</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
                  <div className="bg-teal-50 rounded-card p-3 sm:p-4 border border-teal-100">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {settingType === 'nursery' ? '🏫 Staff & Curriculum' : '🎯 Club Operations'}
                    </h4>
                    <div className="space-y-2">
                      {dynamicQuestions.primary.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(question.text)}
                          className="w-full text-left text-xs bg-white hover:bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 transition-colors"
                        >
                          {question.text.length > 50 ? `${question.text.substring(0, 47)}...` : question.text}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-teal-50 rounded-card p-3 sm:p-4 border border-teal-100">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {settingType === 'nursery' ? '📚 Assessment & Development' : '🏃‍♂️ Activities & Safety'}
                    </h4>
                    <div className="space-y-2">
                      {dynamicQuestions.secondary.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(question.text)}
                          className="w-full text-left text-xs bg-white hover:bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 transition-colors"
                        >
                          {question.text.length > 50 ? `${question.text.substring(0, 47)}...` : question.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 max-w-2xl mx-auto">
                  <h4 className="font-medium text-gray-900 mb-3 text-center">⚡ Quick Compliance Checks</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {dynamicQuestions.quickChecks.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(question.text)}
                        className="text-xs bg-white hover:bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 transition-colors"
                      >
                        {question.text.length > 25 ? `${question.text.substring(0, 22)}...` : question.text}
                      </button>
                    ))}
                  </div>
                </div>
                
                <p className="mt-6 text-xs text-gray-500">Click a question above or type your own below!</p>
              </div>
            ) : (
              <div className="space-y-4 min-h-0">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} px-1 sm:px-2`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] rounded-card px-3 py-2 sm:px-4 sm:py-3 break-words overflow-hidden shadow-sm relative group ${
                        message.role === 'user'
                          ? 'bg-teal-500 text-white'
                          : 'bg-teal-50 text-gray-900 border border-teal-100'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => copyMessage(message.content, index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-50 border border-gray-200 rounded-md p-1.5 shadow-sm"
                          title="Copy message"
                        >
                          {copiedMessageIndex === index ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-600" />
                          )}
                        </button>
                      )}
                      {message.role === 'assistant' ? (
                        <MarkdownRenderer 
                          content={message.content}
                          className="leading-relaxed text-sm pr-8"
                        />
                      ) : (
                        <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere leading-relaxed text-sm">
                          {message.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start px-2">
                    <div className="bg-teal-50 border border-teal-100 rounded-card px-4 py-3 break-words overflow-hidden max-w-[85%] shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 sm:p-4 border-t border-teal-100 flex-shrink-0 bg-gray-50">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="flex gap-3 items-end"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about KCSiE, EYFS, or compliance..."
                disabled={isLoading}
                className="flex-1 rounded-input border-gray-300 focus:border-gray-400 focus:ring-gray-400 min-h-[44px] py-3"
                maxLength={1000}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-teal-500 hover:bg-teal-600 rounded-button px-4 py-3 min-h-[44px] min-w-[44px] shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            
            {/* Disclaimer Accordion */}
            <div className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="disclaimer" className="border border-gray-200 rounded-lg bg-white">
                  <AccordionTrigger className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 hover:no-underline">
                    Declaration & Guidance
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3 text-xs text-gray-600 leading-relaxed">
                    <span className="font-bitter text-gray-700">Ask<span className="text-teal-500">Ed.</span></span> provides guidance based on official publications, including the EYFS framework, KCSiE, and Ofsted resources. Whilst we aim for accuracy, responses should not be considered legal advice. For specific compliance decisions, please consult your Designated Safeguarding Lead or a qualified professional.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Press Enter to send • Maximum 1,000 characters
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
    </>
  )
}
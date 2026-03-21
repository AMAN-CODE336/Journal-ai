import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { ComponentPropsWithoutRef } from 'react'
import { Send } from 'lucide-react'

interface Message {
  role: 'user' | 'ai'
  content: string
}

type MdProps = { children?: React.ReactNode }
type CodeProps = ComponentPropsWithoutRef<'code'>

const markdownComponents = {
  h1: ({ children }: MdProps) => <h1 className="text-lg font-bold text-text mb-2 mt-1">{children}</h1>,
  h2: ({ children }: MdProps) => <h2 className="text-base font-bold text-text mb-2 mt-3">{children}</h2>,
  h3: ({ children }: MdProps) => <h3 className="text-sm font-bold text-accent mb-1 mt-3">{children}</h3>,
  p: ({ children }: MdProps) => <p className="text-sm text-text mb-2 leading-relaxed">{children}</p>,
  ul: ({ children }: MdProps) => <ul className="list-disc pl-4 mb-2 flex flex-col gap-1">{children}</ul>,
  ol: ({ children }: MdProps) => <ol className="list-decimal pl-4 mb-2 flex flex-col gap-1">{children}</ol>,
  li: ({ children }: MdProps) => <li className="text-sm text-text leading-relaxed">{children}</li>,
  strong: ({ children }: MdProps) => <strong className="text-accent font-semibold">{children}</strong>,
  code: ({ children }: CodeProps) => <code className="bg-surface2 text-accent px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
  hr: () => <hr className="border-border my-3" />,
}

const ThinkingBubble = () => (
  <div className="flex justify-start">
    <div className="bg-surface border border-border rounded-2xl px-5 py-4 flex items-center gap-2">
      <span className="text-sm text-muted">Thinking...</span>
      <div className="flex gap-1.5">
        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
)

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hi! I've read all your journal entries. Ask me anything about your learning journey! 🧠" }
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const send = async () => {
    if (!input.trim() || isStreaming) return
    const message = input.trim()
    setInput('')

    setMessages(prev => [...prev, { role: 'user', content: message }])
    setIsThinking(true)
    setIsStreaming(true)

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message })
      })

      if (!res.ok) throw new Error('Request failed')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let firstChunk = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '').trim()
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data) as { text: string }
              if (parsed.text) {
                if (firstChunk) {
                  setIsThinking(false)
                  setMessages(prev => [...prev, { role: 'ai', content: '' }])
                  firstChunk = false
                }
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'ai',
                    content: updated[updated.length - 1].content + parsed.text
                  }
                  return updated
                })
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setIsThinking(false)
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Something went wrong. Please try again.'
      }])
    } finally {
      setIsStreaming(false)
      setIsThinking(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-40px)]">

      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl text-text mb-1">Chat with Journal</h1>
        <p className="text-sm text-muted">Ask anything about your learning journey</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 md:mb-6 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-accent text-bg font-medium'
                : 'bg-surface border border-border text-text'
            }`}>
              {msg.role === 'ai' ? (
                <>
                  <ReactMarkdown components={markdownComponents}>
                    {msg.content}
                  </ReactMarkdown>
                  {isStreaming && i === messages.length - 1 && msg.content !== '' && (
                    <span className="inline-block w-1.5 h-4 bg-accent animate-pulse ml-0.5 rounded-sm align-middle" />
                  )}
                </>
              ) : msg.content}
            </div>
          </div>
        ))}

        {isThinking && <ThinkingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 md:gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about your journal..."
          disabled={isStreaming}
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={isStreaming || !input.trim()}
          className="bg-accent text-bg px-4 md:px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={14} />
          <span className="hidden md:inline">
            {isStreaming ? 'Streaming...' : 'Send'}
          </span>
        </button>
      </div>

    </div>
  )
}

export default Chat
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '@/api/axios'
import Editor from '@/components/Editor'
import useDebounce from '@/hooks/useDebounce'
import { toast } from 'sonner'
import DeleteDialog from '@/components/DeleteDialog'
import { ArrowLeft, Trash2, Save, Clock, FileText, Smile } from 'lucide-react'
import { CardSkeleton } from '@/components/skeletons'

interface Entry {
  _id: string
  title: string
  content: string
  plainText: string
  createdAt: string
  meta: { wordCount: number; readingTime: number }
  ai: {
    summary: string
    topics: string[]
    quizzes: { question: string; answer: string }[]
    insight: string
    mood: {
      label: string
      emoji: string
      score: number
    }
  }
}

const EntryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [plainText, setPlainText] = useState('')
  const [autoSaved, setAutoSaved] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const debouncedContent = useDebounce(content, 2000)
  const debouncedTitle = useDebounce(title, 2000)

  const { data: entry, isLoading } = useQuery({
    queryKey: ['entry', id],
    queryFn: async () => {
      const res = await api.get<Entry>(`/entries/${id}`)
      return res.data
    }
  })

  useEffect(() => {
    if (entry) {
      setTitle(entry.title)
      setContent(entry.content)
      setPlainText(entry.plainText)
    }
  }, [entry])

  // Auto save — only triggers if content actually changed
  useEffect(() => {
    if (!debouncedContent || !debouncedTitle || !entry) return
    if (debouncedContent === entry.content && debouncedTitle === entry.title) return

    api.put(`/entries/${id}`, {
      title: debouncedTitle,
      content: debouncedContent,
      plainText
    }).then(() => {
      setAutoSaved(true)
      setTimeout(() => setAutoSaved(false), 2000)
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    }).catch(() => {
      toast.error('Auto save failed')
    })
  }, [debouncedContent, debouncedTitle])

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/entries/${id}`, { title, content, plainText })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      toast.success('Entry updated!')
    },
    onError: () => toast.error('Failed to update entry')
  })

  const { mutate: remove, isPending: removing } = useMutation({
    mutationFn: async () => {
      await api.delete(`/entries/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      navigate('/entries')
      toast.success('Entry deleted!')
    },
    onError: () => toast.error('Failed to delete entry')
  })

  if (isLoading) return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <CardSkeleton lines={4} />
    </div>
  )

  if (!entry) return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <p className="text-muted">Entry not found</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/entries')}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2">
          {autoSaved && (
            <span className="text-xs text-accent flex items-center gap-1">
              <Save size={10} /> Saved
            </span>
          )}
          <button
            onClick={() => setShowDelete(true)}
            className="p-2 text-muted hover:text-danger hover:bg-surface2 transition-colors cursor-pointer rounded-lg"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={() => save()}
            disabled={saving}
            className="bg-accent text-bg px-3 md:px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full bg-transparent text-2xl md:text-3xl text-text font-bold outline-none mb-2 placeholder:text-muted"
        placeholder="Entry title..."
      />

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted mb-6">
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {new Date(entry.createdAt).toDateString()}
        </span>
        <span className="flex items-center gap-1">
          <FileText size={10} />
          {entry.meta?.wordCount} words
        </span>
        <span>{entry.meta?.readingTime} min read</span>
        {entry.ai?.mood ? (
          <span className="flex items-center gap-1">
            {entry.ai.mood.emoji} {entry.ai.mood.label}
          </span>
        ) : (
          <span className="italic">✨ AI processing...</span>
        )}
      </div>

      {/* Editor */}
      <Editor
        initialContent={entry.content}
        onChange={(c, p) => { setContent(c); setPlainText(p) }}
      />

      {/* AI Results */}
      {entry.ai?.summary && (
        <div className="mt-8 flex flex-col gap-4">

          <div className="bg-surface border border-border rounded-xl p-4 md:p-5">
            <p className="text-xs text-muted uppercase tracking-widest mb-3">📝 AI Summary</p>
            <p className="text-sm text-text leading-relaxed">{entry.ai.summary}</p>
          </div>

          {entry.ai?.insight && (
            <div className="bg-surface rounded-xl p-4 md:p-5" style={{ border: '1px solid rgba(232,184,109,0.3)' }}>
              <p className="text-xs text-accent uppercase tracking-widest mb-3">💡 Insight</p>
              <p className="text-sm text-text leading-relaxed">{entry.ai.insight}</p>
            </div>
          )}

          {entry.ai?.topics?.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-4 md:p-5">
              <p className="text-xs text-muted uppercase tracking-widest mb-3">🏷️ Topics</p>
              <div className="flex flex-wrap gap-2">
                {entry.ai.topics.map((topic, i) => (
                  <span key={i} className="bg-surface2 text-muted border border-border text-xs px-3 py-1 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {entry.ai?.quizzes?.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-4 md:p-5">
              <p className="text-xs text-muted uppercase tracking-widest mb-4">🧠 Quiz Me</p>
              <div className="flex flex-col gap-3">
                {entry.ai.quizzes.map((quiz, i) => (
                  <details key={i} className="border border-border rounded-lg p-4 cursor-pointer group">
                    <summary className="text-sm text-text font-medium cursor-pointer list-none flex justify-between items-center">
                      {quiz.question}
                      <span className="text-muted text-xs group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{quiz.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      <DeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => remove()}
        isPending={removing}
      />

    </div>
  )
}

export default EntryDetail
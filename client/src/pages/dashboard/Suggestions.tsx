import { useQuery } from '@tanstack/react-query'
import api from '@/api/axios'
import Loader from '@/components/Loader'
import Empty from '@/components/Empty'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Zap, Target } from 'lucide-react'

interface Suggestion {
  topic: string
  reason: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  resources: string[]
}

interface SuggestionsData {
  suggestions: Suggestion[]
  pattern: string
  strength: string
  gap: string
}

const difficultyColor = (d: string) => {
  if (d === 'beginner') return 'text-green-400 bg-green-400/10 border-green-400/20'
  if (d === 'intermediate') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  return 'text-red-400 bg-red-400/10 border-red-400/20'
}

const Suggestions = () => {
  const navigate = useNavigate() // ← was missing!
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const res = await api.get<SuggestionsData>('/suggestions')
      return res.data
    }
  })

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl text-text mb-2">What to Learn Next</h1>
      <Loader text="AI is analyzing your journal entries..." />
    </div>
  )

  if (error) return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl text-text mb-2">What to Learn Next</h1>
      <Empty
        title="Not enough entries"
        description="Write at least 2 journal entries to get personalized suggestions."
        action="+ New Entry"
        onAction={() => navigate('/entries/new')}
      />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl text-text mb-1">What to Learn Next</h1>
      <p className="text-sm text-muted mb-6 md:mb-8">Personalized suggestions based on your journal entries</p>

      {/* Pattern, Strength, Gap — 1 col mobile, 3 desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-surface border border-border rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={12} className="text-muted" />
            <p className="text-xs text-muted uppercase tracking-widest">Your Pattern</p>
          </div>
          <p className="text-sm text-text leading-relaxed">{data?.pattern}</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} className="text-muted" />
            <p className="text-xs text-muted uppercase tracking-widest">Strength</p>
          </div>
          <p className="text-sm text-text leading-relaxed">{data?.strength}</p>
        </div>

        <div className="bg-surface rounded-xl p-4 md:p-5" style={{ border: '1px solid rgba(232,184,109,0.3)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={12} className="text-accent" />
            <p className="text-xs text-accent uppercase tracking-widest">Knowledge Gap</p>
          </div>
          <p className="text-sm text-text leading-relaxed">{data?.gap}</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex flex-col gap-3 md:gap-4">
        {data?.suggestions.map((s, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4 md:p-5">
            <div className="flex justify-between items-start mb-3 gap-3">
              <h2 className="text-base md:text-lg text-text font-medium flex-1 min-w-0">{s.topic}</h2>
              <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${difficultyColor(s.difficulty)}`}>
                {s.difficulty}
              </span>
            </div>
            <p className="text-sm text-muted mb-4 leading-relaxed">{s.reason}</p>
            {s.resources.length > 0 && (
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-2">Resources</p>
                <div className="flex flex-wrap gap-2">
                  {s.resources.map((r, j) => (
                    <span key={j} className="bg-surface2 text-muted border border-border text-xs px-3 py-1 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Suggestions
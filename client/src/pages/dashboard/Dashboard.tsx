import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/api/axios'
import useAuthStore from '@/store/authStore'
import { StatSkeleton, CardSkeleton } from '@/components/skeletons'
import Empty from '@/components/Empty'
import { ArrowRight, Tag, BookOpen } from 'lucide-react'

interface Entry {
  _id: string
  title: string
  plainText: string
  createdAt: string
  meta: { wordCount: number; readingTime: number }
  ai: { topics: string[] }
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: entries, isLoading } = useQuery<Entry[]>({
    queryKey: ['dashboard-entries'],
    queryFn: async () => {
      const res = await api.get<{ entries: Entry[] }>('/entries', {
        params: { page: 1, limit: 100 }
      })
      return res.data.entries
    }
  })

  const totalWords = entries?.reduce((acc, e) => acc + (e.meta?.wordCount || 0), 0) || 0
  const allTopics = [...new Set(entries?.flatMap(e => e.ai?.topics || []))]
  const recentEntries = entries?.slice(0, 3) || []

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <StatSkeleton count={3} />
      <div className="mt-6"><CardSkeleton lines={3} /></div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">

      {/* Header */}
      <div className="flex justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-text mb-1">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-sm text-muted">Here's your learning progress</p>
        </div>
        <button
          onClick={() => navigate('/entries/new')}
          className="bg-accent text-bg px-3 md:px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          + New Entry
        </button>
      </div>

      {/* Stats — 1 col on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total Entries', value: entries?.length || 0, icon: BookOpen },
          { label: 'Words Written', value: totalWords.toLocaleString(), icon: Tag },
          { label: 'Topics Learned', value: allTopics.length, icon: Tag },
        ].map((stat, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4 md:p-5">
            <p className="text-xs text-muted uppercase tracking-widest mb-2 md:mb-3">{stat.label}</p>
            <p className="text-3xl md:text-4xl text-text">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Topics */}
      {allTopics.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-4 md:p-5 mb-6">
          <p className="text-xs text-muted uppercase tracking-widest mb-3 md:mb-4">🏷️ Topics Explored</p>
          <div className="flex flex-wrap gap-2">
            {allTopics.map((topic, i) => (
              <span key={i} className="bg-surface2 text-muted border border-border text-xs px-3 py-1 rounded-full">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="bg-surface border border-border rounded-xl p-4 md:p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-muted uppercase tracking-widest">📓 Recent Entries</p>
          <button
            onClick={() => navigate('/entries')}
            className="text-xs text-accent cursor-pointer hover:opacity-80 flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        {recentEntries.length === 0 && (
          <Empty
            title="No entries yet"
            description="Start writing your first journal entry!"
            action="+ New Entry"
            onAction={() => navigate('/entries/new')}
          />
        )}

        <div className="flex flex-col gap-2">
          {recentEntries.map(entry => (
            <div
              key={entry._id}
              onClick={() => navigate(`/entries/${entry._id}`)}
              className="flex justify-between items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-surface2 transition-colors"
            >
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm text-text font-medium truncate">{entry.title}</p>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(entry.createdAt).toDateString()} · {entry.meta?.wordCount} words
                </p>
              </div>
              <ArrowRight size={14} className="text-muted flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
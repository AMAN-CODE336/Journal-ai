import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '@/api/axios'
import Editor from '@/components/Editor'
import { toast } from 'sonner'
import { ArrowLeft, Save, CalendarDays, X } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

const NewEntry = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [plainText, setPlainText] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post('/entries', { title, content, plainText, date })
      return res.data
    },
    onSuccess: (data) => {
      toast.success('Entry created!')
      navigate(`/entries/${data._id}`)
    },
    onError: () => toast.error('Failed to create entry')
  })

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
        <button
          onClick={() => mutate()}
          disabled={isPending || !title || !plainText}
          className="bg-accent text-bg px-3 md:px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          <Save size={13} />
          {isPending ? 'Saving...' : 'Save Entry'}
        </button>
      </div>

      {/* Date picker trigger */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors cursor-pointer"
        >
          <CalendarDays size={13} />
          {formattedDate}
        </button>

        {/* Calendar dropdown */}
        {showCalendar && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowCalendar(false)}
            />
            {/* Calendar */}
            <div className="absolute top-8 left-0 z-20 bg-surface border border-border rounded-xl shadow-xl p-3">
              <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-xs text-muted">Pick a date</p>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="text-muted hover:text-text transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) {
                    setDate(d)
                    setShowCalendar(false)
                  }
                }}
                disabled={{ after: new Date() }}
                styles={{
                  root: { margin: 0 },
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Title */}
      <input
        placeholder="Entry title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full bg-transparent text-2xl md:text-3xl text-text font-bold outline-none mb-6 placeholder:text-muted"
      />

      {/* Editor */}
      <Editor onChange={(c, p) => {
        setContent(c)
        setPlainText(p)
      }} />

    </div>
  )
}

export default NewEntry
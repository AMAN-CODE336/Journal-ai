import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '@/api/axios'
import useAuthStore from '@/store/authStore'
import { User } from '@/types'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Mail, Lock, NotebookPen, UserIcon } from 'lucide-react'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post<User>('/auth/register', form)
      return res.data
    },
    onSuccess: (data) => {
      setUser(data)
      navigate('/dashboard')
      toast.success('Account created!')
    },
    onError: () => toast.error('Registration failed')
  })

  const { user, isLoading } = useAuth()

  if (isLoading) return null
  if (user) return <Navigate to="/dashboard" />

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <NotebookPen size={28} className="text-accent" />
            <h1 className="text-3xl text-accent font-semibold">JournalAI</h1>
          </div>
          <p className="text-sm text-muted">Your personal AI learning companion</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col gap-5">
          <div>
            <h2 className="text-2xl text-text mb-1">Create account</h2>
            <p className="text-sm text-muted">Start your learning journey today</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted uppercase tracking-widest">Name</label>
            <div className="relative">
              <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-surface2 border border-border rounded-lg pl-9 pr-4 py-3 text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted uppercase tracking-widest">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-surface2 border border-border rounded-lg pl-9 pr-4 py-3 text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && mutate()}
                className="w-full bg-surface2 border border-border rounded-lg pl-9 pr-4 py-3 text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <button
            onClick={() => mutate()}
            disabled={isPending || !form.name || !form.email || !form.password}
            className="w-full bg-accent text-bg font-semibold rounded-lg py-3 text-sm disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {isPending ? 'Creating...' : 'Create Account'}
          </button>

          <p className="text-sm text-center text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register
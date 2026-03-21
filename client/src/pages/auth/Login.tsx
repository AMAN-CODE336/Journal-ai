import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '@/api/axios'
import useAuthStore from '@/store/authStore'
import { User } from '@/types'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Mail, Lock, NotebookPen } from 'lucide-react'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post<User>('/auth/login', form)
      return res.data
    },
    onSuccess: (data) => {
      setUser(data)
      navigate('/dashboard')
      toast.success('Welcome back!')
    },
    onError: () => toast.error('Invalid email or password')
  })

  const { user, isLoading } = useAuth()

  if (isLoading) return null // ← don't show loading text on auth pages
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
            <h2 className="text-2xl text-text mb-1">Welcome back</h2>
            <p className="text-sm text-muted">Sign in to continue your journey</p>
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
                onKeyDown={e => e.key === 'Enter' && mutate()}
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
            disabled={isPending || !form.email || !form.password}
            className="w-full bg-accent text-bg font-semibold rounded-lg py-3 text-sm disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-sm text-center text-muted">
            No account?{' '}
            <Link to="/register" className="text-accent font-medium hover:opacity-80 transition-opacity">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login
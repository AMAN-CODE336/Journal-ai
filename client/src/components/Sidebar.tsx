import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  TrendingUp,
  Lightbulb,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
  NotebookPen
} from 'lucide-react'
import api from '@/api/axios'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

const links = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Entries', path: '/entries', icon: BookOpen },
  { label: 'New Entry', path: '/entries/new', icon: PenLine },
  { label: 'Progress', path: '/progress', icon: TrendingUp },
  { label: 'What to Learn', path: '/suggestions', icon: Lightbulb },
  { label: 'Chat with Journal', path: '/chat', icon: MessageCircle },
  { label: 'Profile', path: '/profile', icon: User },
]

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuthStore()

  const { mutate: logout } = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      setUser(null)
      navigate('/login')
      toast.success('Logged out!')
    },
    onError: () => toast.error('Logout failed')
  })

  const handleNavigate = (path: string) => {
    navigate(path)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-3">
        <div className="flex items-center gap-2">
          <NotebookPen size={20} className="text-accent" />
          <h1 className="text-lg text-accent font-semibold">JournalAI</h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted hover:text-text transition-colors lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Links */}
      <div className="flex flex-col gap-1 flex-1">
        {links.map(link => {
          const Icon = link.icon
          const isActive = location.pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer w-full text-left ${
                isActive
                  ? 'bg-accent text-bg font-medium'
                  : 'text-muted hover:bg-surface2 hover:text-text'
              }`}
            >
              <Icon size={16} />
              {link.label}
            </button>
          )
        })}
      </div>

      {/* Logout */}
      <button
        onClick={() => logout()}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:bg-surface2 hover:text-danger transition-colors cursor-pointer w-full"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  )
}

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-surface border border-border rounded-lg p-2 text-muted hover:text-text transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar — fixed, full height */}
      <div className="hidden lg:flex w-64 fixed top-0 left-0 h-screen bg-surface border-r border-border flex-col">
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar
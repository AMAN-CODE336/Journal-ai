import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/axios'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'
import { User, Lock, Save } from 'lucide-react'

const Profile = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
    mutationFn: async () => {
      const res = await api.put('/user', { name, email })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Profile updated successfully!')
    },
    onError: () => toast.error('Failed to update profile')
  })

  const { mutate: changePassword, isPending: changingPassword } = useMutation({
    mutationFn: async () => {
      const res = await api.put('/user/password', { currentPassword, newPassword })
      return res.data
    },
    onSuccess: () => {
      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
    },
    onError: () => toast.error('Current password is incorrect')
  })

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">

      <h1 className="text-2xl md:text-3xl text-text mb-1">Profile</h1>
      <p className="text-sm text-muted mb-6 md:mb-8">Manage your account settings</p>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6 md:mb-8 bg-surface border border-border rounded-xl p-4 md:p-5">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent flex items-center justify-center text-bg text-xl md:text-2xl font-bold flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-text font-medium truncate">{user?.name}</p>
          <p className="text-sm text-muted truncate">{user?.email}</p>
        </div>
      </div>

      {/* Update Profile */}
      <div className="bg-surface border border-border rounded-xl p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-5 md:mb-6">
          <User size={14} className="text-muted" />
          <p className="text-xs text-muted uppercase tracking-widest">Personal Info</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted uppercase tracking-widest">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-surface2 border border-border rounded-lg px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-surface2 border border-border rounded-lg px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            onClick={() => updateProfile()}
            disabled={updatingProfile}
            className="bg-accent text-bg px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 self-start flex items-center gap-2"
          >
            <Save size={13} />
            {updatingProfile ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-surface border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-5 md:mb-6">
          <Lock size={14} className="text-muted" />
          <p className="text-xs text-muted uppercase tracking-widest">Change Password</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted uppercase tracking-widest">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="bg-surface2 border border-border rounded-lg px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted uppercase tracking-widest">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="bg-surface2 border border-border rounded-lg px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>

          <button
            onClick={() => changePassword()}
            disabled={changingPassword || !currentPassword || !newPassword}
            className="bg-surface2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:bg-border transition-colors disabled:opacity-50 self-start flex items-center gap-2"
          >
            <Lock size={13} />
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>

    </div>
  )
}

export default Profile
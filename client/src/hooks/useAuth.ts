import { useQuery } from '@tanstack/react-query'
import api from '@/api/axios'
import useAuthStore from '@/store/authStore'
import { User } from '@/types'

const useAuth = () => {
  const { user, setUser } = useAuthStore()

  const { isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get<User>('/auth/me')
      setUser(res.data)
      return res.data
    },
    retry: false
  })

  return { user, isLoading }  
}

export default useAuth
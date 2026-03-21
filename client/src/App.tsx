import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard/Dashboard'
import Entries from '@/pages/dashboard/Entries'
import NewEntry from '@/pages/dashboard/NewEntry'
import EntryDetail from '@/pages/dashboard/EntryDetail'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Progress from '@/pages/dashboard/Progress'
import Suggestions from '@/pages/dashboard/Suggestions'
import Chat from '@/pages/dashboard/Chat'
import Profile from '@/pages/dashboard/Profile'
import ToastProvider from '@/components/ToastProvider'

const queryClient = new QueryClient()

const App = () => {
  return (
    // <div className="dark">   
       <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/entries" element={<Entries />} />
              <Route path="/entries/new" element={<NewEntry />} />
              <Route path="/entries/:id" element={<EntryDetail />} />
<Route path="/progress" element={<Progress />} />
<Route path="/suggestions" element={<Suggestions />} />
<Route path="/chat" element={<Chat />} />

            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <ToastProvider />
    </QueryClientProvider>
    // </div>
  )
}

export default App
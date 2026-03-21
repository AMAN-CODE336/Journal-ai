import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      {/* lg:ml-64 pushes content right on desktop to account for fixed sidebar */}
      <main className="flex-1 overflow-auto lg:ml-64">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
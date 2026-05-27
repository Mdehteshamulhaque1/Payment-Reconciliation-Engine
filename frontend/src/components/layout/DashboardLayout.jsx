import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0A08] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent_24%),linear-gradient(180deg,rgba(17,17,16,0.98),rgba(12,12,11,0.98))]">
          <Topbar onMenuToggle={() => setSidebarOpen((current) => !current)} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
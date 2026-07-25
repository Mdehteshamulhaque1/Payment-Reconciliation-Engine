import { useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0, y: -6, filter: 'blur(4px)',
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('pf-sidebar-collapsed') === '1')
  const location = useLocation()

  const handleCollapseToggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c
      localStorage.setItem('pf-sidebar-collapsed', next ? '1' : '0')
      return next
    })
  }, [])

  return (
    <div className="flex min-h-screen bg-[var(--bg1)]">
      <Sidebar
        collapsed={collapsed}
        onCollapseToggle={handleCollapseToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col lg:p-2 lg:pl-0">
        <Topbar
          onMenuToggle={() => setMobileOpen((o) => !o)}
          onCollapseToggle={handleCollapseToggle}
          collapsed={collapsed}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

import { useState, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { ToastContainer } from '../ui/Toast'
import { useChatContext } from '../../contexts/ChatContext'
import { ChatPanel } from '../chat/ChatPanel'
import { ChatToggleButton } from '../chat/ChatToggleButton'

interface AppLayoutProps {
  children?: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isOpen: isChatOpen, panelWidth } = useChatContext()

  const mainContent = children ?? <Outlet />

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <TopNav onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      <div className="flex flex-1">
        <Sidebar
          isOpenMobile={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />
        <main
          className="flex-1 bg-gradient-to-b from-slate-950 to-slate-900 transition-all duration-300"
          style={{ marginRight: isChatOpen ? panelWidth : 0 }}
        >
          <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-6xl flex-col px-4 py-6">
            {mainContent}
          </div>
        </main>
      </div>
      <Footer />
      <ToastContainer />
      <ChatPanel />
      <ChatToggleButton />
    </div>
  )
}


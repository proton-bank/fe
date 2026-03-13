import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface ChatContextValue {
  isOpen: boolean
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
  panelWidth: number
  setPanelWidth: (width: number) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [panelWidth, _setPanelWidth] = useState(420)

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const openChat = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setIsOpen(false)
  }, [])

  const setPanelWidth = useCallback((width: number) => {
    const clamped = Math.min(Math.max(width, 360), 640)
    _setPanelWidth(clamped)
  }, [])

  const value = useMemo(
    () => ({
      isOpen,
      toggleChat,
      openChat,
      closeChat,
      panelWidth,
      setPanelWidth,
    }),
    [closeChat, isOpen, openChat, panelWidth, setPanelWidth, toggleChat],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return ctx
}


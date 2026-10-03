/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { createContext, useContext, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useSignalR } from '@/hooks/useSignalR'

const MessagingRealtimeContext = createContext()

export function MessagingRealtimeProvider({ children }) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  // Message handlers
  const handlers = useMemo(() => ({
    onMessage: (update) => {
      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent('signalr:message', { detail: update }))
    },
    onTyping: (data) => {
      window.dispatchEvent(new CustomEvent('signalr:typing', { detail: data }))
    },
    onStatusUpdate: (data) => {
      window.dispatchEvent(new CustomEvent('signalr:status', { detail: data }))
    },
    onConversationUpdate: (data) => {
      window.dispatchEvent(new CustomEvent('signalr:conversation', { detail: data }))
    },
    onNotification: (data) => {
      window.dispatchEvent(new CustomEvent('signalr:notification', { detail: data }))
    },
    onUserStatusChange: (data) => {
      window.dispatchEvent(new CustomEvent('signalr:userstatus', { detail: data }))
    },
    onReconnected: () => {
      // Re-join active conversations
      window.dispatchEvent(new CustomEvent('signalr:reconnected'))
    }
  }), [])

  const signalR = useSignalR(userId, handlers)

  const contextValue = useMemo(() => signalR, [signalR])

  return (
    <MessagingRealtimeContext.Provider value={contextValue}>
      {children}
    </MessagingRealtimeContext.Provider>
  )
}

export function useMessagingRealtime() {
  const context = useContext(MessagingRealtimeContext)
  if (!context) {
    throw new Error('useMessagingRealtime must be used within MessagingRealtimeProvider')
  }
  return context
}
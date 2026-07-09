/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useRef, useCallback, useState } from 'react'
import * as signalR from '@microsoft/signalr'
/**
 * SignalR hook for real-time messaging
 * @param {string} userId - Current user ID
 * @param {Object} handlers - Event handlers
 * @returns {Object} - SignalR connection state and methods
 */
export function useSignalR(userId, handlers = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState('Disconnected')
  const connectionRef = useRef(null)
  const handlersRef = useRef(handlers)

  // Update handlers ref when they change
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const connect = useCallback(async () => {
    if (!userId || connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return
    }

    try {

      const hubUrl = `/api/hubs/messaging`

      // Create connection
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => {
            // Add your auth token here if needed
            return localStorage.getItem('authToken') || ''
          },
          transport: signalR.HttpTransportType.WebSockets | 
                    signalR.HttpTransportType.ServerSentEvents |
                    signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 10s, 30s, then 30s
            if (retryContext.elapsedMilliseconds < 60000) {
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000)
            }
            return null // Stop reconnecting after 1 minute
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build()

      // Register event handlers

      // Message events
      connection.on('ReceiveMessage', (message) => {
        console.log('📨 Received message:', message)
        handlersRef.current.onMessage?.({
          type: 'message_received',
          data: {
            id: message.messageId,
            conversationId: message.conversationId,
            content: message.body,
            senderId: message.fromUserId,
            senderDisplayName: message.senderDisplayName,
            avatarUrl: message.avatarUrl,
            timestamp: message.createdAt,
            messageType: message.messageType,
            attachments: message.attachments ? JSON.parse(message.attachments) : []
          }
        })
      })

      connection.on('MessageUpdated', (message) => {
        console.log('✏️ Message updated:', message)
        handlersRef.current.onMessage?.({
          type: 'message_updated',
          data: {
            id: message.messageId,
            conversationId: message.conversationId,
            content: message.body,
            isEdited: true
          }
        })
      })

      connection.on('MessageDeleted', (data) => {
        console.log('🗑️ Message deleted:', data)
        handlersRef.current.onMessage?.({
          type: 'message_deleted',
          data: {
            id: data.messageId,
            conversationId: data.conversationId
          }
        })
      })

      // Typing indicator
      connection.on('TypingIndicator', (data) => {
        console.log('⌨️ Typing indicator:', data)
        handlersRef.current.onTyping?.({
          conversationId: data.conversationId,
          userId: data.userId,
          username: data.username,
          isTyping: data.isTyping
        })
      })

      // Message status updates (delivered, read)
      connection.on('MessageStatusUpdated', (data) => {
        console.log('✓ Message status updated:', data)
        handlersRef.current.onStatusUpdate?.({
          messageId: data.messageId,
          status: data.status, // 'delivered' or 'read'
          userId: data.userId
        })
      })

      // Conversation events
      connection.on('ConversationUpdated', (conversation) => {
        console.log('🔄 Conversation updated:', conversation)
        handlersRef.current.onConversationUpdate?.(conversation)
      })

      connection.on('NotificationSummaryUpdated', (data) => {
        console.log('🔔 Notification summary updated:', data)
        handlersRef.current.onNotification?.(data)
      })

      connection.on('UserOnlineStatusChanged', (data) => {
        console.log('🟢 User online status changed:', data)
        handlersRef.current.onUserStatusChange?.({
          userId: data.userId,
          isOnline: data.isOnline
        })
      })

      // Impression events
      connection.on('MessageImpressionUpdated', (data) => {
        console.log('❤️ Message impression updated:', data)
        handlersRef.current.onImpressionUpdate?.({
          messageId: data.messageId,
          userId: data.userId,
          impressionId: data.impressionId,
          emoji: data.emoji,
          name: data.name,
          removed: data.removed,
          impressions: data.impressions,
          timestamp: data.timestamp
        })
      })

      // Connection state handlers
      connection.onreconnecting((error) => {
        console.warn('🔄 SignalR reconnecting...', error)
        setConnectionState('Reconnecting')
        setIsConnected(false)
      })

      connection.onreconnected(async (connectionId) => {
        console.log('✅ SignalR reconnected:', connectionId)
        setConnectionState('Connected')
        setIsConnected(true)

        try {
          await connection.invoke('RegisterUser', userId)
          console.log(`🔁 Re-registered SignalR user group: ${userId}`)
        } catch (err) {
          console.error('Failed to re-register SignalR user after reconnect:', err)
        }

        // Rejoin all active conversations
        handlersRef.current.onReconnected?.()
      })

      connection.onclose((error) => {
        console.error('❌ SignalR connection closed:', error)
        setConnectionState('Disconnected')
        setIsConnected(false)
        connectionRef.current = null
      })

      // Start connection
      await connection.start()
      console.log('✅ SignalR connected:', connection.connectionId)
      setConnectionState('Connected')
      setIsConnected(true)

      // Authenticate/register user
      await connection.invoke('RegisterUser', userId)

      connectionRef.current = connection

    } catch (err) {
      console.error('❌ Failed to start SignalR connection:', err)
      setConnectionState('Disconnected')
      setIsConnected(false)
    }
  }, [userId])

  // Join conversation group
  const joinConversation = useCallback(async (conversationId) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('JoinConversation', conversationId)
        console.log(`📥 Joined conversation: ${conversationId}`)
      } catch (err) {
        console.error('Failed to join conversation:', err)
      }
    }
  }, [])

  // Leave conversation group
  const leaveConversation = useCallback(async (conversationId) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('LeaveConversation', conversationId)
        console.log(`📤 Left conversation: ${conversationId}`)
      } catch (err) {
        console.error('Failed to leave conversation:', err)
      }
    }
  }, [])

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (conversationId, isTyping) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('SendTypingIndicator', conversationId, isTyping)
      } catch (err) {
        console.error('Failed to send typing indicator:', err)
      }
    }
  }, [])

  // Mark message as read
  const markMessageAsRead = useCallback(async (conversationId, messageId) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('MarkMessageAsRead', conversationId, messageId)
      } catch (err) {
        console.error('Failed to mark message as read:', err)
      }
    }
  }, [])

  // Invoke custom method
  const invoke = useCallback(async (methodName, ...args) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        return await connectionRef.current.invoke(methodName, ...args)
      } catch (err) {
        console.error(`Failed to invoke ${methodName}:`, err)
        throw err
      }
    } else {
      throw new Error('SignalR not connected')
    }
  }, [])

  // Connect on mount
  useEffect(() => {
    let connectTimer = null

    if (userId) {
      connectTimer = window.setTimeout(() => {
        connect()
      }, 0)
    }

    return () => {
      if (connectTimer) {
        window.clearTimeout(connectTimer)
      }

      if (connectionRef.current) {
        connectionRef.current.stop()
      }
    }
  }, [userId, connect])

  return {
    isConnected,
    connectionState,
    joinConversation,
    leaveConversation,
    sendTypingIndicator,
    markMessageAsRead,
    invoke,
    connection: connectionRef.current
  }
}
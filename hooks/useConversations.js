/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect, useCallback, useRef } from 'react'
import getApiURL from '@/components/widgets/GetApiURL'

// Cache to prevent duplicate requests
const conversationCache = new Map()
const pendingRequests = new Map()

/**
 * Hook to fetch and manage user's conversations
 * @param {string} userId - Current user's ID
 * @param {boolean} enabled - Whether to fetch conversations (default: true)
 * @returns {Object} - conversations data and mutation functions
 */
export function useConversations(userId, enabled = true) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMountedRef = useRef(true)

  const fetchConversations = useCallback(async () => {
    if (!enabled || !userId) {
      setLoading(false)
      return
    }

    const cacheKey = `conv-${userId}`
    
    // Check cache (30 second TTL)
    const cached = conversationCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 30000) {
      console.log(`Using cached conversations for ${cacheKey}`)
      setConversations(cached.data)
      setError(null)
      setLoading(false)
      return
    }

    // Check if request is already in flight
    if (pendingRequests.has(cacheKey)) {
      console.log(`Waiting for pending request for ${cacheKey}`)
      try {
        const data = await pendingRequests.get(cacheKey)
        if (isMountedRef.current) {
          setConversations(data)
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error('Error from pending request:', err)
          setError(err.message)
          setConversations([])
          setLoading(false)
        }
      }
      return
    }

    try {
      setLoading(true)
      const apiUrl = getApiURL()
      
      // Create promise for this request
      const requestPromise = fetch(`${apiUrl}conversations?userId=${encodeURIComponent(userId)}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch conversations: ${response.status}`)
          }
          const data = await response.json()
          const conversationData = Array.isArray(data) ? data : (data.conversations || data.data || [])
          
          // Transform API response to match component expectations
          return conversationData.map(conv => ({
            id: conv.conversationId || conv.id,
            name: conv.name || null,
            isGroup: conv.conversationType === 'group' || conv.isGroup || false,
            isOnline: conv.participants?.some(p => p.isOnline) || false,
            lastMessage: (conv.lastMessage?.content || '').replace(/<[^>]*>/g, '').trim(),
            lastMessageTime: formatLastMessageTime(conv.lastActivityAt || conv.lastMessage?.createdAt),
            unreadCount: conv.unreadCount || 0,
            participants: (conv.participants || []).map(p => ({
              id: p.userId || p.id,
              username: p.username || p.user?.username || 'Unknown',
              displayName: p.displayName || p.user?.name || p.username || 'Unknown User',
              avatarUrl: p.avatarUrl || p.user?.image || '/images/default-avatar.png',
              isOnline: p.isOnline || false,
              role: p.role || 'member'
            }))
          }))
        })
      
      // Store pending request
      pendingRequests.set(cacheKey, requestPromise)
      
      const transformedData = await requestPromise
      
      // Cache the result
      conversationCache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      })
      
      if (isMountedRef.current) {
        setConversations(transformedData)
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching conversations:', err)
      if (isMountedRef.current) {
        setError(err.message)
        setConversations([])
      }
    } finally {
      pendingRequests.delete(cacheKey)
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [userId, enabled])

  useEffect(() => {
    isMountedRef.current = true
    fetchConversations()
    
    return () => {
      isMountedRef.current = false
    }
  }, [fetchConversations])

  /**
   * Create new conversation
   */
  const createConversation = useCallback(async (participantIds, name = null) => {
    try {
      const apiUrl = getApiURL()
      const response = await fetch(`${apiUrl}conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createdBy: userId,
          participantUserIds: [...participantIds, userId], // Include creator
          name,
          conversationType: participantIds.length > 1 ? 'group' : 'direct'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to create conversation: ${response.status}`)
      }

      const result = await response.json()
      
      // Invalidate cache and refetch
      conversationCache.delete(`conv-${userId}`)
      await fetchConversations()

      return { 
        success: true, 
        conversation: result,
        message: 'Conversation created successfully'
      }
    } catch (err) {
      console.error('Error creating conversation:', err)
      return { success: false, error: err.message }
    }
  }, [userId, fetchConversations])

  /**
   * Mark conversation as read
   */
  const markAsRead = useCallback(async (conversationId) => {
    try {
      const apiUrl = getApiURL()
      const response = await fetch(`${apiUrl}conversations/${conversationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error(`Failed to mark as read: ${response.status}`)
      }

      // Update local state optimistically
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ))
      
      // Invalidate cache
      conversationCache.delete(`conv-${userId}`)

      return { success: true }
    } catch (err) {
      console.error('Error marking as read:', err)
      return { success: false, error: err.message }
    }
  }, [userId])

  /**
   * Delete conversation
   */
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      const apiUrl = getApiURL()
      const response = await fetch(`${apiUrl}conversations/${conversationId}?userId=${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to delete conversation: ${response.status}`)
      }

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      
      // Invalidate cache
      conversationCache.delete(`conv-${userId}`)

      return { success: true, message: 'Conversation deleted' }
    } catch (err) {
      console.error('Error deleting conversation:', err)
      return { success: false, error: err.message }
    }
  }, [userId])

  return {
    conversations,
    loading,
    error,
    createConversation,
    markAsRead,
    deleteConversation,
    refetch: fetchConversations
  }
}

/**
 * Helper function to format last message time
 */
function formatLastMessageTime(timestamp) {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
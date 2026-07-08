/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect, useCallback, useRef } from 'react'

// Cache to prevent duplicate requests
const messageCache = new Map()
const pendingRequests = new Map()

/**
 * Hook to fetch and manage messages in a conversation
 * @param {string} conversationId - Conversation ID
 * @param {boolean} enabled - Whether to fetch messages (default: true)
 * @returns {Object} - messages data and pagination functions
 */
export function useMessages(conversationId, enabled = true) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const isMountedRef = useRef(true)

  const fetchMessages = useCallback(async (pageNum = 1, append = false) => {
    if (!enabled || !conversationId) {
      setLoading(false)
      return
    }

    const cacheKey = `msg-${conversationId}-${pageNum}`
    
    // Check cache (10 second TTL for messages)
    const cached = messageCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 10000 && pageNum === 1) {
      console.log(`Using cached messages for ${cacheKey}`)
      setMessages(cached.data)
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
          if (append) {
            setMessages(prev => [...data, ...prev])
          } else {
            setMessages(data)
          }
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error('Error from pending request:', err)
          setError(err.message)
          if (!append) setMessages([])
          setLoading(false)
        }
      }
      return
    }

    try {
      setLoading(true)
      
      const requestPromise = fetch(
        `/api/conversations/${conversationId}/messages?page=${pageNum}&limit=50`
      ).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status}`)
        }

        const data = await response.json()
        const messageData = Array.isArray(data) ? data : (data.messages || data.data || [])
        
        // Transform API response to match component expectations
        return messageData.map(msg => ({
          id: msg.messageId || msg.id,
          content: msg.content || '',
          senderId: msg.senderId || msg.userId,
          senderName: msg.sender?.name || msg.user?.name || 'Unknown',
          senderAvatar: msg.sender?.image || msg.user?.image || '/images/default-avatar.png',
          timestamp: msg.createdAt || msg.timestamp,
          status: msg.status || 'delivered',
          isEdited: msg.isEdited || false,
          attachments: msg.attachments || [],
          replyToId: msg.replyToId || null
        }))
      })
      
      pendingRequests.set(cacheKey, requestPromise)
      const transformedData = await requestPromise
      
      // Cache the result
      messageCache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      })
      
      if (isMountedRef.current) {
        if (append) {
          setMessages(prev => [...transformedData, ...prev])
        } else {
          setMessages(transformedData)
        }
        setHasMore(transformedData.length === 50)
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
      if (isMountedRef.current) {
        setError(err.message)
        if (!append) setMessages([])
      }
    } finally {
      pendingRequests.delete(cacheKey)
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [conversationId, enabled])

  useEffect(() => {
    isMountedRef.current = true
    setPage(1)
    fetchMessages(1, false)
    
    return () => {
      isMountedRef.current = false
    }
  }, [fetchMessages])

  /**
   * Load more messages (older messages)
   */
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchMessages(nextPage, true)
    }
  }, [page, hasMore, loading, fetchMessages])

  /**
   * Add message optimistically (for real-time updates)
   */
  const addMessage = useCallback((message) => {
    setMessages(prev => {
      // Check if message already exists
      const exists = prev.some(msg => msg.id === message.id)
      if (exists) return prev
      return [...prev, message]
    })
    
    // Invalidate cache
    messageCache.delete(`msg-${conversationId}-1`)
  }, [conversationId])

  /**
   * Update message (for edits)
   */
  const updateMessage = useCallback((messageId, updates) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    ))
    
    // Invalidate cache
    messageCache.delete(`msg-${conversationId}-1`)
  }, [conversationId])

  /**
   * Remove message (for deletes)
   */
  const removeMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    
    // Invalidate cache
    messageCache.delete(`msg-${conversationId}-1`)
  }, [conversationId])

  return {
    messages,
    loading,
    error,
    hasMore,
    loadMore,
    addMessage,
    updateMessage,
    removeMessage,
    refetch: () => fetchMessages(1, false)
  }
}
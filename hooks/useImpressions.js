/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect, useCallback, useRef } from 'react'

// Cache to prevent duplicate requests
const impressionCache = new Map()
const pendingRequests = new Map()

/**
 * Hook to fetch and manage impressions/reactions for any target (listing, artist, post, etc.)
 * @param {string} targetId - Unique identifier for the target
 * @param {number} targetType - Type of target: 1 for Listing, 2 for Artist, 3 for Comment
 * @param {boolean} enabled - Whether to fetch impressions (default: true)
 * @returns {Object} - impressions data and mutation functions
 */
export function useImpressions(targetId, targetType, enabled = true) {
  const [impressions, setImpressions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMountedRef = useRef(true)

  const fetchImpressions = useCallback(async () => {
    if (!enabled || !targetId || !targetType) {
      setLoading(false)
      return
    }

    const normalizedTargetId = Number(targetId)
    if (!Number.isInteger(normalizedTargetId) || normalizedTargetId <= 0) {
      setError(null)
      setImpressions([])
      setLoading(false)
      return
    }

    const cacheKey = `${targetType}-${normalizedTargetId}`
    
    // Check cache first (5 second TTL)
    const cached = impressionCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 5000) {
      console.log(`Using cached impressions for ${cacheKey}`)
      setImpressions(cached.data)
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
          setImpressions(data)
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error('Error from pending request:', err)
          setError(err.message)
          setImpressions([])
          setLoading(false)
        }
      }
      return
    }

    try {
      setLoading(true)
      
      // Create promise for this request
      const requestPromise = fetch(
        `/api/impression/primary?targetId=${encodeURIComponent(normalizedTargetId)}&targetType=${targetType}`
      ).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch impressions: ${response.status}`)
        }
        const data = await response.json()
        return Array.isArray(data) ? data : (data.impressions || data.data || [])
      })
      
      // Store pending request
      pendingRequests.set(cacheKey, requestPromise)
      
      const impressionData = await requestPromise
      
      // Cache the result
      impressionCache.set(cacheKey, {
        data: impressionData,
        timestamp: Date.now()
      })
      
      if (isMountedRef.current) {
        setImpressions(impressionData)
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching impressions:', err)
      if (isMountedRef.current) {
        setError(err.message)
        setImpressions([])
      }
    } finally {
      pendingRequests.delete(cacheKey)
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [targetId, targetType, enabled])

  useEffect(() => {
    isMountedRef.current = true
    fetchImpressions()
    
    return () => {
      isMountedRef.current = false
    }
  }, [fetchImpressions])

  /**
   * Toggle reaction (add or remove based on current state)
   * API Response: { message: "Reaction added/removed", removed: true/false }
   * @param {number} impressionId - ID of the impression type from the API
   * @param {string} userId - Current user's ID
   * @returns {Object} - success status with action performed
   */
  const toggleReaction = useCallback(async (impressionId, userId) => {
    if (!userId) {
      console.error('User must be logged in to react')
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const response = await fetch(`/api/impression/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId,
          targetType,
          impressionId,
          userId
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to toggle reaction: ${response.status}`)
      }

      const result = await response.json()
      const wasRemoved = result.removed === true
      const message = result.message || (wasRemoved ? 'Reaction removed' : 'Reaction added')
      
      // Invalidate cache
      const normalizedTargetId = Number(targetId)
      if (!Number.isInteger(normalizedTargetId) || normalizedTargetId <= 0) {
        return { success: false, error: 'Invalid target ID' }
      }

      const cacheKey = `${targetType}-${normalizedTargetId}`
      impressionCache.delete(cacheKey)
      
      await fetchImpressions()

      return { 
        success: true, 
        removed: wasRemoved, 
        message,
        data: result 
      }
    } catch (err) {
      console.error('Error toggling reaction:', err)
      return { success: false, error: err.message }
    }
  }, [targetId, targetType, fetchImpressions])

  return {
    impressions,
    loading,
    error,
    toggleReaction,
    refetch: fetchImpressions
  }
}

/**
 * Target type constants for clarity
 */
export const ImpressionTargetType = {
  LISTING: 1,
  ARTIST: 2,
  COMMENT: 3,
  BLOG: 4,
  MESSAGE: 5  // NEW: For message impressions
}
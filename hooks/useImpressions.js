/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect, useCallback } from 'react'
import getApiURL from '@/components/widgets/GetApiURL'

/**
 * Hook to fetch and manage impressions/reactions for any target (listing, artist, post, etc.)
 * @param {string} targetId - Unique identifier for the target
 * @param {number} targetType - Type of target: 1 for Listing, 2 for Artist
 * @param {boolean} enabled - Whether to fetch impressions (default: true)
 * @returns {Object} - impressions data and mutation functions
 */
export function useImpressions(targetId, targetType, enabled = true) {
  const [impressions, setImpressions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchImpressions = useCallback(async () => {
    if (!enabled || !targetId || !targetType) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const apiUrl = getApiURL()
      const response = await fetch(
        `${apiUrl}impression/primary?targetId=${encodeURIComponent(targetId)}&targetType=${targetType}`
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch impressions: ${response.status}`)
      }

      const data = await response.json()
      const impressionData = Array.isArray(data) ? data : (data.impressions || data.data || [])
      
      setImpressions(impressionData)
      setError(null)
    } catch (err) {
      console.error('Error fetching impressions:', err)
      setError(err.message)
      setImpressions([])
    } finally {
      setLoading(false)
    }
  }, [targetId, targetType, enabled])

  useEffect(() => {
    fetchImpressions()
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
      const apiUrl = getApiURL()
      const response = await fetch(`${apiUrl}impression/react`, {
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
  ARTIST: 2
}
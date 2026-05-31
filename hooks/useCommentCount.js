/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect, useCallback } from 'react'
import getApiURL from '@/components/widgets/GetApiURL'

/**
 * Lightweight hook to fetch only comment count
 * @param {string} targetId - Unique identifier for the target
 * @param {number} targetType - Type of target: 1 for Listing, 2 for Artist, 3 for Post, 4 for Blog
 * @param {boolean} enabled - Whether to fetch count (default: true)
 * @returns {Object} - comment count and loading state
 */
export function useCommentCount(targetId, targetType, enabled = true) {
  const [commentCount, setCommentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCommentCount = useCallback(async () => {
    if (!enabled || !targetId || !targetType) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const apiUrl = getApiURL()
      const response = await fetch(
        `${apiUrl}comments/count?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comment count: ${response.status}`)
      }

      const data = await response.json()
      
      // Ensure we extract the number from the response
      let count = 0
      if (typeof data === 'number') {
        count = data
      } else if (data && typeof data.count === 'number') {
        count = data.count
      } else if (data && typeof data === 'object') {
        // Fallback: try to parse any numeric property
        count = parseInt(data.count || data.Count || data.total || 0, 10)
      }
      
      setCommentCount(count)
    } catch (err) {
      console.error('Error fetching comment count:', err)
      setCommentCount(0)
    } finally {
      setLoading(false)
    }
  }, [targetId, targetType, enabled])

  useEffect(() => {
    fetchCommentCount()
  }, [fetchCommentCount])

  return {
    commentCount,
    loading,
    refetch: fetchCommentCount
  }
}
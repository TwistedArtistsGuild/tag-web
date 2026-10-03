/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import SocialReactions from './Reactions'

/**
 * Wrapper component that transforms impression data from API format to SocialReactions format
 * 
 * API Format: [{ id, emoji, name, label, displayOrder, count }]
 * SocialReactions Format: [{ emoji, userId, username, timestamp }]
 */
const ImpressionReactions = ({
  impressions = [],
  currentUser = null,
  onToggle = () => {},
  readOnly = false,
  size = 'sm',
  showDetails = true,
  targetId = '',
  targetType = ''
}) => {
  const router = useRouter()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState(null)

  const transformedReactions = useMemo(() => {
    if (!impressions || impressions.length === 0) {
      return []
    }

    return impressions.flatMap(impression => {
      const count = impression.count || 0
      if (count === 0) return []
      
      return Array.from({ length: count }, (_, index) => ({
        emoji: impression.emoji,
        userId: `user-${impression.id}-${index}`,
        username: `User ${index + 1}`,
        timestamp: new Date().toISOString(),
        impressionId: impression.id
      }))
    })
  }, [impressions])

  const availableReactions = useMemo(() => {
    if (!impressions || impressions.length === 0) {
      return []
    }
    
    return impressions
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map(imp => ({
        emoji: imp.emoji,
        name: imp.name,
        label: imp.label || imp.name
      }))
  }, [impressions])

  const showFeedback = (message, duration = 2000) => {
    setFeedbackMessage(message)
    setTimeout(() => setFeedbackMessage(null), duration)
  }

  const handleReactionAdd = async (reactionData) => {
    if (!currentUser) {
      setShowLoginPrompt(true)
      setTimeout(() => {
        setShowLoginPrompt(false)
      }, 2500)
      return
    }
    
    const impression = impressions.find(imp => imp.emoji === reactionData.reaction)
    if (!impression) {
      console.error('Impression not found for emoji:', reactionData.reaction)
      showFeedback('Error: Reaction type not found')
      return
    }
    
    const result = await onToggle(impression.id, currentUser.id)
    
    if (result?.success) {
      const action = result.removed ? 'removed' : 'added'
      showFeedback(`${impression.emoji} ${action}!`)
    } else if (result?.error) {
      showFeedback(`Error: ${result.error}`)
    }
  }

  const handleReactionRemove = async (reactionData) => {
    if (!currentUser) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 2500)
      return
    }
    
    const impression = impressions.find(imp => imp.emoji === reactionData.reaction)
    if (!impression) return
    
    const result = await onToggle(impression.id, currentUser.id)
    
    if (result?.success) {
      const action = result.removed ? 'removed' : 'added'
      showFeedback(`${impression.emoji} ${action}!`)
    }
  }

  if (!impressions || impressions.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <SocialReactions
        targetId={targetId}
        targetType={targetType}
        initialReactions={transformedReactions}
        currentUser={currentUser}
        readOnly={false}
        showDetails={showDetails}
        size={size}
        onReactionAdd={handleReactionAdd}
        onReactionRemove={handleReactionRemove}
        availableReactions={availableReactions}
      />
      
      {showLoginPrompt && (
        <div className="absolute -top-12 left-0 right-0 bg-warning text-warning-content px-4 py-2 rounded-box shadow-lg text-sm z-50 flex items-center justify-between">
          <span>Please log in to react</span>
          <button 
            onClick={() => router.push('/api/auth/signin')}
            className="btn btn-sm btn-ghost hover:bg-warning-content/20"
          >
            Log In
          </button>
        </div>
      )}

      {feedbackMessage && (
        <div className="absolute -top-10 left-0 right-0 bg-success text-success-content px-3 py-1.5 rounded-box shadow-lg text-xs z-50 text-center animate-fade-in">
          {feedbackMessage}
        </div>
      )}
    </div>
  )
}

export default ImpressionReactions
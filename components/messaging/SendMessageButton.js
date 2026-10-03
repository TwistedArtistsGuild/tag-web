/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { IoMailOutline } from 'react-icons/io5'
import { useConversations } from '@/hooks/useConversations'

/**
 * SendMessageButton - Button to initiate conversation with an artist
 * 
 * @param {Object} props
 * @param {Object} props.recipient - Recipient user object { id, name, image }
 * @param {string} props.className - Optional CSS classes
 * @param {boolean} props.compact - Show compact button
 */
const SendMessageButton = ({ recipient, className = '', compact = false }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  
  const { createConversation } = useConversations(session?.user?.id, !!session?.user)
  
  const handleClick = async () => {
    // Redirect to login if not authenticated
    if (!session?.user) {
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`)
      return
    }
    
    setLoading(true)
    
    try {
      // Create or find existing conversation
      const result = await createConversation([recipient.id])
      
      if (result.success) {
        // Redirect to messages page with conversation
        router.push(`/messages?conversation=${result.conversation.id}`)
      } else {
        alert(`Failed to create conversation: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      alert('Failed to create conversation')
    } finally {
      setLoading(false)
    }
  }
  
  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`btn btn-sm btn-circle ${className}`}
        title={`Send message to ${recipient.name}`}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <IoMailOutline className="text-lg" />
        )}
      </button>
    )
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`btn btn-primary gap-2 ${className}`}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Creating conversation...
        </>
      ) : (
        <>
          <IoMailOutline className="text-lg" />
          Send Message
        </>
      )}
    </button>
  )
}

export default SendMessageButton
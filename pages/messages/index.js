/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import TagSEO from '@/components/TagSEO'
import DirectMessages from '@/components/social/DirectMessages'

const MessagesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const currentUser = session?.user
  const currentUserId = currentUser?.id

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/messages')
    }
  }, [status, router])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Loading your messages...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const pageMetaData = {
    title: 'Messages - TAG',
    description: 'Direct messages and conversations with artists',
    robots: 'noindex, nofollow'
  }

  return (
    
      <div className="min-h-screen bg-base-200">
        <TagSEO metadataProp={pageMetaData} canonicalSlug="messages" />
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary">Messages</h1>
          </div>
          
          <div className="bg-base-100 rounded-box shadow-lg" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Let DirectMessages handle everything internally */}
            <DirectMessages
              apiMode={true}
              compact={false}
              allowMedia={true}
              readOnly={false}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </div>
    
  )
}

export default MessagesPage

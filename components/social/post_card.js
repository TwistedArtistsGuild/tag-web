/* Example: Using impressions in a social post card */
"use client"

import { useImpressions } from "@/hooks/useImpressions"
import SocialReactions from "@/components/social/Reactions"

const PostCard = ({ post, currentUser }) => {
  const targetId = `post-${post.id}`
  const targetType = "post"

  const { 
    impressions, 
    loading,
    addReaction,
    removeReaction
  } = useImpressions(targetId, targetType, true)

  const handleReactionAdd = async (reactionData) => {
    if (!currentUser) return
    await addReaction(reactionData.reaction, currentUser.id, currentUser.username)
  }

  const handleReactionRemove = async (reactionData) => {
    if (!currentUser) return
    await removeReaction(reactionData.reaction, currentUser.id)
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p>{post.content}</p>

        <SocialReactions
          targetId={targetId}
          targetType={targetType}
          initialReactions={impressions}
          currentUser={currentUser}
          readOnly={!currentUser || loading}
          showDetails
          size="md"
          onReactionAdd={handleReactionAdd}
          onReactionRemove={handleReactionRemove}
        />
      </div>
    </div>
  )
}

export default PostCard
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useSession } from "next-auth/react"
import ArtistCard from "@/components/cards/card_artist"
import ImpressionReactions from "@/components/social/ImpressionReactions"
import { useImpressions, ImpressionTargetType } from "@/hooks/useImpressions"

/**
 * Artist Card wrapper with dynamic impression tracking
 * Use this when you want impressions on artist cards
 */
const ArtistCardWithImpressions = ({
  artist,
  currentUser: propCurrentUser = null,
  enableDynamicImpressions = true,
  showReactions = true,
  ...artistCardProps
}) => {
  // Get user from session
  const { data: session } = useSession()
  const currentUser = propCurrentUser || session?.user || null

  const artistSeed = artist?.artistID || artist?.artistid || artist?.path || artist?.title
  const targetId = artistSeed
  const targetType = ImpressionTargetType.ARTIST

  const { 
    impressions, 
    loading: impressionsLoading,
    toggleReaction
  } = useImpressions(targetId, targetType, enableDynamicImpressions && showReactions)

  const totalReactionCount = impressions?.reduce((sum, imp) => sum + (imp.count || 0), 0) || 0

  return (
    <div className="space-y-2">
      <ArtistCard artist={artist} {...artistCardProps} />
      
      {showReactions && (
        <div className="space-y-1">
          {!impressionsLoading && impressions && impressions.length > 0 ? (
            <ImpressionReactions
              impressions={impressions}
              currentUser={currentUser}
              onToggle={toggleReaction}
              readOnly={false}
              size="sm"
              showDetails
              targetId={`artist-${targetId}`}
              targetType="artist"
            />
          ) : impressionsLoading ? (
            <div className="text-sm text-base-content/50">Loading reactions...</div>
          ) : null}
          
          {totalReactionCount > 0 && (
            <p className="text-xs text-base-content/65">
              {totalReactionCount} reactions
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ArtistCardWithImpressions
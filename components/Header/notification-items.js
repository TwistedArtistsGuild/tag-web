/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { getSeededStockPhotoByCategory } from "@/utils/stockPhotos"

function getReactionTargetLabel(targetType) {
  const normalized = String(targetType || "item").toLowerCase()
  return normalized === "blog" ? "post" : normalized
}

export function buildHeaderNotifications({
  reactionSummary,
  commentSummary,
  messageSummary,
  formatRelativeTime,
}) {
  const items = []

  if (reactionSummary?.latestReaction) {
    items.push({
      type: "reactions",
      href: reactionSummary.latestReaction.href || "/artists",
      title: `Reactions (${reactionSummary.count})`,
      body: `${reactionSummary.latestReaction.reactorName || "Someone"} reacted to your ${getReactionTargetLabel(reactionSummary.latestReaction.targetType)}.`,
      time: formatRelativeTime(reactionSummary.latestReaction.createdAt),
      avatar: reactionSummary.latestReaction.reactorImage || getSeededStockPhotoByCategory("Reaction", "artist"),
      createdAt: reactionSummary.latestReaction.createdAt,
    })
  }

  if (commentSummary?.latestComment) {
    items.push({
      type: "comments",
      href: commentSummary.latestComment.href || "/news#comments-section",
      title: `Comments (${commentSummary.count})`,
      body: `${commentSummary.latestComment.commenterName || "Someone"} commented: ${commentSummary.latestComment.contentPreview || "New comment"}`,
      time: formatRelativeTime(commentSummary.latestComment.createdAt),
      avatar: commentSummary.latestComment.commenterImage || getSeededStockPhotoByCategory("Comment", "artist"),
      createdAt: commentSummary.latestComment.createdAt,
    })
  }

  if (messageSummary?.latestMessage) {
    items.push({
      type: "messages",
      href: messageSummary.latestMessage.href || "/messages",
      title: `Messages (${messageSummary.unreadMessages})`,
      body: `${messageSummary.latestMessage.senderName || "Someone"}: ${messageSummary.latestMessage.contentPreview || "New message"}`,
      time: formatRelativeTime(messageSummary.latestMessage.createdAt),
      avatar: messageSummary.latestMessage.senderImage || getSeededStockPhotoByCategory("New Message", "artist"),
      createdAt: messageSummary.latestMessage.createdAt,
      conversationId: messageSummary.latestMessage.conversationId ? String(messageSummary.latestMessage.conversationId) : null,
    })
  }

  return items.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bTime - aTime
  })
}

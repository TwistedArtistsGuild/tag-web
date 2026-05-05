import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

/**
 * Fetches conversations for CRM/social chat view
 * Staff-only: requires authenticated session.
 * TODO: restrict to marketing-team role once role system is in place.
 */
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const token = process.env.GHL_API_TOKEN || process.env.GHL_PRIVATE_INTEGRATION_TOKEN
  const locationId = process.env.GHL_LOCATION_ID || req.query.locationId

  if (!token) {
    return res.status(400).json({
      error: "GoHighLevel API token not configured",
      hint: "Set GHL_API_TOKEN in .env.local",
    })
  }

  if (!locationId) {
    return res.status(400).json({
      error: "Location ID not provided",
      hint: "Set GHL_LOCATION_ID in .env.local or pass ?locationId=YOUR_LOCATION_ID",
    })
  }

  try {
    const params = new URLSearchParams({
      locationId,
      limit: "50",
      status: "all",
      sort: "desc",
    })

    // Optional filters
    if (req.query.contactId) params.set("contactId", req.query.contactId)
    if (req.query.query) params.set("query", req.query.query)
    if (req.query.lastMessageType) params.set("lastMessageType", req.query.lastMessageType)

    const response = await fetch(
      `https://services.leadconnectorhq.com/conversations/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          Version: "2023-02-21",
        },
      }
    )

    const body = await response.text()
    let data = {}
    try {
      data = JSON.parse(body)
    } catch {
      data = {}
    }

    if (!response.ok) {
      throw new Error(`GHL API ${response.status}: ${data.message || body}`)
    }

    const conversations = data.conversations || []

    // Keep the social subset for legacy callers, but return all conversations
    // so the CRM inbox shows form submissions, emails, SMS, and social channels.
    const socialConversations = conversations.filter((c) =>
      ["TYPE_FACEBOOK", "TYPE_INSTAGRAM", "TYPE_WHATSAPP", "TYPE_PHONE", "TYPE_SMS", "TYPE_EMAIL"].includes(
        c.lastMessageType
      )
    )

    res.status(200).json({
      data: conversations,
      social: conversations, // return all; socialConversations kept for reference
      total: data.total || conversations.length,
    })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    res.status(500).json({
      error: error.message,
      details: "Failed to fetch conversations from GoHighLevel",
    })
  }
}

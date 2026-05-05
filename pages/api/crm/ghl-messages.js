import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

/**
 * Fetches individual messages for a given GHL conversation.
 * Staff-only: requires authenticated session.
 * TODO: restrict to marketing-team role once role system is in place.
 * GET /api/crm/ghl-messages?conversationId=xxx&limit=50
 * GHL docs: GET /conversations/{id}/messages
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

  if (!token) {
    return res.status(400).json({
      error: "GoHighLevel API token not configured",
      hint: "Set GHL_API_TOKEN in .env.local",
    })
  }

  const { conversationId, limit = "50", lastMessageId } = req.query

  if (!conversationId) {
    return res.status(400).json({ error: "conversationId is required" })
  }

  try {
    const params = new URLSearchParams({ limit })
    if (lastMessageId) params.set("lastMessageId", lastMessageId)

    const response = await fetch(
      `https://services.leadconnectorhq.com/conversations/${encodeURIComponent(conversationId)}/messages?${params.toString()}`,
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

    // GHL returns { messages: { lastMessageId, nextPage, messages: [...] } }
    // or { messages: [...] } depending on API version — normalise both shapes.
    const rawMessages = (() => {
      const m = data.messages
      if (Array.isArray(m)) return m
      if (m && Array.isArray(m.messages)) return m.messages
      // Log unexpected shape in dev so we can fix it
      console.warn("ghl-messages: unexpected messages shape", JSON.stringify(data).slice(0, 300))
      return []
    })()

    // Normalize GHL messages to the shape DirectMessages component expects
    const messages = rawMessages.map((msg) => ({
      id: msg.id,
      // GHL body is plain text; wrap so DOMPurify + rich-text rendering works
      content: `<p>${msg.body || ""}</p>`,
      senderId: msg.direction === "outbound" ? "staff" : msg.contactId || "contact",
      senderName: msg.direction === "outbound" ? "Staff" : null, // caller fills contact name
      senderAvatar: "/images/default-avatar.png",
      timestamp: msg.dateAdded || new Date().toISOString(),
      status: msg.status || "delivered",
      // GHL extras preserved for future use
      _ghl: {
        type: msg.type,
        messageType: msg.messageType,
        direction: msg.direction,
        source: msg.source,
        contentType: msg.contentType,
      },
    }))

    res.status(200).json({
      messages,
      lastMessageId: data.messages?.lastMessageId || data.lastMessageId || null,
      nextPage: data.messages?.nextPage || data.nextPage || false,
    })
  } catch (error) {
    console.error("Error fetching GHL messages:", error)
    res.status(500).json({
      error: error.message,
      details: "Failed to fetch messages from GoHighLevel",
    })
  }
}

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

/**
 * Sends a message through GHL conversations API (CRM channel)
 * Staff-only: requires authenticated session.
 * TODO: restrict to marketing-team role once role system is in place.
 */
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const token = process.env.GHL_API_TOKEN || process.env.GHL_PRIVATE_INTEGRATION_TOKEN
  const locationId = process.env.GHL_LOCATION_ID || req.body?.locationId

  if (!token) {
    return res.status(400).json({
      error: "GoHighLevel API token not configured",
      hint: "Set GHL_API_TOKEN in .env.local",
    })
  }

  if (!locationId) {
    return res.status(400).json({
      error: "Location ID not provided",
      hint: "Set GHL_LOCATION_ID in .env.local or include locationId in request body",
    })
  }

  const { contactId, message, type } = req.body || {}

  if (!contactId || !message || !type) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["contactId", "message", "type"],
    })
  }

  const allowedTypes = ["SMS", "Email", "WhatsApp", "IG", "FB", "Custom", "Live_Chat", "InternalComment"]
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({
      error: "Invalid type",
      allowedTypes,
    })
  }

  try {
    const payload = {
      type,
      contactId,
      message,
      status: "pending",
    }

    const response = await fetch("https://services.leadconnectorhq.com/conversations/messages", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Version: "2023-02-21",
      },
      body: JSON.stringify(payload),
    })

    const body = await response.text()
    let data = {}
    try {
      data = JSON.parse(body)
    } catch {
      data = { raw: body }
    }

    if (!response.ok) {
      throw new Error(`GHL API ${response.status}: ${data.message || body}`)
    }

    res.status(200).json({
      ok: true,
      data,
    })
  } catch (error) {
    console.error("Error sending GHL message:", error)
    res.status(500).json({
      error: error.message,
      details:
        "Failed to send message. Ensure the contact has the selected channel connected (FB/IG/WhatsApp/SMS/Email).",
    })
  }
}

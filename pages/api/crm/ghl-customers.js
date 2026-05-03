/**
 * Fetches customers/contacts from GoHighLevel
 */
export default async function handler(req, res) {
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
      troubleshooting: {
        step1: "Verify your private integration has 'Contacts' scope enabled in GHL Settings",
        step2: "Find your Location ID in GHL: Settings > General > Location ID",
        step3: "Add to .env.local: GHL_LOCATION_ID=your_location_id_here",
      },
    })
  }

  try {
    const url = `https://services.leadconnectorhq.com/contacts?locationId=${locationId}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`GHL API Error: ${response.status}`, errorText)
      let errorBody
      try {
        errorBody = JSON.parse(errorText)
      } catch {
        errorBody = { message: errorText }
      }
      throw new Error(`GHL API ${response.status}: ${errorBody.message || errorText}`)
    }

    const data = await response.json()
    res.status(200).json({
      data: data.contacts || data.data || [],
      total: data.meta?.total || data.contacts?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching GHL customers:", error)
    res.status(500).json({
      error: error.message,
      details: "Failed to fetch customers from GoHighLevel",
    })
  }
}

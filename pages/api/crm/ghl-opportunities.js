/**
 * Fetches opportunities from GoHighLevel
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
    })
  }

  try {
    const pipelineId = req.query.pipelineId
    const params = new URLSearchParams({
      location_id: locationId,
      limit: "100",
      page: "1",
      status: "all",
    })
    if (pipelineId) {
      params.set("pipeline_id", pipelineId)
    }

    const url = `https://services.leadconnectorhq.com/opportunities/search?${params.toString()}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        Version: "2023-02-21",
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
      data: data.opportunities || data.data || [],
      total: data.meta?.total || data.total || data.opportunities?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching GHL opportunities:", error)
    res.status(500).json({
      error: error.message,
      details: "Failed to fetch opportunities from GoHighLevel",
    })
  }
}

/**
 * Fetches survey responses from GoHighLevel
 * Surveys may be available via /surveys endpoint or as form responses
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const token = process.env.GHL_API_TOKEN || process.env.GHL_PRIVATE_INTEGRATION_TOKEN
  const locationId = process.env.GHL_LOCATION_ID || req.query.locationId
  const membershipFormId =
    process.env.GHL_MEMBERSHIP_FORM_ID || req.query.formId || "jqVGvHmn4pv8gb67G3zU"
  const startAt = process.env.GHL_FORMS_START_AT || req.query.startAt || "2020-01-01"
  const endAt = process.env.GHL_FORMS_END_AT || req.query.endAt || "2030-01-01"

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
    const submissionsUrl = new URL("https://services.leadconnectorhq.com/forms/submissions")
    submissionsUrl.searchParams.set("locationId", locationId)
    submissionsUrl.searchParams.set("formId", membershipFormId)
    submissionsUrl.searchParams.set("startAt", startAt)
    submissionsUrl.searchParams.set("endAt", endAt)
    submissionsUrl.searchParams.set("limit", "100")
    submissionsUrl.searchParams.set("page", "1")

    const response = await fetch(submissionsUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        Version: "2023-02-21",
      },
    })

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      data = { raw: responseText }
    }

    if (!response.ok) {
      const apiMessage = data?.message || responseText || "Unknown error"
      throw new Error(`GHL API ${response.status}: ${apiMessage}`)
    }

    const submissions = data?.submissions || []

    res.status(200).json({
      data: submissions,
      total: data?.meta?.total || submissions.length || 0,
      source: "forms-submissions",
      formId: membershipFormId,
      formName: "TAG Membership Interest Form",
      startAt,
      endAt,
    })
  } catch (error) {
    console.error("Error fetching GHL surveys:", error)
    res.status(500).json({
      error: error.message,
      details:
        "Failed to fetch surveys from GoHighLevel. Surveys may require additional permissions or may not be available via this API endpoint.",
    })
  }
}

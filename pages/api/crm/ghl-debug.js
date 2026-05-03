/**
 * Debug endpoint to test different GHL API endpoint formats
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const token = process.env.GHL_API_TOKEN || process.env.GHL_PRIVATE_INTEGRATION_TOKEN
  const locationId = process.env.GHL_LOCATION_ID

  if (!token) {
    return res.status(400).json({
      error: "Token not configured",
      hint: "Set GHL_API_TOKEN in .env.local",
    })
  }

  console.log("Testing GHL endpoints...")
  console.log("Token:", token?.substring(0, 15) + "...")
  console.log("LocationId:", locationId)

  const results = []

  // Test 1: Direct /contacts/
  try {
    const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
    })
    const text = await response.text()
    results.push({
      endpoint: "/contacts/",
      status: response.status,
      statusText: response.statusText,
      body: text.substring(0, 300),
    })
  } catch (e) {
    results.push({
      endpoint: "/contacts/",
      error: e.message,
    })
  }

  // Test 2: /contacts as query param
  if (locationId) {
    try {
      const response = await fetch(
        `https://services.leadconnectorhq.com/contacts?locationId=${locationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Version: "2021-07-28",
          },
        }
      )
      const text = await response.text()
      results.push({
        endpoint: `/contacts?locationId=${locationId}`,
        status: response.status,
        statusText: response.statusText,
        body: text.substring(0, 300),
      })
    } catch (e) {
      results.push({
        endpoint: `/contacts?locationId=${locationId}`,
        error: e.message,
      })
    }
  }

  // Test 3: /contacts/ with trailing slash and query
  if (locationId) {
    try {
      const response = await fetch(
        `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Version: "2021-07-28",
          },
        }
      )
      const text = await response.text()
      results.push({
        endpoint: `/contacts/?locationId=${locationId}`,
        status: response.status,
        statusText: response.statusText,
        body: text.substring(0, 300),
      })
    } catch (e) {
      results.push({
        endpoint: `/contacts/?locationId=${locationId}`,
        error: e.message,
      })
    }
  }

  res.status(200).json({
    config: {
      tokenSet: !!token,
      locationIdSet: !!locationId,
    },
    results,
  })
}

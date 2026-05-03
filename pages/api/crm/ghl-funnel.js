/**
 * Fetches membership funnel information (pipeline + stage totals)
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const token = process.env.GHL_API_TOKEN || process.env.GHL_PRIVATE_INTEGRATION_TOKEN
  const locationId = process.env.GHL_LOCATION_ID || req.query.locationId
  const preferredPipelineName =
    process.env.GHL_MEMBERSHIP_PIPELINE_NAME || req.query.pipelineName || "Artist Onboarding and Interviews"
  const membershipFormId = process.env.GHL_MEMBERSHIP_FORM_ID || req.query.formId || "jqVGvHmn4pv8gb67G3zU"

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
    const pipelinesRes = await fetch(
      `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${locationId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          Version: "2023-02-21",
        },
      }
    )

    const pipelinesBody = await pipelinesRes.text()
    let pipelinesData = {}
    try {
      pipelinesData = JSON.parse(pipelinesBody)
    } catch {
      pipelinesData = {}
    }

    if (!pipelinesRes.ok) {
      throw new Error(`GHL API ${pipelinesRes.status}: ${pipelinesData.message || pipelinesBody}`)
    }

    const pipelines = pipelinesData.pipelines || []
    const targetPipeline =
      pipelines.find((p) => p.name === preferredPipelineName) ||
      pipelines.find((p) => p.name?.toLowerCase().includes("artist onboarding")) ||
      pipelines[0]

    if (!targetPipeline) {
      return res.status(200).json({
        pipeline: null,
        stages: [],
        stageCounts: [],
        opportunities: [],
        total: 0,
      })
    }

    const oppParams = new URLSearchParams({
      location_id: locationId,
      pipeline_id: targetPipeline.id,
      limit: "100",
      page: "1",
      status: "all",
    })

    const oppRes = await fetch(
      `https://services.leadconnectorhq.com/opportunities/search?${oppParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          Version: "2023-02-21",
        },
      }
    )

    const oppBody = await oppRes.text()
    let oppData = {}
    try {
      oppData = JSON.parse(oppBody)
    } catch {
      oppData = {}
    }

    if (!oppRes.ok) {
      throw new Error(`GHL API ${oppRes.status}: ${oppData.message || oppBody}`)
    }

    const opportunities = oppData.opportunities || []
    const stageMap = new Map((targetPipeline.stages || []).map((stage) => [stage.id, stage.name]))

    const stageCounts = (targetPipeline.stages || []).map((stage) => ({
      stageId: stage.id,
      stageName: stage.name,
      count: 0,
      stageWinProbability: stage.stageWinProbability,
      position: stage.position,
    }))

    const counter = new Map(stageCounts.map((x) => [x.stageId, x]))
    for (const opp of opportunities) {
      const stageEntry = counter.get(opp.pipelineStageId)
      if (stageEntry) {
        stageEntry.count += 1
      }
    }

    const normalizedOpportunities = opportunities.map((opp) => ({
      id: opp.id,
      name: opp.name,
      status: opp.status,
      monetaryValue: opp.monetaryValue,
      pipelineStageId: opp.pipelineStageId,
      pipelineStageName: stageMap.get(opp.pipelineStageId) || opp.pipelineStageId,
      contact: opp.contact || null,
      source: opp.source || null,
      createdAt: opp.createdAt,
      updatedAt: opp.updatedAt,
    }))

    const formParams = new URLSearchParams({
      locationId,
      formId: membershipFormId,
      startAt: "2020-01-01",
      endAt: "2030-01-01",
      limit: "1",
      page: "1",
    })

    let membershipForm = {
      formId: membershipFormId,
      formName: "TAG Membership Interest Form",
      submissionsTotal: 0,
      viewedTotal: 0,
      completionRate: 0,
      viewedLabel: "Initial Interest Stage",
    }

    try {
      const formRes = await fetch(
        `https://services.leadconnectorhq.com/forms/submissions?${formParams.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            Version: "2023-02-21",
          },
        }
      )

      const formBody = await formRes.text()
      let formData = {}
      try {
        formData = JSON.parse(formBody)
      } catch {
        formData = {}
      }

      if (formRes.ok) {
        const firstStage = stageCounts.length > 0 ? stageCounts[0] : null
        const viewedTotal = firstStage?.count || 0
        const submissionsTotal = formData?.meta?.total || formData?.submissions?.length || 0
        const completionRate = viewedTotal > 0 ? Number(((submissionsTotal / viewedTotal) * 100).toFixed(1)) : 0

        membershipForm = {
          formId: membershipFormId,
          formName: "TAG Membership Interest Form",
          submissionsTotal,
          viewedTotal,
          completionRate,
          viewedLabel: firstStage?.stageName || "Initial Interest Stage",
        }
      }
    } catch {
      // non-fatal: funnel data should still render even if submissions query fails
    }

    res.status(200).json({
      pipeline: {
        id: targetPipeline.id,
        name: targetPipeline.name,
      },
      membershipForm,
      stages: targetPipeline.stages || [],
      stageCounts: stageCounts.sort((a, b) => a.position - b.position),
      opportunities: normalizedOpportunities,
      total: oppData.meta?.total || normalizedOpportunities.length,
    })
  } catch (error) {
    console.error("Error fetching GHL funnel:", error)
    res.status(500).json({
      error: error.message,
      details: "Failed to fetch funnel information from GoHighLevel",
    })
  }
}

import { useState, useEffect, useMemo } from "react"

export default function GHLTester() {
  const [contacts, setContacts] = useState([])
  const [surveys, setSurveys] = useState([])
  const [funnel, setFunnel] = useState({
    pipeline: null,
    membershipForm: null,
    stageCounts: [],
    opportunities: [],
    total: 0,
  })
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatType, setChatType] = useState("SMS")
  const [chatStatus, setChatStatus] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contactSearch, setContactSearch] = useState("")
  const [contactSort, setContactSort] = useState({ key: "company", direction: "asc" })
  const membershipFormId = "jqVGvHmn4pv8gb67G3zU"

  const getContactName = (contact) => {
    if (contact.firstName || contact.lastName) {
      return `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
    }
    return contact.contactName || "-"
  }

  const filteredAndSortedContacts = useMemo(() => {
    const search = contactSearch.trim().toLowerCase()

    const filtered = contacts.filter((contact) => {
      if (!search) return true

      const fields = [
        contact.companyName || "",
        getContactName(contact),
        contact.email || "",
        contact.type || "",
      ]

      return fields.some((field) => field.toLowerCase().includes(search))
    })

    const sorted = [...filtered].sort((a, b) => {
      const aName = getContactName(a)
      const bName = getContactName(b)

      const valueMapA = {
        company: (a.companyName || "").toLowerCase(),
        name: (aName || "").toLowerCase(),
        email: (a.email || "").toLowerCase(),
        status: (a.type || "contact").toLowerCase(),
      }

      const valueMapB = {
        company: (b.companyName || "").toLowerCase(),
        name: (bName || "").toLowerCase(),
        email: (b.email || "").toLowerCase(),
        status: (b.type || "contact").toLowerCase(),
      }

      const aValue = valueMapA[contactSort.key] || ""
      const bValue = valueMapB[contactSort.key] || ""

      if (aValue < bValue) return contactSort.direction === "asc" ? -1 : 1
      if (aValue > bValue) return contactSort.direction === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [contacts, contactSearch, contactSort])

  const toggleContactSort = (key) => {
    setContactSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" }
      }
      return { key, direction: "asc" }
    })
  }

  const sortIndicator = (key) => {
    if (contactSort.key !== key) return ""
    return contactSort.direction === "asc" ? " ↑" : " ↓"
  }

  const findFieldInObject = (value, candidateKeys) => {
    if (value == null) return null

    const normalize = (input) => String(input).toLowerCase().replace(/[^a-z0-9]/g, "")
    const normalizedCandidates = candidateKeys.map((key) => normalize(key))

    const visit = (node) => {
      if (node == null) return null

      if (typeof node !== "object") {
        return null
      }

      if (Array.isArray(node)) {
        for (const item of node) {
          const found = visit(item)
          if (found) return found
        }
        return null
      }

      for (const [key, rawVal] of Object.entries(node)) {
        const normalizedKey = normalize(key)
        const isMatch = normalizedCandidates.some(
          (candidate) => normalizedKey === candidate || normalizedKey.includes(candidate)
        )

        if (isMatch && typeof rawVal !== "object" && rawVal != null && String(rawVal).trim()) {
          return String(rawVal).trim()
        }

        const nested = visit(rawVal)
        if (nested) return nested
      }

      return null
    }

    return visit(value)
  }

  const getSubmissionName = (survey) => {
    const directName =
      survey.fullName ||
      survey.contactName ||
      survey.respondentName ||
      survey.name

    if (directName) return String(directName).trim()

    const firstName = findFieldInObject(survey, ["firstName", "first_name", "firstname"])
    const lastName = findFieldInObject(survey, ["lastName", "last_name", "lastname"])

    if (firstName || lastName) {
      return `${firstName || ""} ${lastName || ""}`.trim()
    }

    return findFieldInObject(survey, ["name", "fullname", "full_name"]) || "—"
  }

  const membershipRows = useMemo(() => {
    return surveys.map((survey, idx) => ({
      id: survey.id || survey._id || `submission-${idx}`,
      name: getSubmissionName(survey),
      city: findFieldInObject(survey, ["city", "town", "municipality"]) || "—",
      state: findFieldInObject(survey, ["state", "province", "region"]) || "—",
      organization:
        findFieldInObject(survey, ["organization", "organisation", "company", "companyName", "business", "guild"]) ||
        "—",
    }))
  }, [surveys])

  const resolveChatTypeFromConversation = (conversation) => {
    const map = {
      TYPE_FACEBOOK: "FB",
      TYPE_INSTAGRAM: "IG",
      TYPE_WHATSAPP: "WhatsApp",
      TYPE_EMAIL: "Email",
      TYPE_SMS: "SMS",
      TYPE_PHONE: "SMS",
    }
    return map[conversation?.lastMessageType] || "SMS"
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch contacts
        const customersRes = await fetch("/api/test/ghl-customers")
        if (!customersRes.ok) throw new Error(`Contacts: ${customersRes.statusText}`)
        const customersData = await customersRes.json()
        setContacts(customersData.data || [])

        // Fetch opportunities/funnel insights
        try {
          const funnelRes = await fetch("/api/test/ghl-funnel")
          if (!funnelRes.ok) throw new Error(`Funnel: ${funnelRes.statusText}`)
          const funnelData = await funnelRes.json()
          setFunnel({
            pipeline: funnelData.pipeline,
            membershipForm: funnelData.membershipForm || null,
            stageCounts: funnelData.stageCounts || [],
            opportunities: funnelData.opportunities || [],
            total: funnelData.total || 0,
          })
        } catch (err) {
          console.warn("Funnel fetch failed:", err.message)
        }

        // Fetch conversations for CRM/social chat
        try {
          const convRes = await fetch("/api/test/ghl-conversations")
          if (!convRes.ok) throw new Error(`Conversations: ${convRes.statusText}`)
          const convData = await convRes.json()
          const list = convData.social?.length ? convData.social : convData.data || []
          setConversations(list)
          if (list.length > 0) {
            setSelectedConversation(list[0])
            setChatType(resolveChatTypeFromConversation(list[0]))
          }
        } catch (err) {
          console.warn("Conversations fetch failed:", err.message)
        }

        // Fetch surveys (optional - endpoint may not be available)
        try {
          const surveysRes = await fetch(
            `/api/test/ghl-surveys?formId=${membershipFormId}&startAt=2020-01-01&endAt=2030-01-01`
          )
          if (surveysRes.ok) {
            const surveysData = await surveysRes.json()
            setSurveys(surveysData.data || [])
          } else {
            console.warn("Surveys endpoint not available")
          }
        } catch (err) {
          console.warn("Surveys fetch failed:", err.message)
        }
      } catch (err) {
        setError(err.message)
        console.error("Error fetching GHL data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    setChatType(resolveChatTypeFromConversation(conversation))
    setChatStatus("")
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!selectedConversation?.contactId || !chatMessage.trim()) {
      setChatStatus("Choose a conversation and enter a message.")
      return
    }

    try {
      setSending(true)
      setChatStatus("")

      const res = await fetch("/api/test/ghl-send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedConversation.contactId,
          type: chatType,
          message: chatMessage.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Send failed: ${res.statusText}`)
      }

      setChatMessage("")
      setChatStatus("Message queued/sent through GHL CRM.")
    } catch (err) {
      setChatStatus(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading GoHighLevel data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">GoHighLevel Integration Tester</h1>

        {/* Contacts Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Contacts ({filteredAndSortedContacts.length})
          </h2>
          {contacts.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="mb-3">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search contacts by company, name, email, or status"
                  className="w-full md:w-96 border rounded px-3 py-2 text-sm"
                />
              </div>
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2">
                      <button type="button" onClick={() => toggleContactSort("company")}>Company{sortIndicator("company")}</button>
                    </th>
                    <th className="px-4 py-2">
                      <button type="button" onClick={() => toggleContactSort("name")}>Name{sortIndicator("name")}</button>
                    </th>
                    <th className="px-4 py-2">
                      <button type="button" onClick={() => toggleContactSort("email")}>Email{sortIndicator("email")}</button>
                    </th>
                    <th className="px-4 py-2">
                      <button type="button" onClick={() => toggleContactSort("status")}>Status{sortIndicator("status")}</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedContacts.slice(0, 10).map((contact, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{contact.companyName || "—"}</td>
                      <td className="px-4 py-2 font-medium">
                        {getContactName(contact)}
                      </td>
                      <td className="px-4 py-2">{contact.email || "—"}</td>
                      <td className="px-4 py-2">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {contact.type || "contact"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAndSortedContacts.length > 10 && (
                <p className="text-gray-500 text-sm mt-2">
                  Showing 10 of {filteredAndSortedContacts.length} contacts
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No contacts found</p>
          )}
        </div>

        {/* Initial Membership Drive Funnel Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Initial Membership Drive Funnel
          </h2>
          {funnel.pipeline ? (
            <div>
              <div className="mb-4 p-3 rounded bg-indigo-50 border border-indigo-200">
                <p className="font-semibold text-indigo-900">Pipeline: {funnel.pipeline.name}</p>
                <p className="text-indigo-700 text-sm">Total opportunities: {funnel.total}</p>
                <p className="text-indigo-700 text-sm">
                  Membership form submissions: {funnel.membershipForm?.submissionsTotal ?? 0}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {funnel.stageCounts.map((stage) => (
                  <div key={stage.stageId} className="border rounded p-3 bg-gray-50">
                    <p className="font-semibold text-gray-800 text-sm">{stage.stageName}</p>
                    <p className="text-xs text-gray-500">Win probability: {stage.stageWinProbability ?? "-"}%</p>
                    <p className="text-lg font-bold text-indigo-700 mt-1">{stage.count}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 font-semibold">
                    <tr>
                      <th className="px-4 py-2">Opportunity</th>
                      <th className="px-4 py-2">Company</th>
                      <th className="px-4 py-2">Stage</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnel.opportunities.slice(0, 10).map((opp) => (
                      <tr key={opp.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{opp.name || "-"}</td>
                        <td className="px-4 py-2">{opp.contact?.companyName || "—"}</td>
                        <td className="px-4 py-2">{opp.pipelineStageName || "—"}</td>
                        <td className="px-4 py-2">{opp.status || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No funnel/pipeline data found.</p>
          )}
        </div>

        {/* Surveys Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Initial Membership Drive Responses ({surveys.length})
          </h2>
          {surveys.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">City</th>
                    <th className="px-4 py-2">State</th>
                    <th className="px-4 py-2">Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {membershipRows.slice(0, 25).map((row) => (
                    <tr key={row.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{row.name}</td>
                      <td className="px-4 py-2">{row.city}</td>
                      <td className="px-4 py-2">{row.state}</td>
                      <td className="px-4 py-2">{row.organization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {membershipRows.length > 25 && (
                <p className="text-gray-500 text-sm mt-2">
                  Showing 25 of {membershipRows.length} submissions
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              No submissions found yet for TAG Membership Interest Form ({membershipFormId}).
            </p>
          )}
        </div>

        {/* CRM + Social Chat Interface */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">CRM Social Chat Interface</h2>
          <p className="text-sm text-gray-500 mb-4">
            Send outbound messages through CRM channels (FB, IG, WhatsApp, SMS, Email) for the selected contact conversation.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 border rounded">
              <div className="p-3 border-b bg-gray-50 font-semibold text-sm">
                Conversations ({conversations.length})
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <p className="p-3 text-sm text-gray-500">No conversations found.</p>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => handleSelectConversation(conversation)}
                      className={`w-full text-left p-3 border-b hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? "bg-indigo-50" : ""
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-800">{conversation.contactName || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{conversation.companyName || conversation.phone || "-"}</p>
                      <p className="text-xs text-indigo-700 mt-1">{conversation.lastMessageType || conversation.type}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2 border rounded p-4">
              {selectedConversation ? (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800">{selectedConversation.contactName || "Unknown contact"}</p>
                    <p className="text-sm text-gray-500">
                      Contact ID: {selectedConversation.contactId} | Channel hint: {selectedConversation.lastMessageType || "n/a"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="text-sm">
                      <span className="block mb-1 text-gray-600">Message Type</span>
                      <select
                        value={chatType}
                        onChange={(e) => setChatType(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="SMS">SMS</option>
                        <option value="FB">Facebook</option>
                        <option value="IG">Instagram</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email</option>
                      </select>
                    </label>
                  </div>

                  <label className="text-sm block">
                    <span className="block mb-1 text-gray-600">Message</span>
                    <textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      rows={5}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Type your message to send through CRM..."
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>

                  {chatStatus ? (
                    <p className="text-sm text-gray-700 bg-gray-50 border rounded p-2">{chatStatus}</p>
                  ) : null}
                </form>
              ) : (
                <p className="text-sm text-gray-500">Select a conversation to start messaging.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

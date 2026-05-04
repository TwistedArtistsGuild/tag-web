import { useState, useEffect } from "react"

/**
 * CrmSocialChat
 * Prototype CRM outbound messaging panel backed by GoHighLevel conversations.
 * Extracted from pages/portal/staff/ghl.js — to be promoted to a proper
 * standalone feature and removed from the GHL tester page.
 */
export default function CrmSocialChat() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatType, setChatType] = useState("SMS")
  const [chatStatus, setChatStatus] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    const fetchConversations = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/crm/ghl-conversations")
        if (!res.ok) throw new Error(`Conversations: ${res.statusText}`)
        const data = await res.json()
        const list = data.social?.length ? data.social : data.data || []
        setConversations(list)
        if (list.length > 0) {
          setSelectedConversation(list[0])
          setChatType(resolveChatTypeFromConversation(list[0]))
        }
      } catch (err) {
        setError(err.message)
        console.error("CrmSocialChat: failed to load conversations", err)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
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

      const res = await fetch("/api/crm/ghl-send-message", {
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
      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading conversations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
        <strong>Error:</strong> {error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Conversation list */}
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

      {/* Message composer */}
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
  )
}

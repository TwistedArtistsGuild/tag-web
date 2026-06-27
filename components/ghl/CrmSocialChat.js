import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import DirectMessages from "@/components/social/DirectMessages"

/** Maps GHL lastMessageType to a human-readable channel label */
const CHANNEL_LABELS = {
  TYPE_FACEBOOK: "Facebook",
  TYPE_INSTAGRAM: "Instagram",
  TYPE_WHATSAPP: "WhatsApp",
  TYPE_EMAIL: "Email",
  TYPE_SMS: "SMS",
  TYPE_PHONE: "SMS",
}

/** Maps GHL lastMessageType to the value GHL send-message API expects */
const CHANNEL_SEND_TYPE = {
  TYPE_FACEBOOK: "FB",
  TYPE_INSTAGRAM: "IG",
  TYPE_WHATSAPP: "WhatsApp",
  TYPE_EMAIL: "Email",
  TYPE_SMS: "SMS",
  TYPE_PHONE: "SMS",
}

const SEND_TYPE_OPTIONS = ["SMS", "FB", "IG", "WhatsApp", "Email"]

/** Strips HTML tags produced by the Tiptap editor so we send plain text to GHL */
function htmlToPlainText(html) {
  return html.replace(/<[^>]*>/g, "").trim()
}

/** Maps a GHL conversation object to the shape DirectMessages expects */
function ghlConvToShape(conv) {
  return {
    id: conv.id,
    name: conv.contactName || "Unknown contact",
    isGroup: false,
    isOnline: false,
    participants: [
      {
        id: conv.contactId || conv.id,
        username: conv.contactName || "contact",
        displayName: conv.contactName || "Unknown",
        avatarUrl: "/images/default-avatar.png",
        isOnline: false,
        role: conv.companyName || "",
      },
    ],
  }
}

/**
 * CrmSocialChat
 * Staff-only CRM messaging panel backed by GoHighLevel.
 * Displays real GHL conversations and their message history; allows staff to
 * send outbound messages on any supported channel (SMS, FB, IG, WhatsApp, Email).
 *
 * Auth: requires an active session. API routes are also server-side guarded.
 * TODO: restrict to marketing-team role once the role system is in place.
 */
export default function CrmSocialChat() {
  const { data: session, status: sessionStatus } = useSession()

  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatType, setChatType] = useState("SMS")
  const [sendError, setSendError] = useState(null)

  const [convLoading, setConvLoading] = useState(true)
  const [convError, setConvError] = useState(null)
  const [msgLoading, setMsgLoading] = useState(false)
  const [msgError, setMsgError] = useState(null)

  // Current staff user shaped for DirectMessages
  const currentUser = session?.user
    ? {
        id: session.user.id || session.user.email,
        username: session.user.email,
        displayName: session.user.name || session.user.email,
        avatarUrl: session.user.image || "/images/default-avatar.png",
        isAdmin: false,
      }
    : null

  // Load conversation list
  useEffect(() => {
    if (sessionStatus !== "authenticated") return

    const load = async () => {
      try {
        setConvLoading(true)
        setConvError(null)
        const res = await fetch("/api/crm/ghl-conversations")
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data = await res.json()
        const list = data.social?.length ? data.social : data.data || []
        setConversations(list)
        if (list.length > 0) {
          setSelectedConv(list[0])
          setChatType(CHANNEL_SEND_TYPE[list[0].lastMessageType] || "SMS")
        }
      } catch (err) {
        setConvError(err.message)
        console.error("CrmSocialChat: conversations fetch failed", err)
      } finally {
        setConvLoading(false)
      }
    }
    load()
  }, [sessionStatus])

  // Load messages whenever the selected conversation changes
  useEffect(() => {
    if (!selectedConv) return

    const load = async () => {
      setMsgLoading(true)
      setMsgError(null)
      setMessages([])
      try {
        const res = await fetch(`/api/crm/ghl-messages?conversationId=${encodeURIComponent(selectedConv.id)}`)
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          setMsgError(errData.error || `${res.status} ${res.statusText}`)
          console.warn("CrmSocialChat: messages fetch non-ok", res.status, errData)
        } else {
          const data = await res.json()
          setMessages(data.messages || [])
        }
      } catch (err) {
        setMsgError(err.message)
        console.error("CrmSocialChat: messages fetch failed", err)
      } finally {
        setMsgLoading(false)
      }
    }
    load()
  }, [selectedConv])

  const handleSelectConv = useCallback((conv) => {
    setSelectedConv(conv)
    setChatType(CHANNEL_SEND_TYPE[conv.lastMessageType] || "SMS")
    setSendError(null)
  }, [])

  /** Called by DirectMessages when staff sends a message */
  const handleSendMessage = useCallback(async (newMessage) => {
    if (!selectedConv?.contactId) return
    const plainText = htmlToPlainText(newMessage.content)
    if (!plainText) return

    try {
      setSendError(null)
      const res = await fetch("/api/crm/ghl-send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedConv.contactId,
          type: chatType,
          message: plainText,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Send failed: ${res.statusText}`)
    } catch (err) {
      setSendError(err.message)
      console.error("CrmSocialChat: send failed", err)
    }
  }, [selectedConv, chatType])

  // --- Auth guard ---
  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    )
  }

  if (sessionStatus !== "authenticated") {
    return (
      <div className="alert alert-warning">
        <span>Staff sign-in required to access CRM messaging.</span>
      </div>
    )
  }

  // --- Conversations loading/error ---
  if (convLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-md text-primary"></span>
        <span className="ml-3 text-base-content/70 text-sm">Loading conversations…</span>
      </div>
    )
  }

  if (convError) {
    return (
      <div className="alert alert-error text-sm">
        <span><strong>Could not load conversations:</strong> {convError}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 border border-base-300 rounded-lg overflow-hidden min-h-[520px]">

      {/* ── Conversation list ── */}
      <aside className="w-full lg:w-72 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-base-300 bg-base-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <h3 className="font-semibold text-base-content text-sm">
            Conversations
          </h3>
          <span className="badge badge-sm badge-neutral">{conversations.length}</span>
        </div>

        <ul className="overflow-y-auto flex-1 max-h-[480px]">
          {conversations.length === 0 ? (
            <li className="px-4 py-6 text-sm text-base-content/50 text-center">No conversations found.</li>
          ) : (
            conversations.map((conv) => {
              const isActive = selectedConv?.id === conv.id
              const channelLabel = CHANNEL_LABELS[conv.lastMessageType] || conv.lastMessageType || "CRM"
              return (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectConv(conv)}
                    className={`w-full text-left px-4 py-3 border-b border-base-300 transition-colors hover:bg-base-300 flex flex-col gap-0.5 ${
                      isActive ? "bg-primary/10 border-l-4 border-l-primary" : ""
                    }`}
                  >
                    <span className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-base-content"}`}>
                      {conv.contactName || "Unknown"}
                    </span>
                    <span className="text-xs text-base-content/60 truncate">
                      {conv.companyName || conv.phone || conv.email || "—"}
                    </span>
                    <span className="badge badge-xs badge-outline mt-1">{channelLabel}</span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </aside>

      {/* ── Message thread + composer ── */}
      <div className="flex-1 flex flex-col bg-base-100 min-w-0">
        {selectedConv ? (
          <>
            {/* Thread header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200">
              <div>
                <p className="font-semibold text-base-content text-sm">{selectedConv.contactName || "Unknown contact"}</p>
                <p className="text-xs text-base-content/60">{selectedConv.companyName || selectedConv.phone || selectedConv.email || ""}</p>
              </div>

              {/* Outbound channel selector */}
              <label className="flex items-center gap-2 text-xs text-base-content/70">
                <span>Send via</span>
                <select
                  value={chatType}
                  onChange={(e) => setChatType(e.target.value)}
                  className="select select-xs select-bordered"
                >
                  {SEND_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Send error */}
            {sendError && (
              <div className="alert alert-error text-xs py-2 px-4 rounded-none">
                <span>Send failed: {sendError}</span>
              </div>
            )}

            {/* Messages via DirectMessages component */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {msgLoading ? (
                <div className="flex justify-center items-center h-40">
                  <span className="loading loading-spinner loading-sm text-primary"></span>
                  <span className="ml-2 text-base-content/60 text-sm">Loading messages…</span>
                </div>
              ) : msgError ? (
                <>
                  <div className="alert alert-warning text-xs mx-4 mt-4">
                    <span>Message history unavailable: {msgError}</span>
                  </div>
                  
                    <DirectMessages
                      messages={[]}
                      onSendMessage={handleSendMessage}
                      currentUser={currentUser}
                      conversation={ghlConvToShape(selectedConv)}
                      allowMedia={false}
                      readOnly={false}
                      demoMode={false}
                      maxHeight={300}
                    />
                  
                </>
              ) : (
                
                  <DirectMessages
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    currentUser={currentUser}
                    conversation={ghlConvToShape(selectedConv)}
                    allowMedia={false}
                    readOnly={false}
                    demoMode={false}
                    maxHeight={400}
                  />
                
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-base-content/40 text-sm">
            Select a conversation to view messages.
          </div>
        )}
      </div>
    </div>
  )
}


/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, ChevronLeft } from "lucide-react"
import Image from "next/image"

export default function MessagesApplet({ isOpen, onClose, conversations = [] }) {
  const [conversationsState, setConversations] = useState(conversations)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages when conversation changes or new message is sent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation, conversationsState])

  // If the prop changes, update the state (for hot reload/dev consistency)
  useEffect(() => {
    setConversations(conversations)
  }, [conversations])

  const handleSendMessage = () => {
    if (messageInput.trim() === "" || !selectedConversation) return

    const newMessage = {
      id: Date.now(),
      sender: "You", // Assuming "You" are the sender
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === selectedConversation.id ? { ...conv, messages: [...conv.messages, newMessage] } : conv,
      ),
    )
    setMessageInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-base-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200 text-base-content">
        {selectedConversation ? (
          <button onClick={() => setSelectedConversation(null)} className="btn btn-ghost btn-sm btn-circle">
            <ChevronLeft size={20} />
          </button>
        ) : (
          <h3 className="text-xl font-bold">Messages</h3>
        )}
        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
          <X size={20} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {!selectedConversation ? (
          // Conversation List View
          <div className="p-4 space-y-2 overflow-y-auto h-full">
            {conversationsState.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <Image src={conv.avatar || "/placeholder.svg"} alt={`${conv.name} avatar`} width={40} height={40} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base-content">{conv.name}</div>
                  <div className="text-sm text-base-content/70 truncate">
                    {conv.messages[conv.messages.length - 1]?.text || "No messages yet."}
                  </div>
                </div>
                <div className="text-xs text-base-content/50">
                  {conv.messages[conv.messages.length - 1]?.time || ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Detailed Conversation View
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {selectedConversation.messages.map((msg) => (
                <div key={msg.id} className={`chat ${msg.sender === "You" ? "chat-end" : "chat-start"}`}>
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <Image
                        src={
                          msg.sender === "You"
                            ? "/placeholder.svg?height=40&width=40&query=your%20avatar"
                            : selectedConversation.avatar
                        }
                        alt={`${msg.sender} avatar`}
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                  <div className="chat-header text-sm text-base-content/70">
                    {msg.sender}
                    <time className="text-xs opacity-50 ml-2">{msg.time}</time>
                  </div>
                  <div className="chat-bubble bg-primary text-primary-content">{msg.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-base-200 bg-base-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="input input-bordered flex-1 bg-base-100 text-base-content"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSendMessage} className="btn btn-primary btn-circle">
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

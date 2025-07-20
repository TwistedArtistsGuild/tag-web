/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, Send, ChevronLeft } from 'lucide-react'

export default function MessagesApplet({ isOpen, onClose, anchorEl }) {
  // Mock data for conversations
  const [conversations, setConversations] = useState([
    {
      id: 1,
      participant: {
        name: "Alex Artist",
        avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-marcela-alessandra-789314-1885213-pianist.jpg",
      },
      messages: [
        {
          id: 1,
          sender: "Alex Artist",
          body: "Hey, are you coming to the event tonight?",
          time: "2m ago",
          avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-marcela-alessandra-789314-1885213-pianist.jpg",
        },
        { id: 2, sender: "You", body: "See you there.", time: "1m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        {
          id: 3,
          sender: "Alex Artist",
          body: "Awesome, can't wait!",
          time: "just now",
          avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-marcela-alessandra-789314-1885213-pianist.jpg",
        },
      ],
    },
    {
      id: 2,
      participant: {
        name: "Jamie Painter",
        avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
      },
      messages: [
        {
          id: 4,
          sender: "Jamie Painter",
          body: "Loved your latest piece!",
          time: "10m ago",
          avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
        },
        { id: 5, sender: "You", body: "Thank you so much!", time: "8m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        {
          id: 6,
          sender: "Jamie Painter",
          body: "Are you teaching any classes soon?",
          time: "7m ago",
          avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
        },
        { id: 7, sender: "You", body: "Yes, next month!", time: "5m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
      ],
    },
    {
      id: 3,
      participant: {
        name: "Morgan Sculptor",
        avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg",
      },
      messages: [
        {
          id: 8,
          sender: "Morgan Sculptor",
          body: "Let's collaborate soon!",
          time: "1h ago",
          avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg",
        },
        { id: 9, sender: "You", body: "I would love that!", time: "55m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        {
          id: 10,
          sender: "Morgan Sculptor",
          body: "I'll DM you some ideas.",
          time: "53m ago",
          avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg",
        },
        {
          id: 11,
          sender: "You",
          body: "Looking forward to it!",
          time: "50m ago",
          avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg",
        },
      ],
    },
    {
      id: 4,
      participant: {
        name: "Taylor Client",
        avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg",
      },
      messages: [
        { id: 20, sender: "Taylor Client", body: "Hi! Are you available for a commission?", time: "3h ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg" },
        { id: 21, sender: "You", body: "Hi Taylor! Yes, I am. What did you have in mind?", time: "2h 55m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        { id: 22, sender: "Taylor Client", body: "I'm looking for a portrait of my dog in your style.", time: "2h 54m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg" },
        { id: 23, sender: "You", body: "That sounds fun! Do you have a photo reference?", time: "2h 53m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        { id: 24, sender: "Taylor Client", body: "Yes, I'll send it over now.", time: "2h 52m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg" },
        { id: 25, sender: "You", body: "Got it! I'll send a sketch for approval soon.", time: "2h 50m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        { id: 26, sender: "Taylor Client", body: "Thank you so much!", time: "2h 49m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg" },
      ],
    },
    {
      id: 5,
      participant: {
        name: "Chris Collaborator",
        avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg",
      },
      messages: [
        { id: 30, sender: "Chris Collaborator", body: "Ready for our collab call?", time: "4h ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg" },
        { id: 31, sender: "You", body: "Yes! Joining now.", time: "4h ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        { id: 32, sender: "Chris Collaborator", body: "Sent you the doc.", time: "3h 58m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg" },
        { id: 33, sender: "You", body: "Reviewing now.", time: "3h 57m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        { id: 34, sender: "Chris Collaborator", body: "Let's sync again tomorrow.", time: "3h 55m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg" },
        { id: 35, sender: "You", body: "Sounds good!", time: "3h 54m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
      ],
    },
    {
      id: 6,
      participant: {
        name: "Patricia Patron",
        avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-patricia-1234567-patron.jpg",
      },
      messages: [
        { id: 40, sender: "Patricia Patron", body: "Your art at the gallery was amazing!", time: "5h ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-patricia-1234567-patron.jpg" },
        { id: 41, sender: "You", body: "Thank you so much, Patricia!", time: "4h 59m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        { id: 42, sender: "Patricia Patron", body: "Will you be showing again soon?", time: "4h 58m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-patricia-1234567-patron.jpg" },
        { id: 43, sender: "You", body: "Yes, next month!", time: "4h 57m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg" },
        { id: 44, sender: "Patricia Patron", body: "I'll be there!", time: "4h 56m ago", avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-patricia-1234567-patron.jpg" },
      ],
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages when conversation changes or new message is sent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation, conversations]) // Depend on conversations to scroll on new message

  const handleSendMessage = () => {
    if (messageInput.trim() === "" || !selectedConversation) return

    const newMessage = {
      id: Date.now(), // Unique ID for the message
      sender: "You",
      body: messageInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg", // Your avatar
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

  // Calculate position just below anchorEl (messages icon)
  const [style, setStyle] = useState({})
  useEffect(() => {
    if (anchorEl && isOpen) {
      const rect = anchorEl.getBoundingClientRect()
      setStyle({
        position: "fixed",
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        zIndex: 100,
        width: 420,
        maxWidth: "100vw",
        maxHeight: "calc(100vh - " + (rect.bottom + 8) + "px)",
        boxShadow: '0 0 0 4px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.18)',
        borderLeft: "2px solid var(--fallback-b3, #d1d5db)", // fallback for DaisyUI theme
        background: "var(--fallback-b1, #fff)", // fallback for DaisyUI theme
        borderRadius: 0,
        display: isOpen ? "block" : "none"
      })
    }
  }, [anchorEl, isOpen])

  return (
    <div style={style} className="shadow-lg flex flex-col">
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
            {conversations.length === 0 ? (
              <div className="text-sm text-base-content/70 text-center py-4">No conversations yet.</div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <Image
                        src={conv.participant.avatar || "/placeholder.svg"}
                        alt={`${conv.participant.name} avatar`}
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base-content">{conv.participant.name}</div>
                    <div className="text-sm text-base-content/70 truncate">
                      {conv.messages[conv.messages.length - 1]?.body || "No messages yet."}
                    </div>
                  </div>
                  <div className="text-xs text-base-content/50">
                    {conv.messages[conv.messages.length - 1]?.time || ""}
                  </div>
                </div>
              ))
            )}
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
                        src={msg.avatar || "/placeholder.svg"}
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
                  <div
                    className={`chat-bubble ${msg.sender === "You" ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"}`}
                  >
                    {msg.body}
                  </div>
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

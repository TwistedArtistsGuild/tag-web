/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Link from "next/link"
import Image from "next/image"
import { X } from 'lucide-react' // Import X icon
import { useEffect, useState } from "react"

const notificationLinks = [
  "/artists",
  "/artists/twistedpassions",
  "/about",
  "/events",
  "/blogs",
]

export default function NotificationsDropdown({ notifications = [], isOpen, onClose, anchorEl }) {
  // Calculate position just below anchorEl (notification icon)
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
        borderLeft: "2px solid var(--fallback-b3, #d1d5db)",
        background: "var(--fallback-b1, #fff)",
        borderRadius: 0,
        display: isOpen ? "block" : "none"
      })
    }
  }, [anchorEl, isOpen])

  return (
    <div style={style} className="shadow-lg flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200 text-base-content">
        <h3 className="text-xl font-bold">Notifications</h3>
        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
          <X size={20} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-sm text-base-content/70 text-center py-4">No new notifications.</div>
        ) : (
          <div className="divide-y divide-base-200">
            {notifications.map((n, i) => (
              <Link
                key={i}
                href={notificationLinks[i % notificationLinks.length]}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                onClick={onClose}
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <Image src={n.avatar || "/placeholder.svg?height=40&width=40"} alt="avatar" width={40} height={40} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base-content">{n.title}</div>
                  <div className="text-sm text-base-content/70 truncate">{n.body}</div>
                </div>
                <div className="text-xs text-base-content/50 whitespace-nowrap">{n.time}</div>
              </Link>
            ))}
            {/* Load More entry */}
            <div className="flex items-center justify-center p-3 text-base-content/70 cursor-pointer hover:bg-base-200 transition-colors font-semibold" onClick={onClose}>
              Load More (...)
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

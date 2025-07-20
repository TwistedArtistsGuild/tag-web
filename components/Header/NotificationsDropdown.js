/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

"use client"

import Link from "next/link"
import Image from "next/image"

const notificationLinks = [
  "/artists",
  "/artists/twistedpassions",
  "/about",
  "/events",
  "/blogs",
]

export default function NotificationsDropdown({ notifications = [], onClose }) {
  const items = notifications
  return (
    <div className="absolute right-4 top-14 z-50 w-80 bg-base-100 shadow-lg rounded-lg p-0">
      <div className="font-bold px-4 pt-4 pb-2">Notifications</div>
      <div className="p-0">
        {items.length === 0 ? (
          <div className="text-sm text-base-content/70 mb-2 px-4">No new notifications.</div>
        ) : (
          <div className="overflow-y-auto max-h-96 divide-y divide-base-200">
            {items.map((n, i) => (
              <Link
                key={i}
                href={notificationLinks[i % notificationLinks.length]}
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-base-200 transition-colors"
                onClick={onClose}
                tabIndex={0}
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
          </div>
        )}
      </div>
    </div>
  )
}

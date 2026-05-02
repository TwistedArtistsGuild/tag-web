/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { X } from "lucide-react"
import DirectMessages from "@/components/social/DirectMessages"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"

export default function MessagesApplet({ onClose }) {
  return (
    <SocialRealtimeProvider>
      <div className="relative h-full w-full overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-lg">
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3 z-20"
          aria-label="Close messages"
        >
          <X size={20} />
        </button>

        <DirectMessages compact demoMode maxHeight={420} />
      </div>
    </SocialRealtimeProvider>
  )
}

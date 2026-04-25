/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"



import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { User, Settings, LogOut } from "lucide-react" // Import Lucide icons

export default function LoginProfile({ className = "", isOpen: controlledIsOpen, onToggle }) {
  const { data: session } = useSession()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = typeof controlledIsOpen === "boolean" && typeof onToggle === "function"
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const setOpenValue = (nextOpen) => {
    if (isControlled) {
      if (nextOpen !== isOpen) onToggle()
      return
    }
    setInternalIsOpen(nextOpen)
  }

  if (!session) {
    return (
      <button onClick={() => signIn()} className={`btn btn-primary btn-sm ${className}`}>
        Sign In
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={`btn btn-ghost btn-circle avatar ${className}`}
        onClick={() => setOpenValue(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 rounded-full overflow-hidden">
          <Image
            alt="User avatar"
            src={session.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            width={32}
            height={32}
          />
        </div>
      </button>
      {isOpen && (
        <>
          {/* Click-outside backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpenValue(false)} />
          <ul className="absolute right-0 top-full mt-2 z-50 w-52 rounded-box bg-base-100 p-2 shadow-lg border border-base-content/10 menu menu-sm">
            <li className="menu-title">
              <span>{session.user?.name || "User"}</span>
            </li>
            <li>
              <Link href="/user/profile" onClick={() => setOpenValue(false)}>
                <User className="w-4 h-4" />
                Profile
              </Link>
            </li>
            <li>
              <Link href="/user/settings" onClick={() => setOpenValue(false)}>
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </li>
            <div className="divider my-1"></div>
            <li>
              <button onClick={() => { setOpenValue(false); signOut() }} className="text-error">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  )
}

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

export default function LoginProfile({ className = "" }) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (!session) {
    return (
      <button onClick={() => signIn()} className={`btn btn-primary btn-sm ${className}`}>
        Sign In
      </button>
    )
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost btn-circle avatar ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 rounded-full">
          <Image
            alt="User avatar"
            src={session.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            width={32}
            height={32}
          />
        </div>
      </div>
      {isOpen && (
        <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-content/10">
          <li className="menu-title">
            <span>{session.user?.name || "User"}</span>
          </li>
          <li>
            <Link href="/user/profile" onClick={() => setIsOpen(false)}>
              <User className="w-4 h-4" />
              Profile
            </Link>
          </li>
          <li>
            <Link href="/user/settings" onClick={() => setIsOpen(false)}>
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </li>

          <div className="divider my-1"></div>
          <li>
            <button onClick={() => signOut()} className="text-error">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

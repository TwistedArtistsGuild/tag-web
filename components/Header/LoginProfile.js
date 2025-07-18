"use client"

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

export default function LoginProfile({ className = "", themes = [], currentTheme = "tag-theme", onThemeChange }) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (theme) => {
    if (onThemeChange) {
      onThemeChange(theme)
    }
    setIsOpen(false)
  }

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
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
          </li>
          <li>
            <Link href="/settings" onClick={() => setIsOpen(false)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </li>
          
          {/* Theme Selector */}
          {themes && themes.length > 0 && (
            <>
              <li className="menu-title">
                <span>Theme</span>
              </li>
              <li>
                <details>
                  <summary>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    {currentTheme.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                  </summary>
                  <ul className="max-h-48 overflow-y-auto">
                    {themes.map((theme) => (
                      <li key={theme}>
                        <button
                          onClick={() => handleThemeChange(theme)}
                          className={`w-full text-left ${currentTheme === theme ? "active" : ""}`}
                        >
                          {theme.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            </>
          )}
          
          <div className="divider my-1"></div>
          <li>
            <button onClick={() => signOut()} className="text-error">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

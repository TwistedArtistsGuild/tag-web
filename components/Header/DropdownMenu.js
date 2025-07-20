/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react" // Using Lucide React icons

export default function DropdownMenu({ title, titleHref, options, active, onActivate, className = "" }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && onActivate) {
      onActivate()
    }
  }

  return (
    <div className={`dropdown dropdown-hover ${className}`}>
      <div tabIndex={0} role="button" className="flex items-center space-x-1" onClick={handleToggle}>
        <Link href={titleHref} className={`${className} ${active ? "text-primary" : "text-base-content"}`}>
          {title}
        </Link>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {isOpen && (
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          {options.map((option, index) => (
            <li key={index}>
              <Link href={option.href} onClick={() => setIsOpen(false)}>
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

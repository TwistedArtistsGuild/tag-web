/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect } from 'react'

/**
 * Client-only date component to avoid hydration mismatch
 */
export const ClientDate = ({ dateString, className = '', format = 'default' }) => {
  const [formattedDate, setFormattedDate] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (dateString) {
      try {
        const date = new Date(dateString)
        if (!isNaN(date.getTime())) {
          let formatted
          if (format === 'short') {
            formatted = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          } else if (format === 'long') {
            formatted = date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          } else {
            formatted = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
          setFormattedDate(formatted)
        }
      } catch (err) {
        console.error('Error formatting date:', err)
      }
    }
  }, [dateString, format])

  if (!mounted) {
    return <time className={className} dateTime={dateString} suppressHydrationWarning />
  }

  return (
    <time className={className} dateTime={dateString}>
      {formattedDate}
    </time>
  )
}

/**
 * Client-only HTML content to avoid hydration mismatch
 * Use this for dangerouslySetInnerHTML content
 */
export const ClientHtml = ({ html, className = '', tag = 'div' }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const Tag = tag

  if (!mounted) {
    return <Tag className={className} suppressHydrationWarning />
  }

  return (
    <Tag 
      className={className}
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  )
}

/**
 * Wrapper for any content that should only render on client
 */
export const ClientOnly = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return fallback
  }

  return <>{children}</>
}
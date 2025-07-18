"use client"

/* This file is part of the Twisted Artists Guild project.
 Copyright (C) 2025 Twisted Artists Guild
 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).
 This software comes with NO WARRANTY; see the license for details.
 Open source · low-profit · human-first*/
"use client"

import { useAppContext } from "/components/Context"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import LoginProfile from "/components/Header/LoginProfile"
import logo from "@/public/logo.png"
import config from "@/config"
import DropdownMenu from "/components/Header/DropdownMenu"
import { useLayout } from "/components/LayoutProvider"
import { FiBell, FiMessageSquare, FiChevronUp, FiChevronDown } from "react-icons/fi"

// Available themes
const themes = [
  "tag-theme",
  "light", 
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "valentine",
  "halloween",
  "garden",
  "aqua",
  "pastel",
  "fantasy",
  "black",
  "luxury",
  "dracula",
]

export default function Header({ pageSections = [] }) {
  const { active, setActive, user } = useAppContext()
  const { isHeaderVisible, toggleHeader } = useLayout()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState("tag-theme")
  const [dmModalOpen, setDmModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [unreadMessages, setUnreadMessages] = useState(2)
  const [scrolled, setScrolled] = useState(false)

  function handleActive(link) {
    setActive(link)
  }

  function handleThemeChange(newTheme) {
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  function toggleDmModal() {
    setDmModalOpen(!dmModalOpen)
    if (!dmModalOpen) {
      setNotificationsOpen(false)
    }
    if (!dmModalOpen && unreadMessages > 0) {
      setUnreadMessages(0)
    }
  }

  function toggleNotifications() {
    setNotificationsOpen(!notificationsOpen)
    if (!notificationsOpen) {
      setDmModalOpen(false)
    }
    if (!notificationsOpen && notificationCount > 0) {
      setNotificationCount(0)
    }
  }

  function getHeaderClassName() {
    const baseClasses = "flex justify-between items-center border-b border-base-300 w-full px-8 py-4"
    if (theme === "tag-theme") {
      return `${baseClasses} header-paint-drip`
    }
    return baseClasses
  }

  function getTextColorClass(isActive = false) {
    const baseTextClass = "font-josefin-sans font-extrabold transition-all"
    if (isActive) {
      return `${baseTextClass} text-primary enhanced-text-visibility`
    }
    return `${baseTextClass} text-base-content enhanced-text-visibility`
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "tag-theme"
      setTheme(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
    }
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [router.asPath])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerClass = getHeaderClassName()

  return (
    <>
      {/* Header Toggle Button - Top Center of Screen when closed */}
      {!isHeaderVisible && (
        <button
          onClick={toggleHeader}
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-primary-content px-4 py-2 rounded-b-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Show header"
        >
          <FiChevronDown className="w-4 h-4" />
        </button>
      )}

      <header
        className={`w-full transition-all duration-300 ease-in-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        } fixed top-0 left-0 right-0 z-40 ${scrolled ? "bg-base-100/95 backdrop-blur-md shadow-lg" : "bg-base-100"}`}
      >
        {/* Single Header Layer */}
        <div className={headerClass}>
          {/* Left: Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setActive("")}>
              <Image src="/tag_logo.png" alt="Home" height={40} width={80} />
              <span className="font-josefin-sans text-xl font-extrabold italic hidden sm:block">
                Twisted Artists Guild
              </span>
            </Link>
          </div>

          {/* Center: Main Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/artists"
              className={`text-lg ${getTextColorClass(active === "artist")}`}
              onClick={(e) => handleActive(e.target.name)}
              name="artist"
            >
              Artists
            </Link>
            <DropdownMenu
              title="Art"
              titleHref="/art/"
              active={active === "art"}
              onActivate={() => handleActive("art")}
              options={[
                { label: "Physical", href: "/art/physical" },
                { label: "Digital", href: "/art/digital" },
                { label: "Performance", href: "/art/performance" },
                { label: "Search", href: "/search/" },
              ]}
              className={`text-lg ${getTextColorClass(active === "art")}`}
            />
            <Link
              href="/events"
              className={`text-lg ${getTextColorClass(active === "events")}`}
              onClick={(e) => handleActive(e.target.name)}
              name="events"
            >
              Events
            </Link>
            <Link
              href="/blogs"
              className={`text-lg ${getTextColorClass(active === "blog")}`}
              onClick={(e) => handleActive(e.target.name)}
              name="blog"
            >
              Blog
            </Link>
            <Link
              href="/news"
              className={`text-lg ${getTextColorClass(active === "news")}`}
              onClick={(e) => handleActive(e.target.name)}
              name="news"
            >
              News
            </Link>
            <Link
              href="/vote/"
              className={`text-lg ${getTextColorClass(active === "vote")}`}
              onClick={(e) => handleActive(e.target.name)}
              name="vote"
            >
              Vote
            </Link>
          </nav>

          {/* Right: User Controls */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <input type="text" placeholder="Search..." className="input input-bordered input-sm w-32 lg:w-48" />
            </div>

            {/* Notifications & Messages - Only if user logged in */}
            {user && (
              <>
                <button
                  onClick={toggleDmModal}
                  className="btn btn-ghost btn-sm btn-circle relative"
                  aria-label="Messages"
                >
                  <FiMessageSquare size={18} />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>
                <button
                  onClick={toggleNotifications}
                  className="btn btn-ghost btn-sm btn-circle relative"
                  aria-label="Notifications"
                >
                  <FiBell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Login Profile with Theme Selector */}
            <LoginProfile 
              className="btn btn-ghost btn-sm" 
              themes={themes}
              currentTheme={theme}
              onThemeChange={handleThemeChange}
            />

            {/* Mobile Menu Button */}
            <button 
              type="button" 
              className="btn btn-ghost btn-sm lg:hidden" 
              onClick={() => setIsOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Header Close Button - Bottom Center when open */}
        {isHeaderVisible && (
          <button
            onClick={toggleHeader}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-base-200 text-base-content hover:bg-base-300 px-3 py-1 rounded-b-lg border border-base-300 shadow-md transition-all duration-300 hover:scale-105"
            aria-label="Hide header"
          >
            <FiChevronUp className="w-4 h-4" />
          </button>
        )}

        {/* Mobile Menu */}
        <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
          <div className="fixed inset-y-0 right-0 z-[100] w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm transform transition duration-300">
            <div className="flex items-center justify-between mb-6">
              <Link className="flex items-center gap-2" href="/">
                <Image src={logo || "/placeholder.svg"} alt={`${config.appName} logo`} className="w-8" />
                <span className="font-extrabold text-lg">{config.appName}</span>
              </Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <Link href="/artists" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Artists</Link>
              <Link href="/art" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Art</Link>
              <Link href="/events" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Events</Link>
              <Link href="/blogs" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Blog</Link>
              <Link href="/news" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>News</Link>
              <Link href="/vote" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Vote</Link>
              
              {user && (
                <div className="pt-4 border-t border-base-300">
                  <button onClick={toggleDmModal} className="flex items-center gap-2 py-2 w-full">
                    <FiMessageSquare size={16} />
                    Messages {unreadMessages > 0 && <span className="badge badge-sm badge-error">{unreadMessages}</span>}
                  </button>
                  <button onClick={toggleNotifications} className="flex items-center gap-2 py-2 w-full">
                    <FiBell size={16} />
                    Notifications {notificationCount > 0 && <span className="badge badge-sm badge-error">{notificationCount}</span>}
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-base-300">
                <LoginProfile themes={themes} currentTheme={theme} onThemeChange={handleThemeChange} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer - Much smaller now */}
      {isHeaderVisible && <div className="h-20" />}
    </>
  )
}

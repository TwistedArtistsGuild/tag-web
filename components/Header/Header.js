/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react" // Using useSession for authentication
import LoginProfile from "/components/Header/LoginProfile"
import ThemeSwitcher from "/components/Header/ThemeSwitcher"
import DropdownMenu from "/components/Header/DropdownMenu"
import { useLayout } from "/components/LayoutProvider"
import { Bell, MessageSquare, ChevronUp, ChevronDown, Menu } from "lucide-react"
import NotificationsDropdown from "/components/Header/NotificationsDropdown" // Keep as dropdown for now
import MessagesApplet from "/components/Header/MessagesApplet" // The new message applet

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
  const { data: session } = useSession() // Use session for user data
  const { isHeaderVisible, toggleHeader, isMobile, toggleLeftSidebar, toggleRightSidebar } = useLayout()
  const router = useRouter()
  const [active, setActive] = useState("") // State for active navigation link
  const [theme, setTheme] = useState("tag-theme")
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false)
  const [isMessageAppletOpen, setIsMessageAppletOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3) // Mock notification count
  const [unreadMessages, setUnreadMessages] = useState(2) // Mock unread messages
  const [scrolled, setScrolled] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)

  const notificationsIconRef = useRef(null)
  const messagesIconRef = useRef(null)

  function handleActive(link) {
    setActive(link)
  }

  function handleThemeChange(newTheme) {
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  function closeAllPopups() {
    setIsNotificationsDropdownOpen(false)
    setIsMessageAppletOpen(false)
    setIsLoginOpen(false)
    setIsThemeOpen(false)
  }

  function toggleMessageApplet() {
    if (!isMessageAppletOpen) closeAllPopups()
    setIsMessageAppletOpen((open) => !open)
    if (!isMessageAppletOpen && unreadMessages > 0) {
      setUnreadMessages(0)
    }
  }

  function toggleNotificationsDropdown() {
    if (!isNotificationsDropdownOpen) closeAllPopups()
    setIsNotificationsDropdownOpen((open) => !open)
    if (!isNotificationsDropdownOpen && notificationCount > 0) {
      setNotificationCount(0)
    }
  }

  function toggleLogin() {
    setIsNotificationsDropdownOpen(false)
    setIsMessageAppletOpen(false)
    setIsLoginOpen((open) => !open)
  }

  function toggleTheme() {
    setIsNotificationsDropdownOpen(false)
    setIsMessageAppletOpen(false)
    setIsThemeOpen((open) => !open)
  }

  function getHeaderClassName() {
    const baseClasses = "flex justify-between items-center border-b border-base-300 w-full px-8 py-2 min-h-[88px]"
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
    // Close mobile menu when route changes
    // setIsOpen(false) // This state is no longer used for mobile menu
  }, [router.asPath])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerClass = getHeaderClassName()

  const stockPhotos = [
    "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-carlo-junemann-156928830-12407580-merchandisehats.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-joshsorenson-995301-drummer.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-jovanvasiljevic-32146479-merchandisesweater.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-karolina-grabowska-4471894-blackguitar.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-marcela-alessandra-789314-1885213-pianist.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-markus-winkler-1430818-3812433-merchandiseclothingrack.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-nappy-936030-violin.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-210922-guitarist.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg",
    "https://tagstatic.blob.core.windows.net/pexels/pexels-victorfreitas-733767-sultrysax.jpg",
  ];

  // Height of the header for popup offset
  const headerHeight = 88
  const popupStyle = {
    position: "fixed",
    top: `${headerHeight}px`,
    right: 0,
    zIndex: 100,
    width: "420px",
    maxWidth: "100vw",
    height: "calc(100vh - 88px)",
    boxShadow: '0 0 0 4px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.18)',
    borderLeft: "2px solid var(--fallback-b3, #d1d5db)",
    background: "var(--fallback-b1, #fff)",
    borderRadius: 0,
    display: isNotificationsDropdownOpen || isMessageAppletOpen ? "block" : "none"
  }

  return (
    <>
      {/* Header Toggle Button - Top Center of Screen when closed */}
      {!isHeaderVisible && (
        <button
          onClick={toggleHeader}
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-primary-content px-4 py-2 rounded-b-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Show header"
        >
          <ChevronDown className="w-4 h-4" />
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
            {isMobile && (
              <button className="btn btn-ghost btn-circle" onClick={toggleLeftSidebar} aria-label="Toggle left sidebar">
                <Menu className="w-6 h-6" />
              </button>
            )}
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
              onClick={() => handleActive("artist")}
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
              onClick={() => handleActive("events")}
              name="events"
            >
              Events
            </Link>
            <Link
              href="/blogs"
              className={`text-lg ${getTextColorClass(active === "blog")}`}
              onClick={() => handleActive("blog")}
              name="blog"
            >
              Blog
            </Link>
            <Link
              href="/news"
              className={`text-lg ${getTextColorClass(active === "news")}`}
              onClick={() => handleActive("news")}
              name="news"
            >
              News
            </Link>
            <Link
              href="/vote/"
              className={`text-lg ${getTextColorClass(active === "vote")}`}
              onClick={() => handleActive("vote")}
              name="vote"
            >
              Vote
            </Link>
          </nav>

          {/* Right: User Controls */}
          <div className="flex items-center space-x-2">
            {/* Theme Switcher */}
            <ThemeSwitcher themes={themes} currentTheme={theme} onThemeChange={handleThemeChange} onClick={toggleTheme} isOpen={isThemeOpen} />

            {/* Notifications & Messages - Only if user logged in */}
            {session?.user && ( // Use session.user for logged-in check
              <>
                <button
                  ref={messagesIconRef}
                  onClick={toggleMessageApplet}
                  className={`btn btn-ghost btn-sm btn-circle relative${isMessageAppletOpen ? " bg-primary text-primary-content ring-2 ring-primary/60" : ""}`}
                  aria-label="Messages"
                >
                  <MessageSquare size={18} />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>
                <button
                  ref={notificationsIconRef}
                  onClick={toggleNotificationsDropdown}
                  className={`btn btn-ghost btn-sm btn-circle relative${isNotificationsDropdownOpen ? " bg-primary text-primary-content ring-2 ring-primary/60" : ""}`}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Login Profile */}
            <LoginProfile className="btn btn-ghost btn-sm" isOpen={isLoginOpen} onToggle={toggleLogin} onClick={toggleLogin} />

            {/* Mobile Right Sidebar Toggle Button */}
            {isMobile && (
              <button type="button" className="btn btn-ghost btn-sm lg:hidden" onClick={toggleRightSidebar}>
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
          {/* Inner div for the circus tent/drip effect */}
          {theme === "tag-theme" && <div className="header-drip-effect" />}
        </div>

        {/* Header Close Button - Bottom Center when open */}
        {isHeaderVisible && (
          <button
            onClick={toggleHeader}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-base-200 text-base-content hover:bg-base-300 px-3 py-1 rounded-b-lg border border-base-300 shadow-md transition-all duration-300 hover:scale-105"
            aria-label="Hide header"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </header>
      {/* Header Spacer - Adjusted to match new header height */}
      {isHeaderVisible && <div className="h-28 w-full" />} {/* Adjusted from h-22 to h-28 */}
      {/* Messages Applet (fixed panel) */}
      {isMessageAppletOpen && !isNotificationsDropdownOpen && !isLoginOpen && !isThemeOpen && (
        <div style={popupStyle}>
          <MessagesApplet
            isOpen={isMessageAppletOpen}
            onClose={toggleMessageApplet}
            conversations={[
              {
                id: 1,
                name: "Sarah Johnson",
                avatar: stockPhotos[0],
                messages: [
                  { id: 1, sender: "Sarah Johnson", text: "Hey, how are you?", time: "10:00 AM" },
                  { id: 2, sender: "You", text: "I'm good, thanks! How about you?", time: "10:05 AM" },
                  { id: 3, sender: "Sarah Johnson", text: "Doing great! Just finished a new painting.", time: "10:10 AM" },
                ],
              },
              {
                id: 2,
                name: "John Doe",
                avatar: stockPhotos[1],
                messages: [
                  { id: 4, sender: "John Doe", text: "Meeting at 2 PM?", time: "Yesterday" },
                  { id: 5, sender: "You", text: "Yes, confirmed!", time: "Yesterday" },
                ],
              },
              {
                id: 3,
                name: "Community Chat",
                avatar: stockPhotos[2],
                messages: [
                  { id: 6, sender: "Admin", text: "Welcome to the community!", time: "2 days ago" },
                  { id: 7, sender: "User1", text: "Thanks!", time: "2 days ago" },
                ],
              },
            ]}
          />
        </div>
      )}
      {/* Notifications Dropdown (simple dropdown) */}
      {isNotificationsDropdownOpen && !isMessageAppletOpen && !isLoginOpen && !isThemeOpen && (
        <div style={popupStyle}>
          <NotificationsDropdown
            notifications={[
              {
                title: "New Follower",
                body: "Alex started following you.",
                time: "Just now",
                avatar: stockPhotos[3],
              },
              {
                title: "Comment",
                body: "Sarah commented on your post.",
                time: "5m ago",
                avatar: stockPhotos[4],
              },
              {
                title: "Sale",
                body: "You sold 'Sunset Overdrive'!",
                time: "1h ago",
                avatar: stockPhotos[5],
              },
              {
                title: "Event Reminder",
                body: "Art show starts in 1 hour.",
                time: "Today",
                avatar: stockPhotos[6],
              },
              {
                title: "Blog Update",
                body: "New blog post: 'The Art of Color'",
                time: "Yesterday",
                avatar: stockPhotos[7],
              },
              {
                title: "Mention",
                body: "You were mentioned in a comment.",
                time: "2h ago",
                avatar: stockPhotos[8],
              },
              {
                title: "Collaboration Invite",
                body: "John invited you to collaborate.",
                time: "3h ago",
                avatar: stockPhotos[9],
              },
              {
                title: "New Message",
                body: "You have a new message from Emily.",
                time: "4h ago",
                avatar: stockPhotos[10],
              },
              {
                title: "Profile View",
                body: "Your profile was viewed 10 times today.",
                time: "Today",
                avatar: stockPhotos[11],
              },
              {
                title: "Art Liked",
                body: "Your artwork 'Blue Dream' got 5 new likes.",
                time: "Today",
                avatar: stockPhotos[12],
              },
              {
                title: "Payment Received",
                body: "You received a payment for a commission.",
                time: "Yesterday",
                avatar: stockPhotos[13],
              },
              {
                title: "System Update",
                body: "Platform maintenance scheduled for Sunday.",
                time: "Yesterday",
                avatar: stockPhotos[14],
              },
              {
                title: "Contest Winner",
                body: "Congrats! You won the monthly art contest.",
                time: "2d ago",
                avatar: stockPhotos[15],
              },
              {
                title: "New Resource",
                body: "A new tutorial is available in Resources.",
                time: "2d ago",
                avatar: stockPhotos[0],
              },
              {
                title: "Feedback Request",
                body: "Please provide feedback on your last sale.",
                time: "3d ago",
                avatar: stockPhotos[1],
              },
            ]}
            onClose={() => setIsNotificationsDropdownOpen(false)}
            isOpen={true}
          />
        </div>
      )}
      {/* Login Popup */}
      {isLoginOpen && !isThemeOpen && (
        <div style={popupStyle}>
          {/* Replace below with your actual login form or modal */}
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            {/* Example login form placeholder */}
            <button className="btn btn-primary w-full" onClick={toggleLogin}>Sign in with Provider</button>
            <button className="btn btn-ghost mt-4" onClick={toggleLogin}>Cancel</button>
          </div>
        </div>
      )}
    </>
  )
}

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"



import { useEffect, useMemo, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Compass, LayoutDashboard, LogOut, Repeat2, Settings, ShoppingBag, SlidersHorizontal, User } from "lucide-react"

import ContextSwitcher from "@/components/Header/ContextSwitcher"
import getApiURL from "@/components/widgets/GetApiURL"

const ROLE_CONTEXT_ORDER = ["moderator", "staff", "admin"]
const ORDER_BASED_CONTEXT_COLORS = [
  "#3B82F6",
  "#14B8A6",
  "#F59E0B",
  "#8B5CF6",
  "#F43F5E",
  "#22C55E",
  "#EF4444",
  "#0EA5E9",
]
const DEFAULT_CONTEXT_COLOR_SCHEMA = {
  user: "#3B82F6",
  artist: "#14B8A6",
  moderator: "#EA580C",
  staff: "#F43F5E",
  admin: "#DC2626",
  business: "#F59E0B",
  collective: "#8B5CF6",
}

function getDefaultContextColor(type) {
  const normalizedType = String(type || "").toLowerCase()
  return DEFAULT_CONTEXT_COLOR_SCHEMA[normalizedType] || "#3B82F6"
}

function mapLinkedArtistToContext(artist) {
  return {
    id: `artist-${artist?.artistID ?? artist?.ArtistID ?? artist?.path ?? artist?.Path ?? "unknown"}`,
    label: artist?.title ?? artist?.Title ?? "Untitled Artist",
    type: "artist",
    avatarUrl:
      artist?.profilePic?.url ||
      artist?.profilePic?.URL ||
      artist?.ProfilePic?.url ||
      artist?.ProfilePic?.URL ||
      "",
    color: getDefaultContextColor("artist"),
    unreadCount: 0,
    needsAttention: false,
  }
}

function mapRoleToContext(roleName, sessionUser) {
  const normalizedRole = String(roleName || "").toLowerCase()
  return {
    id: `role-${normalizedRole}`,
    label: `TAG ${normalizedRole.charAt(0).toUpperCase()}${normalizedRole.slice(1)}`,
    type: normalizedRole,
    avatarUrl: sessionUser?.image || "",
    color: getDefaultContextColor(normalizedRole),
    unreadCount: 0,
    needsAttention: false,
  }
}

function resolveFullName(sessionUser, userProfile) {
  const profileFirstName = userProfile?.firstName || userProfile?.FirstName || userProfile?.firstname || ""
  const profileLastName = userProfile?.lastName || userProfile?.LastName || userProfile?.lastname || ""
  const profileFullName = `${profileFirstName} ${profileLastName}`.trim()

  if (profileFullName) {
    return profileFullName
  }

  return sessionUser?.name || sessionUser?.email || "User"
}

function buildBaseUserContext(sessionUser, userProfile) {
  const fullName = resolveFullName(sessionUser, userProfile)
  const email = sessionUser?.email || ""

  return {
    id: "user-primary",
    label: fullName,
    subtitle: email,
    type: "user",
    avatarUrl: sessionUser?.image || "",
    color: getDefaultContextColor("user"),
    unreadCount: 0,
    needsAttention: false,
  }
}

export default function LoginProfile({
  className = "",
  isOpen: controlledIsOpen,
  onToggle,
  onContextSnapshotChange,
  activeContextId: controlledActiveContextId,
  onActiveContextChange,
}) {
  const { data: session } = useSession()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [activeMode, setActiveMode] = useState("browse")
  const [isContextWindowOpen, setIsContextWindowOpen] = useState(false)
  const [artistContexts, setArtistContexts] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [internalActiveContextId, setInternalActiveContextId] = useState("user-primary")
  const [contextColorOverrides, setContextColorOverrides] = useState({})
  const [sessionOrderColorMap, setSessionOrderColorMap] = useState({})
  const isControlled = typeof controlledIsOpen === "boolean" && typeof onToggle === "function"
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen
  const selectedActiveContextId = controlledActiveContextId ?? internalActiveContextId

  const updateActiveContextId = (nextContextId) => {
    if (controlledActiveContextId === undefined) {
      setInternalActiveContextId(nextContextId)
    }

    onActiveContextChange?.(nextContextId)
  }

  const roleContexts = useMemo(() => {
    const roleList = Array.isArray(session?.user?.roles) ? session.user.roles : []
    return ROLE_CONTEXT_ORDER
      .filter((roleName) => roleList.includes(roleName))
      .map((roleName) => mapRoleToContext(roleName, session?.user))
  }, [session?.user])

  const baseContexts = useMemo(() => {
    if (!session?.user) {
      return []
    }

    return [
      buildBaseUserContext(session.user, userProfile),
      ...artistContexts,
      ...roleContexts,
    ]
  }, [artistContexts, roleContexts, session?.user, userProfile])

  const availableContexts = useMemo(() => {
    return baseContexts.map((context, index) => ({
      ...context,
      color:
        contextColorOverrides[context.id] ||
        sessionOrderColorMap[context.id] ||
        ORDER_BASED_CONTEXT_COLORS[index % ORDER_BASED_CONTEXT_COLORS.length] ||
        context.color,
    }))
  }, [baseContexts, contextColorOverrides, sessionOrderColorMap])

  const activeContext = useMemo(() => {
    if (availableContexts.length === 0) {
      return null
    }

    return availableContexts.find((context) => context.id === selectedActiveContextId) || availableContexts[0]
  }, [availableContexts, selectedActiveContextId])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const persistedOverrides = window.localStorage.getItem("tag:contextColorOverrides")
      if (persistedOverrides) {
        const parsed = JSON.parse(persistedOverrides)
        if (parsed && typeof parsed === "object") {
          setContextColorOverrides(parsed)
        }
      }
    } catch (error) {
      console.error("Unable to load saved context color overrides:", error.message)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.setItem("tag:contextColorOverrides", JSON.stringify(contextColorOverrides))
    } catch (error) {
      console.error("Unable to save context color overrides:", error.message)
    }
  }, [contextColorOverrides])

  useEffect(() => {
    if (baseContexts.length === 0) {
      return
    }

    setSessionOrderColorMap((currentMap) => {
      const nextMap = { ...currentMap }
      let didChange = false

      baseContexts.forEach((context, index) => {
        if (!nextMap[context.id]) {
          nextMap[context.id] = ORDER_BASED_CONTEXT_COLORS[index % ORDER_BASED_CONTEXT_COLORS.length]
          didChange = true
        }
      })

      const validIds = new Set(baseContexts.map((context) => context.id))
      Object.keys(nextMap).forEach((contextId) => {
        if (!validIds.has(contextId)) {
          delete nextMap[contextId]
          didChange = true
        }
      })

      return didChange ? nextMap : currentMap
    })
  }, [baseContexts])

  useEffect(() => {
    // TODO: Replace local default color schema with user preference colors from API once endpoint is designed.
    onContextSnapshotChange?.({
      activeContext,
      availableContexts,
    })
  }, [activeContext, availableContexts, onContextSnapshotChange])

  useEffect(() => {
    if (!session?.user?.id) {
      setArtistContexts([])
      setUserProfile(null)
      return
    }

    let isMounted = true

    const loadLinkedArtistsAndUser = async () => {
      try {
        const apiUrl = getApiURL()
        const [artistResponse, userResponse] = await Promise.all([
          fetch(`${apiUrl}linker_usertoartist/byUserID/${session.user.id}`),
          fetch(`${apiUrl}user/${session.user.id}`),
        ])

        const payload = artistResponse.ok ? await artistResponse.json() : []
        const userPayload = userResponse.ok ? await userResponse.json() : null

        const contexts = Array.isArray(payload) ? payload.map(mapLinkedArtistToContext) : []

        if (isMounted) {
          setArtistContexts(contexts)
          setUserProfile(userPayload)
        }
      } catch (error) {
        console.error("Unable to load linked artists for profile context switcher:", error.message)
      }
    }

    loadLinkedArtistsAndUser()

    return () => {
      isMounted = false
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (availableContexts.length === 0) {
      return
    }

    if (!availableContexts.some((context) => context.id === selectedActiveContextId)) {
      updateActiveContextId(availableContexts[0].id)
    }
  }, [availableContexts, selectedActiveContextId])

  const setOpenValue = (nextOpen) => {
    if (!nextOpen) {
      setIsContextWindowOpen(false)
    }

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
        style={activeContext?.color ? { boxShadow: `0 0 0 2px ${activeContext.color}66, 0 0 12px ${activeContext.color}88` } : undefined}
      >
        <div className="w-8 rounded-full overflow-hidden">
          <Image
            alt="Active context avatar"
            src={activeContext?.avatarUrl || session.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            width={32}
            height={32}
          />
        </div>
      </button>

      {isContextWindowOpen && (
        <>
          <div className="fixed inset-0 z-70" onClick={() => setIsContextWindowOpen(false)} />
          <div className="absolute right-0 top-full mt-3 z-80 w-88">
            <ContextSwitcher
              variant="applet"
              title="Switch Active Context"
              contexts={availableContexts}
              activeContextId={activeContext?.id}
              onChange={(nextContextId) => {
                updateActiveContextId(nextContextId)
                setOpenValue(false)
              }}
            />
          </div>
        </>
      )}

      {isOpen && (
        <>
          {/* Click-outside backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpenValue(false)} />
          <ul className="absolute right-0 top-full mt-2 z-50 w-64 rounded-box bg-base-100 p-2 shadow-lg border border-base-content/10 menu menu-sm">
            <li className="menu-title">
              <div className="flex flex-col gap-3 px-1 py-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="rounded-box border border-base-300 bg-base-200/60 p-2 text-xs text-base-content/80 space-y-1.5 flex-1 min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">User Profile</div>
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-7 rounded-full overflow-hidden">
                          <Image
                            alt="User profile avatar"
                            src={session.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            width={28}
                            height={28}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm leading-tight truncate">{session.user?.name || "User"}</div>
                        <div className="text-[11px] text-base-content/70 truncate">{session.user?.email || "No email on record"}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsContextWindowOpen((current) => !current)}
                    className="btn btn-xs btn-primary btn-circle mt-1"
                    aria-label="Open context switcher"
                    aria-expanded={isContextWindowOpen}
                  >
                    <Repeat2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {activeContext ? (
                  <div
                    className="rounded-box border border-base-300 bg-base-200/60 px-2 py-1 text-xs text-base-content/75"
                    style={activeContext.color ? { borderLeft: `3px solid ${activeContext.color}`, backgroundColor: `${activeContext.color}12` } : undefined}
                  >
                    Active context: <span className="font-semibold">{activeContext.label}</span>{activeContext.subtitle ? <span className="text-base-content/60"> ({activeContext.subtitle})</span> : null}
                  </div>
                ) : null}

                <div className="rounded-box border border-base-300 bg-base-200/60 p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      className={`btn btn-xs ${activeMode === "browse" ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setActiveMode("browse")}
                      aria-pressed={activeMode === "browse"}
                    >
                      <Compass className="h-3.5 w-3.5" />
                      Browse
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${activeMode === "buy" ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setActiveMode("buy")}
                      aria-pressed={activeMode === "buy"}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <Link href="/user" onClick={() => setOpenValue(false)}>
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </Link>
            </li>
            <li>
              <Link href="/user/profile" onClick={() => setOpenValue(false)}>
                <User className="w-4 h-4" />
                Profile
              </Link>
            </li>
            <li>
              <Link href="/user/preferences" onClick={() => setOpenValue(false)}>
                <SlidersHorizontal className="w-4 h-4" />
                Preferences
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

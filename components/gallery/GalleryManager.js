/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import getApiURL from "@/components/widgets/GetApiURL"
import ContentTags, { WARNING_DEFINITIONS } from "@/components/social/ContentTags"

const api_url = getApiURL()
const defaultFieldClass = "input input-bordered w-full"

const fallbackRoleOptions = [
  { creditRoleID: 1, label: "Copyright Owner" },
  { creditRoleID: 2, label: "Photographer" },
  { creditRoleID: 3, label: "Videographer" },
  { creditRoleID: 4, label: "Model" },
  { creditRoleID: 5, label: "Makeup Artist" },
  { creditRoleID: 6, label: "Set Designer" },
  { creditRoleID: 13, label: "Stylist" },
]

function normalizeUrl(url) {
  if (!url) return ""
  return String(url).trim().toLowerCase()
}

function makeEmptyCreditRow(role = "", creditRoleID = "") {
  return {
    role,
    creditRoleID: creditRoleID ? String(creditRoleID) : "",
    mode: "manual",
    artistQuery: "",
    artistResults: [],
    selectedArtist: null,
    displayName: "",
    externalURL: "",
    bioNote: "",
  }
}

function mapRoleLabel(roleOptions, id) {
  const match = roleOptions.find((r) => String(r.creditRoleID) === String(id))
  return match?.label || ""
}

function warningKeyToLabel(key) {
  return String(key || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" - ")
}

function getProfileDisplayName(profile) {
  return (
    profile?.stageName ||
    profile?.title ||
    profile?.Title ||
    profile?.preferredName ||
    profile?.username ||
    profile?.displayName ||
    profile?.name ||
    profile?.path ||
    profile?.Path ||
    profile?.emailOne ||
    profile?.email ||
    ""
  )
}

function getUserDisplayName(user) {
  return user?.displayName || user?.name || user?.preferredName || user?.username || user?.email || user?.emailOne || ""
}

function isArtistLikeProfile(profile) {
  return Boolean(
    profile?.artistID
    || profile?.ArtistID
    || profile?.stageName
    || profile?.title
    || profile?.path
    || profile?.isArtist
  )
}

function mergeArtists(primary = [], extra = []) {
  const combined = [...primary, ...extra]
  const seen = new Set()
  const merged = []

  for (const artist of combined) {
    const key = String(
      artist?.artistID
      || artist?.ArtistID
      || artist?.path
      || artist?.Path
      || getProfileDisplayName(artist)
      || ""
    ).toLowerCase().trim()

    if (!key || seen.has(key)) continue
    seen.add(key)
    merged.push(artist)
  }

  return merged
}

function getCurrentUserLabel(currentUser) {
  if (!currentUser) return ""
  if (typeof currentUser === "string") return currentUser
  return currentUser.name || currentUser.displayName || currentUser.username || currentUser.email || ""
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0
}

function getManagedPrefix(entityType, entityId, folderKind = "gallery") {
  const normalizedEntityType = String(entityType || "").trim().toLowerCase()
  const normalizedFolderKind = String(folderKind || "gallery").trim().toLowerCase()

  if (normalizedEntityType === "artist") {
    return `platformpics/artists/${entityId}/${normalizedFolderKind}/`
  }

  if (normalizedEntityType === "user") {
    return `platformpics/users/${entityId}/${normalizedFolderKind}/`
  }

  return `platformpics/${normalizedEntityType}/${entityId}/${normalizedFolderKind}/`
}

function mapApiCreditsToEditorRows(credits = []) {
  if (!Array.isArray(credits)) return []
  return credits.map((credit) => ({
    role: credit?.role || credit?.Role || "",
    creditRoleID: String(credit?.creditRoleID || credit?.CreditRoleID || ""),
    mode: "lookup",
    artistQuery: credit?.displayName || credit?.DisplayName || "",
    artistResults: [],
    selectedArtist: null,
    displayName: credit?.displayName || credit?.DisplayName || "",
    externalURL: credit?.externalURL || credit?.ExternalURL || "",
    bioNote: credit?.creditText || credit?.CreditText || credit?.bioNote || credit?.BioNote || "",
    creditPartyID: credit?.creditPartyID || credit?.CreditPartyID || null,
  }))
}

function buildCreditsSavePayload(credits = [], defaultRoleID = "") {
  if (!Array.isArray(credits)) return []

  return credits
    .map((credit, index) => {
      const selectedArtist = credit?.selectedArtist || null
      const artistID =
        toNumber(selectedArtist?.artistID) ||
        toNumber(selectedArtist?.ArtistID) ||
        toNumber(credit?.artistID) ||
        toNumber(credit?.ArtistID) ||
        null

      const userID =
        toNumber(selectedArtist?.userID) ||
        toNumber(selectedArtist?.UserID) ||
        toNumber(credit?.userID) ||
        toNumber(credit?.UserID) ||
        null

      const displayName = String(credit?.displayName || "").trim()
      const externalURL = String(credit?.externalURL || "").trim()
      const bioNote = String(credit?.bioNote || "").trim()
      const creditRoleID = toNumber(credit?.creditRoleID || defaultRoleID)
      const creditPartyID = toNumber(credit?.creditPartyID || credit?.CreditPartyID) || null

      const hasAnyValue = Boolean(displayName || externalURL || bioNote || artistID || userID || creditPartyID)
      if (!hasAnyValue || !creditRoleID) return null

      return {
        creditPartyID,
        creditRoleID,
        sortOrder: index + 1,
        creditText: bioNote || null,
        party: creditPartyID
          ? null
          : {
              userID,
              artistID,
              displayName: displayName || null,
              externalURL: externalURL || null,
              bioNote: bioNote || null,
            },
      }
    })
    .filter(Boolean)
}

function CreditsAdder({ credits, onChange, artists, users, onSave, saving, roleOptions, defaultRoleID, onDirty, currentUser }) {
  const ownerAutofillRef = useRef(false)
  const ownerFocusClearedRef = useRef(false)

  const userSuggestion = useMemo(() => {
    if (!currentUser) return null
    if (typeof currentUser === "string") {
      return {
        kind: "you",
        label: "You",
        displayName: currentUser,
        username: "",
        email: String(currentUser).includes("@") ? currentUser : "",
        externalURL: "",
      }
    }

    const displayName = currentUser.name || currentUser.displayName || currentUser.username || currentUser.email || ""
    if (!displayName) return null
    return {
      kind: "you",
      label: "You",
      displayName,
      username: currentUser.username || "",
      email: currentUser.email || "",
      externalURL: "",
    }
  }, [currentUser])

  const updateCredit = useCallback((index, updates) => {
    onChange(credits.map((c, i) => (i === index ? { ...c, ...updates } : c)))
    onDirty?.()
  }, [credits, onChange, onDirty])

  useEffect(() => {
    if (!credits?.length) return
    const first = credits[0]
    if (String(first?.creditRoleID || "").trim()) return
    updateCredit(0, {
      creditRoleID: defaultRoleID,
      role: mapRoleLabel(roleOptions, defaultRoleID) || "Copyright Owner",
    })
  }, [credits, defaultRoleID, roleOptions, updateCredit])

  useEffect(() => {
    if (ownerAutofillRef.current) return
    if (!userSuggestion?.displayName) return
    if (!credits?.length) return
    if (String(credits[0]?.displayName || "").trim()) return

    ownerAutofillRef.current = true
    
    // If currentUser is an object with an ID, fetch their linked artists to find their primary artist profile
    const currentUserId = typeof currentUser === "object" ? currentUser?.id : null
    if (!currentUserId) {
      // User is not logged in or no ID; just use the user suggestion
      updateCredit(0, {
        displayName: userSuggestion.displayName,
        externalURL: "",
        selectedArtist: null,
        creditRoleID: credits[0]?.creditRoleID || defaultRoleID,
        role: credits[0]?.role || mapRoleLabel(roleOptions, defaultRoleID) || "Copyright Owner",
      })
      return
    }

    // Fetch the current user's linked artists
    fetch(`${api_url}linker_usertoartist/byUserID/${currentUserId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!Array.isArray(data) || !data.length) {
          // No artist linked; use user name
          updateCredit(0, {
            displayName: userSuggestion.displayName,
            externalURL: "",
            selectedArtist: null,
            creditRoleID: credits[0]?.creditRoleID || defaultRoleID,
            role: credits[0]?.role || mapRoleLabel(roleOptions, defaultRoleID) || "Copyright Owner",
          })
          return
        }

        // Use the first (primary) linked artist
        const userArtist = data[0]
        const displayName = getProfileDisplayName(userArtist)
        const artistPath = String(userArtist?.path || userArtist?.Path || "").trim()
        const externalURL = artistPath ? `/artists/${artistPath}` : ""

        updateCredit(0, {
          displayName,
          externalURL,
          selectedArtist: userArtist,
          creditRoleID: credits[0]?.creditRoleID || defaultRoleID,
          role: credits[0]?.role || mapRoleLabel(roleOptions, defaultRoleID) || "Copyright Owner",
        })
      })
      .catch(() => {
        // Fallback to user name if fetch fails
        updateCredit(0, {
          displayName: userSuggestion.displayName,
          externalURL: "",
          selectedArtist: null,
          creditRoleID: credits[0]?.creditRoleID || defaultRoleID,
          role: credits[0]?.role || mapRoleLabel(roleOptions, defaultRoleID) || "Copyright Owner",
        })
      })
  }, [credits, currentUser, defaultRoleID, roleOptions, updateCredit, userSuggestion])

  const addCredit = () => {
    onChange([...credits, makeEmptyCreditRow("", defaultRoleID)])
    onDirty?.()
  }

  const removeCredit = (index) => {
    onChange(credits.filter((_, i) => i !== index))
    onDirty?.()
  }

  const buildSuggestions = (query) => {
    const lowered = String(query || "").toLowerCase().trim()
    const suggestions = []

    if (userSuggestion) {
      const matchesSelf = !lowered
        || String(userSuggestion.displayName || "").toLowerCase().includes(lowered)
        || String(userSuggestion.email || "").toLowerCase().includes(lowered)
      if (matchesSelf) suggestions.push(userSuggestion)
    }

    const userMatches = users
      .filter((user) => {
        const displayName = getUserDisplayName(user)
        const username = String(user?.username || "").trim()
        const email = String(user?.email || user?.emailOne || "").trim()
        if (!displayName && !username && !email) return false
        if (!lowered) return true

        const displayNameLower = String(displayName).toLowerCase()
        const usernameLower = username.toLowerCase()
        const emailLower = email.toLowerCase()
        return displayNameLower.includes(lowered) || usernameLower.includes(lowered) || emailLower.includes(lowered)
      })
      .map((user) => ({
        kind: isArtistLikeProfile(user) ? "artist" : "user",
        label: isArtistLikeProfile(user) ? "Artist" : "User",
        displayName: getUserDisplayName(user),
        username: user?.username || "",
        email: user?.email || user?.emailOne || "",
        externalURL: user?.externalURL || user?.webSite || "",
        sourceArtist: isArtistLikeProfile(user) ? user : null,
        sourceUser: user,
      }))
      .filter((suggestion) => String(suggestion.displayName || "").trim())

    const artistMatches = artists
      .filter((artist) => {
        const displayName = getProfileDisplayName(artist)
        const username = String(artist?.username || "").trim()
        const email = String(artist?.emailOne || artist?.email || "").trim()
        if (!displayName && !username && !email) return false
        if (!lowered) return true

        const displayNameLower = String(displayName).toLowerCase()
        const titleLower = String(artist?.title || artist?.Title || "").toLowerCase()
        const pathLower = String(artist?.path || artist?.Path || "").toLowerCase()
        const usernameLower = username.toLowerCase()
        const preferredName = String(artist?.preferredName || "").toLowerCase()
        const emailLower = email.toLowerCase()
        const externalURL = String(artist?.externalURL || artist?.webSite || "").toLowerCase()
        return (
          displayNameLower.includes(lowered) ||
          titleLower.includes(lowered) ||
          pathLower.includes(lowered) ||
          usernameLower.includes(lowered) ||
          preferredName.includes(lowered) ||
          emailLower.includes(lowered) ||
          externalURL.includes(lowered)
        )
      })
      .slice(0, 10)
      .map((artist) => {
        const artistPath = String(artist?.path || artist?.Path || "").trim()
        return {
          kind: "artist",
          label: "Artist",
          displayName: getProfileDisplayName(artist),
          artistPath,
          // Use internal profile URL if path exists, otherwise fall back to external URL
          externalURL: artistPath ? `/artists/${artistPath}` : (artist?.externalURL || artist?.webSite || ""),
          username: artist?.username || "",
          email: artist?.emailOne || artist?.email || "",
          sourceArtist: artist,
        }
      })
      .filter((suggestion) => String(suggestion.displayName || "").trim())

    // Keep artists ahead of users so dedupe preserves the richer artist identity/tag.
    const combined = [...suggestions, ...artistMatches, ...userMatches]
    const deduped = []
    const seen = new Set()
    for (const entry of combined) {
      const key = `${String(entry.displayName || "").toLowerCase()}::${String(entry.email || "").toLowerCase()}::${String(entry.username || "").toLowerCase()}`
      if (!String(entry.displayName || "").trim()) continue
      if (seen.has(key)) continue
      seen.add(key)
      deduped.push(entry)
    }

    return deduped.slice(0, 20)
  }

  const applySuggestion = (index, suggestion) => {
    const profileName = suggestion.displayName || ""
    // Prefer internal artist profile link; fall back to external URL on suggestion
    const profileUrl = suggestion.externalURL || credits[index]?.externalURL || ""
    updateCredit(index, {
      selectedArtist: suggestion.sourceArtist || null,
      displayName: profileName,
      artistQuery: profileName,
      artistResults: [],
      externalURL: profileUrl,
      mode: "lookup",
    })
  }

  const tryResolveLinkToArtist = (index, maybeUrl) => {
    const normalized = normalizeUrl(maybeUrl)
    if (!normalized) return

    const match = artists.find((artist) => {
      const url = normalizeUrl(artist?.externalURL || artist?.webSite)
      if (!url) return false
      return normalized === url || normalized.includes(url) || url.includes(normalized)
    })

    if (!match) return

    updateCredit(index, {
      selectedArtist: match,
      displayName: getProfileDisplayName(match),
      artistQuery: getProfileDisplayName(match),
      artistResults: [],
      externalURL: match?.externalURL || match?.webSite || maybeUrl,
      mode: "lookup",
    })
  }

  return (
    <>
      <div className="rounded-md border border-base-300 bg-base-200 p-3 space-y-3">
        <div className="font-semibold text-sm">Credits</div>
        <p className="text-xs text-base-content/60">Copyright Owner defaults to your profile. Click into Owner Name to clear and quickly pick from profiles (friends will be prioritized once that list is wired).</p>

        {credits.map((credit, index) => (
          <div key={index} className="rounded-md border border-base-300 bg-base-100 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-base-content/80">{index === 0 ? "Copyright Owner" : `Credit ${index + 1}`}</div>
              {index > 0 && (
                <button type="button" className="btn btn-xs btn-ghost text-error" onClick={() => removeCredit(index)}>
                  Remove
                </button>
              )}
            </div>

            <label className="form-control">
              <span className="label-text text-xs">Role</span>
              <select
                className="select select-bordered w-full"
                value={credit.creditRoleID || (index === 0 ? defaultRoleID : "")}
                onChange={(e) => {
                  const roleId = e.target.value
                  updateCredit(index, { creditRoleID: roleId, role: mapRoleLabel(roleOptions, roleId) })
                }}
              >
                <option value="">Select role</option>
                {roleOptions.map((role) => (
                  <option key={role.creditRoleID} value={role.creditRoleID}>{role.label}</option>
                ))}
              </select>
            </label>

            <div className="relative">
              <input
                className={defaultFieldClass}
                placeholder={index === 0 ? "Copyright owner name or profile link" : "Display name"}
                value={credit.displayName}
                onFocus={() => {
                  if (index === 0 && !ownerFocusClearedRef.current && userSuggestion?.displayName && credit.displayName === userSuggestion.displayName) {
                    ownerFocusClearedRef.current = true
                    updateCredit(index, { displayName: "" })
                  }
                  updateCredit(index, {
                    artistResults: buildSuggestions(index === 0 ? "" : credit.displayName || ""),
                    mode: "lookup",
                  })
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData?.getData("text") || ""
                  if (/^https?:\/\//i.test(String(pasted).trim())) {
                    setTimeout(() => tryResolveLinkToArtist(index, String(pasted).trim()), 0)
                  }
                }}
                onChange={(e) => {
                  const query = e.target.value
                  updateCredit(index, {
                    displayName: query,
                    artistQuery: query,
                    artistResults: buildSuggestions(query),
                    mode: "lookup",
                  })
                }}
              />

              {credit.artistResults?.length > 0 && (
                <div className="absolute z-10 w-full bg-base-100 border border-base-300 rounded-md shadow-lg mt-1 max-h-40 overflow-auto">
                  {credit.artistResults.map((a, suggestionIndex) => (
                    <button
                      key={`${a.kind || "artist"}-${a.displayName || "unknown"}-${suggestionIndex}`}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-base-200 text-sm"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => applySuggestion(index, a)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{a.displayName || "Unknown profile"}</span>
                        <span className="badge badge-ghost badge-xs">{a.label || "Artist"}</span>
                      </div>
                      {a.kind === "artist" && a.artistPath
                        ? <div className="text-[11px] text-base-content/60 truncate">/artists/{a.artistPath}</div>
                        : (a.username || a.email) ? <div className="text-[11px] text-base-content/60 truncate">{a.username || a.email}</div> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {credit.selectedArtist && (
              <div className="badge badge-success mt-1">
                Selected: {getProfileDisplayName(credit.selectedArtist) || credit.displayName}
              </div>
            )}

            <input
              className={defaultFieldClass}
              placeholder="External URL (optional)"
              value={credit.externalURL}
              onBlur={(e) => tryResolveLinkToArtist(index, e.target.value)}
              onChange={(e) => updateCredit(index, { externalURL: e.target.value })}
            />
            <input className={defaultFieldClass} placeholder="Credit note (optional)" value={credit.bioNote} onChange={(e) => updateCredit(index, { bioNote: e.target.value })} />
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button type="button" className="btn btn-sm btn-outline" onClick={addCredit}>+ Add Credit</button>
          <button type="button" className="btn btn-sm btn-secondary" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save Credits"}</button>
        </div>
      </div>
    </>
  )
}

export default function GalleryManager({ entityType, entityId, entityLabel, currentUser, basePrefix, folderKind = "gallery", title = "Gallery Manager", allowVideo, onFilesChanged }) {
  const normalizedFolderKind = String(folderKind || "gallery").trim().toLowerCase()
  const galleryPrefix = basePrefix || getManagedPrefix(entityType, entityId, normalizedFolderKind)
  const canManageOrder = normalizedFolderKind === "gallery"
  const canPostVideo = typeof allowVideo === "boolean" ? allowVideo : normalizedFolderKind === "gallery"
  const folderDisplayName = normalizedFolderKind.charAt(0).toUpperCase() + normalizedFolderKind.slice(1)
  const localCreditsKey = useMemo(() => `gallery-manager:${entityType}:${entityId}:credits`, [entityType, entityId])
  const localWarningsKey = useMemo(() => `gallery-manager:${entityType}:${entityId}:warnings`, [entityType, entityId])

  const [files, setFiles] = useState([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [deletingUrl, setDeletingUrl] = useState(null)
  const [orderDirty, setOrderDirty] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)

  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [uploadMessage, setUploadMessage] = useState("")
  const [uploadError, setUploadError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const dragIndexRef = useRef(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const [picMetadata, setPicMetadata] = useState({ title: "", altText: "", byline: "", description: "" })
  const [savingPicMeta, setSavingPicMeta] = useState(false)
  const [picMetaDirty, setPicMetaDirty] = useState(false)

  const [picCredits, setPicCredits] = useState([makeEmptyCreditRow("Copyright Owner")])
  const [savingPicCredits, setSavingPicCredits] = useState(false)
  const [picCreditsDirty, setPicCreditsDirty] = useState(false)

  const [pictureByUrl, setPictureByUrl] = useState({})
  const [creditsByUrl, setCreditsByUrl] = useState({})
  const [creditRoles, setCreditRoles] = useState([])

  const [videoUrl, setVideoUrl] = useState("")
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("")
  const [videoProvider, setVideoProvider] = useState("")
  const [videoMeta, setVideoMeta] = useState({ title: "", byline: "", description: "" })
  const [savingVideoMeta, setSavingVideoMeta] = useState(false)
  const [videoMetaDirty, setVideoMetaDirty] = useState(false)
  const [videoSyncing, setVideoSyncing] = useState(false)
  const [lastSyncedVideoKey, setLastSyncedVideoKey] = useState("")

  const [videoCredits, setVideoCredits] = useState([makeEmptyCreditRow("Copyright Owner")])
  const [savingVideoCredits, setSavingVideoCredits] = useState(false)
  const [videoCreditsDirty, setVideoCreditsDirty] = useState(false)

  const [users, setUsers] = useState([])
  const [artists, setArtists] = useState([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [warningsByUrl, setWarningsByUrl] = useState({})
  const [selectedWarnings, setSelectedWarnings] = useState([])
  const [warningsDirty, setWarningsDirty] = useState(false)
  const [savingWarnings, setSavingWarnings] = useState(false)

  const warningOptions = useMemo(
    () => Object.keys(WARNING_DEFINITIONS).map((key) => ({ key, label: warningKeyToLabel(key) })),
    []
  )
  const currentUserLabel = useMemo(() => getCurrentUserLabel(currentUser), [currentUser])

  const roleOptions = creditRoles.length ? creditRoles : fallbackRoleOptions
  const defaultRoleID = String(roleOptions[0]?.creditRoleID || "")

  const showMessage = (msg) => {
    setMessage(msg)
    setError("")
    setTimeout(() => setMessage(""), 3500)
  }

  const showError = (msg) => {
    setError(msg)
    setMessage("")
  }

  const displayFileName = (name) => {
    if (!name) return ""
    const trimmed = name.endsWith("/") ? name.slice(0, -1) : name
    return trimmed.split("/").pop() || name
  }

  const formatSize = (bytes) => {
    if (!bytes) return "-"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const upsertVirtualFile = useCallback((nextVirtualFile) => {
    setFiles((prev) => {
      const withoutSameVirtual = prev.filter((f) => !(f.isVideoPreview && f.virtualKey === nextVirtualFile.virtualKey))
      return [nextVirtualFile, ...withoutSameVirtual]
    })
  }, [])

  const loadFiles = useCallback(async () => {
    setLoadingFiles(true)
    try {
      const entityFetchUrl = entityType === "blog"
        ? `${api_url}blog/${entityId}`
        : `${api_url}${entityType}/byID/${entityId}`

      const blobResPromise = fetch(`/api/image/list?container=tagpictures&startPrefix=${encodeURIComponent(galleryPrefix)}&prefix=${encodeURIComponent(galleryPrefix)}`)
      const entityResPromise = canManageOrder ? fetch(entityFetchUrl) : Promise.resolve(null)

      const [entityRes, blobRes] = await Promise.all([entityResPromise, blobResPromise])

      const entityData = entityRes?.ok ? await entityRes.json() : null
      const galleryItems = canManageOrder && Array.isArray(entityData?.gallery?.galleryItems) ? entityData.gallery.galleryItems : []
      const blobData = blobRes.ok ? await blobRes.json() : null
      const remoteFiles = Array.isArray(blobData?.files) ? blobData.files : []

      const byUrl = new Map()

      if (galleryItems.length > 0) {
        const mapped = galleryItems
          .slice()
          .sort((a, b) => (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0))
          .map((item) => {
            if (item.videoID) {
              const sourceVideoUrl = item.video?.url || ""
              const detected = detectVideoProvider(sourceVideoUrl)
              const thumbUrl = item.video?.thumbnailURL || (detected.videoId ? `https://vumbnail.com/${detected.videoId}.jpg` : "")
              return {
                name: `video-preview-${item.videoID}.jpg`,
                url: thumbUrl,
                thumbnailURL: thumbUrl,
                contentLength: 0,
                isVideoPreview: true,
                virtualKey: `video-${item.videoID}`,
                sourceVideoUrl,
                embedUrl: item.video?.embedURL || detected.embedUrl,
                persistedVideoId: item.videoID,
                persistedGalleryItemId: item.galleryItemID,
                sortOrder: Number(item.sortOrder) || 0,
              }
            }

            const url = item.picture?.url || ""
            return {
              name: displayFileName(url),
              url,
              thumbnailURL: item.picture?.thumbnailURL || url,
              contentLength: 0,
              persistedPictureId: item.pictureID,
              persistedGalleryItemId: item.galleryItemID,
              sortOrder: Number(item.sortOrder) || 0,
            }
          })

        mapped.forEach((item) => {
          const key = normalizeUrl(item?.url)
          if (key) byUrl.set(key, item)
        })
      }

      remoteFiles.forEach((item) => {
        const key = normalizeUrl(item?.url)
        if (!key || byUrl.has(key)) return
        byUrl.set(key, item)
      })

      const nextFiles = Array.from(byUrl.values())
      setFiles(nextFiles)
      onFilesChanged?.(nextFiles)
    } catch (err) {
      showError(err.message)
    } finally {
      setLoadingFiles(false)
    }
  }, [canManageOrder, entityType, entityId, galleryPrefix, onFilesChanged])

  const loadPictureMetadata = useCallback(async () => {
    try {
      const res = await fetch(`${api_url}picture`)
      if (!res.ok) return
      const data = await res.json()
      if (!Array.isArray(data)) return
      const map = {}
      for (const pic of data) {
        const key = normalizeUrl(pic.url || pic.URL)
        if (key) map[key] = pic
      }
      setPictureByUrl(map)
    } catch {
      // keep form usable without metadata preload
    }
  }, [])

  const loadLocalCredits = useCallback(() => {
    try {
      const raw = localStorage.getItem(localCreditsKey)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === "object") setCreditsByUrl(parsed)
    } catch {
      // ignore cache errors
    }
  }, [localCreditsKey])

  const loadLocalWarnings = useCallback(() => {
    try {
      const raw = localStorage.getItem(localWarningsKey)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === "object") setWarningsByUrl(parsed)
    } catch {
      // ignore cache errors
    }
  }, [localWarningsKey])

  useEffect(() => {
    loadFiles()
    loadPictureMetadata()
    loadLocalCredits()
    loadLocalWarnings()
  }, [loadFiles, loadPictureMetadata, loadLocalCredits, loadLocalWarnings])

  useEffect(() => {
    const currentUserId = typeof currentUser === "object" ? currentUser?.id : null

    fetch(`${api_url}user`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))

    fetch(`${api_url}artist`)
      .then((r) => r.json())
      .then((data) => setArtists(Array.isArray(data) ? data : []))
      .catch(() => {})

    if (currentUserId) {
      fetch(`${api_url}linker_usertoartist/byUserID/${currentUserId}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          if (!Array.isArray(data) || !data.length) return
          setArtists((prev) => mergeArtists(prev, data))
        })
        .catch(() => {})
    }

    fetch(`${api_url}blog/credit-roles`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCreditRoles(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [currentUser])

  const applySelectedFileData = useCallback((file) => {
    const key = normalizeUrl(file?.url)
    const pic = pictureByUrl[key]
    const cachedCredits = creditsByUrl[key]
    const cachedWarnings = warningsByUrl[key]
    const persistedPictureId = toNumber(file?.persistedPictureId || pic?.pictureID || pic?.PictureID)
    const persistedVideoId = toNumber(file?.persistedVideoId)

    setPicMetadata({
      title: pic?.title || pic?.Title || "",
      altText: pic?.altText || pic?.AltText || "",
      byline: pic?.byline || pic?.Byline || "",
      description: pic?.description || pic?.Description || "",
    })
    setPicMetaDirty(false)

    if (Array.isArray(cachedCredits) && cachedCredits.length) {
      if (file?.isVideoPreview) {
        setVideoCredits(cachedCredits)
      } else {
        setPicCredits(cachedCredits)
      }
    } else if (file?.isVideoPreview) {
      setVideoCredits([makeEmptyCreditRow("Copyright Owner", defaultRoleID)])
      if (persistedVideoId) {
        fetch(`${api_url}picture/video/${persistedVideoId}/credits`)
          .then((res) => (res.ok ? res.json() : []))
          .then((rows) => {
            const mapped = mapApiCreditsToEditorRows(rows)
            if (!mapped.length) return
            setCreditsByUrl((prev) => ({ ...prev, [key]: mapped }))
            setVideoCredits(mapped)
          })
          .catch(() => {})
      }
    } else {
      setPicCredits([makeEmptyCreditRow("Copyright Owner", defaultRoleID)])
      if (persistedPictureId) {
        fetch(`${api_url}picture/${persistedPictureId}/credits`)
          .then((res) => (res.ok ? res.json() : []))
          .then((rows) => {
            const mapped = mapApiCreditsToEditorRows(rows)
            if (!mapped.length) return
            setCreditsByUrl((prev) => ({ ...prev, [key]: mapped }))
            setPicCredits(mapped)
          })
          .catch(() => {})
      }
    }
    setPicCreditsDirty(false)
    setVideoCreditsDirty(false)

    setSelectedWarnings(Array.isArray(cachedWarnings) ? cachedWarnings : [])
    setWarningsDirty(false)
  }, [pictureByUrl, creditsByUrl, warningsByUrl, defaultRoleID])

  const toggleWarning = (warningKey) => {
    setWarningsDirty(true)
    setSelectedWarnings((prev) =>
      prev.includes(warningKey)
        ? prev.filter((item) => item !== warningKey)
        : [...prev, warningKey]
    )
  }

  const handleSaveWarnings = async () => {
    if (!selectedFile?.url) return
    setSavingWarnings(true)
    try {
      const key = normalizeUrl(selectedFile.url)
      const next = { ...warningsByUrl, [key]: selectedWarnings }
      setWarningsByUrl(next)
      localStorage.setItem(localWarningsKey, JSON.stringify(next))
      setWarningsDirty(false)
      showMessage("Content warning tags saved.")
    } catch {
      showError("Failed to save content warning tags.")
    } finally {
      setSavingWarnings(false)
    }
  }

  const selectImage = (file) => {
    setSelectedFile(file)
    if (file?.isVideoPreview) {
      setVideoPreviewUrl(file.embedUrl || "")
    }
    applySelectedFileData(file)
  }

  useEffect(() => {
    if (selectedFile) applySelectedFileData(selectedFile)
  }, [selectedFile, applySelectedFileData])

  const uploadSingleFile = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("container", "tagpictures")
    formData.append("startPrefix", galleryPrefix)
    formData.append("targetPrefix", galleryPrefix)
    formData.append("userID", "staff")
    formData.append("category", entityType)
    formData.append("entityID", String(entityId || ""))

    const res = await fetch("/api/image/upload", { method: "POST", body: formData })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || data.message || `Upload failed: ${file.name}`)

    let blobName = file.name
    try {
      const parts = new URL(data.url).pathname.split("/")
      blobName = parts.slice(2).join("/")
    } catch {
      blobName = file.name
    }

    return {
      name: blobName,
      url: data.url,
      persistedPictureId: data?.persistedPictureId || null,
    }
  }

  const syncVideoToGallery = useCallback(async ({ provider, videoId, sourceUrl, previewImage, embedUrl }) => {
    if (!entityId) return null

    const res = await fetch(`${api_url}${entityType}/${entityId}/gallery/video`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: sourceUrl,
        embedURL: embedUrl,
        thumbnailURL: previewImage,
        provider,
        providerVideoID: videoId,
        title: videoMeta.title || null,
        byline: videoMeta.byline || null,
        description: videoMeta.description || null,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData?.message || errorData?.error || "Failed to save video to gallery")
    }

    const saved = await res.json()
    return {
      galleryItemID: saved?.galleryItemID || saved?.GalleryItemID || null,
      videoID: saved?.videoID || saved?.VideoID || null,
      sortOrder: saved?.sortOrder ?? saved?.SortOrder ?? null,
      thumbnailURL: saved?.thumbnailURL || saved?.ThumbnailURL || null,
      url: saved?.url || saved?.URL || sourceUrl,
    }
  }, [entityType, entityId, videoMeta.title, videoMeta.byline, videoMeta.description])

  const uploadFiles = async (fileList) => {
    const filesToUpload = Array.from(fileList || []).filter(Boolean)
    if (!filesToUpload.length) return

    setUploadLoading(true)
    setUploadError("")
    setUploadMessage("")
    setUploadProgress(null)

    const errors = []
    const uploaded = []

    for (let i = 0; i < filesToUpload.length; i++) {
      setUploadProgress(`${i + 1} / ${filesToUpload.length}`)
      try {
        const uploadedFile = await uploadSingleFile(filesToUpload[i])
        uploaded.push(uploadedFile)
        setFiles((prev) => [uploadedFile, ...prev])
      } catch (err) {
        errors.push(err.message)
      }
    }

    setUploadProgress(null)
    setUploadLoading(false)

    if (errors.length) setUploadError(errors.join(" | "))

    if (uploaded.length) {
      setUploadMessage(`Uploaded ${uploaded.length} file${uploaded.length > 1 ? "s" : ""}`)
      selectImage(uploaded[uploaded.length - 1])
      loadFiles()
      loadPictureMetadata()
    }
  }

  const persistGalleryItems = useCallback(async (items) => {
    if (!entityId || !canManageOrder) return

    const payload = {
      items: items.map((file) => {
        if (file?.isVideoPreview) {
          return {
            mediaType: "video",
            videoID: file.persistedVideoId || null,
            url: file.sourceVideoUrl || file.url,
            embedURL: file.embedUrl || null,
          }
        }

        return {
          mediaType: "picture",
          pictureID: file.persistedPictureId || null,
          url: file.url,
        }
      }),
    }

    const res = await fetch(`${api_url}${entityType}/${entityId}/gallery/order`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData?.message || errorData?.error || "Failed to save gallery order")
    }
  }, [canManageOrder, entityId, entityType])

  const handleArchive = async (file) => {
    if (!file || file?.isVideoPreview) return

    const timestampFolder = new Date().toISOString().replace(/[:.]/g, "-")
    const fileName = displayFileName(file.name)
    const archivedName = `${galleryPrefix}${timestampFolder}/${fileName}`

    try {
      const response = await fetch("/api/image/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          container: "tagpictures",
          oldName: file.name,
          newName: archivedName,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Archive move failed")
      }

      showMessage(`Archived: ${fileName}`)
      loadFiles()
    } catch (err) {
      showError(err.message || "Failed to archive file.")
    }
  }

  const handleDelete = async (file) => {
    if (file?.isVideoPreview) {
      setFiles((prev) => prev.filter((f) => !(f.isVideoPreview && f.virtualKey === file.virtualKey)))
      if (selectedFile?.virtualKey === file.virtualKey) setSelectedFile(null)
      showMessage(`Removed: ${displayFileName(file.name)}`)
      return
    }

    if (!window.confirm(`Delete "${displayFileName(file.name)}"?`)) return

    setDeletingUrl(file.url)
    try {
      const res = await fetch("/api/image/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: file.url, pictureId: file.persistedPictureId || null }),
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || d.message || "Delete failed")
      }

      const nextFiles = files.filter((f) => f.url !== file.url)
      setFiles(nextFiles)
      onFilesChanged?.(nextFiles)
      if (selectedFile?.url === file.url) setSelectedFile(null)
      if (canManageOrder) {
        await persistGalleryItems(nextFiles)
        setOrderDirty(false)
      }
      showMessage(`Deleted: ${displayFileName(file.name)}`)
    } catch (err) {
      showError(err.message)
    } finally {
      setDeletingUrl(null)
    }
  }

  const handleDragStart = (index) => {
    dragIndexRef.current = index
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragDrop = (index) => {
    const from = dragIndexRef.current
    if (from === null || from === index) {
      dragIndexRef.current = null
      setDragOverIndex(null)
      return
    }

    setFiles((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      return next
    })
    setOrderDirty(true)

    dragIndexRef.current = null
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    dragIndexRef.current = null
    setDragOverIndex(null)
  }

  const handleSaveOrder = async () => {
    if (!entityId || !files.length || !canManageOrder) return

    setSavingOrder(true)
    try {
      await persistGalleryItems(files)

      setOrderDirty(false)
      showMessage("Gallery order saved.")
    } catch (err) {
      showError(err.message || "Failed to save order.")
    } finally {
      setSavingOrder(false)
    }
  }

  const handleSavePicMeta = async () => {
    if (!selectedFile) return
    setSavingPicMeta(true)

    try {
      const key = normalizeUrl(selectedFile.url)
      const existing = pictureByUrl[key]
      const existingId = existing?.pictureID || existing?.PictureID || 0

      const payload = {
        ...(existing || {}),
        pictureID: existingId,
        url: selectedFile.url,
        normalizedURL: key,
        path: galleryPrefix,
        title: picMetadata.title || null,
        altText: picMetadata.altText || null,
        byline: picMetadata.byline || null,
        description: picMetadata.description || null,
        embedURL: selectedFile?.isVideoPreview ? selectedFile?.sourceVideoUrl || null : existing?.embedURL || existing?.EmbedURL || null,
        context: selectedFile?.isVideoPreview ? "vimeo-preview" : existing?.context || existing?.Context || null,
        updated: new Date().toISOString(),
        created: existing?.created || existing?.Created || new Date().toISOString(),
      }

      if (existingId) {
        const res = await fetch(`${api_url}picture/${existingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, pictureID: existingId }),
        })
        if (!res.ok) throw new Error("Failed to save metadata")
        setPictureByUrl((prev) => ({ ...prev, [key]: { ...payload, pictureID: existingId } }))
      } else {
        const res = await fetch(`${api_url}picture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create picture metadata")
        const created = await res.json()
        setPictureByUrl((prev) => ({ ...prev, [key]: created }))
      }

      setPicMetaDirty(false)
      showMessage("Image metadata saved.")
    } catch (err) {
      showError(err.message || "Failed to save metadata.")
    } finally {
      setSavingPicMeta(false)
    }
  }

  const handleSavePicCredits = async () => {
    if (!selectedFile) return
    setSavingPicCredits(true)

    try {
      const key = normalizeUrl(selectedFile.url)
      const picture = pictureByUrl[key]
      const pictureId = toNumber(selectedFile?.persistedPictureId || picture?.pictureID || picture?.PictureID)
      if (!pictureId) {
        throw new Error("Save image metadata first so a PictureID exists, then save credits.")
      }

      const payload = {
        credits: buildCreditsSavePayload(picCredits, defaultRoleID),
      }

      const res = await fetch(`${api_url}picture/${pictureId}/credits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        if (res.status === 404) {
          throw new Error("Credits endpoint not found (404). Restart the API server so the latest routes are loaded.")
        }
        throw new Error(errorData?.message || errorData?.error || "Failed to save image credits.")
      }

      const savedRows = await res.json()
      const mapped = mapApiCreditsToEditorRows(savedRows)
      const next = { ...creditsByUrl, [key]: mapped }
      setCreditsByUrl(next)
      setPicCredits(mapped.length ? mapped : [makeEmptyCreditRow("Copyright Owner", defaultRoleID)])
      localStorage.setItem(localCreditsKey, JSON.stringify(next))
      setPicCreditsDirty(false)
      showMessage("Image credits saved.")
    } catch (err) {
      showError(err.message || "Failed to save credits.")
    } finally {
      setSavingPicCredits(false)
    }
  }

  const detectVideoProvider = (url) => {
    if (!url) return { provider: "", videoId: "", embedUrl: "" }

    if (url.includes("vimeo.com")) {
      const match = url.match(/vimeo\.com\/(\d+)/)
      if (match) return { provider: "vimeo", videoId: match[1], embedUrl: `https://player.vimeo.com/video/${match[1]}` }
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
      if (match) return { provider: "youtube", videoId: match[1], embedUrl: `https://www.youtube.com/embed/${match[1]}` }
    }

    return { provider: "", videoId: "", embedUrl: "" }
  }

  const handleVideoUrlChange = async (val) => {
    setVideoUrl(val)
    const { provider, videoId, embedUrl } = detectVideoProvider(val)
    setVideoProvider(provider)
    setVideoPreviewUrl(embedUrl)

    if (provider === "vimeo" && videoId) {
      const previewImage = `https://vumbnail.com/${videoId}.jpg`
      const virtualFile = {
        name: `video-preview-vimeo-${videoId}.jpg`,
        url: previewImage,
        contentLength: 0,
        isVideoPreview: true,
        virtualKey: `vimeo-${videoId}`,
        sourceVideoUrl: val,
        embedUrl,
      }
      upsertVirtualFile(virtualFile)
      selectImage(virtualFile)

      const syncKey = `${provider}-${videoId}`
      if (syncKey !== lastSyncedVideoKey) {
        setVideoSyncing(true)
        try {
          const saved = await syncVideoToGallery({
            provider,
            videoId,
            sourceUrl: val,
            previewImage,
            embedUrl,
          })

          if (saved) {
            setLastSyncedVideoKey(syncKey)
            setFiles((prev) => prev.map((item) => {
              if (item.virtualKey !== virtualFile.virtualKey) return item
              return {
                ...item,
                url: saved.thumbnailURL || item.url,
                sourceVideoUrl: saved.url || item.sourceVideoUrl,
                persistedVideoId: saved.videoID,
                persistedGalleryItemId: saved.galleryItemID,
              }
            }))
            showMessage("Video added to gallery.")
          }
        } catch (err) {
          showError(err.message || "Failed to attach video to blog gallery.")
        } finally {
          setVideoSyncing(false)
        }
      }
    }
  }

  const handleSaveVideoMeta = async () => {
    setSavingVideoMeta(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      setVideoMetaDirty(false)
      showMessage("Video metadata saved.")
    } catch {
      showError("Failed to save video metadata.")
    } finally {
      setSavingVideoMeta(false)
    }
  }

  const handleSaveVideoCredits = async () => {
    if (!selectedFile?.isVideoPreview) return
    setSavingVideoCredits(true)
    try {
      const key = normalizeUrl(selectedFile.url)
      const videoId = toNumber(selectedFile?.persistedVideoId)
      if (!videoId) {
        throw new Error("Save or attach the video to gallery first, then save credits.")
      }

      const payload = {
        credits: buildCreditsSavePayload(videoCredits, defaultRoleID),
      }

      const res = await fetch(`${api_url}picture/video/${videoId}/credits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        if (res.status === 404) {
          throw new Error("Credits endpoint not found (404). Restart the API server so the latest routes are loaded.")
        }
        throw new Error(errorData?.message || errorData?.error || "Failed to save video credits.")
      }

      const savedRows = await res.json()
      const mapped = mapApiCreditsToEditorRows(savedRows)
      const next = { ...creditsByUrl, [key]: mapped }
      setCreditsByUrl(next)
      setVideoCredits(mapped.length ? mapped : [makeEmptyCreditRow("Copyright Owner", defaultRoleID)])
      localStorage.setItem(localCreditsKey, JSON.stringify(next))
      setVideoCreditsDirty(false)
      showMessage("Video credits saved.")
    } catch (err) {
      showError(err.message || "Failed to save video credits.")
    } finally {
      setSavingVideoCredits(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">{title}</h2>
          <p className="text-sm text-base-content/60">Editing {normalizedFolderKind} media for {entityLabel || `${entityType} #${entityId}`}</p>
        </div>

        {error ? <div className="alert alert-error text-sm">{error}</div> : null}
        {message ? <div className="alert alert-success text-sm">{message}</div> : null}

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className={`rounded-md border-2 border-dashed p-4 transition-colors ${isDragOver ? "border-primary bg-primary/10" : "border-base-300 bg-base-200"}`}
              onDragOver={(e) => {
                e.preventDefault()
                if (dragIndexRef.current === null) setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragOver(false)
                if (dragIndexRef.current === null) uploadFiles(e.dataTransfer.files)
              }}
            >
              <div className="font-semibold mb-1">Upload to {normalizedFolderKind}</div>
              <div className="text-xs text-base-content/60 mb-3 font-mono">{galleryPrefix}</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  uploadFiles(e.target.files)
                  e.target.value = ""
                }}
              />
              <button type="button" className="btn btn-sm btn-outline" onClick={() => fileInputRef.current?.click()} disabled={uploadLoading}>
                {uploadLoading ? (uploadProgress ? `Uploading ${uploadProgress}...` : "Uploading...") : "Choose & Upload"}
              </button>
            </div>

            {canPostVideo && (
            <div className="rounded-md border border-base-300 bg-base-200 p-4 space-y-2">
              <div className="font-semibold text-sm">Post video URL</div>
              <input className={defaultFieldClass} placeholder="Paste a Vimeo or YouTube URL" value={videoUrl} onChange={(e) => { void handleVideoUrlChange(e.target.value) }} />
              <div className="flex items-center gap-2">
                {videoProvider ? <div className="badge badge-outline capitalize">{videoProvider}</div> : <div className="text-xs text-base-content/60">Auto-detects Vimeo/YouTube after paste.</div>}
                {videoSyncing ? <span className="loading loading-spinner loading-xs" /> : null}
              </div>
            </div>
            )}
          </div>

          {uploadError ? <div className="alert alert-error text-sm">{uploadError}</div> : null}
          {uploadMessage ? <div className="alert alert-success text-sm break-all">{uploadMessage}</div> : null}

          <div className="border border-base-300 rounded-md">
            <div className="px-3 py-2 border-b border-base-300 text-sm font-semibold flex justify-between items-center">
              <span>{folderDisplayName} Images ({files.length})</span>
              <div className="flex items-center gap-2">
                <button type="button" className="btn btn-xs btn-outline" onClick={() => fileInputRef.current?.click()} disabled={uploadLoading}>
                  {uploadLoading ? "Uploading..." : "Upload"}
                </button>
                <button type="button" className="btn btn-xs btn-ghost" onClick={loadFiles} disabled={loadingFiles}>
                  {loadingFiles ? "Loading..." : "Refresh"}
                </button>
                {canManageOrder && orderDirty ? (
                  <button type="button" className="btn btn-xs btn-primary" onClick={handleSaveOrder} disabled={savingOrder}>
                    {savingOrder ? "Saving..." : "Save Order"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="max-h-136 overflow-auto">
              {files.length === 0 ? (
                <p className="text-base-content/60 text-sm py-4 text-center">{loadingFiles ? "Loading..." : "No images yet. Upload one above or from this panel."}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${file.virtualKey || "native"}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDragDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group rounded-md border-2 transition-colors cursor-grab active:cursor-grabbing ${selectedFile?.url === file.url ? "border-primary" : dragOverIndex === index ? "border-secondary border-dashed" : "border-base-300"}`}
                    >
                      <button type="button" className="w-full aspect-square block" onClick={() => selectImage(file)}>
                        <div className="relative w-full h-full min-h-20">
                          <Image src={file.thumbnailURL || file.url} alt={displayFileName(file.name)} fill sizes="160px" className="rounded-md object-cover" />
                        </div>
                      </button>

                      <div className="absolute top-1 left-1 badge badge-sm badge-neutral opacity-70 select-none pointer-events-none">{index + 1}</div>

                      <button
                        type="button"
                        className="absolute top-1 right-8 btn btn-xs btn-warning opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleArchive(file)}
                        title="Archive image"
                      >
                        A
                      </button>

                      <button
                        type="button"
                        className="absolute top-1 right-1 btn btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(file)}
                        disabled={!file?.isVideoPreview && deletingUrl === file.url}
                        title="Delete image"
                      >
                        {!file?.isVideoPreview && deletingUrl === file.url ? "..." : "X"}
                      </button>

                      <div className="text-[10px] truncate px-1 pb-0.5 text-base-content/70 select-none">{displayFileName(file.name)}</div>
                      <div className="text-[10px] px-1 pb-1 text-base-content/50 select-none">{formatSize(file.contentLength)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedFile ? (
          selectedFile?.isVideoPreview ? (
            <div className="space-y-4">
              {(videoMetaDirty || videoCreditsDirty) && (
                <div className="alert alert-warning text-sm">Unsaved changes detected. Please click Save before leaving this section.</div>
              )}

              {warningsDirty && (
                <div className="alert alert-warning text-sm">Unsaved content warning tags. Click Save Tags before leaving this section.</div>
              )}

              {videoPreviewUrl && (
                <div className="rounded-md border border-base-300 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <iframe src={videoPreviewUrl} className="w-full h-full" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Video preview" />
                </div>
              )}

              {videoPreviewUrl ? (
                <>
                  <div className="rounded-md border border-base-300 bg-base-200 p-3 space-y-3">
                    <div className="font-semibold text-sm">Video Metadata</div>
                    <input className={defaultFieldClass} placeholder="Title" value={videoMeta.title} onChange={(e) => { setVideoMetaDirty(true); setVideoMeta((m) => ({ ...m, title: e.target.value })) }} />
                    <input className={defaultFieldClass} placeholder="Byline" value={videoMeta.byline} onChange={(e) => { setVideoMetaDirty(true); setVideoMeta((m) => ({ ...m, byline: e.target.value })) }} />
                    <textarea className="textarea textarea-bordered w-full" rows={2} placeholder="Description" value={videoMeta.description} onChange={(e) => { setVideoMetaDirty(true); setVideoMeta((m) => ({ ...m, description: e.target.value })) }} />

                    <div className="form-control">
                      <label className="label pb-0"><span className="label-text text-xs">Submitted by</span></label>
                      <input className="input input-bordered w-full bg-base-300 cursor-not-allowed" value={currentUserLabel} readOnly tabIndex={-1} />
                    </div>

                    <div className="flex justify-end">
                      <button type="button" className="btn btn-sm btn-primary" onClick={handleSaveVideoMeta} disabled={savingVideoMeta}>
                        {savingVideoMeta ? "Saving..." : "Save Video"}
                      </button>
                    </div>
                  </div>

                  <CreditsAdder
                    credits={videoCredits}
                    onChange={(next) => { setVideoCredits(next); setVideoCreditsDirty(true) }}
                    artists={artists}
                    users={users}
                    onSave={handleSaveVideoCredits}
                    saving={savingVideoCredits}
                    roleOptions={roleOptions}
                    defaultRoleID={defaultRoleID}
                    onDirty={() => setVideoCreditsDirty(true)}
                    currentUser={currentUser}
                  />

                  <div className="rounded-md border border-base-300 bg-base-200 p-3 space-y-3">
                    <div className="font-semibold text-sm">Content Warning Tags</div>
                    <p className="text-xs text-base-content/60">Use existing warning taxonomy tags for this media.</p>

                    <div className="flex flex-wrap gap-2">
                      {warningOptions.map((option) => {
                        const selected = selectedWarnings.includes(option.key)
                        return (
                          <button
                            key={option.key}
                            type="button"
                            className={`btn btn-xs ${selected ? "btn-primary" : "btn-outline"}`}
                            onClick={() => toggleWarning(option.key)}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>

                    {selectedWarnings.length > 0 ? (
                      <ContentTags warnings={selectedWarnings.map(warningKeyToLabel)} title="Selected Warnings" size="sm" />
                    ) : (
                      <div className="text-xs text-base-content/60">No warning tags selected.</div>
                    )}

                    <div className="flex justify-end">
                      <button type="button" className="btn btn-sm btn-primary" onClick={handleSaveWarnings} disabled={savingWarnings}>
                        {savingWarnings ? "Saving..." : "Save Tags"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-base-content/60">Enter a valid Vimeo or YouTube URL above to preview and add metadata.</div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {(picMetaDirty || picCreditsDirty) && (
                <div className="alert alert-warning text-sm">Unsaved changes detected. Please click Save before leaving this section.</div>
              )}

              {warningsDirty && (
                <div className="alert alert-warning text-sm">Unsaved content warning tags. Click Save Tags before leaving this section.</div>
              )}

              <>
                <div className="relative h-48 w-full rounded-md overflow-hidden bg-base-200 border border-base-300">
                  <Image src={selectedFile.url} alt={displayFileName(selectedFile.name)} fill style={{ objectFit: "contain" }} />
                </div>

                <div className="text-xs text-base-content/60 font-mono">{displayFileName(selectedFile.name)}</div>

                <div className="rounded-md border border-base-300 bg-base-200 p-3 space-y-3">
                  <div className="font-semibold text-sm">Image Metadata</div>
                  <input className={defaultFieldClass} placeholder="Title" value={picMetadata.title} onChange={(e) => { setPicMetaDirty(true); setPicMetadata((m) => ({ ...m, title: e.target.value })) }} />
                  <input className={defaultFieldClass} placeholder="Alt text" value={picMetadata.altText} onChange={(e) => { setPicMetaDirty(true); setPicMetadata((m) => ({ ...m, altText: e.target.value })) }} />
                  <input className={defaultFieldClass} placeholder="Byline" value={picMetadata.byline} onChange={(e) => { setPicMetaDirty(true); setPicMetadata((m) => ({ ...m, byline: e.target.value })) }} />
                  <textarea className="textarea textarea-bordered w-full" rows={2} placeholder="Description" value={picMetadata.description} onChange={(e) => { setPicMetaDirty(true); setPicMetadata((m) => ({ ...m, description: e.target.value })) }} />

                  <div className="form-control">
                    <label className="label pb-0"><span className="label-text text-xs">Uploaded by</span></label>
                    <input className="input input-bordered w-full bg-base-300 cursor-not-allowed" value={currentUserLabel} readOnly tabIndex={-1} />
                  </div>

                  <div className="flex justify-end">
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleSavePicMeta} disabled={savingPicMeta}>
                      {savingPicMeta ? "Saving..." : "Save Metadata"}
                    </button>
                  </div>
                </div>

                <CreditsAdder
                  credits={picCredits}
                  onChange={(next) => { setPicCredits(next); setPicCreditsDirty(true) }}
                  artists={artists}
                  users={users}
                  onSave={handleSavePicCredits}
                  saving={savingPicCredits}
                  roleOptions={roleOptions}
                  defaultRoleID={defaultRoleID}
                  onDirty={() => setPicCreditsDirty(true)}
                  currentUser={currentUser}
                />

                <div className="rounded-md border border-base-300 bg-base-200 p-3 space-y-3">
                  <div className="font-semibold text-sm">Content Warning Tags</div>
                  <p className="text-xs text-base-content/60">Use existing warning taxonomy tags for this media.</p>

                  <div className="flex flex-wrap gap-2">
                    {warningOptions.map((option) => {
                      const selected = selectedWarnings.includes(option.key)
                      return (
                        <button
                          key={option.key}
                          type="button"
                          className={`btn btn-xs ${selected ? "btn-primary" : "btn-outline"}`}
                          onClick={() => toggleWarning(option.key)}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>

                  {selectedWarnings.length > 0 ? (
                    <ContentTags warnings={selectedWarnings.map(warningKeyToLabel)} title="Selected Warnings" size="sm" />
                  ) : (
                    <div className="text-xs text-base-content/60">No warning tags selected.</div>
                  )}

                  <div className="flex justify-end">
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleSaveWarnings} disabled={savingWarnings}>
                      {savingWarnings ? "Saving..." : "Save Tags"}
                    </button>
                  </div>
                </div>
              </>
            </div>
          )
        ) : (
          <div className="text-sm text-base-content/60 py-2">Select an image or video tile from the gallery above to edit metadata and credits.</div>
        )}
      </div>
    </div>
  )
}

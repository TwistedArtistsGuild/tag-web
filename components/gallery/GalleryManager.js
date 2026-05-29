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

function CreditsAdder({ credits, onChange, artists, onSave, saving, roleOptions, defaultRoleID, onDirty }) {
  const [picker, setPicker] = useState({ open: false, index: null, artist: null })
  const searchTimersRef = useRef({})

  const updateCredit = useCallback((index, updates) => {
    onChange(credits.map((c, i) => (i === index ? { ...c, ...updates } : c)))
    onDirty?.()
  }, [credits, onChange, onDirty])

  useEffect(() => {
    return () => {
      Object.values(searchTimersRef.current).forEach((id) => clearTimeout(id))
    }
  }, [])

  const handleArtistQueryChange = (index, query) => {
    updateCredit(index, { artistQuery: query })
    if (searchTimersRef.current[index]) clearTimeout(searchTimersRef.current[index])

    searchTimersRef.current[index] = setTimeout(() => {
      const lowered = String(query || "").toLowerCase().trim()
      const results = !lowered
        ? []
        : artists
            .filter((a) => {
              const stageName = String(a?.stageName || "").toLowerCase()
              const username = String(a?.username || "").toLowerCase()
              const preferredName = String(a?.preferredName || "").toLowerCase()
              const email = String(a?.emailOne || "").toLowerCase()
              return stageName.includes(lowered) || username.includes(lowered) || preferredName.includes(lowered) || email.includes(lowered)
            })
            .slice(0, 8)
      updateCredit(index, { artistResults: results })
    }, 300)
  }

  const addCredit = () => {
    onChange([...credits, makeEmptyCreditRow("", defaultRoleID)])
    onDirty?.()
  }

  const removeCredit = (index) => {
    onChange(credits.filter((_, i) => i !== index))
    onDirty?.()
  }

  const applyPickedArtist = () => {
    if (picker.index === null || !picker.artist) {
      setPicker({ open: false, index: null, artist: null })
      return
    }

    const artist = picker.artist
    updateCredit(picker.index, {
      selectedArtist: artist,
      artistQuery: artist.stageName || artist.username || "",
      artistResults: [],
      displayName: artist.stageName || artist.username || "",
      externalURL: artist.externalURL || artist.webSite || "",
      bioNote: artist.bioNote || "",
    })

    setPicker({ open: false, index: null, artist: null })
  }

  return (
    <>
      <div className="rounded-md border border-base-300 bg-base-200 p-3 space-y-3">
        <div className="font-semibold text-sm">Credits</div>

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

            {index > 0 && (
              <label className="form-control">
                <span className="label-text text-xs">Role</span>
                <select
                  className="select select-bordered w-full"
                  value={credit.creditRoleID || ""}
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
            )}

            <input
              className={defaultFieldClass}
              placeholder={index === 0 ? "Copyright owner name or entity" : "Display name"}
              value={credit.displayName}
              onChange={(e) => updateCredit(index, { displayName: e.target.value })}
            />

            {index > 0 && (
              <>
                <div className="flex gap-2">
                  <button type="button" className={`btn btn-xs ${credit.mode === "lookup" ? "btn-primary" : "btn-outline"}`} onClick={() => updateCredit(index, { mode: "lookup" })}>Artist Lookup</button>
                  <button type="button" className={`btn btn-xs ${credit.mode === "manual" ? "btn-primary" : "btn-outline"}`} onClick={() => updateCredit(index, { mode: "manual" })}>Manual Entry</button>
                </div>

                {credit.mode === "lookup" && (
                  <div className="relative">
                    <input
                      className={defaultFieldClass}
                      placeholder="Search by artist/user/profile..."
                      value={credit.artistQuery}
                      onChange={(e) => handleArtistQueryChange(index, e.target.value)}
                    />

                    {credit.artistResults?.length > 0 && (
                      <div className="absolute z-10 w-full bg-base-100 border border-base-300 rounded-md shadow-lg mt-1 max-h-40 overflow-auto">
                        {credit.artistResults.map((a) => (
                          <button
                            key={a.artistID || a.id || a.username}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-base-200 text-sm"
                            onClick={() => setPicker({ open: true, index, artist: a })}
                          >
                            {a.stageName || a.username || `Artist #${a.artistID}`}
                          </button>
                        ))}
                      </div>
                    )}

                    {credit.selectedArtist && <div className="badge badge-success mt-1">Selected: {credit.selectedArtist.stageName || credit.selectedArtist.username}</div>}
                  </div>
                )}

                <input className={defaultFieldClass} placeholder="External URL (optional)" value={credit.externalURL} onChange={(e) => updateCredit(index, { externalURL: e.target.value })} />
                <input className={defaultFieldClass} placeholder="Credit note (optional)" value={credit.bioNote} onChange={(e) => updateCredit(index, { bioNote: e.target.value })} />
              </>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button type="button" className="btn btn-sm btn-outline" onClick={addCredit}>+ Add Credit</button>
          <button type="button" className="btn btn-sm btn-secondary" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save Credits"}</button>
        </div>
      </div>

      {picker.open && picker.artist && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Use This Profile?</h3>
            <p className="text-sm mt-2">{picker.artist.stageName || picker.artist.username || "Unknown profile"}</p>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => setPicker({ open: false, index: null, artist: null })}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={applyPickedArtist}>Use Profile</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function GalleryManager({ entityType, entityId, entityLabel, currentUser }) {
  const galleryPrefix = `platformpics/${entityType}/${entityId}/gallery/`
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
    const entityFetchUrl = entityType === "blog"
      ? `${api_url}blog/${entityId}`
      : `${api_url}${entityType}/byID/${entityId}`
    try {
      const [entityRes, blobRes] = await Promise.all([
        fetch(entityFetchUrl),
        fetch(`/api/image/list?container=tagpictures&startPrefix=${encodeURIComponent(galleryPrefix)}&prefix=${encodeURIComponent(galleryPrefix)}`),
      ])

      const entityData = entityRes.ok ? await entityRes.json() : null
      const galleryItems = Array.isArray(entityData?.gallery?.galleryItems) ? entityData.gallery.galleryItems : []
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

      setFiles(Array.from(byUrl.values()))
    } catch (err) {
      showError(err.message)
    } finally {
      setLoadingFiles(false)
    }
  }, [entityType, entityId, galleryPrefix])

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
    fetch(`${api_url}artist`)
      .then((r) => r.json())
      .then((data) => setArtists(Array.isArray(data) ? data : []))
      .catch(() => {})

    fetch(`${api_url}blog/credit-roles`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCreditRoles(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const applySelectedFileData = useCallback((file) => {
    const key = normalizeUrl(file?.url)
    const pic = pictureByUrl[key]
    const cachedCredits = creditsByUrl[key]
    const cachedWarnings = warningsByUrl[key]

    setPicMetadata({
      title: pic?.title || pic?.Title || "",
      altText: pic?.altText || pic?.AltText || "",
      byline: pic?.byline || pic?.Byline || "",
      description: pic?.description || pic?.Description || "",
    })
    setPicMetaDirty(false)

    if (Array.isArray(cachedCredits) && cachedCredits.length) {
      setPicCredits(cachedCredits)
    } else {
      setPicCredits([makeEmptyCreditRow("Copyright Owner", defaultRoleID)])
    }
    setPicCreditsDirty(false)

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
        body: JSON.stringify({ imageUrl: file.url }),
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || d.message || "Delete failed")
      }

      setFiles((prev) => prev.filter((f) => f.url !== file.url))
      if (selectedFile?.url === file.url) setSelectedFile(null)
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
    if (!entityId || !files.length) return

    setSavingOrder(true)
    try {
      const payload = {
        items: files.map((file) => {
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
      const next = { ...creditsByUrl, [key]: picCredits }
      setCreditsByUrl(next)
      localStorage.setItem(localCreditsKey, JSON.stringify(next))
      setPicCreditsDirty(false)
      showMessage("Image credits saved.")
    } catch {
      showError("Failed to save credits.")
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
    setSavingVideoCredits(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      setVideoCreditsDirty(false)
      showMessage("Video credits saved.")
    } catch {
      showError("Failed to save video credits.")
    } finally {
      setSavingVideoCredits(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Gallery Manager</h2>
          <p className="text-sm text-base-content/60">Editing gallery for {entityLabel || `${entityType} #${entityId}`}</p>
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
              <div className="font-semibold mb-1">Upload to gallery</div>
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

            <div className="rounded-md border border-base-300 bg-base-200 p-4 space-y-2">
              <div className="font-semibold text-sm">Post video URL</div>
              <input className={defaultFieldClass} placeholder="Paste a Vimeo or YouTube URL" value={videoUrl} onChange={(e) => { void handleVideoUrlChange(e.target.value) }} />
              <div className="flex items-center gap-2">
                {videoProvider ? <div className="badge badge-outline capitalize">{videoProvider}</div> : <div className="text-xs text-base-content/60">Auto-detects Vimeo/YouTube after paste.</div>}
                {videoSyncing ? <span className="loading loading-spinner loading-xs" /> : null}
              </div>
            </div>
          </div>

          {uploadError ? <div className="alert alert-error text-sm">{uploadError}</div> : null}
          {uploadMessage ? <div className="alert alert-success text-sm break-all">{uploadMessage}</div> : null}

          <div className="border border-base-300 rounded-md">
            <div className="px-3 py-2 border-b border-base-300 text-sm font-semibold flex justify-between items-center">
              <span>Gallery Images ({files.length})</span>
              <div className="flex items-center gap-2">
                <button type="button" className="btn btn-xs btn-outline" onClick={() => fileInputRef.current?.click()} disabled={uploadLoading}>
                  {uploadLoading ? "Uploading..." : "Upload"}
                </button>
                <button type="button" className="btn btn-xs btn-ghost" onClick={loadFiles} disabled={loadingFiles}>
                  {loadingFiles ? "Loading..." : "Refresh"}
                </button>
                {orderDirty ? (
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
                      <input className="input input-bordered w-full bg-base-300 cursor-not-allowed" value={currentUser || ""} readOnly tabIndex={-1} />
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
                    onSave={handleSaveVideoCredits}
                    saving={savingVideoCredits}
                    roleOptions={roleOptions}
                    defaultRoleID={defaultRoleID}
                    onDirty={() => setVideoCreditsDirty(true)}
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
                    <input className="input input-bordered w-full bg-base-300 cursor-not-allowed" value={currentUser || ""} readOnly tabIndex={-1} />
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
                  onSave={handleSavePicCredits}
                  saving={savingPicCredits}
                  roleOptions={roleOptions}
                  defaultRoleID={defaultRoleID}
                  onDirty={() => setPicCreditsDirty(true)}
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

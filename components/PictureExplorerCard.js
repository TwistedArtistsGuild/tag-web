/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { defaultFieldClass } from "@/utils/formSettings"

const CONTAINER_CONFIGS = {
	"personal-blog": { container: "tagpictures", startPrefix: "platformpics/personalblogs/", label: "Personal Blog Media" },
	"artist-blog": { container: "tagpictures", startPrefix: "platformpics/usercontent/", label: "Artist Business Media" },
	listing: { container: "tagpictures", startPrefix: "platformpics/listings/", label: "Listing Media" },
	article: { container: "platformpics", startPrefix: "news/", label: "News Articles" },
}

const AVAILABLE_CONTAINERS = ["tagpictures", "platformpics"]

function normalizePrefix(value) {
	return String(value || "").replace(/^\/+/, "")
}

export default function PictureExplorerCard({ useCase = "personal-blog", title, allowContainerSwitch = false }) {
	const config = CONTAINER_CONFIGS[useCase] || CONTAINER_CONFIGS["personal-blog"]
	const [container, setContainer] = useState(config.container)
	const [startPrefixInput, setStartPrefixInput] = useState(config.startPrefix)
	const [activeStartPrefix, setActiveStartPrefix] = useState(config.startPrefix)
	const [prefix, setPrefix] = useState(config.startPrefix)
	const [directories, setDirectories] = useState([])
	const [files, setFiles] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [deleteLoading, setDeleteLoading] = useState("")
	const [renameLoading, setRenameLoading] = useState("")
	const [renameFile, setRenameFile] = useState(null)
	const [newName, setNewName] = useState("")
	const [copyMessage, setCopyMessage] = useState("")
	const [uploadLoading, setUploadLoading] = useState(false)
	const [uploadMessage, setUploadMessage] = useState("")
	const [uploadError, setUploadError] = useState("")
	const [isDragOver, setIsDragOver] = useState(false)
	const [selectedImageUrl, setSelectedImageUrl] = useState("")
	const [selectedImageName, setSelectedImageName] = useState("")
	const fileInputRef = useRef(null)

	const rootSegments = useMemo(() => activeStartPrefix.split("/").filter(Boolean), [activeStartPrefix])
	const currentSegments = useMemo(() => prefix.split("/").filter(Boolean), [prefix])
	const relativeSegments = useMemo(
		() => currentSegments.slice(rootSegments.length),
		[currentSegments, rootSegments]
	)

	const displayFolderName = (folderPath) => {
		const trimmed = folderPath.endsWith("/") ? folderPath.slice(0, -1) : folderPath
		return trimmed.split("/").pop() || folderPath
	}

	const displayFileName = (filePath) => {
		if (!prefix || !filePath.startsWith(prefix)) return filePath
		return filePath.slice(prefix.length)
	}

	const isImageFile = (file) => {
		if (file.contentType?.startsWith("image/")) return true
		const ext = file.name.split(".").pop()?.toLowerCase()
		return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)
	}

	const formatFileSize = (bytes) => {
		if (!bytes) return "0 B"
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
	}

	const loadDirectory = async (
		nextPrefix = prefix,
		nextStartPrefix = activeStartPrefix,
		targetContainer = container
	) => {
		setLoading(true)
		setError("")
		setCopyMessage("")

		try {
			const normalizedStartPrefix = normalizePrefix(nextStartPrefix)
			const normalizedPrefix = normalizePrefix(nextPrefix) || normalizedStartPrefix
			const params = new URLSearchParams()
			params.set("container", targetContainer)
			params.set("startPrefix", normalizedStartPrefix)
			params.set("prefix", normalizedPrefix)

			const response = await fetch(`/api/image/list?${params.toString()}`)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Unable to load directory")
			}

			setContainer(data.container || targetContainer)
			setActiveStartPrefix(data.startPrefix || normalizedStartPrefix)
			setPrefix(data.prefix || normalizedPrefix)
			setDirectories(data.directories || [])
			setFiles(data.files || [])

			const nextImageFiles = (data.files || []).filter((file) => isImageFile(file))
			if (nextImageFiles.length > 0) {
				setSelectedImageUrl(nextImageFiles[0].url)
				setSelectedImageName(nextImageFiles[0].name)
			} else {
				setSelectedImageUrl("")
				setSelectedImageName("")
			}
		} catch (loadError) {
			setDirectories([])
			setFiles([])
			setSelectedImageUrl("")
			setSelectedImageName("")
			setError(loadError.message)
		} finally {
			setLoading(false)
		}
	}

	const applyStartPrefix = () => {
		loadDirectory(startPrefixInput, startPrefixInput)
	}

	const handleContainerChange = (nextContainer) => {
		setContainer(nextContainer)
		const nextStartPrefix = ""
		setStartPrefixInput(nextStartPrefix)
		loadDirectory(nextStartPrefix, nextStartPrefix, nextContainer)
	}

	const goToRoot = () => {
		loadDirectory(activeStartPrefix, activeStartPrefix)
	}

	const goToParent = () => {
		if (currentSegments.length <= rootSegments.length) return
		const parent = `${currentSegments.slice(0, -1).join("/")}/`
		loadDirectory(parent, activeStartPrefix)
	}

	const goToBreadcrumb = (index) => {
		if (index < 0 || index >= relativeSegments.length) {
			goToRoot()
			return
		}
		const selected = `${[...rootSegments, ...relativeSegments.slice(0, index + 1)].join("/")}/`
		loadDirectory(selected, activeStartPrefix)
	}

	const handleDelete = async (fileUrl, fileName) => {
		setDeleteLoading(fileUrl)
		setError("")

		try {
			const response = await fetch("/api/image/delete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imageUrl: fileUrl }),
			})
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.error || data.message || "Delete failed")
			}
			await loadDirectory(prefix, activeStartPrefix)
		} catch (deleteError) {
			setError(deleteError.message)
		} finally {
			setDeleteLoading("")
		}
	}

	const handleRename = async () => {
		if (!renameFile || !newName.trim()) return
		setRenameLoading(true)
		setError("")

		try {
			const response = await fetch("/api/image/rename", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					container,
					oldName: renameFile.name,
					newName: `${prefix}${newName.trim()}`,
				}),
			})
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.error || "Rename failed")
			}
			setRenameFile(null)
			setNewName("")
			await loadDirectory(prefix, activeStartPrefix)
		} catch (renameError) {
			setError(renameError.message)
		} finally {
			setRenameLoading(false)
		}
	}

	const handleCopyUrl = async (url) => {
		setCopyMessage("")
		try {
			await navigator.clipboard.writeText(url)
			setCopyMessage("Copied full image URL to clipboard.")
		} catch {
			setCopyMessage("Unable to copy URL in this browser context.")
		}
	}

	const handleSelectImage = (file) => {
		if (!isImageFile(file)) return
		setSelectedImageUrl(file.url)
		setSelectedImageName(file.name)
	}

	const uploadFileToCurrentDirectory = async (imageFile) => {
		setUploadError("")
		setUploadMessage("")

		if (!imageFile) {
			setUploadError("No file selected.")
			return
		}

		setUploadLoading(true)
		try {
			const formData = new FormData()
			formData.append("file", imageFile)
			formData.append("container", container)
			formData.append("startPrefix", activeStartPrefix)
			formData.append("targetPrefix", prefix)

			const response = await fetch("/api/image/upload", {
				method: "POST",
				body: formData,
			})
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Upload failed")
			}

			setUploadMessage(`Uploaded to ${prefix || "/"}: ${data.url}`)
			await loadDirectory(prefix, activeStartPrefix)
		} catch (uploadErr) {
			setUploadError(uploadErr.message)
		} finally {
			setUploadLoading(false)
		}
	}

	const onDropZoneDrop = (event) => {
		event.preventDefault()
		setIsDragOver(false)
		const droppedFile = event.dataTransfer?.files?.[0]
		if (droppedFile && droppedFile.type.startsWith("image/")) {
			uploadFileToCurrentDirectory(droppedFile)
		} else {
			setUploadError("Drop an image file to upload.")
		}
	}

	useEffect(() => {
		const initialize = setTimeout(() => {
			loadDirectory(config.startPrefix, config.startPrefix, config.container)
		}, 0)
		return () => clearTimeout(initialize)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCase])

	return (
		<div className="card bg-base-100 shadow-md border border-base-300">
			<div className="card-body gap-4">
				<h2 className="card-title">{title || config.label}</h2>

				{allowContainerSwitch && (
					<div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
						<div className="form-control md:col-span-3">
							<label className="label">Container</label>
							<select
								className={defaultFieldClass}
								value={container}
								onChange={(e) => handleContainerChange(e.target.value)}
							>
								{AVAILABLE_CONTAINERS.map((name) => (
									<option key={name} value={name}>
										{name}
									</option>
								))}
							</select>
						</div>
						<div className="form-control md:col-span-7">
							<label className="label">Start Directory (security boundary)</label>
							<input
								className={defaultFieldClass}
								value={startPrefixInput}
								onChange={(e) => setStartPrefixInput(e.target.value)}
								placeholder="e.g. platformpics/usercontent/ (cannot browse above this)"
							/>
						</div>
						<div className="md:col-span-2">
							<button className="btn btn-secondary w-full" type="button" onClick={applyStartPrefix}>
								Apply
							</button>
						</div>
					</div>
				)}

				<div className="rounded-md border border-base-300 bg-base-200 p-4">
					<div className="grid grid-cols-1 md:gap-6 md:grid-cols-[65%_35%]">
						<div>
							<div className="text-xs uppercase tracking-wide text-base-content/70 mb-2">Current Path</div>
							<div className="font-mono text-sm break-all bg-base-100 p-2 rounded mb-2">{prefix || "/"}</div>
							<div className="text-xs text-base-content/60 mb-2">Boundary: {activeStartPrefix || "/"}</div>
							<div className="flex flex-wrap gap-2">
								<button className="btn btn-xs btn-ghost" type="button" onClick={goToRoot}>
									Root
								</button>
								<button
									className="btn btn-xs btn-ghost"
									type="button"
									onClick={goToParent}
									disabled={currentSegments.length <= rootSegments.length}
								>
									Up
								</button>
								<button
									className="btn btn-xs btn-ghost"
									type="button"
									onClick={() => loadDirectory(prefix, activeStartPrefix)}
									disabled={loading}
								>
									{loading ? "Loading..." : "Refresh"}
								</button>
							</div>
							<div className="mt-2 flex flex-wrap gap-1">
								<button className="btn btn-xs btn-ghost" type="button" onClick={() => goToBreadcrumb(-1)}>
									/
								</button>
								{relativeSegments.map((segment, index) => (
									<button
										key={`${segment}-${index}`}
										className="btn btn-xs btn-ghost"
										type="button"
										onClick={() => goToBreadcrumb(index)}
									>
										{segment}/
									</button>
								))}
							</div>
						</div>

						<div
							className={`rounded-md border-2 border-dashed p-4 transition-colors ${
								isDragOver ? "border-primary bg-primary/10" : "border-base-100 bg-base-100"
							}`}
							onDragOver={(e) => {
								e.preventDefault()
								setIsDragOver(true)
							}}
							onDragLeave={() => setIsDragOver(false)}
							onDrop={onDropZoneDrop}
						>
							<div className="font-semibold mb-2">Upload to Current Directory</div>
							<div className="text-xs text-base-content/60 mb-3">Drop an image here, or choose a file.</div>
							<div className="flex gap-2">
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => uploadFileToCurrentDirectory(e.target.files?.[0] || null)}
								/>
								<button
									type="button"
									className="btn btn-sm btn-outline"
									onClick={() => fileInputRef.current?.click()}
									disabled={uploadLoading}
								>
									Choose File
								</button>
								<button
									type="button"
									className="btn btn-sm btn-primary"
									onClick={() => fileInputRef.current?.click()}
									disabled={uploadLoading}
								>
									{uploadLoading ? "Uploading..." : "Upload"}
								</button>
							</div>
						</div>
					</div>
				</div>

				{uploadError ? <div className="alert alert-error">{uploadError}</div> : null}
				{uploadMessage ? <div className="alert alert-success break-all">{uploadMessage}</div> : null}

				{error ? <div className="alert alert-error">{error}</div> : null}
				{copyMessage ? <div className="alert alert-success">{copyMessage}</div> : null}

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
					<div className="lg:col-span-4 border border-base-300 rounded-md">
						<div className="px-3 py-2 border-b border-base-300 text-sm font-semibold">Folders</div>
						<div className="max-h-80 overflow-auto p-2 space-y-1">
							<button
								type="button"
								className="btn btn-sm btn-ghost justify-start w-full"
								onClick={goToParent}
								disabled={currentSegments.length <= rootSegments.length}
							>
								..
							</button>
							{directories.map((directory) => (
								<button
									key={directory}
									type="button"
									className="btn btn-sm btn-ghost justify-start w-full"
									onClick={() => loadDirectory(directory, activeStartPrefix)}
								>
									{displayFolderName(directory)}
								</button>
							))}
							{directories.length === 0 ? (
								<div className="text-sm text-base-content/60 px-2 py-1">No subfolders</div>
							) : null}
						</div>
					</div>

					<div className="lg:col-span-8 border border-base-300 rounded-md">
						<div className="px-3 py-2 border-b border-base-300 text-sm font-semibold">Files ({files.length})</div>
						<div className="max-h-80 overflow-auto">
							<table className="table table-sm">
								<thead>
									<tr>
										<th>Preview</th>
										<th>Name (Click to preview)</th>
										<th>Size (KB/MB)</th>
										<th>Modified</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{files.map((file) => (
										<tr key={file.name} className={selectedImageUrl === file.url ? "bg-base-200" : ""}>
											<td>
												{isImageFile(file) ? (
													<button type="button" className="rounded" onClick={() => handleSelectImage(file)}>
														<Image
															src={file.url}
															alt={file.name}
															width={48}
															height={48}
															className="rounded object-cover"
														/>
													</button>
												) : (
													<span className="badge badge-ghost">file</span>
												)}
											</td>
											<td className="max-w-xs break-all">
												<button
													type="button"
													className="link link-hover"
													onClick={() => handleSelectImage(file)}
													disabled={!isImageFile(file)}
												>
													{displayFileName(file.name)}
												</button>
											</td>
											<td>{formatFileSize(file.contentLength || 0)}</td>
											<td>{file.lastModified ? new Date(file.lastModified).toLocaleString() : "-"}</td>
											<td>
												<div className="flex gap-2">
													{isImageFile(file) ? (
														<button
															type="button"
															className="btn btn-xs btn-outline"
															onClick={() => handleCopyUrl(file.url)}
														>
															Copy URL
														</button>
													) : null}
													<button
														type="button"
														className="btn btn-xs btn-outline"
														onClick={() => setRenameFile(file)}
													>
														Rename
													</button>
													<button
														type="button"
														className="btn btn-xs btn-error btn-outline"
														onClick={() => handleDelete(file.url, file.name)}
														disabled={deleteLoading === file.url}
													>
														{deleteLoading === file.url ? "Deleting..." : "Delete"}
													</button>
												</div>
											</td>
										</tr>
									))}
									{files.length === 0 ? (
										<tr>
											<td colSpan={5} className="text-base-content/60">
												No files in this folder.
											</td>
										</tr>
									) : null}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="rounded-md border border-base-300 bg-base-200 p-3">
					<div className="text-sm font-semibold mb-2">Selected Image Preview</div>
					{selectedImageUrl ? (
						<>
							<div className="text-xs text-base-content/70 mb-2 break-all">{displayFileName(selectedImageName)}</div>
							<div className="relative h-[70vh] w-full overflow-hidden rounded-md bg-base-100">
								<Image src={selectedImageUrl} alt={selectedImageName} fill style={{ objectFit: "contain" }} />
							</div>
							<div className="mt-2 flex justify-end">
								<button type="button" className="btn btn-sm btn-outline" onClick={() => handleCopyUrl(selectedImageUrl)}>
									Copy Full URL
								</button>
							</div>
						</>
					) : (
						<div className="text-sm text-base-content/60">Select an image row above to preview it here.</div>
					)}
				</div>

				{renameFile && (
					<div className="modal modal-open">
						<div className="modal-box">
							<h3 className="font-bold text-lg mb-4">Rename File</h3>
							<div className="form-control mb-4">
								<label className="label">
									<span className="label-text text-xs">Current name: {displayFileName(renameFile.name)}</span>
								</label>
								<input
									type="text"
									className={defaultFieldClass}
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									placeholder="New file name"
									onKeyDown={(e) => e.key === "Enter" && handleRename()}
									autoFocus
								/>
							</div>
							<div className="modal-action">
								<button
									type="button"
									className="btn"
									onClick={() => {
										setRenameFile(null)
										setNewName("")
									}}
								>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleRename}
									disabled={renameLoading || !newName.trim()}
								>
									{renameLoading ? "Renaming..." : "Rename"}
								</button>
							</div>
						</div>
						<div className="modal-backdrop" onClick={() => setRenameFile(null)} />
					</div>
				)}
			</div>
		</div>
	)
}

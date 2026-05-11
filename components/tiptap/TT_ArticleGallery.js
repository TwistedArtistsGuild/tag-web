/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import TTArticle from "@/components/tiptap/TT_Article";

const PhotoGallery = dynamic(() => import("@/components/cards/card_photoGallery"), { ssr: false });

function isImageFile(file) {
	const ext = String(file?.name || "").split(".").pop()?.toLowerCase();
	return (
		file?.contentType?.startsWith("image/") ||
		["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)
	);
}

function buildListParams(container, startPrefix, prefix) {
	const params = new URLSearchParams();
	params.set("container", container || "tagpictures");
	params.set("startPrefix", (startPrefix || "").replace(/^\/+/, ""));
	params.set("prefix", (prefix || startPrefix || "").replace(/^\/+/, ""));
	return params.toString();
}

function deriveInitialConfig(uploadContext = {}) {
	const explicitStart = String(uploadContext?.startPrefix || "").replace(/^\/+/, "");
	const explicitTarget = String(uploadContext?.targetPrefix || "").replace(/^\/+/, "");
	const containerRoot = "platformpics/";

	// Honor explicit prefixes first when provided by caller.
	if (explicitStart || explicitTarget) {
		const startPrefix = explicitStart || containerRoot;
		const prefix = explicitTarget || startPrefix;
		return {
			container: uploadContext?.container || "tagpictures",
			startPrefix,
			prefix,
		};
	}

	// Generic fallback: root prefix unless caller supplies explicit start/target prefixes.
	const targetPrefix = containerRoot;

	return {
		container: uploadContext?.container || "tagpictures",
		startPrefix: containerRoot,
		prefix: targetPrefix,
	};
}

function decodeGalleryPayload(encoded) {
	if (!encoded) return null;

	try {
		const decoded = decodeURIComponent(encoded);
		const parsed = JSON.parse(decoded);
		if (Array.isArray(parsed)) {
			return {
				id: "",
				images: parsed.filter(Boolean),
				size: "large",
				placement: "center",
			};
		}

		return {
			id: String(parsed?.id || ""),
			images: Array.isArray(parsed?.images) ? parsed.images.filter(Boolean) : [],
			size: String(parsed?.size || "large"),
			placement: String(parsed?.placement || "center"),
		};
	} catch {
		return null;
	}
}

function escapeRegex(value) {
	return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findGalleryEntryById(content, galleryId) {
	if (!galleryId) return null;

	const regex = /\[\[TAG_GALLERY:([^\]]+)\]\]/g;
	let match = regex.exec(String(content || ""));

	while (match) {
		const encoded = match[1];
		const payload = decodeGalleryPayload(encoded);
		if (payload?.id === galleryId) {
			return { encoded, payload };
		}
		match = regex.exec(String(content || ""));
	}

	return null;
}

export default function TTArticleGallery({
	value,
	onChange,
	onSubmit,
	onCancel,
	actionPreset = "none",
	minHeight = 240,
	uploadContext,
	showAlignmentControls = true,
}) {
	const initialConfig = deriveInitialConfig(uploadContext);

	const [modalOpen, setModalOpen] = useState(false);
	const [selectorMode, setSelectorMode] = useState("gallery"); // gallery | single
	const [container] = useState(initialConfig.container);
	const [startPrefix] = useState(initialConfig.startPrefix);
	const [prefix, setPrefix] = useState(initialConfig.prefix);
	const [directories, setDirectories] = useState([]);
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [listError, setListError] = useState("");
	const [selected, setSelected] = useState([]); // [{ url, name }] in insertion order
	const [gallerySize, setGallerySize] = useState("large");
	const [galleryPlacement, setGalleryPlacement] = useState("center");
	const [editingGallery, setEditingGallery] = useState(null); // { id, encoded }
	const [dragIndex, setDragIndex] = useState(null);
	const editorRef = useRef(null);
	const singlePickResolverRef = useRef(null);

	const loadDirectory = useCallback(
		async (nextPrefix) => {
			setLoading(true);
			setListError("");
			try {
				const qs = buildListParams(container, startPrefix, nextPrefix);
				const res = await fetch(`/api/image/list?${qs}`);
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to list images");
				setPrefix(data.prefix || nextPrefix);
				setDirectories(data.directories || []);
				setFiles((data.files || []).filter(isImageFile));
			} catch (err) {
				setListError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[container, startPrefix]
	);

	const openGallerySelector = useCallback(() => {
		setSelectorMode("gallery");
		setModalOpen(true);
		loadDirectory(prefix);
	}, [loadDirectory, prefix]);

	const resolveSinglePick = useCallback((url) => {
		if (singlePickResolverRef.current) {
			singlePickResolverRef.current(url || null);
			singlePickResolverRef.current = null;
		}
	}, []);

	const openSingleSelector = useCallback(() => {
		setSelectorMode("single");
		setModalOpen(true);
		loadDirectory(prefix);

		return new Promise((resolve) => {
			singlePickResolverRef.current = resolve;
		});
	}, [loadDirectory, prefix]);

	const closeSelector = useCallback(() => {
		setModalOpen(false);
		setEditingGallery(null);
		if (selectorMode === "single") {
			resolveSinglePick(null);
		}
	}, [resolveSinglePick, selectorMode]);

	const goUp = () => {
		const segments = prefix.replace(/\/$/, "").split("/").filter(Boolean);
		if (segments.length <= startPrefix.replace(/\/$/, "").split("/").filter(Boolean).length) return;
		loadDirectory(segments.slice(0, -1).join("/") + "/");
	};

	const toggleSelect = (file) => {
		if (selectorMode === "single") {
			setModalOpen(false);
			resolveSinglePick(file?.url || null);
			return;
		}

		setSelected((prev) => {
			const exists = prev.find((s) => s.url === file.url);
			if (exists) return prev.filter((s) => s.url !== file.url);
			return [...prev, { url: file.url, name: file.name }];
		});
	};

	// --- drag-to-reorder in the selected tray ---
	const handleDragStart = (index) => setDragIndex(index);

	const handleDragOver = (event, overIndex) => {
		event.preventDefault();
		if (dragIndex === null || dragIndex === overIndex) return;
		setSelected((prev) => {
			const next = [...prev];
			const [item] = next.splice(dragIndex, 1);
			next.splice(overIndex, 0, item);
			return next;
		});
		setDragIndex(overIndex);
	};

	const handleDragEnd = () => setDragIndex(null);

	const insertImages = useCallback(() => {
		if (!selected.length) return;

		// Tiptap strips unknown HTML nodes/attrs that are not in schema, so persist as plain text token.
		const galleryId = editingGallery?.id || `g${Date.now().toString(36)}`;
		const payload = {
			id: galleryId,
			images: selected.map((img) => img.url),
			size: gallerySize,
			placement: galleryPlacement,
		};
		const encodedPayload = encodeURIComponent(JSON.stringify(payload));
		const previewLabel = `${selected.length} image${selected.length !== 1 ? "s" : ""}`;
		const chipHref = `#tag-gallery-${galleryId}`;
		const previewText = `<a href="${chipHref}" title="Edit this gallery">🖼 Edit Gallery [${galleryId}]</a> <span>(${previewLabel} | ${gallerySize} | ${galleryPlacement})</span>`;
		const newToken = `[[TAG_GALLERY:${encodedPayload}]]`;
		const galleryHtml = `<p>${previewText}</p><p>${newToken}</p><p></p>`;

		if (editingGallery?.encoded) {
			const oldToken = `[[TAG_GALLERY:${editingGallery.encoded}]]`;
			const previewRegex = new RegExp(
				`<p[^>]*>(?:(?!<\\/p>).)*#tag-gallery-${escapeRegex(galleryId)}(?:(?!<\\/p>).)*<\\/p>`,
				"i"
			);
			let updated = String(value || "");
			updated = updated.replace(oldToken, newToken);
			updated = updated.replace(previewRegex, `<p>${previewText}</p>`);
			onChange(updated);
		} else {
			// If an article editor ref is available, insert; otherwise append to value
			if (editorRef.current?.insertHtml) {
				editorRef.current.insertHtml(galleryHtml);
			} else {
				const current = value || "";
				onChange(current + galleryHtml);
			}
		}

		setSelected([]);
		setEditingGallery(null);
		setModalOpen(false);
	}, [selected, gallerySize, galleryPlacement, editingGallery, value, onChange]);

	const handleGalleryPreviewClick = useCallback((galleryId) => {
		const entry = findGalleryEntryById(value, galleryId);
		if (!entry?.payload?.images?.length) {
			return;
		}

		setSelectorMode("gallery");
		setEditingGallery({ id: galleryId, encoded: entry.encoded });
		setSelected(entry.payload.images.map((url) => ({
			url,
			name: String(url).split("/").pop() || "image",
		})));
		setGallerySize(entry.payload.size || "large");
		setGalleryPlacement(entry.payload.placement || "center");
		setModalOpen(true);
		loadDirectory(prefix);
	}, [loadDirectory, prefix, value]);

	const previewItems = selected.map((s) => ({ original: s.url, thumbnail: s.url }));

	const picturesButton = (
		<button
			type="button"
			className="btn btn-xs h-8 min-h-8 px-2 normal-case btn-ghost border border-base-300 gap-1"
			onClick={openGallerySelector}
		>
			<span className="inline-flex items-center gap-1 text-xs font-semibold">
				<span>Gallery</span>
				<span aria-hidden="true">↗</span>
			</span>
		</button>
	);

	return (
		<div className="space-y-2">
			<style jsx global>{`
				.ProseMirror a[href^="#tag-gallery-"] {
					display: inline-flex;
					align-items: center;
					gap: 0.35rem;
					padding: 0.2rem 0.6rem;
					border-radius: 9999px;
					border: 1px solid color-mix(in oklab, var(--color-primary, hsl(var(--p))) 45%, transparent);
					background: color-mix(in oklab, var(--color-primary, hsl(var(--p))) 12%, transparent);
					font-size: 0.78rem;
					font-weight: 600;
					line-height: 1.2;
					text-decoration: none;
					cursor: pointer;
				}

				.ProseMirror a[href^="#tag-gallery-"]:hover {
					background: color-mix(in oklab, var(--color-primary, hsl(var(--p))) 18%, transparent);
				}
			`}</style>

			{/* Article editor with Pictures button injected into toolbar */}
			<TTArticle
				value={value}
				onChange={onChange}
				onSubmit={onSubmit}
				onCancel={onCancel}
				actionPreset={actionPreset}
				minHeight={minHeight}
				uploadContext={uploadContext}
				showAlignmentControls={showAlignmentControls}
				mediaToolbarSlot={picturesButton}
				onPickImageFromLibrary={openSingleSelector}
				onGalleryPreviewClick={handleGalleryPreviewClick}
			/>

			{/* Picture selector modal */}
			{modalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					onClick={(e) => { if (e.target === e.currentTarget) closeSelector(); }}
				>
					<div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
						{/* Modal header */}
						<div className="flex items-center justify-between px-5 py-3 border-b border-base-300">
							<h2 className="text-lg font-semibold">
								{selectorMode === "single" ? "Select a Single Image" : "Select Pictures to Insert as Gallery"}
							</h2>
							<button
								type="button"
								className="btn btn-sm btn-ghost btn-square"
								onClick={closeSelector}
								aria-label="Close"
							>
								✕
							</button>
						</div>

						<div className="flex flex-col md:flex-row flex-1 overflow-hidden">
							{/* Left panel – browser */}
							<div className="flex-1 overflow-y-auto p-4 border-r border-base-300">
								{/* Path / nav */}
								<div className="flex items-center gap-2 mb-3 text-sm flex-wrap">
									<span className="font-mono text-base-content/60 break-all">{prefix || "/"}</span>
									<button
										type="button"
										className="btn btn-xs btn-ghost"
										onClick={goUp}
										disabled={
											prefix.replace(/\/$/, "").split("/").filter(Boolean).length <=
											startPrefix.replace(/\/$/, "").split("/").filter(Boolean).length
										}
									>
										↑ Up
									</button>
									<button
										type="button"
										className="btn btn-xs btn-ghost"
										onClick={() => loadDirectory(prefix)}
										disabled={loading}
									>
										{loading ? "Loading…" : "Refresh"}
									</button>
								</div>

								{listError && (
									<p className="text-error text-sm mb-2">{listError}</p>
								)}

								{/* Directories */}
								{directories.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-3">
										{directories.map((dir) => (
											<button
												key={dir}
												type="button"
												className="btn btn-xs btn-ghost border border-base-300"
												onClick={() => loadDirectory(dir)}
											>
												📁 {dir.replace(prefix, "").replace(/\/$/, "") || dir}
											</button>
										))}
									</div>
								)}

								{/* Image grid */}
								{files.length === 0 && !loading && (
									<p className="text-base-content/50 text-sm">No images in this folder.</p>
								)}
								<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
									{files.map((file) => {
										const isSelected = selected.some((s) => s.url === file.url);
										const order = selected.findIndex((s) => s.url === file.url);
										return (
											<button
												key={file.url}
												type="button"
												onClick={() => toggleSelect(file)}
												className={`relative rounded-lg overflow-hidden border-2 transition-all ${
													isSelected
														? "border-primary ring-2 ring-primary/30"
														: "border-base-300 hover:border-primary/50"
												}`}
											>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={file.url}
													alt={file.name}
													className="w-full aspect-square object-cover"
												/>
												{isSelected && (
													<span className="absolute top-1 right-1 bg-primary text-primary-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
														{order + 1}
													</span>
												)}
											</button>
										);
									})}
								</div>
							</div>

							{/* Right panel – selected / preview */}
							{selectorMode === "gallery" ? (
							<div className="w-full md:w-64 flex flex-col p-4 gap-3 overflow-y-auto">
								<p className="text-sm font-semibold">
									Selected ({selected.length}) — drag to reorder
								</p>

								{selected.length === 0 && (
									<p className="text-base-content/50 text-sm">None yet. Click images on the left.</p>
								)}

								{/* Ordered tray */}
								<div className="flex flex-col gap-2">
									{selected.map((img, idx) => (
										<div
											key={img.url}
											draggable
											onDragStart={() => handleDragStart(idx)}
											onDragOver={(e) => handleDragOver(e, idx)}
											onDragEnd={handleDragEnd}
											className={`flex items-center gap-2 rounded-lg border border-base-300 p-1 bg-base-200 cursor-grab ${
												dragIndex === idx ? "opacity-50" : ""
											}`}
										>
											<span className="text-xs font-bold text-primary w-4 text-center shrink-0">
												{idx + 1}
											</span>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={img.url}
												alt={img.name}
												className="w-10 h-10 object-cover rounded"
											/>
											<span className="text-xs truncate flex-1">{img.name.split("/").pop()}</span>
											<button
												type="button"
												className="btn btn-xs btn-ghost text-error"
												onClick={() => toggleSelect(img)}
												aria-label="Remove"
											>
												✕
											</button>
										</div>
									))}
								</div>

								{/* Preview using existing PhotoGallery component */}
								{selected.length > 0 && (
									<div className="mt-2">
										<div className="mb-3 space-y-2">
											<p className="text-xs text-base-content/60">Gallery Layout</p>
											<div className="grid grid-cols-2 gap-2">
												<label className="form-control">
													<span className="label-text text-xs mb-1">Size</span>
													<select
														className="select select-bordered select-xs w-full"
														value={gallerySize}
														onChange={(e) => setGallerySize(e.target.value)}
													>
														<option value="small">Small</option>
														<option value="medium">Medium</option>
														<option value="large">Large</option>
														<option value="full">Full Width</option>
													</select>
												</label>
												<label className="form-control">
													<span className="label-text text-xs mb-1">Placement</span>
													<select
														className="select select-bordered select-xs w-full"
														value={galleryPlacement}
														onChange={(e) => setGalleryPlacement(e.target.value)}
													>
														<option value="left">Left</option>
														<option value="center">Center</option>
														<option value="right">Right</option>
													</select>
												</label>
											</div>
										</div>
										<p className="text-xs text-base-content/60 mb-1">Preview</p>
										<PhotoGallery
											images={previewItems}
											mode="standalone"
											navigationMode="manual"
											imageEffect="landscape"
											showThumbnails={selected.length > 1}
										/>
									</div>
								)}
							</div>
							) : (
							<div className="w-full md:w-64 p-4">
								<p className="text-sm text-base-content/70">
									Click any image on the left to insert it immediately.
								</p>
							</div>
							)}
						</div>

						{/* Modal footer */}
						<div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-base-300">
							<button
								type="button"
								className="btn btn-ghost btn-sm"
								onClick={() => { setSelected([]); closeSelector(); }}
							>
								Cancel
							</button>
							{selectorMode === "gallery" && (
								<button
									type="button"
									className="btn btn-primary btn-sm"
									disabled={selected.length === 0}
									onClick={insertImages}
								>
									Insert {selected.length > 0 ? `${selected.length} ` : ""}Image{selected.length !== 1 ? "s" : ""}
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

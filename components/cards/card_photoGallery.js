/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/image-gallery.css';
import { CARD_SHELL_CLASS } from "@/components/cards/sizes/panel-layout";
import MediaCreditsCard from "@/components/forms/media-credits";
import ContentTags, { ContentWarningMediaGate } from "@/components/social/ContentTags";
import { useMemo, useState } from "react";

const NAV_MODES = {
	hover: {
		autoPlay: false,
		showNav: true,
		showPlayButton: false,
		showFullscreenButton: true,
		showControlsOnHover: true,
	},
	manual: {
		autoPlay: false,
		showNav: true,
		showPlayButton: false,
		showFullscreenButton: true,
		showControlsOnHover: false,
	},
	auto: {
		autoPlay: true,
		showNav: false,
		showPlayButton: false,
		showFullscreenButton: false,
		showControlsOnHover: false,
	},
	both: {
		autoPlay: true,
		showNav: true,
		showPlayButton: true,
		showFullscreenButton: true,
		showControlsOnHover: false,
	},
};

const IMAGE_EFFECTS = ["landscape", "portrait", "circle"];

const normalizeNavMode = (mode) => {
	if (NAV_MODES[mode]) {
		return mode;
	}
	return "hover";
};

const normalizeImageEffect = (effect) => {
	if (IMAGE_EFFECTS.includes(effect)) {
		return effect;
	}
	return "landscape";
};

const isVideoMedia = (item) => {
	if (!item) return false;
	const mediaType = String(item.mediaType || "").toLowerCase();
	if (mediaType === "video") return true;
	const source = String(item.sourceURL || item.embedURL || item.original || "").toLowerCase();
	return source.includes("vimeo.com") || source.includes("youtube.com") || source.includes("youtu.be");
};

const toEmbedUrl = (item) => {
	const explicit = String(item?.embedURL || "").trim();
	if (explicit) {
		if (explicit.includes("player.vimeo.com") || explicit.includes("youtube.com/embed/")) {
			return explicit;
		}
		const vimeoMatch = explicit.match(/vimeo\.com\/(\d+)/i);
		if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
		const ytMatch = explicit.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/i);
		if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
	}

	const source = String(item?.sourceURL || item?.original || "").trim();
	if (!source) return "";
	const vimeoMatch = source.match(/vimeo\.com\/(\d+)/i);
	if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
	const ytMatch = source.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/i);
	if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
	return "";
};

/**
 * @desc A reusable photo gallery component styled with daisyUI and Tailwind CSS.
 * @param {object} props - Contains the images array for the gallery.
 */
const PhotoGallery = ({
	images,
	mode = "embedded",
	shellClassName = "",
	navigationMode = "hover",
	imageEffect = "landscape",
	slideInterval = 3500,
	showThumbnails = true,
	contentWarnings = [],
	hasViewerConsent = false,
	onConsent,
	showContentWarnings = true,
	contentWarningTitle = "Content Warnings",
	contentWarningSize = "sm",
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAttributionModal, setShowAttributionModal] = useState(false);
	const [localViewerConsent, setLocalViewerConsent] = useState(Boolean(hasViewerConsent));
	const imageList = useMemo(() => (Array.isArray(images) ? images : images ? [images] : []), [images]);
	const galleryItems = useMemo(
		() =>
			imageList.map((image) => {
				if (typeof image === "string") {
					return { original: image, thumbnail: image };
				}

				if (image?.original) {
					const normalized = { ...image };
					if (isVideoMedia(normalized)) {
						const embedUrl = toEmbedUrl(normalized);
						if (embedUrl) {
							normalized.renderItem = () => (
								<div className="custom-gallery-video-frame">
									<iframe
										src={embedUrl}
										title={normalized.description || "Embedded video"}
										className="custom-gallery-video-iframe"
										frameBorder="0"
										allow="autoplay; fullscreen; picture-in-picture"
										allowFullScreen
									/>
								</div>
							);
						}
					}
					return normalized;
				}

				const fallback = image?.url || "/blank_image.png";
				const normalized = {
					original: fallback,
					thumbnail: image?.thumbnail || fallback,
					mediaType: image?.mediaType,
					sourceURL: image?.sourceURL,
					embedURL: image?.embedURL,
					description: image?.description,
					attribution: image?.attribution,
					photographer: image?.photographer,
					copyright: image?.copyright,
					makeup: image?.makeup,
					credits: image?.credits,
				};

				if (isVideoMedia(normalized)) {
					const embedUrl = toEmbedUrl(normalized);
					if (embedUrl) {
						normalized.renderItem = () => (
							<div className="custom-gallery-video-frame">
								<iframe
									src={embedUrl}
									title={normalized.description || "Embedded video"}
									className="custom-gallery-video-iframe"
									frameBorder="0"
									allow="autoplay; fullscreen; picture-in-picture"
									allowFullScreen
								/>
							</div>
						);
					}
				}

				return normalized;
			}),
		[imageList],
	);

	const normalizedNavMode = normalizeNavMode(navigationMode);
	const normalizedEffect = normalizeImageEffect(imageEffect);
	const navConfig = NAV_MODES[normalizedNavMode];
	const hasMultipleItems = galleryItems.length > 1;
	const singleImageControlsHidden = !hasMultipleItems && !isHovered && !isFullscreen;
	const hoverControlsHidden = (navConfig.showControlsOnHover && !isHovered && !isFullscreen) || singleImageControlsHidden;
	const galleryClassName = `custom-gallery custom-gallery--${normalizedEffect}`;
	const safeCurrentIndex = currentIndex < galleryItems.length ? currentIndex : 0;
	const currentImageAttribution = galleryItems[safeCurrentIndex];
	const showInfoControl = galleryItems.length > 0;
	const hasAttributionData =
		(Array.isArray(currentImageAttribution?.credits) && currentImageAttribution.credits.length > 0) ||
		currentImageAttribution?.photographer ||
		currentImageAttribution?.copyright ||
		currentImageAttribution?.makeup ||
		currentImageAttribution?.attribution;

	const fallbackCredits = [
		currentImageAttribution?.copyright
			? { role: "Copyright Owner", name: currentImageAttribution.copyright }
			: null,
		currentImageAttribution?.photographer
			? { role: "Photographer / Videographer", name: currentImageAttribution.photographer }
			: null,
		currentImageAttribution?.makeup
			? { role: "Additional Production Credits", name: currentImageAttribution.makeup }
			: null,
		currentImageAttribution?.attribution
			? { role: "Attribution Notes", note: currentImageAttribution.attribution, name: "Notes" }
			: null,
	].filter(Boolean);

	const modalCredits =
		Array.isArray(currentImageAttribution?.credits) && currentImageAttribution.credits.length > 0
			? currentImageAttribution.credits
			: fallbackCredits;

	const effectiveConsent = hasViewerConsent || localViewerConsent;
	const hasWarnings = Array.isArray(contentWarnings) && contentWarnings.length > 0;

	const galleryMarkup = (
		<div className={`custom-gallery-host relative ${hoverControlsHidden ? "custom-gallery-host--controls-hidden" : ""}`}>
			<div
				className="gallery-container-inner"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<ImageGallery
					items={galleryItems}
					showThumbnails={showThumbnails && hasMultipleItems}
					showFullscreenButton={navConfig.showFullscreenButton}
					showPlayButton={navConfig.showPlayButton && hasMultipleItems}
					autoPlay={navConfig.autoPlay && hasMultipleItems}
					slideInterval={slideInterval}
					additionalClass={galleryClassName}
					infinite={true}
					showNav={navConfig.showNav && hasMultipleItems}
					onSlide={(index) => setCurrentIndex(index)}
					onScreenChange={(isFull) => setIsFullscreen(Boolean(isFull))}
					renderCustomControls={() =>
						showInfoControl ? (
							<button
								type="button"
								className="image-gallery-custom-info-control absolute top-4 right-4 z-60 inline-flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100/95 text-base-content shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-base-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pointer-events-auto"
								onClick={(event) => {
									event.stopPropagation();
									setShowAttributionModal(true);
								}}
								title="Open credits and attribution details"
								aria-label="Open credits and attribution details"
							>
								<span aria-hidden="true" className="font-serif text-xl italic font-semibold leading-none -translate-y-px">i</span>
							</button>
						) : null
					}
				/>
			</div>
		</div>
	);

	const moderatedGalleryMarkup = hasWarnings ? (
		<div className="space-y-0">
			{showContentWarnings && (
				<ContentTags
					warnings={contentWarnings}
					title={contentWarningTitle}
					size={contentWarningSize}
				/>
			)}
			<ContentWarningMediaGate
				warnings={contentWarnings}
				hasViewerConsent={effectiveConsent}
				onConsent={() => {
					if (typeof onConsent === "function") {
						onConsent();
					}
					setLocalViewerConsent(true);
				}}
			>
				{galleryMarkup}
			</ContentWarningMediaGate>
		</div>
	) : galleryMarkup;

	const attributionModal = showAttributionModal ? (
		<div className="modal modal-open modal-bottom z-10000 sm:modal-middle">
			<div className="modal-box max-w-2xl">
				<h3 className="text-lg font-bold">Media Credits and Ownership</h3>
				<p className="mt-2 text-sm text-base-content/80">
					This media asset may include intellectual property and contributor rights. Please retain
					ownership and contributor credits when reusing or publishing this content.
				</p>

				<div className="mt-4">
					<MediaCreditsCard
						title="Credits"
						credits={modalCredits}
						size="large"
						emptyLabel="No credit metadata is available yet for this media."
					/>
				</div>

				{!hasAttributionData && (
					<p className="mt-4 text-sm text-base-content/70">
						No attribution metadata is available yet for the current image.
					</p>
				)}

				<div className="modal-action">
					<button type="button" className="btn btn-sm" onClick={() => setShowAttributionModal(false)}>
						Close
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop" onClick={() => setShowAttributionModal(false)}>
				<button type="button">close</button>
			</form>
		</div>
	) : null;

	if (mode === "standalone") {
		return (
			<>
				{moderatedGalleryMarkup}
				{attributionModal}
				<style jsx global>{`
					.custom-gallery-host {
						position: relative;
						width: 100%;
					}
					.gallery-container-inner {
						position: relative;
						width: 100%;
					}
					.custom-gallery-host .image-gallery {
						margin-inline: auto;
						width: 100%;
					}
					.custom-gallery .image-gallery-image {
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.custom-gallery .image-gallery-slide {
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.custom-gallery .image-gallery-slide img {
						border-radius: 0.5rem;
						border: 0.125rem solid color-mix(in oklab, var(--color-base-content, hsl(var(--bc))) 25%, transparent);
						object-fit: cover;
					}
					.custom-gallery--landscape .image-gallery-slide img {
						aspect-ratio: 16 / 9;
						width: 100%;
					}
					.custom-gallery--portrait .image-gallery-slide img {
						aspect-ratio: 3 / 4;
						width: 100%;
						max-width: 20rem;
					}
					.custom-gallery--circle .image-gallery-slide img {
						aspect-ratio: 1 / 1;
						border-radius: 9999px;
						width: 100%;
						max-width: 18rem;
						object-fit: cover;
					}
					.custom-gallery .image-gallery-thumbnail img {
						width: 6.25rem !important;
						height: 4.125rem !important;
						border: 0.0625rem solid color-mix(in oklab, var(--color-base-content, hsl(var(--bc))) 30%, transparent);
						margin: 0.3125rem;
					}
					.custom-gallery .image-gallery-thumbnails-wrapper {
						margin-top: 1rem;
					}
					.custom-gallery-host--controls-hidden .image-gallery-left-nav,
					.custom-gallery-host--controls-hidden .image-gallery-right-nav,
					.custom-gallery-host--controls-hidden .image-gallery-fullscreen-button,
					.custom-gallery-host--controls-hidden .image-gallery-play-button,
					.custom-gallery-host--controls-hidden .image-gallery-custom-info-control {
						opacity: 0;
						pointer-events: none;
					}
					.custom-gallery-video-frame {
						position: relative;
						width: 100%;
						aspect-ratio: 16 / 9;
						border-radius: 0.5rem;
						overflow: hidden;
						border: 0.125rem solid color-mix(in oklab, var(--color-base-content, hsl(var(--bc))) 25%, transparent);
						background: color-mix(in oklab, var(--color-base-200, hsl(var(--b2))) 75%, black);
					}
					.custom-gallery-video-iframe {
						width: 100%;
						height: 100%;
					}
				`}</style>
			</>
		);
	}

	return (
		<div className={`${CARD_SHELL_CLASS} ${shellClassName}`}>
			<div className="card-body p-4 md:p-6">
				{moderatedGalleryMarkup}
			</div>
			{attributionModal}
			<style jsx global>{`
				.custom-gallery-host {
					position: relative;
					width: 100%;
				}
				.gallery-container-inner {
					position: relative;
					width: 100%;
				}
				.custom-gallery-host .image-gallery {
					margin-inline: auto;
					width: 100%;
				}
				.custom-gallery .image-gallery-image {
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.custom-gallery .image-gallery-slide {
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.custom-gallery .image-gallery-slide img {
					border-radius: 0.5rem;
					border: 0.125rem solid color-mix(in oklab, var(--color-base-content, hsl(var(--bc))) 25%, transparent);
					object-fit: cover;
				}
				.custom-gallery--landscape .image-gallery-slide img {
					aspect-ratio: 16 / 9;
					width: 100%;
				}
				.custom-gallery--portrait .image-gallery-slide img {
					aspect-ratio: 3 / 4;
					width: 100%;
					max-width: 20rem;
				}
				.custom-gallery--circle .image-gallery-slide img {
					aspect-ratio: 1 / 1;
					border-radius: 9999px;
					width: 100%;
					max-width: 18rem;
					object-fit: cover;
				}
				.custom-gallery .image-gallery-thumbnail img {
					width: 6.25rem !important;
					height: 4.125rem !important;
					border: 0.0625rem solid color-mix(in oklab, var(--color-base-content, hsl(var(--bc))) 30%, transparent);
					margin: 0.3125rem;
				}
				.custom-gallery .image-gallery-thumbnails-wrapper {
					margin-top: 1rem;
				}
				.custom-gallery-host--controls-hidden .image-gallery-left-nav,
				.custom-gallery-host--controls-hidden .image-gallery-right-nav,
				.custom-gallery-host--controls-hidden .image-gallery-fullscreen-button,
				.custom-gallery-host--controls-hidden .image-gallery-play-button,
				.custom-gallery-host--controls-hidden .image-gallery-custom-info-control {
					opacity: 0;
					pointer-events: none;
				}
				.custom-gallery-video-frame {
					position: relative;
					width: 100%;
					aspect-ratio: 16 / 9;
					border-radius: 0.5rem;
					overflow: hidden;
					border: 0.125rem solid color-mix(in oklab, var(--color-base-content, hsl(var(--bc))) 25%, transparent);
					background: color-mix(in oklab, var(--color-base-200, hsl(var(--b2))) 75%, black);
				}
				.custom-gallery-video-iframe {
					width: 100%;
					height: 100%;
				}
			`}</style>
		</div>
	);
};

export default PhotoGallery;


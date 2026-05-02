/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/image-gallery.css';
import { CARD_SHELL_CLASS } from "@/components/cards/sizes/panel-layout";
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
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAttributionModal, setShowAttributionModal] = useState(false);
	const imageList = useMemo(() => (Array.isArray(images) ? images : images ? [images] : []), [images]);
	const galleryItems = useMemo(
		() =>
			imageList.map((image) => {
				if (typeof image === "string") {
					return { original: image, thumbnail: image };
				}

				if (image?.original) {
					return image;
				}

				const fallback = image?.url || "/blank_image.png";
				return {
					original: fallback,
					thumbnail: image?.thumbnail || fallback,
					description: image?.description,
					attribution: image?.attribution,
					photographer: image?.photographer,
					copyright: image?.copyright,
					makeup: image?.makeup,
				};
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
	const showInfoControl = (isFullscreen || !hoverControlsHidden) && (navConfig.showFullscreenButton || (navConfig.showNav && hasMultipleItems));
	const hasAttributionData =
		currentImageAttribution?.photographer ||
		currentImageAttribution?.copyright ||
		currentImageAttribution?.makeup ||
		currentImageAttribution?.attribution;

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
								className="image-gallery-custom-info-control absolute bottom-4 left-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100/95 text-base-content shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-base-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pointer-events-auto"
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

	const attributionModal = showAttributionModal ? (
		<div className="modal modal-open modal-bottom z-10000 sm:modal-middle">
			<div className="modal-box max-w-2xl">
				<h3 className="text-lg font-bold">Media Credits and Ownership</h3>
				<p className="mt-2 text-sm text-base-content/80">
					This media asset may include intellectual property and contributor rights. Please retain
					ownership and contributor credits when reusing or publishing this content.
				</p>

				<div className="mt-4 grid gap-3 sm:grid-cols-2">
					<div className="rounded-lg border border-base-300 bg-base-100 p-3">
						<h4 className="text-xs font-semibold uppercase tracking-wide text-primary">Copyright Ownership</h4>
						<p className="mt-1 text-sm text-base-content/85">
							{currentImageAttribution?.copyright || "No copyright ownership details were supplied for this asset."}
						</p>
					</div>

					<div className="rounded-lg border border-base-300 bg-base-100 p-3">
						<h4 className="text-xs font-semibold uppercase tracking-wide text-primary">Photographer / Videographer</h4>
						<p className="mt-1 text-sm text-base-content/85">
							{currentImageAttribution?.photographer || "No photographer or videographer credit was supplied."}
						</p>
					</div>

					<div className="rounded-lg border border-base-300 bg-base-100 p-3">
						<h4 className="text-xs font-semibold uppercase tracking-wide text-primary">Additional Production Credits</h4>
						<p className="mt-1 text-sm text-base-content/85">
							{currentImageAttribution?.makeup || "No makeup, set design, styling, or related production credits were supplied."}
						</p>
					</div>

					<div className="rounded-lg border border-base-300 bg-base-100 p-3">
						<h4 className="text-xs font-semibold uppercase tracking-wide text-primary">General Attribution Notes</h4>
						<p className="mt-1 text-sm text-base-content/85">
							{currentImageAttribution?.attribution || "No additional attribution notes were supplied for this asset."}
						</p>
					</div>
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
				{galleryMarkup}
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
					.custom-gallery-host--controls-hidden .image-gallery-play-button {
						opacity: 0;
						pointer-events: none;
					}
				`}</style>
			</>
		);
	}

	return (
		<div className={`${CARD_SHELL_CLASS} ${shellClassName}`}>
			<div className="card-body p-4 md:p-6">
				{galleryMarkup}
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
				.custom-gallery-host--controls-hidden .image-gallery-play-button {
					opacity: 0;
					pointer-events: none;
				}
			`}</style>
		</div>
	);
};

export default PhotoGallery;


/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import PhotoGallery from "@/components/cards/card_photoGallery";
import SocialReactions from "@/components/social/Reactions";
import { CARD_SHELL_CLASS } from "@/components/cards/sizes/panel-layout";

const buildReactionSeed = (count, emoji, prefix) => {
	const safeCount = Math.max(0, Number(count) || 0);
	const displayCount = Math.min(safeCount, 24);
	return Array.from({ length: displayCount }, (_, index) => ({
		emoji,
		userId: `${prefix}-${index + 1}`,
		username: `${prefix}${index + 1}`,
		timestamp: new Date(2026, 0, 1 + index).toISOString(),
	}));
};

const getArtistLogoSrc = (artist) => artist?.profilePic?.url || "/blank_image.png";

const getArtistDescription = (artist) =>
	artist?.description ||
	artist?.roleSummary ||
	artist?.byline ||
	artist?.biography ||
	"Creative portfolio and artist highlights.";

const getArtistGalleryImages = (artist) => {
	if (Array.isArray(artist?.images) && artist.images.length > 0) {
		return artist.images;
	}

	const fallback = artist?.profilePic?.url || "/blank_image.png";
	return [fallback];
};

const getArtistContentGalleryImages = (artist) => {
	const metadataCollections = [
		artist?.pictureMetadata,
		artist?.imageMetadata,
		artist?.imagesMetadata,
		artist?.contentImages,
		artist?.content,
	];

	const metadataUrls = metadataCollections
		.flatMap((collection) => (Array.isArray(collection) ? collection : []))
		.map((item) => {
			if (typeof item === "string") return item;
			return item?.contentUrl || item?.contentURL || item?.url || item?.src || "";
		})
		.map((url) => String(url || "").trim())
		.filter(Boolean);

	if (metadataUrls.length > 0) {
		return metadataUrls;
	}

	return getArtistGalleryImages(artist);
};

const formatSinceMonthYear = (value) => {
	if (!value) {
		return "n/a";
	}

	if (typeof value === "number" || /^\d{4}$/.test(String(value).trim())) {
		const year = String(value).trim();
		const parsed = new Date(`${year}-01-01T00:00:00Z`);
		if (!Number.isNaN(parsed.getTime())) {
			return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(parsed);
		}
	}

	const parsed = new Date(value);
	if (!Number.isNaN(parsed.getTime())) {
		return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(parsed);
	}

	return String(value);
};

const ArtistCard = ({ artist, compact = false }) => {
	const [logoSrc, setLogoSrc] = useState(getArtistLogoSrc(artist));
	const artistDescription = getArtistDescription(artist);
	const galleryImages = useMemo(() => getArtistGalleryImages(artist), [artist]);
	const contentGalleryImages = useMemo(() => getArtistContentGalleryImages(artist), [artist]);
	const artistId = artist?.artistid || artist?.path || artist?.title || "artist";
	const panelSize = artist?.panelSize || "third";
	const isLargePanel = ["twoThirds", "threeQuarters", "full"].includes(panelSize);
	const isMediumPanel = panelSize === "half";

	const metadataSummary = useMemo(() => {
		const categoryCount = Array.isArray(artist?.artistCategoryLinks) ? artist.artistCategoryLinks.length : 0;
		const seoTags = Array.isArray(artist?.seoTags)
			? artist.seoTags.map((tag) => String(tag).trim()).filter(Boolean)
			: typeof artist?.seoTags === "string" && artist.seoTags.trim().length > 0
				? artist.seoTags.split(",").map((tag) => tag.trim()).filter(Boolean)
				: [];

		return {
			since: formatSinceMonthYear(artist?.since),
			categoryCount,
			seoTags,
		};
	}, [artist]);

	const detailRows = useMemo(() => {
		const rows = [];

		if (artist?.roleSummary) {
			rows.push({ label: "Role", value: artist.roleSummary });
		}

		if (Array.isArray(artist?.artForms) && artist.artForms.length > 0) {
			rows.push({ label: "Art Forms", value: artist.artForms.join(", ") });
		}

		return rows;
	}, [artist]);

	const initialReactions = useMemo(
		() => [
			...buildReactionSeed(artist?.loves, "❤️", `love-${artistId}`),
			...buildReactionSeed(artist?.likes, "👏", `clap-${artistId}`),
			...buildReactionSeed(artist?.followers, "🔥", `fire-${artistId}`),
		],
		[artist?.followers, artist?.likes, artist?.loves, artistId],
	);

	return (
		<article className={`${CARD_SHELL_CLASS} h-auto self-start w-full overflow-hidden`}>
			<div className={`card-body ${compact ? "gap-2 p-3" : "gap-4 p-4"}`}>
				{!compact && (
					<PhotoGallery
						images={galleryImages}
						mode="standalone"
						navigationMode={galleryImages.length > 1 ? "hover" : "manual"}
						imageEffect="landscape"
						showThumbnails={false}
					/>
				)}

				<div className={`flex items-start ${compact ? "gap-2" : "gap-3"}`}>
					<div className="avatar mt-0.5">
						<div className={`${compact ? "w-9" : "w-11"} rounded-full border-2 border-base-300 bg-base-200`}>
							<Image
								src={logoSrc}
								alt={artist?.profilePic?.alttext || `${artist?.title || "Artist"} logo`}
								width={compact ? 36 : 44}
								height={compact ? 36 : 44}
								onError={() => setLogoSrc("/blank_image.png")}
								style={{ objectFit: "cover" }}
							/>
						</div>
					</div>
					<div className="min-w-0">
						<h3 className={`${compact ? "text-base" : "text-lg"} font-semibold text-primary leading-tight`}>
							<Link href={`/artists/${artist?.path || ""}`} className="hover:underline">
								{artist?.title || "Untitled Artist"}
							</Link>
						</h3>
						<p className={`${compact ? "mt-0.5 text-xs line-clamp-2" : "mt-1 text-sm leading-relaxed"} text-base-content/70`}>{artistDescription}</p>
					</div>
				</div>

				<div className={compact ? "" : "mt-1"}>
					<SocialReactions
						targetId={`artist-${artistId}`}
						targetType="post"
						initialReactions={initialReactions}
						readOnly
						showDetails={!compact}
						size="sm"
					/>
				</div>

				<div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
					<span className="badge badge-outline badge-sm">Since: {metadataSummary.since}</span>
					{(isMediumPanel || isLargePanel) && (
						<span className="badge badge-outline badge-sm">Categories: {metadataSummary.categoryCount}</span>
					)}
					{(isMediumPanel || isLargePanel) && metadataSummary.seoTags.length > 0 && (
						metadataSummary.seoTags.slice(0, isLargePanel ? metadataSummary.seoTags.length : 3).map((tag) => (
							<span key={tag} className="badge badge-primary badge-sm badge-outline">{tag}</span>
						))
					)}
				</div>

				{!compact && (isMediumPanel || isLargePanel) && detailRows.length > 0 && (
					<div className="rounded-box border border-base-300 bg-base-100/70 p-3">
						<div className="space-y-2">
							{detailRows.slice(0, isLargePanel ? detailRows.length : 2).map((row) => (
								<div key={row.label} className="grid grid-cols-1 gap-1 sm:grid-cols-[7rem_1fr]">
									<span className="text-xs font-semibold uppercase tracking-wide text-primary/90">{row.label}</span>
									<p className="text-sm text-base-content/75 line-clamp-3">{row.value}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{!compact && (isMediumPanel || isLargePanel) && (
					<div className="rounded-box border border-base-300 bg-base-100/70 p-3">
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary/90">Image Content</p>
						<PhotoGallery
							images={contentGalleryImages}
							mode="standalone"
							navigationMode={contentGalleryImages.length > 1 ? "hover" : "manual"}
							imageEffect="landscape"
							showThumbnails={false}
						/>
					</div>
				)}


			</div>
		</article>
	);
};

export default ArtistCard;

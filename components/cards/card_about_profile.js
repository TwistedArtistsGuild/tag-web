/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Link from "next/link";
import PhotoGallery from "@/components/cards/card_photoGallery";
import { CARD_SHELL_CLASS, PANEL_SIZE_LABELS, PANEL_SIZES } from "@/components/cards/sizes/panel-layout";

export default function AboutProfileCard({
	profile,
	panelSize = "third",
	panelSizeOptions = PANEL_SIZES,
	isInteractive = false,
	isExpanded = false,
	onPanelSizeChange,
	onToggleExpand,
}) {
	const onCardClick = (event) => {
		if (!isInteractive) {
			return;
		}

		if (event.target.closest("a,button")) {
			return;
		}
		onToggleExpand?.(profile.slug);
	};

	const onCardKeyDown = (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onToggleExpand?.(profile.slug);
		}
	};

	const galleryImages = profile.images && profile.images.length > 0 ? profile.images : ["/blank_image.png"];

	return (
		<article
			className={`${CARD_SHELL_CLASS} hover:-translate-y-1 ${isInteractive ? "cursor-pointer" : ""}`}
			onClick={onCardClick}
			onKeyDown={isInteractive ? onCardKeyDown : undefined}
			tabIndex={isInteractive ? 0 : undefined}
		>
			<div className="card-body items-center text-center p-6">
				<div className="mb-4 flex w-full items-center justify-end gap-2">
					{isInteractive && (
						<div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
							<div className="join">
								{panelSizeOptions.map((size) => (
									<button
										key={size}
										type="button"
										className={`btn btn-xs join-item ${panelSize === size ? "btn-primary" : "btn-outline"}`}
										onClick={() => onPanelSizeChange?.(profile.slug, size)}
										title={`Set card size to ${PANEL_SIZE_LABELS[size] || size}`}
									>
										{PANEL_SIZE_LABELS[size] || size}
									</button>
								))}
							</div>
							<button
								type="button"
								className="btn btn-xs btn-ghost"
								onClick={() => onToggleExpand?.(profile.slug)}
							>
								{isExpanded ? "Collapse" : "Expand"}
							</button>
						</div>
					)}
				</div>
				<div className="w-full -mx-6 mb-4">
					<PhotoGallery
						images={galleryImages}
						mode="embedded"
						variantName=""
						navigationMode={galleryImages.length > 1 ? "hover" : "manual"}
						imageEffect="landscape"
						showThumbnails={false}
						showVariantBadge={false}
						shellClassName="border-0 shadow-none"
					/>
				</div>
				<h4 className="mt-2 text-xl font-bold text-primary">
					<Link href={`/about/us/${profile.slug}`} className="hover:underline">
						{profile.name}
					</Link>
				</h4>
				<p className="text-sm font-semibold text-base-content/80">{profile.title}</p>
				<p className="text-sm text-base-content/70">{profile.roleSummary}</p>
				<p className="text-sm text-base-content/70">
					<strong>Art Forms:</strong> {profile.artForms.join(", ")}
				</p>
				<div className="card-actions mt-4 justify-center gap-3">
					<Link href={`/about/us/${profile.slug}`} className="btn btn-primary btn-sm">
						Read Profile
					</Link>
					<a
						href={profile.linkToArtistPage}
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-outline btn-sm"
					>
						Artist Page
					</a>
				</div>
			</div>
		</article>
	);
}

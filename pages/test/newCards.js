/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import TagSEO from "@/components/TagSEO";
import profiles from "@/content/us/profiles";
import AboutProfileCard from "@/components/cards/card_about_profile";
import { getPanelClass } from "@/components/cards/sizes/panel-layout";
import PhotoGallery from "@/components/cards/card_photoGallery";
import ArtistCard from "@/components/cards/card_artist";
import ListingCard from "@/components/cards/card_listing";

export default function NewCardsTestPage() {
	const artistsForDemo = profiles.slice(0, 3).map((profile, index) => {
		const artistPath = profile.linkToArtistPage?.replace("/artists/", "") || profile.slug;
		const profileImage = profile.images?.[0] || "/blank_image.png";

		return {
			artistid: index + 1,
			path: artistPath,
			title: profile.name,
			byline: profile.roleSummary || profile.title,
			loves: 100 + (index + 1) * 7,
			likes: 65 + (index + 1) * 5,
			followers: 40 + (index + 1) * 3,
			profilePic: {
				url: profileImage,
				alttext: `${profile.name} preview image`,
			},
		};
	});

	const listingsForDemo = [
		{
			listingid: 1,
			path: "sunset-flow-mandala",
			title: "Sunset Flow Mandala",
			description: "A layered tie-dye mandala with warm gradients and hand-finished stitching.",
			created: "2026-04-12",
			loves: 34,
			likes: 28,
			followers: 15,
			artist: {
				path: "twistedpassions",
				title: "Bobb Shields",
			},
			artCategory: {
				category: "Wearable Art",
			},
			profilePic: {
				url: "https://tagpictures.blob.core.windows.net/aboutcontent/352758208_10167521936530573_1350574665168998075_n.jpg",
				alttext: "Tie-dye textile detail",
			},
		},
		{
			listingid: 2,
			path: "embers-in-motion",
			title: "Embers In Motion",
			description: "Performance series still showing long-exposure fire choreography and dynamic trails.",
			created: "2026-03-28",
			loves: 52,
			likes: 41,
			followers: 23,
			artist: {
				path: "twistedpassions",
				title: "TAG Performance Team",
			},
			artCategory: {
				category: "Performance Photography",
			},
			profilePic: {
				url: "https://tagpictures.blob.core.windows.net/aboutcontent/367448489_10167756207805573_115514317805409958_n.jpg",
				alttext: "Fire performance in motion",
			},
		},
		{
			listingid: 3,
			path: "studio-rituals",
			title: "Studio Rituals",
			description: "Behind-the-scenes visual diary of process sketches, palettes, and setup cues.",
			created: "2026-02-15",
			loves: 21,
			likes: 17,
			followers: 9,
			artist: {
				path: "satya",
				title: "Satya",
			},
			artCategory: {
				category: "Studio Practice",
			},
			profilePic: {
				url: "https://tagpictures.blob.core.windows.net/aboutcontent/283066084_10166159563465573_5133481584611622279_n.jpg",
				alttext: "Studio workspace overview",
			},
		},
	];

	const galleryImages = profiles.slice(0, 2).flatMap((profile) => profile.images || []);
	const singleGalleryImage = galleryImages[0] || "/blank_image.png";

	const pageMetaData = {
		title: "New Card Tester",
		description: "Static reference examples for panel layout and gallery behaviors",
		keywords: "cards, layouts, testing, panel sizing",
		robots: "noindex, nofollow",
		author: "Twisted Artists Guild",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "New Card Tester",
			description: "Interactive card sizing and expansion playground",
		},
	};

	return (
		<div className="container mx-auto max-w-6xl p-4 md:p-6">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="test/newCards" />

			<div className="mb-6">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold text-primary">Panel and Gallery Reference</h1>
					<p className="text-sm text-base-content/70 mt-1">
						Static examples for gallery, profile cards, artist cards, and art listing cards.
					</p>
				</div>
			</div>

			<h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Gallery Scenarios</h2>
			<div className="grid gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12 mb-10">
				<div className={getPanelClass("half")}>
					<div className="mb-2">
						<h3 className="font-semibold text-sm md:text-base text-base-content mb-1">Landscape + Hover Controls</h3>
						<p className="text-xs text-base-content/60">Hover to reveal navigation arrows and fullscreen button</p>
					</div>
					<PhotoGallery
						images={galleryImages}
						mode="embedded"
						imageEffect="landscape"
					/>
				</div>
				<div className={getPanelClass("half")}>
					<div className="mb-2">
						<h3 className="font-semibold text-sm md:text-base text-base-content mb-1">Portrait + Auto-Play</h3>
						<p className="text-xs text-base-content/60">Automatic slideshow; centered with 3:4 aspect ratio</p>
					</div>
					<PhotoGallery
						images={galleryImages}
						mode="embedded"
						navigationMode="auto"
						slideInterval={2500}
						imageEffect="portrait"
					/>
				</div>
				<div className={getPanelClass("half")}>
					<div className="mb-2">
						<h3 className="font-semibold text-sm md:text-base text-base-content mb-1">Circle + Both Controls</h3>
						<p className="text-xs text-base-content/60">Auto-play + always-visible controls; 1:1 aspect with rounded crop</p>
					</div>
					<PhotoGallery
						images={galleryImages}
						mode="embedded"
						navigationMode="both"
						imageEffect="circle"
					/>
				</div>
				<div className={getPanelClass("half")}>
					<div className="mb-2">
						<h3 className="font-semibold text-sm md:text-base text-base-content mb-1">Single Image Gallery</h3>
						<p className="text-xs text-base-content/60">No thumbnails or navigation (single image mode)</p>
					</div>
					<PhotoGallery
						images={singleGalleryImage}
						mode="embedded"
						imageEffect="landscape"
						showThumbnails={false}
						navigationMode="manual"
					/>
				</div>
			</div>

			<h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">About Profile Card Examples</h2>
			<p className="text-sm text-base-content/70 mb-4">Half-width profile cards shown in grid layout. Non-interactive display mode.</p>
			<div className="grid gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12 mb-10">
				{profiles.slice(0, 4).map((profile) => (
					<div key={profile.slug} className={getPanelClass("half")}>
						<AboutProfileCard profile={profile} />
					</div>
				))}
			</div>

			<h2 className="text-2xl md:text-3xl font-semibold text-primary mt-10 mb-4">Artist Card Examples</h2>
			<p className="text-sm text-base-content/70 mb-4">Artist profile cards with engagement metrics (followers, likes, loves). Responsive 1-2 column grid.</p>
			<div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-10">
				{artistsForDemo.map((artist) => (
					<div key={artist.artistid} className="w-full">
						<ArtistCard artist={artist} />
					</div>
				))}
			</div>

			<h2 className="text-2xl md:text-3xl font-semibold text-primary mt-10 mb-4">Art Listing Card Examples</h2>
			<p className="text-sm text-base-content/70 mb-4">Art piece and project listings with category, artist, and engagement info. Responsive 1-3 column grid.</p>
			<div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
				{listingsForDemo.map((listing) => (
					<div key={listing.listingid} className="w-full">
						<ListingCard listing={listing} />
					</div>
				))}
			</div>
		</div>
	);
}

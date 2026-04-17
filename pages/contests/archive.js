/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Link from "next/link"
import Image from "next/image"
import { getRandomStockPhotoByCategory } from "@/utils/stockPhotos"

const getRandomStockPhoto = () => getRandomStockPhotoByCategory("general")

const archivedContests = [
	{
		id: "halloween-2025",
		cadence: "Annual Contest",
		title: "Halloween Art Contest 2025",
		summary:
			"Based on community reactions in our Halloween showcase, this archive tracks the strongest performers and keeps them discoverable long after voting closed.",
		archiveLink: "/vote/vote_halloween",
		profileLink: "/artist/mystic-sculptor",
		listingLink: "/listing/witchs-brew-cauldron",
		imageUrl: getRandomStockPhotoByCategory("painting"),
		topFive: [
			{
				rank: 1,
				title: "Witch's Brew Cauldron",
				artist: "Mystic Sculptor",
				reactions: 150,
				imageUrl: getRandomStockPhotoByCategory("painting"),
			},
			{
				rank: 2,
				title: "Spooky Haunted Mansion",
				artist: "Ghostly Painter",
				reactions: 125,
				imageUrl: getRandomStockPhotoByCategory("general"),
			},
			{
				rank: 3,
				title: "Pumpkin Patch Nightmare",
				artist: "Carving King",
				reactions: 98,
				imageUrl: getRandomStockPhotoByCategory("artist"),
			},
			{
				rank: 4,
				title: "Zombie Apocalypse",
				artist: "Undead Illustrator",
				reactions: 80,
				imageUrl: getRandomStockPhotoByCategory("performance"),
			},
			{
				rank: 5,
				title: "Lanterns at Midnight",
				artist: "Velvet Nocturne",
				reactions: 73,
				imageUrl: getRandomStockPhotoByCategory("instrument"),
			},
		],
	},
	{
		id: "light-after-storm",
		cadence: "Quarterly Contest",
		title: "Light After Storm",
		summary:
			"A mixed-media cityscape cycle selected by layered community reactions. This archive preserves ranking outcomes and drives ongoing profile visits and listing discovery.",
		archiveLink: "/vote/archive/light-after-storm",
		profileLink: "/artist/riley-mercer",
		listingLink: "/listing/neon-harbor-at-dawn",
		imageUrl: getRandomStockPhotoByCategory("performance"),
		topFive: [
			{
				rank: 1,
				title: "Neon Harbor at Dawn",
				artist: "Riley Mercer",
				reactions: 112,
				imageUrl: getRandomStockPhotoByCategory("performance"),
			},
			{
				rank: 2,
				title: "Embers in the Rain",
				artist: "Nova Kline",
				reactions: 104,
				imageUrl: getRandomStockPhotoByCategory("general"),
			},
			{
				rank: 3,
				title: "Static Bloom",
				artist: "Ari Sol",
				reactions: 97,
				imageUrl: getRandomStockPhotoByCategory("artist"),
			},
			{
				rank: 4,
				title: "Paper Lantern Alley",
				artist: "Mina Ortega",
				reactions: 89,
				imageUrl: getRandomStockPhotoByCategory("painting"),
			},
			{
				rank: 5,
				title: "Blue Hour Transit",
				artist: "Kellan Rhys",
				reactions: 84,
				imageUrl: getRandomStockPhotoByCategory("instrument"),
			},
		],
	},
]

export default function VoteArchive() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 py-10 px-4">
			<div className="container mx-auto max-w-6xl">
				<section className="text-center mb-10">
					<h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-primary">Contest Archive</h1>
					<p className="text-xl text-secondary mb-4">A searchable record of artist wins, momentum, and visibility.</p>
					<p className="text-lg text-base-content max-w-4xl mx-auto">
						Archived contests stay public and indexable so participating artists keep receiving long-term discovery,
						backlink value, and profile traffic beyond the original contest window.
					</p>
					<div className="mt-8 rounded-box overflow-hidden shadow-xl max-w-4xl mx-auto">
						<div className="relative h-64 md:h-80 w-full">
							<Image src={getRandomStockPhoto()} alt="Archived artist contest highlights" fill style={{ objectFit: "cover" }} />
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					{archivedContests.map((contest) => (
						<article key={contest.id} className="card bg-base-100 shadow-xl rounded-box p-6">
							<figure className="relative h-52 w-full rounded-box overflow-hidden mb-5">
								<Image
									src={contest.imageUrl || "/placeholder.svg"}
									alt={contest.title}
									fill
									style={{ objectFit: "cover" }}
								/>
							</figure>
							<p className="text-sm uppercase tracking-wide text-secondary font-semibold mb-2">{contest.cadence}</p>
							<h2 className="text-3xl font-bold text-primary mb-3">{contest.title}</h2>
							<p className="text-base-content mb-4">{contest.summary}</p>

							<div className="bg-base-200 rounded-box p-4 mb-5 border border-base-300">
								<h3 className="text-lg font-bold text-primary mb-3">Top 5 Entries</h3>
								<div className="space-y-3">
									{contest.topFive.map((entry) => (
										<div key={`${contest.id}-${entry.rank}`} className="flex items-center gap-3 bg-base-100 rounded-box p-2">
											<figure className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0">
												<Image
													src={entry.imageUrl || "/placeholder.svg"}
													alt={entry.title}
													fill
													style={{ objectFit: "cover" }}
												/>
											</figure>
											<div className="min-w-0">
												<p className="text-sm font-semibold text-secondary">#{entry.rank}</p>
												<p className="font-semibold text-base-content truncate">{entry.title}</p>
												<p className="text-xs text-base-content/80">
													By {entry.artist} • {entry.reactions} reactions
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="flex flex-wrap gap-3">
								<Link href={contest.archiveLink} className="btn btn-primary btn-sm">
									View Contest Archive
								</Link>
								<Link href={contest.profileLink} className="btn btn-outline btn-sm">
									Artist Profile
								</Link>
								<Link href={contest.listingLink} className="btn btn-outline btn-sm">
									Winning Listing
								</Link>
							</div>
						</article>
					))}
				</section>

				<div className="text-center">
					<Link href="/vote" className="btn btn-secondary btn-lg">
						Back to Contest Hub
					</Link>
				</div>
			</div>
		</div>
	)
}

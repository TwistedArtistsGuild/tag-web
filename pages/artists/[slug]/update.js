/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import { useRouter } from "next/router"

import TagSEO from "@/components/TagSEO"

/**
 * Component for updating artist details.
 * @param {Object} props - Component properties
 * @param {Object} props.metadataProp - Form metadata
 * @param {Object} props.artistdata - Artist data
 * @param {string} props.slug - Artist slug
 * @returns {JSX.Element} - Rendered component
 */
export default function UpdateArtistForm1(props) {
	const router = useRouter();
	const { slug } = router.query;
	const artistSlug = slug || "";

	return (
		<div className="min-h-[60vh] p-6 md:p-10 bg-base-200">
			<TagSEO
				metadataProp={{
					title: "Artist Update Moved to Portal",
					description: "Artist profile editing now happens in the Artist Portal.",
					keywords: "artist, portal, update",
					og: {
						title: "Artist Update Moved to Portal",
						description: "Artist profile editing now happens in the Artist Portal.",
					},
				}}
				canonicalSlug="/artists/[slug]/update"
			/>
			<div className="max-w-3xl mx-auto card bg-base-100 shadow border border-base-300">
				<div className="card-body gap-4">
					<h1 className="text-2xl font-bold">This Update Page Has Moved</h1>
					<p className="text-base-content/80">
						If you own this artist profile, sign in to the Artist Portal to manage updates and media.
					</p>
					<div className="flex flex-wrap gap-2">
						{artistSlug ? (
							<Link href={`/portal/artist/${artistSlug}`} className="btn btn-primary">Open Artist Workspace</Link>
						) : null}
						<button type="button" className="btn btn-ghost" onClick={() => router.back()}>Go Back</button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { useRouter } from "next/router"
import TagSEO from "@/components/TagSEO"
import PhotoGallery from "@/components/cards/card_photoGallery"

export default function VendorPortalSlugIndex() {
	const router = useRouter()
	const { slug } = router.query
	const safeSlug = String(slug || "").trim()

	const pageMetaData = {
		title: "Vendor Gallery Workspace",
		description: "Vendor gallery placeholder workspace.",
		keywords: "vendor, gallery, portal",
		robots: "no-index, no-follow",
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug={`portal/vendor/${safeSlug}`} />

			<div className="mx-auto max-w-5xl space-y-6">
				<section className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body gap-4">
						<h1 className="text-2xl font-bold text-primary">Vendor Gallery Placeholder</h1>
						<p className="text-sm text-base-content/70">
							This location is gallery-ready. Vendor entity gallery links can attach later without reworking the UX surface.
						</p>

						<PhotoGallery
							images={["/blank_image.png"]}
							mode="standalone"
							navigationMode="manual"
							imageEffect="landscape"
							showThumbnails={false}
						/>

						<div className="alert alert-info">
							<span>Empty gallery slot deployed for vendor pages.</span>
						</div>

						<div className="flex gap-2 flex-wrap">
							<Link href={`/portal/vendor/${safeSlug}/edit`} className="btn btn-accent btn-sm">Edit Profile</Link>
							<Link href={`/portal/vendor/${safeSlug}/manage`} className="btn btn-primary btn-sm">Manage Gallery</Link>
							<Link href="/portal" className="btn btn-outline btn-sm">Back to Portal</Link>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

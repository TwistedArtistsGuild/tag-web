/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { useRouter } from "next/router"
import TagSEO from "@/components/TagSEO"
import PictureExplorerCard from "@/components/PictureExplorerCard"

export default function UserPortalSlugManage() {
	const router = useRouter()
	const { slug } = router.query
	const safeSlug = String(slug || "").trim()
	const startPrefix = safeSlug ? `/platformpics/user/${safeSlug}/gallery/` : null

	const pageMetaData = {
		title: "Manage User Gallery",
		description: "Placeholder management workspace for user gallery.",
		keywords: "user, gallery, manage",
		robots: "no-index, no-follow",
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug={`portal/user/${safeSlug}/manage`} />

			<div className="mx-auto max-w-5xl space-y-6">
				<section className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body gap-4">
						<h1 className="text-2xl font-bold text-primary">User Gallery Management</h1>
						<p className="text-sm text-base-content/70">
							Loose integration is enabled: files can be staged to a predictable path now, then linked to future entity-level gallery records after DB rollout.
						</p>

						{startPrefix ? (
							<PictureExplorerCard
								useCase="user-portal"
								startPrefix={startPrefix}
								allowContainerSwitch={false}
								preserveStartPrefixOnContainerSwitch={false}
							/>
						) : (
							<div className="alert alert-warning">
								<span>User slug is missing. Open this page from the user portal route.</span>
							</div>
						)}

						<div className="flex gap-2 flex-wrap">
							<Link href={`/portal/user/${safeSlug}`} className="btn btn-primary btn-sm">Back to User Gallery</Link>
							<button type="button" className="btn btn-outline btn-sm" onClick={() => router.back()}>Go Back</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

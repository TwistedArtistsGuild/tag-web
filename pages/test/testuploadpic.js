/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Link from "next/link"

import TagSEO from "@/components/TagSEO"

export default function UploadPicPage() {
	return (
		<div className="p-4 bg-base-200 min-h-screen">
			<TagSEO metadataProp={{ title: "Deprecated Upload Page", description: "This page has moved to picture management.", keywords: "deprecated, picture management", og: { title: "Deprecated Upload Page", description: "This page has moved to picture management." } }} canonicalSlug="test/testuploadpic" />
			<div className="max-w-2xl card bg-base-100 shadow-md border border-base-300">
				<div className="card-body">
					<h1 className="text-2xl font-bold">Deprecated Route</h1>
					<p>Picture upload moved to the consolidated Picture Management page.</p>
					<Link href="/test/pictureManagement" className="btn btn-primary w-fit">Go to /test/pictureManagement</Link>
				</div>
			</div>
		</div>
	)
}

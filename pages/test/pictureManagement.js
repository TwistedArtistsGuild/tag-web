/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import PictureExplorerCard from "@/components/PictureExplorerCard"
import TagSEO from "@/components/TagSEO"

export default function PictureManagement() {
	return (
		<div className="p-4 bg-base-200 min-h-screen">
			<TagSEO
				metadataProp={{
					title: "Picture Management",
					description: "Traditional file explorer for browsing and uploading Azure blobs within constrained start directories.",
					keywords: "image management, file explorer, blob storage",
					robots: "noindex, nofollow",
					og: {
						title: "Picture Management",
						description: "Traditional file explorer for browsing and uploading Azure blobs within constrained start directories.",
					},
				}}
				canonicalSlug="test/pictureManagement"
			/>

			<div className="max-w-7xl mx-auto space-y-6">
				<h1 className="text-3xl font-bold text-primary">Picture Management</h1>
				<PictureExplorerCard
					useCase="staff-portal"
					allowContainerSwitch={true}
					preserveStartPrefixOnContainerSwitch={false}
					creditsMode="smart-owner"
				/>
			</div>
		</div>
	)
}

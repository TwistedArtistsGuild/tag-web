/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

"use client"
 
import { useRouter } from "next/navigation"
import { defaultButtonClass } from "@/utils/formSettings"
import TagSEO from "@/components/TagSEO"
 
export default function Page() {
	const router = useRouter()
	const pageMetaData = {
		title: "Test Form Redirect | Twisted Artists Guild",
		description: "Internal test page for updateForms routing behavior.",
		keywords: "test, forms, routing",
		robots: "noindex, nofollow",
		og: {
			title: "TAG Test Form Redirect",
			description: "Internal test page for updateForms routing behavior.",
		},
	}
 
	return (
		<>
			<TagSEO metadataProp={pageMetaData} canonicalSlug="test/updateForms" />
			<button type="button" className={defaultButtonClass} onClick={() => router.push("/test/updateForms/testform")}>
				Redirect to /test/updateForms/testform
			</button>
		</>
	)
}





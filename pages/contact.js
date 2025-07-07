/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { useState } from "react"
import TagSEO from "@/components/TagSEO"

export default function Contact() {

	const pageMetaData = {
		title: "TAG Contact Page",
		description: "Contact us here",
		keywords: "art, stay in touch, contact",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "TAG Contact Page",
			description: "Contact us here",
		},
	}

	return (
		<div className="flex flex-col justify-evenly items-center h-[90vh] w-full mt-24 bg-base-100 text-base-content">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="contact" />

			<p className="font-poiret text-6xl text-primary shadow-text">Trying to contact the team?</p>
      
			<div>
				<a href="https://www.facebook.com/groups/twistedartists/" className="text-blue-500 underline hover:text-blue-700">
					Join us in the Facebook Group: Twisted Artists Guild
				</a>
			</div>

			<iframe
				width="640px"
				height="480px"
				src="https://forms.office.com/Pages/ResponsePage.aspx?id=CXCjcr9p3k-mFkuxZV9NHPDbHBXdbw9MqFWEzrNZGvtURVE4WVZSUDcwR00xSjdYMEIwRlZJV1YzOC4u&embed=true"
				className="border-none max-w-full max-h-screen rounded-lg shadow-lg"
				allowFullScreen
			>
			</iframe>
		</div>
	)
}

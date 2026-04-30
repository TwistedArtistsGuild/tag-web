/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import TagSEO from "@/components/TagSEO"

export default function SlideShow() {
	const pageMetaData = {
		title: "Slideshow",
		description: "Review TAG's values and MVP vision through the embedded slideshow.",
		keywords: "slideshow, values, roadmap",
		og: {
			title: "Slideshow",
			description: "Review TAG's values and MVP vision through the embedded slideshow.",
		},
	}

	return (
		<div >
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/slideshow" />
			<div className="flex justify-center items-center w-full h-150 bg-base-200">
				<iframe
					src="https://view.officeapps.live.com/op/embed.aspx?src=https://tagstatic.blob.core.windows.net/content/TAG_Values_and_MVP_Features.pptx"
					width="65%"
					height="100%"
					frameBorder="0"
					className="rounded-lg shadow-lg"
				></iframe>
			</div>
		</div>
	);
}

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import TagSEO from "@/components/TagSEO"

export default function CodeOfConduct() {
	const pageMetaData = {
		title: "Interview Disclosure Page",
		description: "Shows our interview guide for questions we want to ask participating artists",
		keywords: "art, interview, news, market research",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Interview Disclosure Page",
			description: "Shows our interview guide for questions we want to ask participating artists",
		},
	}

	return (
      <div className="container mx-auto p-4">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/activeprojects/interviews" />
			<h2 className="text-2xl font-bold mb-4">
        The interview guide to be used to ask artists about their businesses: 
			</h2>
			{/* 
      <iframe src="https://docs.google.com/document/d/e/2PACX-1vRq-QB5PeNT5ox5mBLAb36x2pZhVAnyKYm6fEdId5rZFknaHJZStfWH5q4T4JjvqW_kYBt03guhJlDu/pub?embedded=true"
        width='50%' height="75%">
      </iframe>
      */}
			<p>
				Our active project at the moment is building this website prototype into a functional business tool suite. And forming our corporation.
			</p>
		</div>
	)
}

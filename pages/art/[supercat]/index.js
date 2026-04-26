/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Listings from "@/pages/art/[supercat]/[cat]/[medium]/[subcat]";
import TagSEO from "@/components/TagSEO"

const SupercatListings = (props) => {
	const pageMetaData = {
		title: "Art by Super Category | Twisted Artists Guild",
		description: "Browse art listings by super category on Twisted Artists Guild.",
		keywords: "art categories, super category listings, TAG art",
		og: {
			title: "TAG Art Categories",
			description: "Browse art listings by super category on Twisted Artists Guild.",
		},
	}

	return (
		<>
			<TagSEO metadataProp={pageMetaData} canonicalSlug="art/[supercat]" />
			<Listings {...props} />
		</>
	)
}

SupercatListings.getInitialProps = Listings.getInitialProps

export default SupercatListings;

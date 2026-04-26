/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Listings from "@/pages/art/[supercat]/[cat]/[medium]/[subcat]";
import TagSEO from "@/components/TagSEO"

const CategoryListings = (props) => {
	const pageMetaData = {
		title: "Art by Category | Twisted Artists Guild",
		description: "Explore art listings by category on Twisted Artists Guild.",
		keywords: "art category, listing browser, TAG art",
		og: {
			title: "TAG Category Listings",
			description: "Explore art listings by category on Twisted Artists Guild.",
		},
	}

	return (
		<>
			<TagSEO metadataProp={pageMetaData} canonicalSlug="art/[supercat]/[cat]" />
			<Listings {...props} />
		</>
	)
}

CategoryListings.getInitialProps = Listings.getInitialProps

export default CategoryListings;

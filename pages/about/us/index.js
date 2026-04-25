/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import TagSEO from "@/components/TagSEO";
import profiles from "@/content/us/profiles";
import AboutProfileCard from "@/components/cards/card_about_profile";

export default function AboutUs() {
	const pageMetaData = {
		title: "About Us - Twisted Artists Guild",
		description: "Meet the members of the Twisted Artists Guild",
		keywords: "about us, artists, guild members, profiles",
		robots: "index, follow",
		author: "Twisted Artists Guild",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "About Us - Twisted Artists Guild",
			description: "Meet the members of the Twisted Artists Guild",
		},
	};

	return (
		<div className="container mx-auto p-4">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/us" />
			<h2 className="text-3xl font-bold text-center mb-6">About the Twisted Artists Guild</h2>
			<div className="mb-8">
				<p className="mb-4">
					The Twisted Artists Guild was founded with a vision to create a
					community where creativity, resilience, and collaboration thrive. Our
					members come from diverse backgrounds, each bringing unique talents
					and stories that contribute to our collective mission. Together, we
					celebrate the transformative power of art and the courage to embrace
					change.
				</p>
				<p>
					Explore our team below to learn more about the individuals who make
					this guild a vibrant and inspiring space.
				</p>
			</div>
			<h3 className="text-2xl font-semibold mb-4">Our Mission Statement (Draft)</h3>
			<div className="bg-base-100 shadow-md p-4 rounded-lg">
				<p className="text-lg">
					TAG envisions a future where independent artists thrive through innovation, sustainability, and creative entrepreneurship.
				</p>
			</div>

			<h3 className="text-2xl font-semibold mb-4 mt-8">Meet Our Team</h3>
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
				{profiles.map((profile) => (
					<AboutProfileCard key={profile.slug} profile={profile} />
				))}
			</div>
		</div>
	);
}



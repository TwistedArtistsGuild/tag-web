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
		<div className="container mx-auto max-w-6xl p-4 md:p-6">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/us" />
			<h1 className="text-4xl md:text-5xl font-bold text-center text-primary mb-6">About the Twisted Artists Guild</h1>
			<div className="card bg-base-100 border border-base-300 shadow-md mb-8">
				<div className="card-body">
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
			</div>
			<h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Our Mission Statement (Draft)</h2>
			<div className="card bg-base-100 border border-base-300 shadow-md mb-8">
				<div className="card-body">
				<p className="text-lg text-base-content/80">
					TAG envisions a future where independent artists thrive through innovation, sustainability, and creative entrepreneurship.
				</p>
				</div>
			</div>

			<h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4 mt-8">Meet Our Team</h2>
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
				{profiles.map((profile) => (
					<AboutProfileCard key={profile.slug} profile={profile} />
				))}
			</div>
		</div>
	);
}



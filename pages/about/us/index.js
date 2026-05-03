/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import TagSEO from "@/components/TagSEO";
import profiles from "@/content/us/profiles";
import AboutProfileCard from "@/components/cards/card_about_profile";
import { getPanelClass } from "@/components/cards/sizes/panel-layout";

export default function AboutUs() {
	const pageMetaData = {
		title: "About Us",
		description: "Meet the members of the Platform",
		keywords: "about us, artists, guild members, profiles",
		robots: "index, follow",
		author: "Twisted Artists Guild",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "About Us",
			description: "Meet the members of the Platform",
		},
	};

	return (
		<div>
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/us" />
			<h1 className="text-4xl md:text-5xl font-bold text-center text-primary mb-6 px-4 md:px-6">About the Twisted Artists Guild</h1>
			<div className="mx-auto mb-8 max-w-3xl px-4 text-center text-base-content/80 md:px-6">
				<p className="mb-4">
					The Twisted Artists Guild was founded with a vision to create a community where
					creativity, resilience, and collaboration thrive. Our members come from diverse
					backgrounds, each bringing unique talents and stories that contribute to our
					collective mission. Together, we celebrate the transformative power of art and the
					courage to embrace change.
				</p>
				<p>
					Explore our team below to learn more about the individuals who make this guild a
					vibrant and inspiring space.
				</p>
			</div>

			<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 md:px-6 mb-8">
				<div className="card bg-base-100 border border-base-300 shadow-md h-full">
					<div className="card-body items-center justify-center text-center">
						<h2 className="text-2xl md:text-3xl font-semibold text-primary mt-1">Our Mission Statement (Draft)</h2>
						<p className="text-lg text-base-content/80 mt-2 max-w-3xl">
							TAG envisions a future where independent artists thrive through innovation, sustainability, and creative entrepreneurship.
						</p>
					</div>
				</div>
			</div>

			<div className="container mx-auto max-w-6xl p-4 md:p-6">
				<h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Meet Our Team</h2>
				<div className="grid gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
					{profiles.map((profile) => (
						<div key={profile.slug} className={getPanelClass("half")}>
							<AboutProfileCard profile={profile} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}



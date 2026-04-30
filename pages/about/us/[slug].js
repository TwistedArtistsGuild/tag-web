/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { useRouter } from "next/router";
import profiles from "@/content/us/profiles";
import Link from "next/link";
import PhotoGallery from "@/components/cards/card_photoGallery";

import TagSEO from "@/components/TagSEO"

export default function ProfilePage() {
	const router = useRouter();
	const { slug } = router.query;

	const profile = profiles.find((p) => p.slug === slug);

	if (!profile) {
		return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
      <TagSEO metadataProp={{ title: "Github Projects Web Pages About Us Slug", description: "Explore Github Projects Web Pages About Us Slug on Platform.", keywords: "artists, art community, marketplace", og: { title: "Github Projects Web Pages About Us Slug", description: "Explore Github Projects Web Pages About Us Slug on Platform." } }} canonicalSlug="/github_projects/tag/tag-web/pages/about/us/[slug]" />
				<div className="alert alert-error max-w-sm">
					<span>Profile not found.</span>
				</div>
			</div>
		);
	}

	return (
      <div className="min-h-screen bg-base-200 py-8 px-4">
      <TagSEO metadataProp={{ title: "Github Projects Web Pages About Us Slug", description: "Explore Github Projects Web Pages About Us Slug on Platform.", keywords: "artists, art community, marketplace", og: { title: "Github Projects Web Pages About Us Slug", description: "Explore Github Projects Web Pages About Us Slug on Platform." } }} canonicalSlug="/github_projects/tag/tag-web/pages/about/us/[slug]" />

			{/* Gallery — 80% width, centered */}
			{profile.images.length > 0 && (
				<div className="mx-auto mb-8" style={{ width: "80%" }}>
					<PhotoGallery
						images={profile.images.map((url) => ({ original: url, thumbnail: url }))}
					/>
				</div>
			)}

			{/* Hero identity card */}
			<div className="card bg-base-100 border border-base-300 shadow-xl mx-auto mb-6 max-w-3xl">
				<div className="card-body items-center text-center gap-2">
					<h1 className="card-title text-4xl font-extrabold text-primary">
						{profile.name}
					</h1>
					<h2 className="text-lg font-semibold text-base-content/80">
						{profile.title}
					</h2>
					{profile.roleSummary && (
						<p className="text-sm text-base-content/60 italic max-w-xl">
							{profile.roleSummary}
						</p>
					)}
					<div className="divider my-1" />
					{/* Art form badges */}
					<div className="flex flex-wrap justify-center gap-2">
						{profile.artForms.map((form) => (
							<span key={form} className="badge badge-primary badge-outline text-sm px-3 py-3">
								{form}
							</span>
						))}
					</div>
					<div className="card-actions mt-2">
						<Link href={profile.linkToArtistPage} className="btn btn-primary btn-sm">
							View {profile.name.trim().split(" ")[0]}&apos;s Artist Page →
						</Link>
					</div>
				</div>
			</div>

			{/* Bio panel */}
			<div className="card bg-base-100 border border-base-300 shadow-md mx-auto mb-8 max-w-3xl">
				<div className="card-body">
					<div
						className="prose prose-base max-w-none text-base-content
							prose-h2:text-primary prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-2
							prose-p:leading-relaxed prose-strong:text-base-content
							prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1
							prose-blockquote:border-l-4 prose-blockquote:border-primary
							prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-base-content/70"
						dangerouslySetInnerHTML={{ __html: profile.bio }}
					/>
				</div>
			</div>

			{/* Footer nav */}
			<div className="text-center">
				<button className="btn btn-ghost" onClick={() => router.back()}>
					← Go Back
				</button>
			</div>
		</div>
	);
}

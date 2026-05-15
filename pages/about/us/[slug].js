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
import { CARD_SHELL_CLASS } from "@/components/cards/sizes/panel-layout";

import TagSEO from "@/components/TagSEO";
import { sanitizeDefaultHtml } from "@/components/security/sanitize";

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

	const pageMetaData = {
		title: `${profile.name} | About Us`,
		description: profile.roleSummary || profile.title,
		keywords: `about us, ${profile.name}, ${profile.artForms.join(", ")}`,
		robots: "index, follow",
		author: "Twisted Artists Guild",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: `${profile.name} | About Us`,
			description: profile.roleSummary || profile.title,
		},
	};

	return (
		<div className="min-h-screen bg-base-200 py-8 px-4">
			<TagSEO metadataProp={pageMetaData} canonicalSlug={`about/us/${profile.slug}`} />
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
				{profile.images.length > 0 && (
					<div className="mx-auto w-full max-w-5xl">
						<PhotoGallery
							images={profile.images}
							mode="embedded"
						/>
					</div>
				)}

				<div className="mx-auto w-full max-w-3xl">
					<div className={`${CARD_SHELL_CLASS} h-full`}>
						<div className="card-body items-center text-center gap-2">
							<h1 className="card-title text-3xl md:text-4xl font-extrabold text-primary">
								{profile.name}
							</h1>
							<h2 className="text-base md:text-lg font-semibold text-base-content/80">
								{profile.title}
							</h2>
							{profile.roleSummary && (
								<p className="text-sm text-base-content/60 italic max-w-xl">
									{profile.roleSummary}
								</p>
							)}
							<div className="divider my-1" />
							<div className="flex flex-wrap justify-center gap-2">
								{profile.artForms.map((form) => (
									<span key={form} className="badge badge-primary badge-outline text-sm px-3 py-3">
										{form}
									</span>
								))}
							</div>
							<div className="card-actions mt-2">
								<Link href={profile.linkToArtistPage} className="btn btn-primary btn-sm">
									View {profile.name.trim().split(" ")[0]}&apos;s Artist Page
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="mx-auto w-full max-w-6xl">
					<div className={`${CARD_SHELL_CLASS} h-full`}>
						<div className="card-body items-center text-center">
							<span className="badge badge-outline badge-primary w-fit">Self Description</span>
							<div
								className="prose prose-base mx-auto max-w-3xl text-base-content
									prose-h2:text-primary prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-2
									prose-p:leading-relaxed prose-strong:text-base-content
									prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1
									prose-blockquote:border-l-4 prose-blockquote:border-primary
									prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-base-content/70"
								dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(profile.bio) }}
							/>
						</div>
					</div>
				</div>

				<div className="mx-auto w-full max-w-md">
					<div className={`${CARD_SHELL_CLASS} h-full`}>
						<div className="card-body items-center p-4 text-center gap-2">
							<span className="badge badge-outline badge-primary w-fit">Navigation</span>
							<div className="card-actions mt-1 flex-col items-stretch gap-2">
				
								<Link href="/about/us" className="btn btn-sm btn-ghost">
									All Profiles
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


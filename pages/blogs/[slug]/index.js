/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import longDateOptions from "@/utils/longdateoptions"
import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import SocialReactions from "@/components/social/Reactions"
import SocialComments from "@/components/social/Comments"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import ArtistCard from "@/components/cards/card_artist"
import { defaultFieldClass } from "@/utils/formSettings"
import { PERMISSIONS } from "@/utils/permissions";
import { hasPermission } from "@/utils/authHelpers";

const PhotoGallery = dynamic(() => import("@/components/cards/card_photoGallery"), { ssr: false });

const GALLERY_SIZE_MAP = {
	small: "max-w-md",
	medium: "max-w-2xl",
	large: "max-w-4xl",
	full: "max-w-none",
};

const GALLERY_PLACEMENT_MAP = {
	left: "mr-auto",
	center: "mx-auto",
	right: "ml-auto",
};

function extractAttributeValue(blockHtml, attrName) {
	const attrRegex = new RegExp(`${attrName}="([^\"]+)"`, "i");
	const match = blockHtml.match(attrRegex);
	return match?.[1] || "";
}

function parseGalleryBlock(match) {
	const encodedImages = extractAttributeValue(match, "data-images");
	const rawSize = extractAttributeValue(match, "data-size").toLowerCase();
	const rawPlacement = extractAttributeValue(match, "data-placement").toLowerCase();

	const size = GALLERY_SIZE_MAP[rawSize] ? rawSize : "large";
	const placement = GALLERY_PLACEMENT_MAP[rawPlacement] ? rawPlacement : "center";

	if (!encodedImages) {
		return {
			images: [],
			size,
			placement,
		};
	}

	try {
		const decoded = decodeURIComponent(encodedImages);
		const parsed = JSON.parse(decoded);
		return {
			images: Array.isArray(parsed) ? parsed.filter(Boolean) : [],
			size,
			placement,
		};
	} catch {
		return {
			images: [],
			size,
			placement,
		};
	}
}

function parseGalleryToken(encodedPayload) {
	const fallback = {
		images: [],
		size: "large",
		placement: "center",
	};

	if (!encodedPayload) {
		return fallback;
	}

	try {
		const decoded = decodeURIComponent(encodedPayload);
		const parsed = JSON.parse(decoded);

		if (Array.isArray(parsed)) {
			return {
				...fallback,
				images: parsed.filter(Boolean),
			};
		}

		const rawSize = String(parsed?.size || "").toLowerCase();
		const rawPlacement = String(parsed?.placement || "").toLowerCase();

		return {
			images: Array.isArray(parsed?.images) ? parsed.images.filter(Boolean) : [],
			size: GALLERY_SIZE_MAP[rawSize] ? rawSize : fallback.size,
			placement: GALLERY_PLACEMENT_MAP[rawPlacement] ? rawPlacement : fallback.placement,
		};
	} catch {
		return fallback;
	}
}

function splitBodySegments(html) {
	const content = String(html || "")
		.replace(/<p[^>]*>(?:(?!<\/p>).)*<a[^>]+href="#tag-gallery-[^"]+"[^>]*>(?:(?!<\/a>).)*<\/a>(?:(?!<\/p>).)*<\/p>/gi, "")
		.replace(/<p[^>]*>(?:(?!<\/p>).)*🖼\s*Gallery Preview:(?:(?!<\/p>).)*<\/p>/gi, "")
		.replace(/<p>\s*(\[\[TAG_GALLERY:[^\]]+\]\])\s*<\/p>/gi, "$1");
	const segments = [];
	const regex = /<div\s+data-tag-gallery="v1"[^>]*><\/div>|\[\[TAG_GALLERY:([^\]]+)\]\]/gi;
	let lastIndex = 0;
	let match = regex.exec(content);

	while (match) {
		const blockStart = match.index;
		if (blockStart > lastIndex) {
			segments.push({ type: "html", html: content.slice(lastIndex, blockStart) });
		}

		const matchedText = match[0] || "";
		const gallerySegment = matchedText.startsWith("[[TAG_GALLERY:")
			? parseGalleryToken(match[1])
			: parseGalleryBlock(matchedText);

		segments.push({ type: "gallery", ...gallerySegment });

		lastIndex = regex.lastIndex;
		match = regex.exec(content);
	}

	if (lastIndex < content.length) {
		segments.push({ type: "html", html: content.slice(lastIndex) });
	}

	return segments;
}

function formatCompactNumber(value, fallback = 0) {
	const numeric = Number(value);
	const safeValue = Number.isFinite(numeric) ? numeric : fallback;
	if (safeValue >= 1000) {
		return `${(safeValue / 1000).toFixed(1).replace(/\.0$/, "")}k`;
	}
	return String(Math.max(0, Math.floor(safeValue)));
}

const BlogByslug = props => {
	const { data: session } = useSession();
	const [mounted, setMounted] = useState(false)
	const options =  longDateOptions
	const blog = props.blog
	const seoKeywords = `blog, post, article, ${blog.searchterms}`
	const canonicalSlug = `blogs/${blog.path}`

	useEffect(() => {
		setMounted(true)
	}, [])
	const canUpdate = hasPermission(session, PERMISSIONS.BLOG.UPDATE);
	const bodySegments = splitBodySegments(blog.body);
	const socialUser = session?.user
		? {
			id: session.user.id || session.user.email || session.user.name || "current-user",
			username: session.user.name || session.user.email || "Artist",
			displayName: session.user.name || "Artist",
			avatarUrl: session.user.image || "",
			isAdmin: false,
		}
		: null;
	const blogContextId = `blog-${props.slug}`;
	const commentCount = blog?.commentCount ?? (Array.isArray(blog?.comments) ? blog.comments.length : 18);
	const viewCount = blog?.viewCount ?? blog?.views ?? 3200;
	const artistCardData = {
		title: blog.artistName || "Artist Goes Here",
		byline: blog.artistByline || "Gallery",
		path: blog.artistPath || "artists",
		panelSize: "twoThirds",
		profilePic: {
			url: blog.artistImage || blog.image || "/blank_image.png",
			alttext: blog.artistName || "Artist profile image",
		},
	};

	const pageMetaData = {
		title: blog.title,
		description: blog.byline,
		keywords: seoKeywords,
		robots: "index, follow",
		author: blog.title,
		viewport: "width=device-width, initial-scale=1.0",
		 og: {
			title: blog.title,
			description: blog.byline,
			image: blog.image,
		},
	}

	return (
		/* suppressHydrationWarning prevents React from logging a hydration mismatch for this subtree.
		   We also only render the rich `body` HTML after mount to avoid SSR/CSR mismatch. */
		<SocialRealtimeProvider>
		<div className="flex flex-col items-center min-h-screen w-full py-8 gap-8" suppressHydrationWarning>
			<style jsx global>{`
				.blog-rich-content img[style*="text-align: left"],
				.blog-rich-content iframe[style*="text-align: left"] {
					display: block;
					margin-left: 0;
					margin-right: auto;
				}

				.blog-rich-content img[style*="text-align: center"],
				.blog-rich-content iframe[style*="text-align: center"] {
					display: block;
					margin-left: auto;
					margin-right: auto;
				}

				.blog-rich-content img[style*="text-align: right"],
				.blog-rich-content iframe[style*="text-align: right"] {
					display: block;
					margin-left: auto;
					margin-right: 0;
				}

				.reaction-scroll > div {
					display: grid;
					grid-template-columns: repeat(6, minmax(0, 1fr));
					gap: 0.4rem;
					align-items: start;
					max-height: 6.2rem;
					overflow-y: auto;
					padding-right: 0.25rem;
				}

				.reaction-scroll > div > * {
					justify-self: stretch;
				}
			`}</style>
			<TagSEO metadataProp={pageMetaData} canonicalSlug={canonicalSlug} />
			<div className="flex flex-col items-center">
				<h1
					className="font-poiret text-7xl shadow-text"
					dangerouslySetInnerHTML={{ __html: props.blog.title }}
				></h1>
				<div
					className="font-fredoka pt-2 w-[75%]"
					dangerouslySetInnerHTML={{ __html: props.blog.byline }}
				></div>
				{/* server-stable formatted date */}
				<div className="font-baloo text-xs shadow-dark">{props.blog.formattedCreated}</div>
			</div>

			<div className="w-[75%] rounded-box border border-base-300 bg-base-100 p-4">
				<div className="flex flex-col gap-4 md:flex-row md:items-start">
					<div className="md:w-[62%]">
						<ArtistCard
							artist={artistCardData}
							compact={false}
							showHeaderGallery={false}
							showContentGallery={false}
						/>
					</div>
					<div className="md:w-[38%] md:shrink-0 rounded-box border border-base-300 bg-base-200/40 p-3">
						<div className="mb-3 flex flex-wrap items-center gap-4 text-sm font-semibold">
							<span>👁 {formatCompactNumber(viewCount)} views</span>
							<a href="#comments-section" className="link link-primary">
								💬 {formatCompactNumber(commentCount)} comments
							</a>
						</div>
						<div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/60">Reactions</div>
						<div className="reaction-scroll">
							<SocialReactions
								targetId={blogContextId}
								targetType="post"
								initialReactions={blog.reactions || []}
								currentUser={socialUser}
								size="md"
								showQuickReactions
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Render full body only on client to avoid hydration mismatch.
			    If SEO is critical for this content, remove this guard and instead fix the underlying mismatch. */}
			{mounted ? (
				<div className="blog-rich-content font-fredoka w-[75%] text-center space-y-6">
					{bodySegments.map((segment, index) => {
						if (segment.type === "gallery") {
							if (!segment.images.length) {
								return null;
							}

							const sizeClass = GALLERY_SIZE_MAP[segment.size] || GALLERY_SIZE_MAP.large;
							const placementClass = GALLERY_PLACEMENT_MAP[segment.placement] || GALLERY_PLACEMENT_MAP.center;

							return (
								<div key={`gallery-${index}`} className={`w-full ${sizeClass} ${placementClass}`}>
									<PhotoGallery
										images={segment.images}
										mode="standalone"
										navigationMode="manual"
										imageEffect="landscape"
										showThumbnails={segment.images.length > 1}
										showContentWarnings={false}
									/>
								</div>
							);
						}

						return (
							<div
								key={`html-${index}`}
								dangerouslySetInnerHTML={{ __html: segment.html }}
							/>
						);
					})}
				</div>
			) : (
				/* lightweight server placeholder that matches shape but not content */
				<div className="font-fredoka w-[75%] text-center">
					{props.blog.body ? "" : ""} 
				</div>
			)}

			{mounted && canUpdate && (
			<Link
				href="/portal/staff/tagblog/[slug]/update"
				as={`/portal/staff/tagblog/${props.slug}/update`}
				className={`${defaultFieldClass} font-fredoka text-xl text-[#e9ecef] transition hover:tracking-wider hover:text-transparent hover:bg-linear-to-r from-[#f1c0e8] to-[#8EECF5] hover:font-bold`}
			>
				Update this blog
			</Link>
			)}

			<div id="comments-section" className="w-[75%] rounded-box border border-base-300 bg-base-100 p-4">
				<div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/60">Comments</div>
				<SocialComments
					contextId={blogContextId}
					initialComments={blog.comments || []}
					currentUser={socialUser}
					readOnly={false}
				/>
			</div>
		</div>
		</SocialRealtimeProvider>
	)
}

BlogByslug.getInitialProps = async function (context) {
	const {slug} = context.query

	const api_url = getApiURL()
  
	if (process.env.DEBUG === "true") {
		console.log (`Fetching blog: ${slug}, path: ${context.pathname}`)
	} 
  
	const res = await fetch (api_url + `blog/path/${slug}`)
	const data = await res.json ()

	const blogData = Array.isArray(data) ? data[0] : data;

	let formattedCreated = "";
	try {
		const createdDate = new Date(blogData.created);
		formattedCreated = createdDate.toLocaleDateString("en-US", longDateOptions);
	} catch (e) {
		formattedCreated = blogData.created || "";
	}

	if (process.env.DEBUG === "true") {
		console.log(`blog data fetched.`, blogData)
	} 

	return {
		blog: {
			...blogData,
			formattedCreated,
		},
		slug: slug,
	}
}

export default BlogByslug

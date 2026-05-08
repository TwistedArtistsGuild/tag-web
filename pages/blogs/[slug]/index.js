/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react"
import longDateOptions from "@/utils/longdateoptions"
import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import { defaultFieldClass } from "@/utils/formSettings"
import { PERMISSIONS } from "@/utils/permissions";
import { hasPermission } from "@/utils/authHelpers";

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
		<div className="flex flex-col justify-evenly items-center h-screen w-full " suppressHydrationWarning>
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

			{/* Render full body only on client to avoid hydration mismatch.
			    If SEO is critical for this content, remove this guard and instead fix the underlying mismatch. */}
			{mounted ? (
				<p
					className={`font-fredoka w-[75%] text-center`}
					dangerouslySetInnerHTML={{ __html: props.blog.body }}
				/>
			) : (
				/* lightweight server placeholder that matches shape but not content */
				<p className="font-fredoka w-[75%] text-center">
					{props.blog.body ? "" : ""} 
				</p>
			)}

			{mounted && canUpdate && (
			<Link
				href="/blogs/[slug]/update"
				as={`/blogs/${props.slug}/update`}
				className={`${defaultFieldClass} font-fredoka text-xl text-[#e9ecef] transition hover:tracking-wider hover:text-transparent hover:bg-linear-to-r from-[#f1c0e8] to-[#8EECF5] hover:font-bold`}
			>
				Update this blog
			</Link>
			)}
		</div>
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

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



///////////////// Imports
import Link from "next/link"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import longDateOptions from "/utils/longdateoptions"

const Blog = (props) => {
	const options = longDateOptions
	const pageMetaData = {
		title: "TAG Blog Main Page",
		description: "A list of our blog entries",
		keywords: "blog, art, business, news",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale-1.0",
		 og: {
			title: "Social Title for Blog Entries",
			description: "Social list of our blog entries",
		},
	}

	return (
		<div className="flex flex-col justify-evenly items-center h-full w-full mt-24 mb-24 bg-base-100 text-base-content">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="blog" />

			<h1 className="font-poiret text-7xl text-primary shadow-text">TAG Blog Entries</h1>
			<h6 className="font-fredoka text-secondary shadow-dark">Please see the below topics of interest to yourself.</h6>

			<ul className="flex flex-col-reverse items-center w-[100vh] h-full space-y-6">
				{props.blogs.map((blog) => (
					<div key={blog.path} className="flex flex-col items-center w-full h-full mb-12">
						<Link href="/blogs/[slug]" as={`/blogs/${blog.path}`} className="font-fredoka flex items-center justify-center text-neutral text-4xl p-2 h-[30%] rounded-t-lg bg-primary shadow-md w-[70%] transition hover:text-accent hover:shadow-lg">
							{blog.title}
						</Link>

						<div className="flex flex-col items-start bg-gradient-to-r from-secondary to-accent w-[80%] p-4 rounded-lg text-neutral-content shadow-lg">
							<p className="text-2xl font-abel">{blog.byline}</p>
							<p className="font-baloo text-sm text-neutral-content shadow-dark">{new Date(blog.created).toLocaleDateString("en-US", options)}</p>
						</div>
					</div>
				))}
			</ul>
			<Link href="/blogs/create" className="font-fredoka text-xl text-accent transition hover:text-primary hover:shadow-light">
				Create a blog post
			</Link>
		</div>
	)
}

Blog.getInitialProps = async function () {
	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL

	let data = []
	let status = 200

	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log("Blog data fetch starting\n " + api_url + "blog/")
	}

	try {
		// Fetch the blog data
		const res = await fetch(api_url + "blog/")
		status = res.statusd
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${status}`)
		}
		data = await res.json()
	} catch (error) {
		console.error("An error has occurred with your fetch request: ", error)
	}

	// If we are running in debug mode, log the blog data
	if (process.env.DEBUG === "true") {
		console.log(`Blog data fetched. Count: ${data.length}`)
	}

	// Return the blog data and status
	return {
		blogs: data,
		status: status,
	}
}

export default Blog

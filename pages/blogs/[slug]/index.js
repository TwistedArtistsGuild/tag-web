/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import "react-quill/dist/quill.snow.css"
import longDateOptions from "/utils/longdateoptions"
import TagSEO from "@/components/TagSEO"

const BlogByslug = props => {
	const options =  longDateOptions

	// Safety check for missing blog data
	if (!props.blog) {
		return (
			<div className="min-h-screen bg-base-100">
				<div className="container mx-auto px-4 py-24 max-w-4xl text-center">
					<div className="hero-content">
						<div className="max-w-md">
							<h1 className="text-5xl font-bold text-error mb-6">404</h1>
							<h2 className="text-3xl font-bold text-base-content mb-4">Blog Post Not Found</h2>
							<p className="text-lg text-base-content/70 mb-8">
								The requested blog post could not be found. It may have been moved or deleted.
							</p>
							<div className="flex gap-4 justify-center">
								<Link 
									href="/blogs" 
									className="btn btn-primary"
								>
									← Back to Blog List
								</Link>
								<Link 
									href="/" 
									className="btn btn-outline"
								>
									Home
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const pageMetaData = {
		title: props.blog.title || "Blog Post",
		description: props.blog.byline || "A blog post from Twisted Artists Guild",
		keywords: props.blog.searchterms || "blog, art, creativity",
		robots: "index, follow",
		author: props.blog.title || "Twisted Artists Guild",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: props.blog.title || "Blog Post",
			description: props.blog.byline || "A blog post from Twisted Artists Guild",
		},
	}

	return (
		<div className="min-h-screen bg-base-100">
			<TagSEO metadataProp={pageMetaData} canonicalSlug={`blogs/${props.blog.path}`} />
			
			{/* Blog Header */}
			<div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 leading-tight">
							{props.blog.title}
						</h1>
						<p className="text-xl md:text-2xl text-base-content/80 mb-6 font-light">
							{props.blog.byline}
						</p>
						<div className="flex items-center justify-center gap-4 text-base-content/60">
							<time className="text-sm md:text-base">
								{new Date(props.blog.created).toLocaleDateString("en-US", options)}
							</time>
							{props.blog.user && (
								<>
									<span className="w-1 h-1 bg-base-content/40 rounded-full"></span>
									<span className="text-sm md:text-base">
										By {props.blog.user.firstName} {props.blog.user.famName}
									</span>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Blog Content */}
			<article className="container mx-auto px-4 py-12 max-w-4xl">
				<div className="prose prose-lg max-w-none">
					<div 
						className="text-base-content leading-relaxed"
						dangerouslySetInnerHTML={{ __html: props.blog.body }}
					/>
				</div>

				{/* Article Footer */}
				<div className="mt-12 pt-8 border-t border-base-300">
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						<div className="flex gap-4">
							<Link
								href="/blogs"
								className="btn btn-outline btn-primary"
							>
								← Back to Blog
							</Link>
							<Link
								href="/blogs/[blognum]/update"
								as={`/blogs/${props.slug}/update`}
								className="btn btn-secondary"
							>
								Edit Post
							</Link>
						</div>
						
						{/* Share buttons placeholder */}
						<div className="flex gap-2">
							<div className="btn btn-ghost btn-sm">
								Share
							</div>
						</div>
					</div>
				</div>

				{/* Related/Navigation */}
				<div className="mt-12 p-6 bg-base-200 rounded-box">
					<h3 className="text-xl font-semibold mb-4">More from TAG Blog</h3>
					<p className="text-base-content/70 mb-4">
						Discover more insights, stories, and updates from the Twisted Artists Guild community.
					</p>
					<Link 
						href="/blogs" 
						className="btn btn-primary"
					>
						View All Posts
					</Link>
				</div>
			</article>
		</div>
	)
}

BlogByslug.getInitialProps = async function (context) {
	const {slug} = context.query

	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
	let data = null
	let status = 200
  
	//Staging API can be added here if needed

	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log (`Fetching blog: ${slug}, path: ${context.pathname}`)
	} 
  
	try {
		const res = await fetch (api_url + `blog/path/${slug}`)
		status = res.status
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${status}`)
		}
		data = await res.json ()
	} catch (error) {
		console.error("An error has occurred with your fetch request: ", error)
		// Return default data structure to prevent page crashes
		data = {
			title: "Blog Not Found",
			byline: "The requested blog post could not be found.",
			body: "This blog post may have been moved or deleted.",
			created: new Date().toISOString(),
			path: slug
		}
	}

	// If we are running in debug mode, log the artist data
	if (process.env.DEBUG === "true") {
		console.log(`blog data fetched for slug: ${slug}`)
		//console.log(data); // Print the contents of the data variable
	} 

	return {
		blog: data,
		slug: slug,
		status: status
	}
}

export default BlogByslug

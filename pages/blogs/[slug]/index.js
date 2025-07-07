/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import longDateOptions from "/utils/longdateoptions"
import TagSEO from "@/components/TagSEO"
import { defaultFieldClass, defaultTextareaClass } from "/utils/formSettings"

// Dynamically import Quill
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
	ssr: false,
	loading: () => <p>Loading ...</p>,
})

const BlogByslug = props => {
	const options =  longDateOptions

	const pageMetaData = {
		title: props.blog.title,
		description: props.blog.byline,
		keywords: props.blog.searchterms,
		robots: "index, follow",
		author: props.blog.title,
		viewport: "width=device-width, initial-scale=1.0",
		 og: {
			title: props.blog.title,
			description: props.blog.byline,
		},
	}

	return (
		<div className="flex flex-col justify-evenly items-center h-screen w-full ">
			<TagSEO metadataProp={pageMetaData} canonicalSlug={`blogs/${props.blog.path}`} />
			<div className="flex flex-col items-center">
				<h1 className="font-poiret text-7xl text-[#98F5E1] shadow-text">{props.blog.title}</h1>
				<div className="font-fredoka text-[#90dbf4] w-[75%]">{props.blog.byline}</div>
				<div className="font-baloo text-xs text-[#fde4cf] shadow-dark">{new Date(props.blog.created).toLocaleDateString("en-US", options)}</div>
			</div>

			<p
				className={`font-fredoka text-[#90dbf4] w-[75%] text-center`}
				dangerouslySetInnerHTML={{ __html: props.blog.body }}
			/>

			<Link
				href="/blogs/[blognum]/update"
				as={`/blogs/${props.slug}/update`}
				className={`${defaultFieldClass} font-fredoka text-xl text-[#e9ecef] transition hover:tracking-wider hover:text-transparent hover:bg-gradient-to-r from-[#f1c0e8] to-[#8EECF5] hover:font-bold`}
			>
				Update this blog
			</Link>
		</div>
	)
}

BlogByslug.getInitialProps = async function (context) {
	const {slug} = context.query

	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
  
	//Staging API can be added here if needed

	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log (`Fetching blog: ${slug}, path: ${context.pathname}`)
	} 
  

	const res = await fetch (api_url + `blog/${slug}`)
	const data = await res.json ()

	// If we are running in debug mode, log the artist data
	if (process.env.DEBUG === "true") {
		console.log(`blog data fetched. Count: ${data.length}`)
		//console.log(data); // Print the contents of the data variable
	} 

	return {
		blog: data,
		slug: slug,
	}
}

export default BlogByslug

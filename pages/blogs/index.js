/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

////////////////// Imports
import Link from "next/link"
import Image from "next/image" // Import Image component
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
    <div className="flex flex-col items-center py-12 bg-base-100 text-base-content min-h-screen">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="blog" />
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center">
        TAG Blog Entries
      </h1>
      <h6 className="text-xl md:text-2xl text-secondary mb-12 text-center">
        Please see the below topics of interest to yourself.
      </h6>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-6xl w-full">
        {props.blogs.map((blog) => (
          <div
            key={blog.path}
            className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
          >
            <figure className="relative h-48 w-full">
              <Image
                src="https://tagstatic.blob.core.windows.net/pexels/pexels-markus-winkler-1430818-3812433-merchandiseclothingrack.jpg"
                alt="Blog post cover image"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-box"
              />
            </figure>
            <div className="card-body p-6">
              <Link
                href="/blogs/[slug]"
                as={`/blogs/${blog.path}`}
                className="card-title text-2xl text-primary hover:underline"
              >
                {blog.title}
              </Link>
              <p className="text-lg text-gray-700 line-clamp-3">{blog.byline}</p>
              <div className="card-actions justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {new Date(blog.created).toLocaleDateString("en-US", options)}
                </span>
                <Link href="#" className="btn btn-sm btn-outline btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/blogs/create"
        className="btn btn-primary mt-12 text-lg" // Simplified button classes
      >
        Create a blog post
      </Link>
    </div>
  )
}

Blog.getInitialProps = async () => {
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
    status = res.status
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
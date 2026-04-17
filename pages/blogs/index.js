/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import Image from "next/image" // Import Image component
import TagSEO from "@/components/TagSEO"
import longDateOptions from "/utils/longdateoptions"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import { MessageCircleIcon, HeartIcon, ShareIcon } from "lucide-react"
import { useState } from "react"

const Blog = (props) => {
  const options = longDateOptions
  const [socialData, setSocialData] = useState(() => 
    props.blogs.reduce((acc, blog) => ({
      ...acc,
      [blog.path]: {
        loves: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 25) + 1
      }
    }), {})
  )

  const handleSocialAction = (blogPath, action) => {
    setSocialData(prev => ({
      ...prev,
      [blogPath]: {
        ...prev[blogPath],
        [action]: prev[blogPath][action] + 1
      }
    }))
  }
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
    <SocialRealtimeProvider>
      <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
        <TagSEO metadataProp={pageMetaData} canonicalSlug="blog" />
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-primary">
            TAG Blog Entries
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-6">
            Please see the below topics of interest to yourself.
          </p>
          <div className="badge badge-info badge-lg">
            💬 Enhanced with Social Features
          </div>
        </section>
        <main className="container mx-auto px-4 py-8 flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {props.blogs.map((blog) => {
              const blogSocial = socialData[blog.path] || { loves: 0, comments: 0, shares: 0 }
              return (
                <div
                  key={blog.path}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group"
                >
                  <figure className="relative h-48 w-full">
                    <Image
                      src="https://tagstatic.blob.core.windows.net/pexels/pexels-markus-winkler-1430818-3812433-merchandiseclothingrack.jpg"
                      alt="Blog post cover image"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-t-box group-hover:scale-105 transition-transform duration-300"
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
                    
                    {/* Enhanced Social Section */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-300">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleSocialAction(blog.path, 'loves')}
                          className="flex items-center gap-1 text-error hover:scale-105 transition-transform cursor-pointer"
                        >
                          <HeartIcon className="w-4 h-4" />
                          <span className="text-sm">{blogSocial.loves}</span>
                        </button>
                        <div className="flex items-center gap-1 text-base-content/60">
                          <MessageCircleIcon className="w-4 h-4" />
                          <span className="text-sm">{blogSocial.comments}</span>
                        </div>
                        <button 
                          onClick={() => handleSocialAction(blog.path, 'shares')}
                          className="flex items-center gap-1 text-info hover:scale-105 transition-transform cursor-pointer"
                        >
                          <ShareIcon className="w-4 h-4" />
                          <span className="text-sm">{blogSocial.shares}</span>
                        </button>
                      </div>
                      
                      <span className="text-sm text-gray-500">
                        {new Date(blog.created).toLocaleDateString("en-US", options)}
                      </span>
                    </div>
                    
                    <div className="card-actions justify-end mt-4">
                      <Link href={`/blogs/${blog.path}`} className="btn btn-sm btn-outline btn-primary">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end mt-12">
            <Link href="/blogs/create" className="btn btn-primary text-lg">
              Create a blog post
            </Link>
          </div>
        </main>
      </div>
    </SocialRealtimeProvider>
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
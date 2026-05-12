/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import Image from "next/image" // Import Image component
import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import longDateOptions from "@/utils/longdateoptions"
import { getSeededStockPhoto } from "@/utils/stockPhotos"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import SocialReactions from "@/components/social/Reactions"
import { MessageCircleIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useSession } from "next-auth/react";
import sanitizeHtml from "sanitize-html";

const UNIFORM_CARD_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "span",
];

function applyCardThemeOverride(html) {
  return sanitizeHtml(String(html || ""), {
    allowedTags: UNIFORM_CARD_ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      p: ["style"],
      span: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedStyles: {
      p: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      span: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
    },
  });
}

function toUniformPlainText(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const getSeededCount = (seed, max, min = 1, salt = "") => {
  const base = `${seed || "blog"}-${salt}`
  const hash = base.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return (hash % max) + min
}

const MOCK_REACTION_OPTIONS = ["❤️", "👏", "🔥", "🎨", "✨", "💯", "🤩", "🙌"];
const MOCK_COMMENT_SNIPPETS = [
  "Absolutely love this one. The composition is so intentional.",
  "The color story on this post is super strong.",
  "This is the kind of process write-up I needed today.",
  "Great update. I would love a behind-the-scenes follow-up.",
  "The visual direction feels polished and cohesive.",
  "Bookmarking this for reference later. Really helpful post.",
];
const MOCK_COMMENT_AUTHORS = ["EmmaWaters", "DavidChen", "SophiaRodriguez", "ArtCollector"];
const MOCK_ARTIST_NAME = "Artist Goes Here";

function buildMockReactions(blogPath) {
  const total = getSeededCount(blogPath, 5, 2, "reaction-total");
  return Array.from({ length: total }).map((_, index) => {
    const emoji = MOCK_REACTION_OPTIONS[(getSeededCount(blogPath, 99, 1, `emoji-${index}`) - 1) % MOCK_REACTION_OPTIONS.length];
    const userIndex = getSeededCount(blogPath, 40, 1, `user-${index}`);
    return {
      emoji,
      userId: `mock-user-${userIndex}`,
      username: `Artist${userIndex}`,
      timestamp: new Date(Date.now() - (index + 1) * 60000).toISOString(),
    };
  });
}

function buildTopMockComments(blogPath, count = 3) {
  return Array.from({ length: count }).map((_, index) => {
    const snippetIndex = (getSeededCount(blogPath, 500, 1, `snippet-${index}`) - 1) % MOCK_COMMENT_SNIPPETS.length;
    const authorIndex = (getSeededCount(blogPath, 500, 1, `author-${index}`) - 1) % MOCK_COMMENT_AUTHORS.length;
    return {
      id: `${blogPath}-comment-${index}`,
      author: MOCK_COMMENT_AUTHORS[authorIndex],
      body: MOCK_COMMENT_SNIPPETS[snippetIndex],
      likes: getSeededCount(blogPath, 40, 2, `comment-likes-${index}`),
    };
  });
}

const Blog = (props) => {
  const { data: session } = useSession();
  const options = longDateOptions
  const [openCommentsFor, setOpenCommentsFor] = useState(null)
  const currentSocialUser = useMemo(() => {
    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id || session.user.email || session.user.name || "current-user",
      username: session.user.name || session.user.email || "Artist",
      displayName: session.user.name || "Artist",
      avatarUrl: session.user.image || "",
      isAdmin: false,
    };
  }, [session]);

  const pageMetaData = {
    title: "TAG Blog",
    description: "Read artist spotlights, platform updates, and practical guides for building visibility and creative income.",
    keywords: "art blog, artist stories, creator insights, platform updates",
    robots: "index, follow",
    author: "Bobb Shields",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: "TAG Blog | Platform Blog",
      description: "Artist spotlights, platform updates, and practical insights for creative growth.",
    },
    }
  return (
    <SocialRealtimeProvider>
      <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
        <TagSEO metadataProp={pageMetaData} canonicalSlug="blogs" />
        {/* Hero Section */}
        <section className="text-center py-12 bg-linear-to-br from-base-200 to-base-100">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-primary">
            TAG Blog
          </h1>
          <p className="text-xl md:text-2xl text-base-content/80 mb-6 max-w-3xl mx-auto px-4">
            Platform updates, transparency on our direction, and practical guidance for thriving as an artist here.
          </p>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto px-4">
            From product launches and safety updates to long-term vision—this is how we stay open about what we're building and why.
          </p>
        </section>
        <main className="container mx-auto px-4 py-8 flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {props.blogs.map((blog) => {
              const commentCount = blog.commentCount ?? getSeededCount(blog.path, 50, 5, "comments")
              const topComments = buildTopMockComments(blog.path)
              const initialReactions = buildMockReactions(blog.path)
              const uniformCardTitle = toUniformPlainText(blog.title)
              const uniformCardByline = applyCardThemeOverride(blog.byline)
              return (
                <div
                  key={blog.path}
                  className="card bg-base-200 text-base-content shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group"
                >
                  <figure className="relative h-48 w-full">
                    <Image
                      src={blog.image || getSeededStockPhoto(blog.path)}
                      alt="Blog post cover image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="rounded-t-box group-hover:scale-105 transition-transform duration-300"
                    />
                  </figure>
                  <div className="card-body p-6">
                    <div className="flex justify-end">
                      <span
                        className="text-xs text-base-content/60"
                        suppressHydrationWarning
                      >
                        {new Date(blog.created).toLocaleDateString("en-US", options)}
                      </span>
                    </div>
                    <div>
                    <Link
                      href="/blogs/[slug]"
                      as={`/blogs/${blog.path}`}
                      className="card-title w-full text-2xl text-primary hover:underline"
                    >
                      {uniformCardTitle || "Untitled"}
                    </Link>
                    </div>
                    <div className="text-lg text-base-content/80 line-clamp-3" dangerouslySetInnerHTML={{ __html: uniformCardByline }}></div>

                    <div className="mt-3 flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-3">
                      <div className="avatar">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden border border-base-300">
                          <Image
                            src={blog.image || getSeededStockPhoto(`${blog.path}-artist`) }
                            alt={`${MOCK_ARTIST_NAME} avatar`}
                            fill
                            sizes="48px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-base-content">{MOCK_ARTIST_NAME}</p>
                        <p className="text-xs uppercase tracking-wide text-base-content/60">Gallery</p>
                      </div>
                    </div>
                    
                    {/* Social Section (Mock-ready for live wiring) */}
                    <div className="relative mt-4 border-t border-base-300 pt-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <SocialReactions
                          targetId={`blog-${blog.path}`}
                          targetType="post"
                          initialReactions={initialReactions}
                          currentUser={currentSocialUser}
                          size="sm"
                          onReactionAdd={async (payload) => {
                            if (process.env.DEBUG === "true") {
                              console.log("[Mock reaction add]", payload);
                            }
                          }}
                          onReactionRemove={async (payload) => {
                            if (process.env.DEBUG === "true") {
                              console.log("[Mock reaction remove]", payload);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <button
                        type="button"
                        onClick={() => setOpenCommentsFor((prev) => (prev === blog.path ? null : blog.path))}
                        className="btn btn-sm btn-outline w-full justify-center gap-2"
                        title="Show top comments"
                      >
                        <MessageCircleIcon className="w-4 h-4" />
                        <span>{commentCount} comments</span>
                      </button>

                      {openCommentsFor === blog.path && (
                        <div className="rounded-box border border-base-300 bg-base-100 p-3 shadow-md">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Top Comments (Mock)
                          </div>
                          <ul className="space-y-2">
                            {topComments.map((comment) => (
                              <li key={comment.id} className="rounded-md bg-base-200/70 p-2">
                                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                                  <span className="font-semibold text-base-content/80">{comment.author}</span>
                                  <span className="text-base-content/50">{comment.likes} likes</span>
                                </div>
                                <p className="text-sm text-base-content/75">{comment.body}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </SocialRealtimeProvider>
  )
}

Blog.getInitialProps = async () => {
  const api_url = getApiURL()
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

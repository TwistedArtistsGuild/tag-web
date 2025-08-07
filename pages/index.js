/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

"use client"

import React from "react"

import styles from "/styles/pages/index.module.css"
import TagSEO from "@/components/TagSEO"
import Hero from "@/components/Hero"
import FAQ from "@/components/FAQ"
import CTA from "@/components/CTA"

/**
 * Home/index page component
 * Serves as the landing page for the site
 * Uses flex layout to ensure proper content flow and footer positioning
 *
 * @returns {JSX.Element} Home page component with hero, parallax sections, FAQ, and CTA
 */
export default function Home() {
  const pageMetaData = {
    title: "Twisted Artists Guild (TAG) Main Page",
    description: "A social media site that hosts art portfolios and helps artists to do business",
    keywords: "blog, art, business, news, events, management, cloud services, tickets, e-commerce, sales",
    robots: "index, follow",
    author: "Bobb Shields",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: "Twisted Artists Guild (TAG) Main Page",
      description: "A social media site that hosts art portfolios and helps artists to do business",
    },
  }

  return (
    <div className="flex flex-col w-full">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="" />

      <div className={`${styles.container} bg-base-100 text-base-content w-full`}>
        <div className="space-y-10 w-full">
          {/* Parallax Banner Section */}
          <section className={`${styles.parallax} flex flex-col`} aria-label="Featured Messages">
            <div className={`${styles.bgColor} bg-primary`}>
              <div className={`${styles.gradient} p-10`}>
                <span className={`${styles.leftTextContent} text-2xl font-bold`}>A platform made for artists.</span>
              </div>
            </div>
            <div className={`${styles.bgColor} bg-secondary`}>
              <div className={`${styles.gradient} p-10`}>
                <span className={`${styles.centerTextContent} text-2xl font-bold`}>A digital revolution.</span>
              </div>
            </div>
            <div className={`${styles.bgColor} bg-accent`}>
              <div className={`${styles.gradient} p-10`}>
                <span className={`${styles.rightTextContent} text-2xl font-bold`}>Tools at your fingertips.</span>
              </div>
            </div>
          </section>

          {/* Main Content Sections */}
          <Hero />
          <FAQ />
          <CTA />
        </div>
      </div>
    </div>
  )
}

// Use getInitialProps to pass sidebar data like other pages
Home.getInitialProps = async () => {
  // Sample data for left sidebar (navigation/filtering)
  const leftSidebarData = {
    artists: [
      {
        id: 1,
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=64&width=64",
        specialty: "Digital Art",
        rating: 4.9,
        location: "San Francisco, CA",
      },
      {
        id: 2,
        name: "Marcus Rodriguez",
        avatar: "/placeholder.svg?height=64&width=64",
        specialty: "Sculpture",
        rating: 4.8,
        location: "Austin, TX",
      },
      {
        id: 3,
        name: "Elena Volkov",
        avatar: "/placeholder.svg?height=64&width=64",
        specialty: "Photography",
        rating: 4.9,
        location: "New York, NY",
      },
    ],
    filters: [
      { label: "All Categories", value: "all" },
      { label: "Digital Art", value: "digital" },
      { label: "Traditional Art", value: "traditional" },
      { label: "Photography", value: "photography" },
      { label: "Sculpture", value: "sculpture" },
      { label: "Performance", value: "performance" },
    ],
  }

  // Sample data for right sidebar (cart/stories)
  const rightSidebarData = {
    cartItems: [
      {
        id: 1,
        name: "Digital Portrait Commission",
        price: 150.0,
        quantity: 1,
        image: "/placeholder.svg?height=48&width=48",
        artist: "Sarah Chen",
      },
      {
        id: 2,
        name: "Custom Sculpture",
        price: 450.0,
        quantity: 1,
        image: "/placeholder.svg?height=48&width=48",
        artist: "Marcus Rodriguez",
      },
      {
        id: 3,
        name: "Photography Print Set",
        price: 75.0,
        quantity: 2,
        image: "/placeholder.svg?height=48&width=48",
        artist: "Elena Volkov",
      },
    ],
    stories: [
      {
        id: 1,
        author: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        content: "Just finished my latest digital piece! Really excited about the color palette I chose.",
        timestamp: "2 hours ago",
      },
      {
        id: 2,
        author: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        content: "Working on a new commission today. The client wants something really unique!",
        timestamp: "4 hours ago",
      },
      {
        id: 3,
        author: "Marcus Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        content: "Found some amazing clay at the local art supply store. Can't wait to start sculpting!",
        timestamp: "1 day ago",
      },
    ],
  }

  return {
    sidebarProps: {
      leftSidebarData,
      rightSidebarData,
    },
  }
}

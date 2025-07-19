/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

"use client"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import ListingCard from "/components/card_listing"

/**
 * Function to generate a random number for social counters
 */
const getRandomCount = () => Math.floor(Math.random() * 1000) + 1 // Random number between 1 and 1000

/**
 * Generates fake listings to demonstrate various art categories
 * @returns {Array} Array of fake listing objects with proper structure for ListingCard component
 */
const generateFakeListings = () => {
  return [
    // Sculpture Category
    {
      listingid: "fake-1",
      title: "Bronze Dragon Sculpture",
      description:
        "Hand-crafted bronze dragon sculpture with incredible detail. Perfect centerpiece for fantasy enthusiasts.",
      price: 1299.99,
      path: "bronze-dragon",
      created: new Date().toISOString(),
      artist: {
        title: "Molten Hands Studio",
        path: "molten-hands",
      },
      artCategory: {
        category: "Sculpture",
      },
      profilePic: {
        url: "https://picsum.photos/seed/dragon/400/300",
        alttext: "Bronze dragon sculpture",
      },
      featured: true,
      loves: getRandomCount(), // Added social counters
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-7",
      title: "Marble Abstract Form",
      description: "Elegant white marble sculpture featuring flowing abstract forms. Height: 18 inches.",
      price: 899.99,
      path: "marble-abstract",
      created: new Date().toISOString(),
      artist: {
        title: "Chisel & Stone",
        path: "chisel-stone",
      },
      artCategory: {
        category: "Sculpture",
      },
      profilePic: {
        url: "https://picsum.photos/seed/marble/400/300",
        alttext: "Marble abstract sculpture",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-8",
      title: "Recycled Metal Wildlife",
      description:
        "Eco-friendly sculpture made from reclaimed metal parts. This majestic eagle has a wingspan of 24 inches.",
      price: 450.0,
      path: "recycled-eagle",
      created: new Date().toISOString(),
      artist: {
        title: "Scrap Metal Visionaries",
        path: "scrap-visionaries",
      },
      artCategory: {
        category: "Sculpture",
      },
      profilePic: {
        url: "https://picsum.photos/seed/metal/400/300",
        alttext: "Recycled metal eagle sculpture",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },

    // Painting Category
    {
      listingid: "fake-2",
      title: "Abstract Sunset Painting",
      description: 'Vibrant acrylic painting on canvas showcasing a dreamlike sunset over water. Measures 24" x 36".',
      price: 450.0,
      path: "abstract-sunset",
      created: new Date().toISOString(),
      artist: {
        title: "ColorScape Arts",
        path: "colorscape",
      },
      artCategory: {
        category: "Painting",
      },
      profilePic: {
        url: "https://picsum.photos/seed/sunset/400/300",
        alttext: "Abstract sunset painting",
      },
      featured: true,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-9",
      title: "Impressionist Garden Scene",
      description:
        "Oil painting inspired by classic Impressionist techniques. This garden scene bursts with color and light.",
      price: 675.0,
      path: "garden-impression",
      created: new Date().toISOString(),
      artist: {
        title: "Light & Palette Studio",
        path: "light-palette",
      },
      artCategory: {
        category: "Painting",
      },
      profilePic: {
        url: "https://picsum.photos/seed/garden/400/300",
        alttext: "Impressionist garden painting",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-10",
      title: "Urban Night Cityscape",
      description: "Moody cityscape captured in oil paints with dramatic lighting. Framed and ready to hang.",
      price: 525.0,
      path: "night-cityscape",
      created: new Date().toISOString(),
      artist: {
        title: "Metropolitan Arts",
        path: "metro-arts",
      },
      artCategory: {
        category: "Painting",
      },
      profilePic: {
        url: "https://picsum.photos/seed/city/400/300",
        alttext: "Urban night cityscape painting",
      },
      featured: true,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },

    // Photography Category
    {
      listingid: "fake-3",
      title: "Urban Wildlife Photography Series",
      description:
        "Limited edition print series documenting wildlife in unexpected urban environments. Signed by the artist.",
      price: 275.0,
      path: "urban-wildlife",
      created: new Date().toISOString(),
      artist: {
        title: "City Lens Collective",
        path: "city-lens",
      },
      artCategory: {
        category: "Photography",
      },
      profilePic: {
        url: "https://picsum.photos/seed/wildlife/400/300",
        alttext: "Urban wildlife photograph",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-11",
      title: "Abandoned Places Collection",
      description: "Hauntingly beautiful photographs of forgotten places. Limited edition prints on archival paper.",
      price: 325.0,
      path: "abandoned-places",
      created: new Date().toISOString(),
      artist: {
        title: "Forgotten Frames",
        path: "forgotten-frames",
      },
      artCategory: {
        category: "Photography",
      },
      profilePic: {
        url: "https://picsum.photos/seed/abandoned/400/300",
        alttext: "Abandoned building photograph",
      },
      featured: true,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-12",
      title: "Macro Nature Study",
      description: "Extreme close-up photography revealing the hidden world of insects and flowers. Set of 3 prints.",
      price: 225.0,
      path: "macro-nature",
      created: new Date().toISOString(),
      artist: {
        title: "Tiny Worlds Studio",
        path: "tiny-worlds",
      },
      artCategory: {
        category: "Photography",
      },
      profilePic: {
        url: "https://picsum.photos/seed/macro/400/300",
        alttext: "Macro nature photography",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },

    // Crochet Category
    {
      listingid: "fake-4",
      title: "Handmade Crochet Blanket",
      description:
        "Luxurious handmade crochet blanket with intricate pattern. Made with 100% merino wool in beautiful earth tones.",
      price: 189.99,
      path: "crochet-blanket",
      created: new Date().toISOString(),
      artist: {
        title: "Yarn Dreams",
        path: "yarn-dreams",
      },
      artCategory: {
        category: "Crochet",
      },
      profilePic: {
        url: "https://picsum.photos/seed/blanket/400/300",
        alttext: "Handmade crochet blanket",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-13",
      title: "Amigurumi Fantasy Creatures",
      description: "Adorable hand-crocheted fantasy creatures including a dragon, unicorn, and phoenix. Perfect gifts!",
      price: 45.99,
      path: "amigurumi-creatures",
      created: new Date().toISOString(),
      artist: {
        title: "Hook & Stitch Magic",
        path: "hook-stitch",
      },
      artCategory: {
        category: "Crochet",
      },
      profilePic: {
        url: "https://picsum.photos/seed/amigurumi/400/300",
        alttext: "Amigurumi fantasy creatures",
      },
      featured: true,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-14",
      title: "Crochet Wall Hanging",
      description: "Bohemian-inspired wall hanging made with organic cotton yarns and driftwood. One-of-a-kind piece.",
      price: 120.0,
      path: "crochet-wallhanging",
      created: new Date().toISOString(),
      artist: {
        title: "Fiber Art Collective",
        path: "fiber-collective",
      },
      artCategory: {
        category: "Crochet",
      },
      profilePic: {
        url: "https://picsum.photos/seed/wallhanging/400/300",
        alttext: "Crochet wall hanging",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },

    // Digital Services Category
    {
      listingid: "fake-5",
      title: "Custom Website Development",
      description:
        "Professional website development services tailored to artists and creative businesses. Includes responsive design and SEO optimization.",
      price: 1499.0,
      path: "website-development",
      created: new Date().toISOString(),
      artist: {
        title: "Web Canvas Studio",
        path: "web-canvas",
      },
      artCategory: {
        category: "Digital Services",
      },
      profilePic: {
        url: "https://picsum.photos/seed/website/400/300",
        alttext: "Web development illustration",
      },
      featured: true,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-15",
      title: "Digital Art Portfolio Creation",
      description:
        "Custom digital portfolio design to showcase your artwork with striking presentation. Includes up to 10 gallery pages.",
      price: 650.0,
      path: "portfolio-creation",
      created: new Date().toISOString(),
      artist: {
        title: "Portfolio Pro",
        path: "portfolio-pro",
      },
      artCategory: {
        category: "Digital Services",
      },
      profilePic: {
        url: "https://picsum.photos/seed/portfolio/400/300",
        alttext: "Digital portfolio example",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-16",
      title: "E-Commerce Art Shop Setup",
      description:
        "Complete setup of your online art store with payment processing, inventory management, and beautiful product displays.",
      price: 1250.0,
      path: "ecommerce-setup",
      created: new Date().toISOString(),
      artist: {
        title: "Digital Artisan Solutions",
        path: "digital-artisan",
      },
      artCategory: {
        category: "Digital Services",
      },
      profilePic: {
        url: "https://picsum.photos/seed/ecommerce/400/300",
        alttext: "E-commerce shop example",
      },
      featured: true,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },

    // Performance Art Category
    {
      listingid: "fake-6",
      title: "Aerial Silk Performance",
      description:
        "Book our aerial silk performers for your next event. Stunning choreography that will leave your guests speechless.",
      price: 850.0,
      path: "aerial-silk",
      created: new Date().toISOString(),
      artist: {
        title: "Sky Dancers Collective",
        path: "sky-dancers",
      },
      artCategory: {
        category: "Performance Art",
      },
      profilePic: {
        url: "https://picsum.photos/seed/circus/400/300",
        alttext: "Aerial silk performance",
      },
      featured: true,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-17",
      title: "Fire Dancing Show",
      description:
        "Mesmerizing fire dancing performance featuring skilled artists with poi, staff, and hoop. Perfect for evening events.",
      price: 750.0,
      path: "fire-dancing",
      created: new Date().toISOString(),
      artist: {
        title: "Flame Artistry",
        path: "flame-artistry",
      },
      artCategory: {
        category: "Performance Art",
      },
      profilePic: {
        url: "https://picsum.photos/seed/fire/400/300",
        alttext: "Fire dancing performance",
      },
      featured: false,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
    {
      listingid: "fake-18",
      title: "Interactive Theater Experience",
      description:
        "Immersive theater performance where audience members become part of the story. Custom themes available.",
      price: 1200.0,
      path: "interactive-theater",
      created: new Date().toISOString(),
      artist: {
        title: "Fourth Wall Breakers",
        path: "fourth-wall",
      },
      artCategory: {
        category: "Performance Art",
      },
      profilePic: {
        url: "https://picsum.photos/seed/theater/400/300",
        alttext: "Interactive theater performance",
      },
      featured: true,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
    },
  ]
}

/**
 *
 * @param {*} props
 * @returns
 */
const Listings = (props) => {
  const [open, setOpen] = useState(false)

  const pageMetaData = {
    title: "TAG Art Listings Main Page",
    description: "Explore art through Bloomscrolling",
    keywords: "listing, art, sales, e-commerce",
    robots: "index, follow",
    author: "Bobb Shields",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: "TAG Art Listings Main Page",
      description: "Explore art through Bloomscrolling",
    },
  }

  return (
    <div className="min-h-screen bg-gray-100 text-base-content py-8 px-4">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="listings" />

      {/* Dynamic listings section */}
      <div className="my-16 container mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-primary">Random Art Selection</h3>
        <p className="mb-10 text-lg text-gray-700">
          Explore a curated selection of random art pieces to inspire your creativity.
        </p>
        <div className="grid grid-cols-1 gap-20 mb-24">
          {props.listings.map((listing) => (
            <div key={listing.listingid} className="flex justify-center">
              <div className="w-full max-w-3xl">
                <ListingCard listing={listing} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fake listings section with more reasonable staggered spacing */}
      <div className="mt-24 mb-20 container mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center text-primary">Coming Soon: Bloomscrolling</h3>
        <p className="mb-12 text-xl text-center max-w-4xl mx-auto text-gray-700">
          Imagine endlessly viewing listings from our artistic community, with no advertisements!.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-16">
          {props.fakeListings.map((listing, index) => (
            <div
              key={listing.listingid}
              className={`flex justify-center ${
                // Add staggered positioning with more reasonable spacing
                index % 4 === 0 ? "mt-0" : index % 4 === 1 ? "mt-20" : index % 4 === 2 ? "mt-8" : "mt-28"
              } transition-all duration-700`}
            >
              <div className="w-full max-w-2xl transform transition-transform duration-300 hover:scale-105 hover:z-10">
                <ListingCard listing={listing} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

Listings.getInitialProps = async (context) => {
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
  const { query } = context

  let data = []
  let status = 200

  try {
    const queryParams = new URLSearchParams(query).toString()
    const res = await fetch(`${api_url}listing/?${queryParams}`)
    status = res.status
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${status}`)
    }
    data = await res.json()
  } catch (error) {
    console.error("An error has occurred with your fetch request: ", error)
  }

  // Generate fake listings for demonstration
  const fakeListings = generateFakeListings()

  return {
    listings: data,
    fakeListings,
    status: status,
  }
}

export default Listings

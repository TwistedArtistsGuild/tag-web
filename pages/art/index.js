/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import ListingCard from "/components/card_listing"
import { getRandomStockPhotoByCategory } from "@/utils/stockPhotos"

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
  const pageMetaData = {
    title: "TAG Art Listings Main Page",
    description: "Explore art through Bloomscrolling",
    keywords: "art, sculpture, painting, digital, gallery",
    robots: "index, follow",
    author: "Bobb Shields",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: "TAG Art Listings Main Page",
      description: "Explore art through Bloomscrolling",
    },
  }
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="listings" />
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-primary">
          Art Listings
        </h1>
        <p className="text-xl md:text-2xl text-secondary mb-6">
          Explore a curated selection of art pieces to inspire your creativity.
        </p>
      </section>
      <main className="container mx-auto px-4 py-8 flex-1 w-full">
        {/* Dynamic listings section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Featured Art</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {props.listings.map((listing) => (
              <div key={listing.listingid} className="flex justify-center">
                <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full max-w-3xl">
                  <ListingCard listing={listing} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Fake listings section */}
        <div className="mt-24 mb-20">
          <h3 className="text-3xl font-bold mb-8 text-center">Coming Soon: Bloomscrolling</h3>
          <p className="mb-12 text-xl text-center max-w-4xl mx-auto">Imagine endlessly viewing listings from our artistic community, with no advertisements!.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {props.fakeListings.map((listing) => (
              <div key={listing.listingid} className="flex justify-center">
                <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full max-w-2xl">
                  <ListingCard listing={listing} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
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

  // Generate some fake artists for sidebar
  const featuredArtists = [
    {
      id: "sidebar-artist-1",
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg?height=48&width=48",
      specialty: "Abstract Painting",
      rating: 4.8,
      location: "San Francisco, CA"
    },
    {
      id: "sidebar-artist-2", 
      name: "Marcus Chen",
      avatar: "/placeholder.svg?height=48&width=48",
      specialty: "Digital Sculpture",
      rating: 4.9,
      location: "Portland, OR"
    },
    {
      id: "sidebar-artist-3",
      name: "Sophia Williams",
      avatar: "/placeholder.svg?height=48&width=48", 
      specialty: "Mixed Media",
      rating: 4.7,
      location: "Austin, TX"
    }
  ]

  return {
    listings: data,
    fakeListings,
    status: status,
    sidebarProps: {
      leftSidebarData: {
        artists: featuredArtists,
        contentType: "artists",
        filters: [
          { label: "All Art", value: "all" },
          { label: "Paintings", value: "paintings" },
          { label: "Sculptures", value: "sculptures" },
          { label: "Digital Art", value: "digital" },
          { label: "Photography", value: "photography" },
          { label: "Mixed Media", value: "mixed" },
          { label: "Under $100", value: "budget" },
          { label: "$100 - $500", value: "mid" },
          { label: "Premium", value: "premium" }
        ]
      },
      rightSidebarData: {
        cartItems: [
          {
            id: "art-cart-1",
            name: "Abstract Digital Print",
            price: 85.0,
            quantity: 1,
            image: getRandomStockPhotoByCategory('painting'),
            artist: "Elena Rodriguez"
          },
          {
            id: "art-cart-2",
            name: "Sculpture Commission",
            price: 340.0,
            quantity: 1,
            image: getRandomStockPhotoByCategory('general'),
            artist: "Marcus Chen"
          },
          {
            id: "art-cart-3",
            name: "Photography Bundle",
            price: 120.0,
            quantity: 2,
            image: getRandomStockPhotoByCategory('general'),
            artist: "Sophia Williams"
          },
          {
            id: "art-cart-4",
            name: "Mixed Media Piece",
            price: 200.0,
            quantity: 1,
            image: getRandomStockPhotoByCategory('painting'),
            artist: "Various Artists"
          }
        ],
        stories: [
          {
            id: "art-story-1",
            author: "Art Collector",
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "Just discovered this amazing piece! The technique and composition are absolutely stunning.",
            timestamp: "30 minutes ago"
          },
          {
            id: "art-story-2",
            author: "Gallery Director", 
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "New arrivals this week include some exceptional contemporary works. Don't miss out!",
            timestamp: "3 hours ago"
          },
          {
            id: "art-story-3",
            author: "Art Critic",
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "The emerging talent in our community continues to amaze me. Such innovative approaches to traditional mediums.",
            timestamp: "6 hours ago"
          },
          {
            id: "art-story-4",
            author: "Student Artist",
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "Learned so much from studying the pieces in this collection. Inspiration everywhere!",
            timestamp: "1 day ago"
          },
          {
            id: "art-story-5",
            author: "Curator",
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "Planning our next exhibition theme. The diversity of styles here is perfect for our spring show.",
            timestamp: "2 days ago"
          }
        ],
        notifications: [
          {
            id: "art-notif-1",
            message: "Flash sale: 20% off all digital prints this weekend!",
            type: "success"
          },
          {
            id: "art-notif-2",
            message: "New artwork uploaded by featured artists",
            type: "info"
          }
        ]
      }
    }
  }
}

export default Listings

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BuildingIcon, GraduationCapIcon, CheckIcon, HeartIcon, MessageCircleIcon, EyeIcon, CalendarIcon } from "lucide-react"
import { getRandomStockPhotoByCategory } from "@/utils/stockPhotos"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import { useState } from "react"

/**
 * Events landing page showcasing the vision for TAG events
 * Features both performance art events and academic support offerings
 */
export default function EventsLanding() {
  // Social data state for events
  const [socialData, setSocialData] = useState({
    "music-events": { views: 2145, loves: 234, comments: 87, shares: 156, attending: 89 },
    "circus-acrobatics": { views: 1876, loves: 189, comments: 64, shares: 128, attending: 67 },
    "dance-performance": { views: 2567, loves: 312, comments: 103, shares: 201, attending: 134 },
    "sculpture-workshop": { views: 1234, loves: 145, comments: 56, shares: 89, attending: 78 },
    "mixed-media": { views: 1654, loves: 198, comments: 72, shares: 134, attending: 92 }
  });

  const handleSocialAction = (eventId, action) => {
    setSocialData(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [action]: prev[eventId][action] + 1
      }
    }));
  };

  return (
    <SocialRealtimeProvider>
    <div className="min-h-screen bg-gray-100 text-base-content">
      <Head>
        <title>Twisted Artists Guild | Events</title>
        <meta
          name="description"
          content="Discover extraordinary performances and educational experiences with Twisted Artists Guild"
        />
      </Head>
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Experience Performance Art Event Management Like Never Before
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
            Where performance meets passion and education ignites creativity
          </p>
          {/* Social Features Badge */}
          <div className="badge badge-secondary badge-lg gap-2 mb-6">
            <CalendarIcon className="w-4 h-4" />
            <span>Event Social Features Enabled</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events/upcoming" className="btn btn-primary btn-lg">
              Upcoming Events
            </Link>
            <Link href="/events/tickets" className="btn btn-secondary btn-lg">
              Get Tickets
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg"
            alt="Band performing for a crowd at an event"
            fill
            priority
            className="object-cover"
            unoptimized
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Vision Statement */}
        <section className="py-12 bg-base-100 rounded-box shadow-lg px-6 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Our Vision</h2>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              At Twisted Artists Guild, we believe in creating transformative experiences through the power of art. Our
              events bring together diverse artistic expressions, fostering community engagement and cultural enrichment
              while supporting artists in their creative journeys.
            </p>
          </div>
        </section>

        

        {/* Performance Art Section */}
        <section className="py-12 bg-base-100 rounded-box shadow-lg px-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary text-center">Performance Art</h2>
          <p className="text-xl text-center mb-12 text-secondary">
            A performance is art on display at a venue for a given time
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Performance Card 1: Music Events */}
            <div className="card bg-base-200 shadow-xl image-full overflow-hidden group">
              <figure>
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-joshsorenson-995301-drummer.jpg"
                  alt="Drummer performing on stage"
                  width={600}
                  height={400}
                  className="w-full group-hover:scale-105 transition-transform duration-300"
                  style={{ objectFit: "cover" }}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl text-white">Music Events</h3>
                <p className="text-white">
                  Experience electrifying performances from bands and DJs that push the boundaries of sound.
                </p>
                
                {/* Enhanced Social Section */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-white/80">
                      <EyeIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData["music-events"].views}</span>
                    </div>
                    <button 
                      onClick={() => handleSocialAction("music-events", 'loves')}
                      className="flex items-center gap-1 text-red-400 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <HeartIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData["music-events"].loves}</span>
                    </button>
                    <div className="flex items-center gap-1 text-white/80">
                      <MessageCircleIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData["music-events"].comments}</span>
                    </div>
                    <button 
                      onClick={() => handleSocialAction("music-events", 'attending')}
                      className="flex items-center gap-1 text-green-400 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData["music-events"].attending}</span>
                    </button>
                  </div>
                </div>
                
                <div className="card-actions justify-end">
                  <div className="badge badge-outline text-white border-white">Music</div>
                  <div className="badge badge-primary">Live</div>
                </div>
              </div>
            </div>
            {/* Performance Card 2: Circus & Acrobatics (using a general performance image) */}
            <div className="card bg-base-200 shadow-xl image-full overflow-hidden">
              <figure>
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-victorfreitas-733767-sultrysax.jpg"
                  alt="Saxophone player performing"
                  width={600}
                  height={400}
                  className="w-full"
                  style={{ objectFit: "cover" }}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl text-white">Circus & Acrobatics</h3>
                <p className="text-white">
                  Be amazed by gravity-defying performances that blend artistry with physical prowess.
                </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline text-white border-white">Circus</div>
                  <div className="badge badge-primary">Performances</div>
                </div>
              </div>
            </div>
            {/* Performance Card 3: Theater & Dance */}
            <div className="card bg-base-200 shadow-xl image-full overflow-hidden">
              <figure>
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-marcela-alessandra-789314-1885213-pianist.jpg"
                  alt="Pianist performing on stage"
                  width={600}
                  height={400}
                  className="w-full"
                  style={{ objectFit: "cover" }}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl text-white">Theater & Dance</h3>
                <p className="text-white">
                  Immerse yourself in storytelling through movement and drama from innovative troupes.
                </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline text-white border-white">Performing Arts</div>
                  <div className="badge badge-primary">Tickets</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <div className="p-6 bg-base-200 rounded-lg max-w-2xl mx-auto text-gray-700">
              <p className="text-lg mb-4">
                <span className="font-bold">Every event offers tickets</span> - whether free or for purchase - providing
                access to extraordinary artistic experiences.
              </p>
              <p className="text-lg">
                Take home a piece of the experience with our <span className="font-bold">branded merchandise</span>,
                supporting artists while showcasing your love for the arts.
              </p>
            </div>
          </div>
        </section>
        {/* Academic Support Section */}
        <section className="py-12 bg-base-100 rounded-box shadow-lg px-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary text-center">Academic Support</h2>
          <p className="text-xl text-center mb-12 text-secondary">
            Education and exhibitions that inspire and nurture artistic talent
          </p>
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mb-6">
                <BuildingIcon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Museums & Exhibitions</h3>
              <p className="text-lg text-gray-700">
                We partner with museums and galleries to bring curated exhibitions that showcase diverse artistic
                expressions. These collaborations create spaces where art can be experienced, contemplated, and
                discussed.
              </p>
              <ul className="mt-6 space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </span>
                  Curated exhibitions
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </span>
                  Artist talks and panels
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </span>
                  Interactive installations
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mb-6">
                <GraduationCapIcon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Classes & Workshops</h3>
              <p className="text-lg text-gray-700">
                Our educational programs connect aspiring artists with experts in various fields. From beginner
                workshops to advanced masterclasses, we foster learning environments that encourage growth and
                experimentation.
              </p>
              <ul className="mt-6 space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </span>
                  Hands-on workshops
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </span>
                  Expert-led masterclasses
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </span>
                  Ongoing education series
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-purple-800 to-pink-700 rounded-box shadow-lg px-6 mb-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Experience the Art?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
              Join us at our next event or workshop and become part of our creative community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events/calendar" className="btn btn-lg glass">
                Event Calendar
              </Link>
              <Link href="/newsletter" className="btn btn-lg btn-primary">
                Subscribe to Updates
              </Link>
            </div>
          </div>
        </section>
        {/* Testimonials */}
        <section className="py-12 bg-base-100 rounded-box shadow-lg px-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary text-center">What Attendees Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700">
                  "The dance performance was absolutely mesmerizing. I've never seen such a perfect blend of technique
                  and emotion. Worth every penny!"
                </p>
                <div className="mt-4">
                  <h3 className="font-bold text-primary">Maria J.</h3>
                  <p className="text-sm opacity-70 text-gray-600">Dance performance attendee</p>
                </div>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700">
                  "The sculpture workshop completely changed how I approach my art. The instructor was knowledgeable and
                  provided personalized guidance."
                </p>
                <div className="mt-4">
                  <h3 className="font-bold text-primary">David R.</h3>
                  <p className="text-sm opacity-70 text-gray-600">Workshop participant</p>
                </div>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700">
                  "The exhibition was incredible - such diverse perspectives and styles. I left feeling inspired and
                  with a deeper appreciation for contemporary art."
                </p>
                <div className="mt-4">
                  <h3 className="font-bold text-primary">Sarah T.</h3>
                  <p className="text-sm opacity-70 text-gray-600">Exhibition visitor</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    </SocialRealtimeProvider>
  )
}

EventsLanding.getInitialProps = async () => {
  // Generate sample events for sidebar
  const upcomingEvents = [
    {
      id: "event-1",
      name: "Contemporary Art Exhibition", 
      date: "March 15, 2025",
      location: "TAG Gallery Downtown",
      description: "Featuring emerging local artists"
    },
    {
      id: "event-2",
      name: "Performance Art Workshop",
      date: "March 22, 2025", 
      location: "Community Arts Center",
      description: "Interactive workshop for all skill levels"
    },
    {
      id: "event-3",
      name: "Artist Talk & Networking",
      date: "April 5, 2025",
      location: "Virtual Event",
      description: "Connect with fellow artists and creators"
    }
  ]

  // Featured artists for events
  const featuredArtists = [
    {
      id: "event-artist-1",
      name: "Jordan Kim",
      avatar: "/placeholder.svg?height=48&width=48",
      specialty: "Performance Art",
      rating: 4.9,
      location: "Seattle, WA"
    },
    {
      id: "event-artist-2",
      name: "Alex Thompson", 
      avatar: "/placeholder.svg?height=48&width=48",
      specialty: "Installation Art",
      rating: 4.8,
      location: "Denver, CO"
    }
  ]

  return {
    sidebarProps: {
      leftSidebarData: {
        events: upcomingEvents,
        artists: featuredArtists,
        contentType: "events",
        filters: [
          { label: "All Events", value: "all" },
          { label: "Exhibitions", value: "exhibitions" },
          { label: "Workshops", value: "workshops" },
          { label: "Performances", value: "performances" },
          { label: "Virtual Events", value: "virtual" },
          { label: "Free Events", value: "free" },
          { label: "This Week", value: "week" },
          { label: "This Month", value: "month" }
        ]
      },
      rightSidebarData: {
        cartItems: [
          {
            id: "event-cart-1",
            name: "Workshop: Digital Art Basics",
            price: 45.0,
            quantity: 1,
            image: getRandomStockPhotoByCategory('general'),
            artist: "TAG Education"
          },
          {
            id: "event-cart-2",
            name: "Exhibition VIP Pass",
            price: 25.0,
            quantity: 2,
            image: getRandomStockPhotoByCategory('painting'),
            artist: "TAG Gallery"
          },
          {
            id: "event-cart-3",
            name: "Performance Art Ticket",
            price: 30.0,
            quantity: 1,
            image: getRandomStockPhotoByCategory('artist'),
            artist: "TAG Performances"
          },
          {
            id: "event-cart-4",
            name: "Artist Meet & Greet",
            price: 15.0,
            quantity: 1,
            image: getRandomStockPhotoByCategory('general'),
            artist: "TAG Events"
          }
        ],
        stories: [
          {
            id: "event-story-1",
            author: "Event Organizer",
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "Exciting lineup for this month's events! Don't forget to register early for the workshop spots.",
            timestamp: "1 hour ago"
          },
          {
            id: "event-story-2",
            author: "Artist Coordinator",
            avatar: getRandomStockPhotoByCategory('artist'), 
            content: "Last week's performance was absolutely incredible. The energy from the audience was amazing!",
            timestamp: "2 days ago"
          },
          {
            id: "event-story-3",
            author: "Workshop Instructor",
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "Seeing students discover their artistic voice never gets old. Next workshop starts Monday!",
            timestamp: "3 days ago"
          },
          {
            id: "event-story-4",
            author: "Gallery Visitor",
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "The current exhibition completely blew my mind. Such innovative approaches to traditional themes.",
            timestamp: "4 days ago"
          },
          {
            id: "event-story-5",
            author: "Performance Artist",
            avatar: getRandomStockPhotoByCategory('artist'),
            content: "Thrilled to be part of next month's showcase. Can't wait to share my new piece with everyone!",
            timestamp: "1 week ago"
          }
        ],
        notifications: [
          {
            id: "event-notif-1",
            message: "Workshop registration opens tomorrow at 9 AM",
            type: "info"
          },
          {
            id: "event-notif-2",
            message: "Limited spots available for VIP exhibition preview",
            type: "warning"
          },
          {
            id: "event-notif-3",
            message: "Early bird pricing ends this Friday!",
            type: "success"
          }
        ]
      }
    }
  }
}

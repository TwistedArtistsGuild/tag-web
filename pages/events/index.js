/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BuildingIcon, GraduationCapIcon, CheckIcon, FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react"

/**
 * Events landing page showcasing the vision for TAG events
 * Features both performance art events and academic support offerings
 */
export default function EventsLanding() {
  return (
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

        {/* News Service Section */}
        <section className="py-12 bg-base-100 rounded-box shadow-lg px-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary text-center">
            🎙️ Twisted Artists Guild News Service
          </h2>
          <p className="text-xl text-center mb-12 text-secondary">
            Amplifying artist voices. Exploring the pulse of creativity.
          </p>

          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg text-gray-700 mb-6">
              The TAG News Service is a storytelling initiative powered by our marketing department, designed to
              spotlight the lives, ideas, and creative journeys of our cooperative’s members. Through rich interviews,
              cultural coverage, and market research, we document what it means to be a working artist today—with
              integrity, curiosity, and a community-first lens.
            </p>
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2 text-primary">
              ✨ Our Purpose
            </h3>
            <p className="text-lg text-gray-700">
              Our journalist team works at the intersection of marketing and editorial, blending narrative storytelling
              with cooperative insight. They conduct interviews from scripted research prompts, capture close-up
              conversations with artists, and produce engaging social content that benefits visibility and discovery.
            </p>
            <p className="text-lg text-gray-700 mt-4">
              While rooted in marketing, this branch of TAG follows ethical journalistic standards. In addition to
              research-driven interviews, our writers pursue broader art coverage—from gallery openings and emerging
              trends to artist-led movements—always centered on the voices of creators.
            </p>
          </div>

          <h3 className="text-xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-primary">
            📚 Featured Articles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Article Card 1: Amina Rodriguez - Multidisciplinary Storyteller */}
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <figure className="relative h-48 w-full">
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg"
                  alt="Artist painting on a canvas"
                  fill
                  objectFit="cover"
                />
              </figure>
              <div className="card-body p-6">
                <h4 className="card-title text-xl text-primary">
                  Beyond the Canvas: Meet Amina Rodriguez, a Multidisciplinary Storyteller
                </h4>
                <p className="text-gray-700 text-sm">
                  Amina blends textile, digital collage, and immersive installations to explore identity and memory. We
                  unpack her process, her cooperative mindset, and how shared authorship shapes her latest exhibition.
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link href="#" className="btn btn-sm btn-outline btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            {/* Article Card 2: What Artists Really Need - Insights from Interviews */}
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <figure className="relative h-48 w-full">
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg"
                  alt="Artist's paint palette with brushes"
                  fill
                  objectFit="cover"
                />
              </figure>
              <div className="card-body p-6">
                <h4 className="card-title text-xl text-primary">
                  What Artists Really Need: Insights from Our Member Interviews
                </h4>
                <p className="text-gray-700 text-sm">
                  From tools to pricing, our journalists analyzed data from extended interviews with TAG members to
                  uncover what drives artist success—and what platforms must evolve to meet their needs.
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link href="#" className="btn btn-sm btn-outline btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            {/* Article Card 3: Art & Algorithms - Hacking AI for Good */}
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <figure className="relative h-48 w-full">
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg"
                  alt="Artist painting a large mural"
                  fill
                  objectFit="cover"
                />
              </figure>
              <div className="card-body p-6">
                <h4 className="card-title text-xl text-primary">
                  Art & Algorithms: How Creatives Are Hacking AI for Good
                </h4>
                <p className="text-gray-700 text-sm">
                  We explore how TAG artists are turning generative tech into collaborative tools—from training models
                  on personal portfolios to co-authoring with bots. This isn’t automation; it’s augmentation.
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link href="#" className="btn btn-sm btn-outline btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            {/* Article Card 4: The Studio is the Cooperative - Shared Governance */}
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <figure className="relative h-48 w-full">
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg"
                  alt="Artist working on a large mural in a studio"
                  fill
                  objectFit="cover"
                />
              </figure>
              <div className="card-body p-6">
                <h4 className="card-title text-xl text-primary">
                  The Studio is the Cooperative: Why Shared Governance Fuels Better Art
                </h4>
                <p className="text-gray-700 text-sm">
                  A deep dive into how collective decision-making—from stock buybacks to platform features—is rewriting
                  what creative ownership can look like. Hear from members building this new reality.
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link href="#" className="btn btn-sm btn-outline btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
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
            <div className="card bg-base-200 shadow-xl image-full overflow-hidden">
              <figure>
                <Image
                  src="https://tagstatic.blob.core.windows.net/pexels/pexels-joshsorenson-995301-drummer.jpg"
                  alt="Drummer performing on stage"
                  width={600}
                  height={400}
                  className="w-full"
                  style={{ objectFit: "cover" }}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl text-white">Music Events</h3>
                <p className="text-white">
                  Experience electrifying performances from bands and DJs that push the boundaries of sound.
                </p>
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
      {/* Footer with Newsletter Signup */}
      <footer className="py-10 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="mb-6">Be the first to know about upcoming events, workshops, and exclusive offers.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="input input-bordered flex-grow" />
              <button className="btn btn-primary">Subscribe</button>
            </form>
            <div className="mt-10 flex justify-center gap-6">
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook">
                <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Twitter">
                <TwitterIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

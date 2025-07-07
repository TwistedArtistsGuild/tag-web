/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Events landing page showcasing the vision for TAG events
 * Features both performance art events and academic support offerings
 */
export default function EventsLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white">
      <Head>
        <title>Twisted Artists Guild | Events</title>
        <meta name="description" content="Discover extraordinary performances and educational experiences with Twisted Artists Guild" />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Experience Performance Art Event Management Like Never Before
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
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
            src="/images/events-hero.jpg" 
            alt="Artistic event performance" 
            fill 
            priority
            className="object-cover"
            unoptimized 
          />
        </div>
      </div>

      {/* Vision Statement */}
      <section className="py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              At Twisted Artists Guild, we believe in creating transformative experiences through the power of art. 
              Our events bring together diverse artistic expressions, fostering community engagement and 
              cultural enrichment while supporting artists in their creative journeys.
            </p>
          </div>
        </div>
      </section>

      {/* Performance Art Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Performance Art</h2>
          <p className="text-xl text-center mb-16 text-purple-200">A performance is art on display at a venue for a given time</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Performance Card 1 */}
            <div className="card bg-base-100 shadow-xl image-full overflow-hidden">
              <figure>
                <Image src="/images/music-event.jpg" alt="Band performing at event" width={600} height={400} className="w-full" />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl">Music Events</h3>
                <p>Experience electrifying performances from bands and DJs that push the boundaries of sound.</p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">Music</div>
                  <div className="badge badge-primary">Live</div>
                </div>
              </div>
            </div>

            {/* Performance Card 2 */}
            <div className="card bg-base-100 shadow-xl image-full overflow-hidden">
              <figure>
                <Image src="/images/circus.jpg" alt="Circus performers" width={600} height={400} className="w-full" />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl">Circus & Acrobatics</h3>
                <p>Be amazed by gravity-defying performances that blend artistry with physical prowess.</p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">Circus</div>
                  <div className="badge badge-primary">Performances</div>
                </div>
              </div>
            </div>

            {/* Performance Card 3 */}
            <div className="card bg-base-100 shadow-xl image-full overflow-hidden">
              <figure>
                <Image src="/images/theater.jpg" alt="Theater performance" width={600} height={400} className="w-full" />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl">Theater & Dance</h3>
                <p>Immerse yourself in storytelling through movement and drama from innovative troupes.</p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">Performing Arts</div>
                  <div className="badge badge-primary">Tickets</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="p-6 bg-purple-900/50 rounded-lg max-w-2xl mx-auto">
              <p className="text-lg mb-4">
                <span className="font-bold">Every event offers tickets</span> - whether free or for purchase - 
                providing access to extraordinary artistic experiences.
              </p>
              <p className="text-lg">
                Take home a piece of the experience with our <span className="font-bold">branded merchandise</span>, 
                supporting artists while showcasing your love for the arts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Support Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Academic Support</h2>
          <p className="text-xl text-center mb-16 text-purple-200">Education and exhibitions that inspire and nurture artistic talent</p>
          
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Museums & Exhibitions</h3>
              <p className="text-lg text-gray-200">
                We partner with museums and galleries to bring curated exhibitions that showcase diverse artistic expressions.
                These collaborations create spaces where art can be experienced, contemplated, and discussed.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Curated exhibitions
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Artist talks and panels
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Interactive installations
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Classes & Workshops</h3>
              <p className="text-lg text-gray-200">
                Our educational programs connect aspiring artists with experts in various fields.
                From beginner workshops to advanced masterclasses, we foster learning environments
                that encourage growth and experimentation.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Hands-on workshops
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Expert-led masterclasses
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-500 rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Ongoing education series
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-800 to-pink-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Art?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
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
      <section className="py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Attendees Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100/10 backdrop-blur-sm shadow-xl">
              <div className="card-body">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p>"The dance performance was absolutely mesmerizing. I've never seen such a perfect blend of technique and emotion. Worth every penny!"</p>
                <div className="mt-4">
                  <h3 className="font-bold">Maria J.</h3>
                  <p className="text-sm opacity-70">Dance performance attendee</p>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100/10 backdrop-blur-sm shadow-xl">
              <div className="card-body">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p>"The sculpture workshop completely changed how I approach my art. The instructor was knowledgeable and provided personalized guidance."</p>
                <div className="mt-4">
                  <h3 className="font-bold">David R.</h3>
                  <p className="text-sm opacity-70">Workshop participant</p>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100/10 backdrop-blur-sm shadow-xl">
              <div className="card-body">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p>"The exhibition was incredible - such diverse perspectives and styles. I left feeling inspired and with a deeper appreciation for contemporary art."</p>
                <div className="mt-4">
                  <h3 className="font-bold">Sarah T.</h3>
                  <p className="text-sm opacity-70">Exhibition visitor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Newsletter Signup */}
      <footer className="py-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="mb-6">Be the first to know about upcoming events, workshops, and exclusive offers.</p>
            
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="input input-bordered flex-grow" />
              <button className="btn btn-primary">Subscribe</button>
            </form>
            
            <div className="mt-10 flex justify-center gap-6">
              <a href="#" className="text-gray-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState } from "react"
import TagSEO from "@/components/TagSEO"

export default function Contact() {
  const [hoveredSocial, setHoveredSocial] = useState(null)

  const pageMetaData = {
    title: "Connect with TAG - Twisted Artists Guild",
    description:
      "Creativity thrives in collaboration — and Twisted Artists Guild is where artists, thinkers, and dreamers unite. Whether you’re an illustrator, performer, crafter, or curator, you belong here.",
    keywords: "art community, twisted artists, creative collaboration, art networking, contact",
    robots: "index, follow",
    author: "Bobb Shields",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: "Connect with TAG - Twisted Artists Guild",
      description: "Creativity thrives in collaboration — and Twisted Artists Guild is where artists, thinkers, and dreamers unite.",
    },
  }

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/twistedartistsguild/",
      icon: "M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z",
      color: "#1877f2",
      hoverColor: "#0d5dbf",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/twistedartistsguild/",
      icon: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
      color: "#E4405F",
      hoverColor: "#c13584",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@twistedartistsguild?lang=en",
      icon: "M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z",
      color: "#000000",
      hoverColor: "#ff0050",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@twistedartistsguild",
      icon: "M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z",
      color: "#FF0000",
      hoverColor: "#cc0000",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/twistedartistsguild",
      icon: "M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z",
      color: "#0077B5",
      hoverColor: "#005885",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 text-base-content">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="contact" />

      {/* Hero Section */}
      <div className="pt-32 pb-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-poiret text-6xl md:text-7xl text-primary shadow-text mb-6 animate-pulse">
            🧵 Let’s Connect
          </h1>
          <p className="text-xl md:text-2xl text-base-content/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Creativity thrives in collaboration — and Twisted Artists Guild is where artists, thinkers, and dreamers unite. Whether you’re an illustrator, performer, crafter, or curator, you belong here.
          </p>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="py-10 bg-base-200/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">✨ Stay In Touch</h2>
          <p className="text-lg text-base-content/70 mb-8">
            Follow our journey across the platforms where art comes alive:
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                onMouseEnter={() => setHoveredSocial(index)}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 transition-colors duration-300"
                    fill={hoveredSocial === index ? social.hoverColor : social.color}
                    viewBox="0 0 576 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={social.icon} />
                  </svg>
                  <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                    {social.name}
                  </p>
                </div>
                {/* Tooltip */}
                {hoveredSocial === index && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap z-10">
                    Follow us on {social.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </a>
            ))}
          </div>
          <p className="text-base-content/70 text-md">
            We share updates, featured artists, live events, competition highlights, and behind-the-scenes magic.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">📨 Get in Touch</h2>
          <p className="text-lg text-base-content/70 mb-6">
            Let us know you&apos;re interested and we&apos;ll put you on the onboarding list!
          </p>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto mb-4" style={{ minHeight: 700 }}>
            <div className="w-full" style={{ minHeight: 600 }}>
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/jqVGvHmn4pv8gb67G3zU"
                style={{ width: '100%', height: '700px', border: 'none', borderRadius: '3px' }}
                id="inline-jqVGvHmn4pv8gb67G3zU"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Form 0"
                data-height="1201"
                data-layout-iframe-id="inline-jqVGvHmn4pv8gb67G3zU"
                data-form-id="jqVGvHmn4pv8gb67G3zU"
                title="Form 0"
                allowFullScreen
              />
            </div>
            <script src="https://link.msgsndr.com/js/form_embed.js"></script>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 bg-primary text-primary-content text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4">🎭 Ready to Twist Reality?</h3>
          <p className="text-xl mb-6 opacity-90">
            Let&apos;s build a community together:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <span className="text-lg">🧑‍🎨 Create</span>
            <span className="text-lg">🤝 Collaborate</span>
            <span className="text-lg">🚀 Inspire</span>
            <span className="text-lg">✨ Transform</span>
          </div>
          <p className="mt-8 text-lg opacity-80">
            The next evolution of art is cooperative — and it starts with you.
          </p>
        </div>
      </div>
    </div>
  )
}

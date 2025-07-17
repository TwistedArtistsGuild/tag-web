/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { useAppContext } from "/components/Context"
import Link from "next/link"
import MissionStatement from "/components/MissionStatement"

/**
 * Footer component for website navigation and social media links
 * @returns {JSX.Element} Footer component
 */
export default function Footer() {
  const { active, setActive } = useAppContext()

  return (
    <footer className="bg-base-200 border-t border-base-content/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap lg:items-start">
          <div className="w-64 flex-shrink-0 text-left">
            <Link href="/#" aria-current="page" className="flex gap-2 justify-start items-center">
              {/* Removed the image as requested */}
              <strong className="font-bold text-lg">Twisted Artist Guild</strong>
            </Link>
            <p className="mt-2 text-sm text-base-content/80">Empowering Artists Worldwide</p>

            {/* Social Media Links */}
            <div className="flex flex-wrap gap-2 mt-4 justify-start">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/twistedartistsguild/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-transform hover:scale-110"
              >
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#1877f2]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                  </svg>
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/twistedartistsguild/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-transform hover:scale-110"
              >
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#c13584]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </span>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@twistedartistsguild?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="transition-transform hover:scale-110"
              >
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#6a76ac]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                  </svg>
                </span>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@twistedartistsguild"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="transition-transform hover:scale-110"
              >
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#ff0000]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
                  </svg>
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/twistedartistsguild"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-transform hover:scale-110"
              >
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#0077b5]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                  </svg>
                </span>
              </a>
            </div>

            <p className="mt-4 text-sm text-base-content/60">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>

          <div className="flex-grow flex flex-wrap justify-start mt-6 md:mt-0 text-left">
            <div className="lg:w-1/3 md:w-1/2 w-full px-2">
              <div className="font-semibold text-base-content tracking-widest text-sm mb-2 underline">ABOUT</div>
              <div className="flex flex-col items-start gap-1 mb-6 text-sm">
                <Link href="/about" className="link link-hover">
                  About
                </Link>
                <Link href="/about/pricing" className="link link-hover">
                  Pricing
                </Link>
                <Link href="/about/vendor" className="link link-hover">
                  Vendor
                </Link>
                <Link href="/about/development" className="link link-hover">
                  Development
                </Link>
                <Link href="/about/investing" className="link link-hover">
                  Investing
                </Link>
              </div>
            </div>

            <div className="lg:w-1/3 md:w-1/2 w-full px-2">
              <div className="font-semibold text-base-content tracking-widest text-sm mb-2 underline">POLICIES</div>
              <div className="flex flex-col items-start gap-1 mb-6 text-sm">
                <Link href="/about/termsofservice" className="link link-hover">
                  Terms of Service
                </Link>
                <Link href="/about/policies" className="link link-hover">
                  Guild Policies
                </Link>
                <Link href="/about/codeofconduct" className="link link-hover">
                  Code of Conduct
                </Link>
              </div>
            </div>

            <div className="lg:w-1/3 md:w-1/2 w-full px-2">
              <div className="font-semibold text-base-content tracking-widest text-sm mb-2 underline">RESOURCES</div>
              <div className="flex flex-col items-start gap-1 mb-6 text-sm">
                <Link href="/contact" className="link link-hover">
                  Contact
                </Link>
                <Link href="/careers" className="link link-hover">
                  Careers
                </Link>
                <Link href="/portal" className="link link-hover">
                  Portals
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-1">
          <MissionStatement />
        </div>
      </div>
    </footer>
  )
}

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppContext } from "@/components/Context" // Import context to update header sections
import StockProgramBanner from "@/components/StockProgramBanner"

import TagSEO from "@/components/TagSEO"

const externalSections = [{ id: "external-investors", label: "External Investors" }]

const External = () => {
  const { setPageSections } = useAppContext()
  const pageMetaData = {
    title: "External Investors",
    description: "Information for external stakeholders interested in investing in the platform.",
    keywords: "external investors, fixed dividend shares, investor relations",
    og: {
      title: "External Investors",
      description: "Information for external stakeholders interested in investing in the platform.",
    },
  }

  // Define sections for this page (can be just one or more)
  useEffect(() => {
    setPageSections(externalSections)
    return () => {
      setPageSections([])
    }
  }, [setPageSections])

  return (
      <div className="min-h-screen bg-linear-to-b from-base-200 to-base-300">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="about/investing/external" />
      {/* Navigation Pane (can be a shared component or similar to other pages) */}
      <nav className="bg-base-100 shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/about" className="text-primary font-bold text-lg">
            About Us
          </Link>
          <div className="flex space-x-4">
            <Link href="/about/pricing" className="text-base-content hover:text-primary">
              Pricing
            </Link>
            <Link href="/about/vendor" className="text-base-content hover:text-primary">
              Vendor
            </Link>
            <Link href="/about/development" className="text-base-content hover:text-primary">
              Development
            </Link>
            {/*<Link href="/about/investing" className="text-base-content hover:text-primary">
              Investing
            </Link>*/}
          </div>
        </div>
      </nav>

      <StockProgramBanner />

      <section id="external-investors" className="py-16 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 text-primary">{"External Investor Access"}</h1>
          <p className="text-xl mb-8 text-base-content">
            {
              "For external stakeholders interested in supporting the Twisted Artists Guild, we offer Fixed Dividend Shares. These shares provide a consistent quarterly dividend and contribute directly to our platform infrastructure, impact initiatives, and long-term scalability."
            }
          </p>
          <p className="text-lg mb-8 text-base-content">
            {
              "These shares do not grant voting rights, but they are a vital way for non-artist investors to participate in our mission and benefit from our growth."
            }
          </p>
          <p className="text-lg text-base-content font-semibold">
            {
              "To learn more about investment opportunities and connect with our investor relations team, please reach out to:"
            }
          </p>
          <p className="text-lg text-primary font-bold mt-4">{"investors@twistedartistsguild.com"}</p>
          <div className="mt-8">
           {/* <Link href="/about/investing" className="btn btn-primary">
              {"Back to Stock Plan Overview"}
            </Link>*/}
          </div>
        </div>
      </section>
    </div>
  )
}

export default External


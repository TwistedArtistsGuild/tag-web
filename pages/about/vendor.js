/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useAppContext } from "@/components/Context"
import DocumentationSection from "@/components/DocumentationSection"
const Vendor = () => {
  const { setPageSections } = useAppContext() // Get access to context to set sections

  useEffect(() => {
    const pageSections = [
      { id: "featured-partners", label: "Featured Partners & Tech Stack" },
      { id: "overview", label: "Overview" },
      { id: "requirements", label: "Vendor Requirements" },
      { id: "benefits", label: "Benefits of Partnership" },
      { id: "application", label: "Application Process" },
      { id: "faq", label: "FAQs" },
    ]

    setPageSections(pageSections)
    return () => {
      setPageSections([])
    }
  }, [setPageSections])


  return (
    <div className="min-h-screen bg-linear-to-b from-base-200 to-base-300 text-base-content">
      <Head>
        <title>Supporting Vendor Information | Twisted Artists Guild</title>
        <meta name="description" content="Details for vendors working with the Twisted Artists Guild." />
      </Head>
      {/* Navigation Pane */}
      <nav className="sticky top-0 z-20 border-b border-base-300 bg-base-100/90 py-3 shadow-sm backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4">
          <Link href="/about" className="btn btn-ghost text-primary text-lg font-bold">
            About Us
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link href="/about/pricing" className="btn btn-ghost btn-sm">
              Pricing
            </Link>
            <Link href="/about/vendor" className="btn btn-secondary btn-sm font-semibold text-secondary-content" aria-current="page">
              Vendor
            </Link>
            <Link href="/about/development" className="btn btn-ghost btn-sm">
              Development
            </Link>
            {/*<Link href="/about/investing" className="text-base-content hover:text-primary">
              Investing
            </Link>*/}
          </div>
        </div>
      </nav>
      <DocumentationSection id="featured-partners" title="Featured Partners & Tech Stack" bgColor="bg-base-200">
        <p className="mb-6">Our chosen vendor partners and core infrastructure providers:</p>
        <div className="space-y-5">
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Stripe</h3>
            <p>Stripe powers primary payment processing across our ecosystem, supporting artist-to-customer transactions.</p>
          </div>
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Modern Treasury</h3>
            <p>Modern Treasury serves as our accounting API and secondary payment gateway.</p>
          </div>
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Shippo</h3>
            <p>Shippo provides shipping and fulfillment logistics for artists and vendor partners.</p>
          </div>
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">GoHighLevel</h3>
            <p>GoHighLevel supports CRM, outreach funnels, and lifecycle communications.</p>
          </div>
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Fidelity Private Shares</h3>
            <p>Fidelity Private Shares supports cooperative equity management and governance operations.</p>
          </div>
        </div>
      </DocumentationSection>

      <DocumentationSection id="vendor-intro" title="Vendor Information" bgColor="bg-base-100" centered>
        <p className="text-lg mb-4 text-base-content">
          We&apos;re building a vibrant community where vendors and artists work together to shape sustainable, ethical, and inclusive partnerships.
        </p>
      </DocumentationSection>

      <DocumentationSection id="overview" title="Overview" bgColor="bg-base-100">
        <p>We invite service providers to offer artist-friendly pricing and customized support that strengthens independent creative businesses.</p>
      </DocumentationSection>

      <DocumentationSection id="requirements" title="Vendor Requirements" bgColor="bg-base-200">
        <p className="mb-4">We are actively seeking partners who can provide the following services:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Health, dental, vision, and mental health insurance</li>
          <li>Retirement planning and wealth management services</li>
          <li>Legal counsel and accounting services</li>
          <li>Art-related services: screen printing, framing, archiving, and supplies</li>
        </ul>
        <p>We&apos;re especially interested in vendors whose values align with cooperative governance, transparency, and artist empowerment.</p>
      </DocumentationSection>

      <DocumentationSection id="benefits" title="Benefits of Partnership" bgColor="bg-base-100">
        <p className="mb-4">Partnering with us means:</p>
        <ul className="list-disc list-inside">
          <li>Access to a passionate and expanding community of artists</li>
          <li>Your services featured as part of our endorsed vendor network</li>
          <li>Opportunities to co-develop new solutions alongside creative professionals</li>
        </ul>
      </DocumentationSection>

      <DocumentationSection id="application" title="Application Process" bgColor="bg-base-200">
        <p className="mb-4">To apply, email us with:</p>
        <ul className="list-disc list-inside mb-4">
          <li>A brief overview of your services</li>
          <li>Any special rates or benefits offered to artist members</li>
          <li>Examples of how you&apos;ve supported creative communities</li>
        </ul>
        <p className="mb-4">We are especially interested in working with print shops, screen printers, merchandise vendors, and other production partners.</p>
        <p>We review submissions on a rolling basis and follow up to explore alignment and next steps.</p>
      </DocumentationSection>

      <DocumentationSection id="faq" title="FAQs" bgColor="bg-base-100">
        <p className="mb-4">
          <strong>Q: What types of artists do you work with?</strong>
          <br />
          A: Painters, sculptors, designers, digital creators, and interdisciplinary artists—our community spans traditional and emerging mediums.
        </p>
        <p>
          <strong>Q: How can I contribute to your mission?</strong>
          <br />
          A: You can offer your services, help shape artist-centric policies, or co-create tools that strengthen creative businesses.
        </p>
      </DocumentationSection>
    </div>
  )
}

export default Vendor


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
import { useAppContext } from "/components/Context" // Import context to update header sections

const Vendor = () => {
  const { setPageSections } = useAppContext() // Get access to context to set sections

  // Navigation sections for quick jump
  const sections = [
    { id: "featured-partners", label: "Featured Partners & Tech Stack" }, // New section
    { id: "overview", label: "Overview" },
    { id: "requirements", label: "Vendor Requirements" },
    { id: "benefits", label: "Benefits of Partnership" },
    { id: "application", label: "Application Process" },
    { id: "faq", label: "FAQs" },
  ]

  useEffect(() => {
    setPageSections(sections)
    return () => {
      setPageSections([])
    }
  }, [setPageSections])

  // Section content
  const Overview = () => (
    <section id="overview" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{"Overview"}</h2>
        <p>
          {
            "We’re building a vibrant community where vendors and artists work together to shape sustainable, ethical, and inclusive partnerships. We invite service providers to offer artist-friendly pricing and customized support that strengthens independent creative businesses."
          }
        </p>
      </div>
    </section>
  )

  const VendorRequirements = () => (
    <section id="requirements" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{"Vendor Requirements"}</h2>
        <p>
          {
            "We are actively seeking partners who can provide the following services to our organization and artist members:"
          }
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>{"Health, dental, vision, and mental health insurance"}</li>
          <li>{"Retirement planning and wealth management services"}</li>
          <li>{"Legal counsel and accounting services"}</li>
          <li>{"Art-related services: screen printing, framing, archiving, and supplies"}</li>
        </ul>
        <p>
          {
            "We're especially interested in vendors whose values align with cooperative governance, transparency, and artist empowerment."
          }
        </p>
      </div>
    </section>
  )

  const BenefitsOfPartnership = () => (
    <section id="benefits" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{"Benefits of Partnership"}</h2>
        <p>{"Partnering with us means:"}</p>
        <ul className="list-disc list-inside">
          <li>{"Access to a passionate and expanding community of artists"}</li>
          <li>{"Your services featured as part of our endorsed vendor network"}</li>
          <li>{"Opportunities to co-develop new solutions alongside creative professionals"}</li>
        </ul>
      </div>
    </section>
  )

  const ApplicationProcess = () => (
    <section id="application" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{"Application Process"}</h2>
        <p>{"To apply, email us with:"}</p>
        <ul className="list-disc list-inside mb-4">
          <li>{"A brief overview of your services"}</li>
          <li>{"Any special rates or benefits offered to artist members"}</li>
          <li>{"Examples of how you’ve supported creative communities"}</li>
        </ul>
        <p className="mb-4">
          {
            "We are especially interested in working with print shops, screen printers, merchandise vendors, and other production partners to expand our network. Our goal is to collaborate with small businesses using a regional model and build a resilient, local-first vendor ecosystem."
          }
        </p>
        <p>{"We review submissions on a rolling basis and follow up to explore alignment and next steps."}</p>
      </div>
    </section>
  )

  const FeaturedPartnersAndTechStack = () => (
    <section id="featured-partners" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{"Featured Partners & Tech Stack"}</h2>
        <p className="mb-6">{"Our chosen vendor partners and core infrastructure providers:"}</p>
        <div className="space-y-5">
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Stripe</h3>
            <p>
              {
                "Stripe powers primary payment processing across our ecosystem, supporting artist-to-customer transactions and platform-level commerce flows. "
              }
            </p>
          </div>
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Modern Treasury</h3>
            <p>
              {
                "Modern Treasury serves as our accounting API and secondary payment gateway to strengthen ledgering, reconciliation, and payment reliability across the network."
              }
            </p>
          </div>
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Shippo</h3>
            <p>
              {
                "Shippo provides shipping and fulfillment logistics, helping artists and vendor partners streamline label generation, tracking, and delivery operations."
              }
            </p>
          </div>
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">GoHighLevel</h3>
            <p>
              {
                "GoHighLevel supports CRM, outreach funnels, and lifecycle communications so we can better connect artists, partners, and customers."
              }
            </p>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Fidelity Private Shares</h3>
            <p>{"Fidelity Private Shares supports cooperative equity management and governance operations."}</p>
          </div>
        </div>
      </div>
    </section>
  )

  const FAQs = () => (
    <section id="faq" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{"FAQs"}</h2>
        <p className="mb-2">
          <strong>{"Q: What types of artists do you work with?"}</strong>
          <br />
          {
            "A: Painters, sculptors, designers, digital creators, and interdisciplinary artists—our community spans traditional and emerging mediums."
          }
        </p>
        <p>
          <strong>{"Q: How can I contribute to your mission?"}</strong>
          <br />
          {
            "A: You can offer your services, help shape artist-centric policies, or co-create tools that strengthen creative businesses."
          }
        </p>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Supporting Vendor Information | Twisted Artists Guild</title>
        <meta name="description" content="Details for vendors working with the Twisted Artists Guild." />
      </Head>
      {/* Navigation Pane */}
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
            <Link href="/about/investing" className="text-base-content hover:text-primary">
              Investing
            </Link>
          </div>
        </div>
      </nav>
      <FeaturedPartnersAndTechStack /> {/* Render selected partners first */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 text-primary">{"Vendor Information"}</h1>
        </div>
      </section>
      
      <Overview />
      <VendorRequirements />
      <BenefitsOfPartnership />
      <ApplicationProcess />
      <FAQs />
    </div>
  )
}

export default Vendor

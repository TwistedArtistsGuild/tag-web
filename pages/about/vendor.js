/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppContext } from "@/components/Context"
import DocumentationSection from "@/components/DocumentationSection"
import TagSEO from "@/components/TagSEO"
const Vendor = () => {
  const pageMetaData = {
    title: "Vendor Information | Twisted Artists Guild",
    description: "Guidance and partnership information for vendors working with TAG.",
    keywords: "vendors, partnerships, requirements",
    og: {
      title: "TAG Vendor Information",
      description: "Guidance and partnership information for vendors working with TAG.",
    },
  }

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
      <TagSEO metadataProp={pageMetaData} canonicalSlug="about/vendor" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Stripe", tag: "Payments", tagColor: "badge-primary", desc: "Primary payment processing across our ecosystem, supporting artist-to-customer transactions." },
            { name: "Modern Treasury", tag: "Accounting", tagColor: "badge-secondary", desc: "Accounting API and secondary payment gateway for treasury operations." },
            { name: "Shippo", tag: "Logistics", tagColor: "badge-accent", desc: "Shipping and fulfillment logistics for artists and vendor partners." },
            { name: "GoHighLevel", tag: "CRM", tagColor: "badge-neutral", desc: "CRM, outreach funnels, and lifecycle communications." },

          ].map((p) => (
            <div key={p.name} className="group flex flex-col gap-2 rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <span className={`badge badge-sm ${p.tagColor}`}>{p.tag}</span>
              </div>
              <p className="text-sm text-base-content/80">{p.desc}</p>
            </div>
          ))}
        </div>
      </DocumentationSection>

      <DocumentationSection id="vendor-intro" title="Vendor Information" bgColor="bg-base-100" centered>
        <p className="text-lg mb-4 text-base-content">
          After our core featured stack, we focus on partnering with small and regional vendors who support artists with fair pricing, practical service, and long-term collaboration.
        </p>
      </DocumentationSection>

      <DocumentationSection id="overview" title="Overview" bgColor="bg-base-100">
        <p>We invite small businesses and service providers to offer artist-friendly pricing and customized support that strengthens independent creative businesses.</p>
      </DocumentationSection>

      <DocumentationSection id="requirements" title="Vendor Requirements" bgColor="bg-base-200">
        <p className="mb-5">We are actively seeking partners who can provide the following services:</p>
        <ul className="space-y-3 mb-5">
          {[
            "Health, dental, vision, and mental health insurance",
            "Retirement planning and wealth management services",
            "Legal counsel and accounting services",
            "Art-related services: screen printing, framing, archiving, and supplies",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="italic text-base-content/70">We&apos;re especially interested in vendors whose values align with cooperative governance, transparency, and artist empowerment.</p>
      </DocumentationSection>

      <DocumentationSection id="benefits" title="Benefits of Partnership" bgColor="bg-base-100">
        <p className="mb-5">Partnering with us means:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🎨", text: "Access to a passionate and expanding community of artists" },
            { icon: "🏷️", text: "Your services featured as part of our endorsed vendor network" },
            { icon: "🤝", text: "Opportunities to co-develop new solutions alongside creative professionals" },
          ].map((b) => (
            <div key={b.text} className="flex flex-col items-center gap-2 rounded-xl border border-base-300 bg-base-200 p-5 text-center shadow-sm">
              <span className="text-3xl">{b.icon}</span>
              <p className="text-sm">{b.text}</p>
            </div>
          ))}
        </div>
      </DocumentationSection>

      <DocumentationSection id="application" title="Application Process" bgColor="bg-base-200">
        <p className="mb-6">To apply, send us an email — we review on a rolling basis and follow up to explore alignment.</p>
        <ol className="space-y-4 mb-6">
          {[
            { step: "1", label: "Introduce yourself", desc: "A brief overview of your services and what you offer." },
            { step: "2", label: "Share your artist rates", desc: "Any special pricing or benefits you offer to our members." },
            { step: "3", label: "Show your community", desc: "Examples of how you&apos;ve supported creative communities before." },
          ].map((s) => (
            <li key={s.step} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content text-sm font-bold shadow">{s.step}</span>
              <div>
                <p className="font-semibold">{s.label}</p>
                <p className="text-sm text-base-content/75" dangerouslySetInnerHTML={{ __html: s.desc }} />
              </div>
            </li>
          ))}
        </ol>
        <p className="text-base-content/70 text-sm">We&apos;re especially interested in print shops, screen printers, merchandise vendors, and other production partners.</p>
      </DocumentationSection>

      <DocumentationSection id="faq" title="FAQs" bgColor="bg-base-100">
        <div className="space-y-3">
          {[
            {
              q: "What types of artists do you work with?",
              a: "Painters, sculptors, designers, digital creators, and interdisciplinary artists — our community spans traditional and emerging mediums.",
            },
            {
              q: "How can I contribute to your mission?",
              a: "You can offer your services, help shape artist-centric policies, or co-create tools that strengthen creative businesses.",
            },
          ].map((faq) => (
            <div key={faq.q} className="collapse collapse-arrow border border-base-300 bg-base-200 rounded-xl">
              <input type="checkbox" />
              <div className="collapse-title font-semibold">{faq.q}</div>
              <div className="collapse-content text-sm text-base-content/80">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </DocumentationSection>
    </div>
  )
}

export default Vendor


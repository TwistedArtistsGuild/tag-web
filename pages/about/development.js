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
const Development = () => {
  const pageMetaData = {
    title: "Development",
    description: "Explore development architecture, tooling, and open-source direction.",
    keywords: "development, architecture, open source, TAG",
    og: {
      title: "Development",
      description: "Explore development architecture, tooling, and open-source direction.",
    },
  }

  const { setPageSections } = useAppContext() // Get access to context to set sections

  useEffect(() => {
    const pageSections = [
      { id: "open-source", label: "Open Source & Community-Driven" },
      { id: "frontend-framework", label: "Front-End Framework" },
      { id: "backend-architecture", label: "Back-End Architecture" },
      { id: "devops-infrastructure", label: "DevOps & Infrastructure" },
      { id: "integrations-sdk", label: "Integrations & SDK" },
      { id: "developer-philosophy", label: "Developer Philosophy" },
    ]

    setPageSections(pageSections)
    return () => {
      setPageSections([])
    }
  }, [setPageSections])




  return (
    <div className="min-h-screen bg-linear-to-b from-base-200 to-base-300 text-base-content">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="about/development" />
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
            <Link href="/about/vendor" className="btn btn-ghost btn-sm">
              Vendor
            </Link>
            <Link href="/about/development" className="btn btn-primary btn-sm">
              Development
            </Link>
            {/*<Link href="/about/investing" className="text-base-content hover:text-primary">
              Investing
            </Link>*/}
          </div>
        </div>
      </nav>

      <DocumentationSection id="overview" title="🧰 Developer Resources & API Documentation" bgColor="bg-base-100" centered>
        <p className="text-xl mb-8 text-base-content text-center">
          Welcome to the Twisted Artists Guild Developer Hub—where artist-first engineering meets open collaboration.
        </p>
        <p className="text-lg mb-8 text-base-content text-center">
          We embrace a hybrid philosophy: build thoughtfully in-house, integrate where it saves creators time, and share our work transparently.
        </p>
      </DocumentationSection>

      <DocumentationSection id="open-source" title="🔓 Open Source & Community-Driven" bgColor="bg-base-200">
        <p className="text-lg mb-4 text-base-content">
          We're not just building software—we're building shared infrastructure. Both our front-end and back-end source code are fully open and MIT licensed:
        </p>
        <ul className="list-disc list-inside text-lg text-base-content space-y-2 mb-4">
          <li>
            <a href="https://github.com/TwistedArtistsGuild/tag-web" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
              Front-End: tag-web on GitHub
            </a>
          </li>
          <li>
            <a href="https://github.com/TwistedArtistsGuild/tag-api" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
              Back-End: tag-api on GitHub
            </a>
          </li>
        </ul>
        <p className="text-lg text-base-content">
          We welcome forks, feature branches, pull requests, and community feedback.
        </p>
      </DocumentationSection>

      <DocumentationSection id="frontend-framework" title="🎨 Front-End Framework" bgColor="bg-base-100">
        <ul className="list-disc list-inside text-lg text-base-content space-y-4">
          <li><strong>Stack:</strong> Next.js + DaisyUI + TailwindCSS for themeable, scalable styling</li>
          <li><strong>Modular Components:</strong> Shared elements abstracted for reuse across the platform</li>
          <li><strong>Live Forms:</strong> Database-stored, editable without code redeploys</li>
          <li><strong>Mobile First:</strong> All UI designed for touch and screen flexibility</li>
          <li><strong>Discovery UX:</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>Bloomscrolling: Infinite scroll tuned to art interests</li>
              <li>Social features: Likes, shares, comments</li>
              <li>Messaging: Direct and group artist communication</li>
              <li>Labeling: Highlights contest winners and promoted listings</li>
            </ul>
          </li>
        </ul>
      </DocumentationSection>

      <DocumentationSection id="backend-architecture" title="⚙️ Back-End Architecture" bgColor="bg-base-200">
        <ul className="list-disc list-inside text-lg text-base-content space-y-4">
          <li><strong>Platform Stack:</strong> C# with Entity Framework (Code-First)</li>
          <li><strong>API Design:</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>Full CRUD coverage across data models</li>
              <li>Nested routes exposing relational data</li>
            </ul>
          </li>
          <li><strong>Security Layer:</strong> Role-based authorization middleware</li>
          <li><strong>Finance Tools:</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>Double-entry accounting integrations</li>
              <li>PCI-compliant payment vendor passthrough</li>
            </ul>
          </li>
          <li><strong>Event Ticketing:</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>Anti-scalping protections</li>
              <li>Waitlist systems for equitable distribution</li>
            </ul>
          </li>
        </ul>
      </DocumentationSection>

      <DocumentationSection id="devops-infrastructure" title="🛠️ DevOps & Infrastructure" bgColor="bg-base-100">
        <ul className="list-disc list-inside text-lg text-base-content space-y-4">
          <li><strong>Version Control:</strong> GitHub Enterprise with full issue tracking and contributions</li>
          <li><strong>CI/CD:</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>Pipeline auto-publishes DB migrations</li>
              <li>Deploys to regionally scaled Azure staging & production slots</li>
            </ul>
          </li>
          <li><strong>Future Features:</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>Native mobile apps with offline caching</li>
              <li>QR-ticketing + POS printer integration</li>
              <li>Event dashboard analytics + booth tools</li>
            </ul>
          </li>
        </ul>
      </DocumentationSection>

      <DocumentationSection id="integrations-sdk" title="🧩 Integrations & SDK (Coming Soon)" bgColor="bg-base-200">
        <p className="text-lg mb-4 text-base-content">
          Third-party modules and vendor services welcomed—especially those that support portfolio analytics, accounting dashboards, and intelligent discovery.
        </p>
        <p className="text-lg text-base-content">
          Our planned SDK will expose key platform modules for reuse, from contests to ticketing engines.
        </p>
      </DocumentationSection>

      <DocumentationSection id="developer-philosophy" title="🎯 Developer Philosophy" bgColor="bg-base-100" centered>
        <p className="text-xl mb-8 text-base-content">
          At TAG, code is community. If your contributions foster creator equity, sustainability, or visibility—we're eager to support you.
        </p>
      </DocumentationSection>
    </div>
  )
}

export default Development


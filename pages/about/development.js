"use client"

/* This file is part of the Twisted Artists Guild project.
 Copyright (C) 2025 Twisted Artists Guild
 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).
 This software comes with NO WARRANTY; see the license for details.
 Open source · low-profit · human-first*/
import { useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useAppContext } from "/components/Context" // Import context to update header sections

const Development = () => {
  const { setPageSections } = useAppContext() // Get access to context to set sections

  // Navigation sections for quick jump
  const sections = [
    { id: "open-source", label: "Open Source & Community-Driven" },
    { id: "frontend-framework", label: "Front-End Framework" },
    { id: "backend-architecture", label: "Back-End Architecture" },
    { id: "devops-infrastructure", label: "DevOps & Infrastructure" },
    { id: "integrations-sdk", label: "Integrations & SDK" },
    { id: "developer-philosophy", label: "Developer Philosophy" },
  ]

  useEffect(() => {
    setPageSections(sections)
    return () => {
      setPageSections([])
    }
  }, [setPageSections])

  const DeveloperResourcesOverview = () => (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-primary">{"🧰 Developer Resources & API Documentation"}</h1>
        <p className="text-xl mb-8 text-base-content">
          {
            "Welcome to the Twisted Artists Guild Developer Hub—where artist-first engineering meets open collaboration. Whether you're building tools to elevate creatives, integrating with our cooperative systems, or contributing to our mission directly, TAG is built to support a vibrant, extensible app ecosystem."
          }
        </p>
        <p className="text-lg mb-8 text-base-content">
          {
            "We embrace a hybrid philosophy: build thoughtfully in-house, integrate where it saves creators time, and share our work transparently. Our platform architecture is modular, mobile-ready, and optimized for open source contribution—from bug fixes to entirely new features."
          }
        </p>
      </div>
              
    </section>
  )

  const OpenSourceAndCommunityDriven = () => (
    <section id="open-source" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-primary">{"🔓 Open Source & Community-Driven"}</h2>
        <p className="text-lg mb-4 text-base-content">
          {
            "We're not just building software—we're building shared infrastructure. That's why both our front-end and back-end source code are fully open and MIT licensed:"
          }
        </p>
        <ul className="list-disc list-inside text-lg text-base-content space-y-2 mb-4">
          <li>
            <a
              href="https://github.com/TwistedArtistsGuild/tag-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              {"Front-End: tag-web on GitHub"}
            </a>
          </li>
          <li>
            <a
              href="https://github.com/TwistedArtistsGuild/tag-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              {"Back-End: tag-api on GitHub"}
            </a>
          </li>
        </ul>
        <p className="text-lg text-base-content">
          {
            "We welcome forks, feature branches, pull requests, and community feedback. If you're aligned with our mission of artist empowerment through ethical tech, we want you contributing. Our GitHub issues, internal changelogs, and future SDKs are all designed for transparent collaboration."
          }
        </p>
      </div>
    </section>
  )

  const FrontendFramework = () => (
    <section id="frontend-framework" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-primary">{"🎨 Front-End Framework"}</h2>
        <ul className="list-disc list-inside text-lg text-base-content space-y-4">
          <li>
            <strong>{"Stack:"}</strong> {"Next.js + DaisyUI + TailwindCSS for themeable, scalable styling"}
          </li>
          <li>
            <strong>{"Modular Components:"}</strong> {"Shared elements abstracted for reuse across the platform"}
          </li>
          <li>
            <strong>{"Live Forms:"}</strong> {"Database-stored, editable without code redeploys"}
          </li>
          <li>
            <strong>{"Mobile First:"}</strong> {"All UI designed for touch and screen flexibility"}
          </li>
          <li>
            <strong>{"Discovery UX:"}</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>{"Bloomscrolling: Infinite scroll tuned to art interests"}</li>
              <li>{"Social features: Likes, shares, comments"}</li>
              <li>{"Messaging: Direct and group artist communication"}</li>
              <li>{"Labeling: Highlights contest winners and promoted listings"}</li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
  )

  const BackendArchitecture = () => (
    <section id="backend-architecture" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-primary">{"⚙️ Back-End Architecture"}</h2>
        <ul className="list-disc list-inside text-lg text-base-content space-y-4">
          <li>
            <strong>{"Platform Stack:"}</strong> {"C# with Entity Framework (Code-First)"}
          </li>
          <li>
            <strong>{"API Design:"}</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>{"Full CRUD coverage across data models"}</li>
              <li>{"Nested routes exposing relational data (e.g. artist + listings + cover image)"}</li>
            </ul>
          </li>
          <li>
            <strong>{"Security Layer:"}</strong> {"Role-based authorization middleware"}
          </li>
          <li>
            <strong>{"Finance Tools:"}</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>{"Double-entry accounting integrations"}</li>
              <li>{"PCI-compliant payment vendor passthrough"}</li>
            </ul>
          </li>
          <li>
            <strong>{"Event Ticketing:"}</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>{"Anti-scalping protections (FIFO queues, ticket transfer validation)"}</li>
              <li>{"Waitlist systems for equitable distribution of limited access"}</li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
  )

  const DevOpsAndInfrastructure = () => (
    <section id="devops-infrastructure" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-primary">{"🛠️ DevOps & Infrastructure"}</h2>
        <ul className="list-disc list-inside text-lg text-base-content space-y-4">
          <li>
            <strong>{"Version Control:"}</strong> {"GitHub Enterprise with full issue tracking and contributions"}
          </li>
          <li>
            <strong>{"CI/CD:"}</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>{"Pipeline auto-publishes DB migrations"}</li>
              <li>{"Deploys to regionally scaled Azure staging & production slots"}</li>
            </ul>
          </li>
          <li>
            <strong>{"Future Features:"}</strong>
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>{"Native mobile apps with offline caching"}</li>
              <li>{"QR-ticketing + POS printer integration"}</li>
              <li>{"Event dashboard analytics + booth tools"}</li>
              <li>{"Exportable artist portfolios and visual messaging modules"}</li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
  )

  const IntegrationsAndSDK = () => (
    <section id="integrations-sdk" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-primary">{"🧩 Integrations & SDK (Coming Soon)"}</h2>
        <p className="text-lg mb-4 text-base-content">
          {"Third-party modules and vendor services welcomed—especially those that support:"}
        </p>
        <ul className="list-disc list-inside text-lg text-base-content space-y-2 mb-4">
          <li>{"Portfolio analytics"}</li>
          <li>{"Accounting dashboards"}</li>
          <li>{"Intelligent discovery + recommendation"}</li>
          <li>{"Merchandise fulfillment and pricing tools"}</li>
        </ul>
        <p className="text-lg text-base-content">
          {"Our planned SDK will expose key platform modules for reuse, from contests to ticketing engines."}
        </p>
      </div>
    </section>
  )

  const DeveloperPhilosophy = () => (
    <section id="developer-philosophy" className="py-16 bg-base-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 text-primary">{"🎯 Developer Philosophy"}</h2>
        <p className="text-xl mb-8 text-base-content">
          {
            "At TAG, code is community. Whether you're debugging a layout or shipping an accounting tool, you're building infrastructure that benefits artists directly. If your contributions foster creator equity, sustainability, or visibility—we’re eager to support you."
          }
        </p>

      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Developer Resources | Twisted Artists Guild</title>
        <meta
          name="description"
          content="Explore our API documentation and developer resources to integrate with the Twisted Artists Guild platform."
        />
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

      <DeveloperResourcesOverview />
      <OpenSourceAndCommunityDriven />
      <FrontendFramework />
      <BackendArchitecture />
      <DevOpsAndInfrastructure />
      <IntegrationsAndSDK />
      <DeveloperPhilosophy />
    </div>
  )
}

export default Development

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
import StockProgramBanner from "/components/StockProgramBanner"

const Investing = () => {
  const { setPageSections } = useAppContext() // Get access to context to set sections

  // Navigation sections for quick jump
  const sections = [
    { id: "overview", label: "TAG Stock Plan Overview" },
    { id: "why-ownership", label: "Why Ownership Now?" },
    { id: "amspp", label: "Artist Member Stock Purchase Program" },
    { id: "contests", label: "Sponsored Contests" },
    { id: "espp", label: "Employee Stock Purchase Plan" },
    { id: "buyback", label: "Stock Buyback Program" },
    { id: "external-investor", label: "External Investor Access" },
    { id: "visual-overview", label: "Visual Overview Available" },
  ]

  useEffect(() => {
    setPageSections(sections)
    return () => {
      setPageSections([])
    }
  }, [setPageSections])

  const TAGStockPlanOverview = () => (
    <section id="overview" className="py-16 bg-base-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-primary">{"🎯 TAG Stock Plan Overview"}</h1>
        <p className="text-xl mb-8 text-base-content">
          {
            "At Twisted Artists Guild, equity isn't a perk—it's a principle. We launched our stock program early to ensure that artists help govern what they help build."
          }
        </p>
      </div>
    </section>
  )

  const WhyOwnershipNow = () => (
    <section id="why-ownership" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"🧭 Why Ownership Now?"}</h2>
        <p className="text-lg text-center mb-8">
          {
            "We believe platform equity should be in the hands of artists from the beginning—not offered retroactively after success. Early ownership:"
          }
        </p>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto mb-8">
          <li>{"Empowers creative voices in governance"}</li>
          <li>{"Aligns platform growth with member prosperity"}</li>
          <li>{"Builds community value through shared decision-making"}</li>
        </ul>
        <p className="text-lg text-center font-semibold">
          {"This isn’t just a cooperative in name. It’s structured so artists own, vote, and lead."}
        </p>
      </div>
    </section>
  )

  const ArtistMemberStockPurchaseProgram = () => (
    <section id="amspp" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"🖼️ Artist Member Stock Purchase Program (AMSPP)"}</h2>
        <p className="text-lg text-center mb-8">
          {
            "Artist members may opt to allocate part of their earned commissions toward quarterly stock purchases. These purchases convert into Common Voting Shares, giving artists a direct stake in governance. It’s the only path to voting equity outside contests."
          }
        </p>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto">
          <li>{"Voting rights included"}</li>
          <li>{"Equity grows alongside your creative output"}</li>
          <li>{"Strengthens member influence over platform direction"}</li>
        </ul>
      </div>
    </section>
  )

  const SponsoredContests = () => (
    <section id="contests" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"🏆 Sponsored Contests"}</h2>
        <p className="text-lg text-center">
          {
            "Artists can also win voting shares by placing in official Guild contests. These initiatives celebrate artistic excellence and foster merit-based governance participation."
          }
        </p>
      </div>
    </section>
  )

  const EmployeeStockPurchasePlan = () => (
    <section id="espp" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"💼 Employee Stock Purchase Plan (ESPP)"}</h2>
        <p className="text-lg text-center mb-8">
          {
            "Team members can invest via the ESPP, purchasing Restricted Non-Voting Shares at a 10–15% discount on market price. While these shares don’t include voting rights, they:"
          }
        </p>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto">
          <li>{"Earn the same variable dividend as artist-owned voting shares"}</li>
          <li>{"Incentivize employees to support artist success"}</li>
          <li>{"Align internal stewardship with creator growth"}</li>
        </ul>
      </div>
    </section>
  )

  const StockBuybackProgram = () => (
    <section id="buyback" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"♻️ Stock Buyback Program"}</h2>
        <p className="text-lg text-center">
          {
            "TAG maintains a buyback program to ensure liquidity for shareholders. By repurchasing shares at regular intervals, the Guild promotes a stable equity ecosystem and long-term value."
          }
          <Link href="/about/investing/buyback" className="text-primary underline hover:no-underline">
            {"🔗 Learn more and connect with our investor team"}
          </Link>
        </p>
      </div>
    </section>
  )

  const ExternalInvestorAccess = () => (
    <section id="external-investor" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"🧾 External Investor Access"}</h2>
        <p className="text-lg text-center mb-4">
          {
            "Interested external stakeholders can access Fixed Dividend Shares, which pay a consistent quarterly dividend. These shares do not grant voting rights but contribute directly to platform infrastructure, impact initiatives, and long-term scalability."
          }
        </p>
        <p className="text-lg text-center">
          <Link href="/about/investing/external" className="text-primary underline hover:no-underline">
            {"🔗 Learn more and connect with our investor team"}
          </Link>
        </p>
      </div>
    </section>
  )

  const VisualOverviewAvailable = () => (
    <section id="visual-overview" className="py-16 bg-base-200">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 text-primary">{"📊 Visual Overview Available"}</h2>
        <p className="text-lg mb-8 text-base-content">
          {
            "Download the [TAG Stock Plan Flowchart] for a guided look at share types, eligibility, and governance structures."
          }
        </p>
        <div className="card bg-base-100 shadow-xl p-6 mx-auto max-w-4xl">
          <h3 className="text-2xl font-bold mb-4 text-secondary">Download the Stock Plan Flowchart</h3>
          <p className="text-lg mb-4">For a detailed overview of our stock plans, download the flowchart below:</p>
          <a
            href="https://tagstatic.blob.core.windows.net/content/TAG%20Stock%20Plan%20Flowchart.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Download PDF
          </a>
          <iframe
            src="https://tagstatic.blob.core.windows.net/content/TAG%20Stock%20Plan%20Flowchart.pdf#toolbar=0&navpanes=0"
            className="w-full h-[48rem] mt-6 border rounded-lg"
            title="TAG Stock Plan Flowchart"
          ></iframe>
        </div>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Investing | Twisted Artists Guild</title>
        <meta
          name="description"
          content="Learn about the TAG Stock Plan Overview, including ESPP, AMSPP, and Buyback Program."
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

      <StockProgramBanner />
      <TAGStockPlanOverview />
      <WhyOwnershipNow />
      <ArtistMemberStockPurchaseProgram />
      <SponsoredContests />
      <EmployeeStockPurchasePlan />
      <StockBuybackProgram />
      <ExternalInvestorAccess />
      <VisualOverviewAvailable />
    </div>
  )
}

export default Investing

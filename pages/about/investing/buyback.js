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

const Buyback = () => {
  const { setPageSections } = useAppContext()

  const sections = [
    { id: "psrp-overview", label: "PSRP Overview" },
    { id: "why-it-exists", label: "Why It Exists" },
    { id: "program-highlights", label: "Program Highlights" },
    { id: "repurchase-mechanics", label: "Repurchase Mechanics" },
    { id: "eligibility-rules", label: "Eligibility & Share Class Rules" },
    { id: "timing-waitlist", label: "Timing & Waitlist Logic" },
    { id: "governance-disclosures", label: "Board & Governance Disclosures" },
    { id: "liquidity-roadmap", label: "Long-Term Liquidity Roadmap" },
  ]

  useEffect(() => {
    setPageSections(sections)
    return () => {
      setPageSections([])
    }
  }, [setPageSections])

  const PSRPOverview = () => (
    <section id="psrp-overview" className="py-16 bg-base-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-primary">{"♻️ Private Stock Repurchase Plan (PSRP)"}</h1>
        <p className="text-xl mb-8 text-base-content">
          {
            "The PSRP is Twisted Artists Guild’s internal stock liquidity mechanism—designed to provide fair value to shareholders, reward long-term participation, and preserve artist ownership. Because TAG stock is intentionally private, this program ensures that share value can scale with platform success—without ever surrendering governance to external markets."
          }
        </p>
      </div>
    </section>
  )

  const WhyItExists = () => (
    <section id="why-it-exists" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"🧭 Why It Exists"}</h2>
        <p className="text-lg text-center mb-8">
          {
            "As a cooperative, TAG doesn’t intend to IPO or sell out to venture capital. Instead, we’ve built an internal buyback system to:"
          }
        </p>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto mb-8">
          <li>{"Ensure shareholder liquidity"}</li>
          <li>{"Maintain real-time stock valuation"}</li>
          <li>{"Protect voting structure from speculative pressure"}</li>
          <li>{"Reflect platform health in equity performance"}</li>
        </ul>
        <p className="text-lg text-center">
          {
            "The PSRP is how we turn adjusted profit into mobility—redistributing value through dividends, retained earnings, and stock repurchases."
          }
        </p>
      </div>
    </section>
  )

  const ProgramHighlights = () => (
    <section id="program-highlights" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"💡 Program Highlights"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Funded by Profits</h3>
            <p>
              {
                "Operates only once the Guild generates and retains profits. A liquid account is filled up to 15% of eligible payable shares, enabling fast fulfillment of requests."
              }
            </p>
          </div>
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Quarterly Limit</h3>
            <p>
              {
                "Up to 15% of vested shares eligible for repurchase each quarter—ensuring price stability and financial discipline."
              }
            </p>
          </div>
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Real-Time Valuation</h3>
            <p>
              {
                "Each buyback influences the share price. A 5% repurchase reduces the stock price by 5%; a filled repurchase account with leftover funds will raise the price accordingly."
              }
            </p>
          </div>
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Price Range</h3>
            <p>
              {
                "Share value fluctuates between $5 and $25. At the top, shares automatically split 5-for-1, resetting the price and requiring a formal charter update."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  )

  const RepurchaseMechanics = () => (
    <section id="repurchase-mechanics" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"📊 Repurchase Mechanics"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Application</h3>
            <p>{"Shareholders submit requests to sell eligible shares within the 15% quarterly cap."}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Valuation & Status</h3>
            <p>
              {
                "Real-time pricing and fund availability shown on the buyback form. Requests exceeding available funds initiate a FIFO waitlist, allowing the user to specify a stop-limit sale price."
              }
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Offer</h3>
            <p>
              {
                "If funds are available, approval is instant. If waitlisted, orders are fulfilled when capital returns or canceled if price dips below user threshold."
              }
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Payment</h3>
            <p>
              {
                "Processed via liquid accounts and distributed via applicable financial platforms. Promotional programs may offer gift cards with bonus credit (e.g., +10%) as alternate buyback disbursement options."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  )

  const EligibilityAndShareClassRules = () => (
    <section id="eligibility-rules" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"📋 Eligibility & Share Class Rules"}</h2>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto mb-8">
          <li>
            <strong>{"Common Stock (Artists):"}</strong>{" "}
            {"Can only be sold by the artist or their estate. Non-transferable."}
          </li>
          <li>
            <strong>{"Preferred Stock (Investors):"}</strong>{" "}
            {"Vested shares may be transferred to vetted third parties."}
          </li>
          <li>
            <strong>{"Restricted Stock (Employees):"}</strong>{" "}
            {
              "Subject to a 4-year vesting + 5-year holding period. Eligible for buyback after hold expires; follows common stock rules thereafter."
            }
          </li>
          <li>
            <strong>{"Conversion Paths:"}</strong>{" "}
            {
              "Future programs will allow conversion from Common/Restricted to Preferred—enabling dividend access, gifting, or estate planning at the cost of governance power."
            }
          </li>
        </ul>
      </div>
    </section>
  )

  const TimingAndWaitlistLogic = () => (
    <section id="timing-waitlist" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"⏳ Timing & Waitlist Logic"}</h2>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto mb-8">
          <li>{"Requests >15% of eligible shares are rejected."}</li>
          <li>{"Large requests under the cap may still queue on waitlist."}</li>
          <li>{"If a quarter’s buyback fund is depleted, the program pauses until replenished."}</li>
          <li>
            {
              "The Board may override pauses with majority consent if circumstances justify early restart (e.g., mass vesting shifts)."
            }
          </li>
          <li>{"Disbursement cycles include a buffer period for financial processing."}</li>
        </ul>
      </div>
    </section>
  )

  const BoardAndGovernanceDisclosures = () => (
    <section id="governance-disclosures" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"🔐 Board & Governance Disclosures"}</h2>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto mb-8">
          <li>
            {
              "Every board member, employee, and artist member earns Common Stock upon qualifying (first fee-earning sale, hire, or board appointment)."
            }
          </li>
          <li>
            {
              "Board/staff vote only with one share’s weight while actively employed. Upon departure, full voting power resumes."
            }
          </li>
          <li>{"Staff may still be artist members and participate in competitions earning stock awards."}</li>
          <li>
            {
              "Board will avoid appearance of conflict but support balanced dual participation as both employees and creatives."
            }
          </li>
        </ul>
      </div>
    </section>
  )

  const LongTermLiquidityRoadmap = () => (
    <section id="liquidity-roadmap" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"📈 Long-Term Liquidity Roadmap"}</h2>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto mb-8">
          <li>{"Restricted Board shares (issued at Guild founding) unlock slowly:"}</li>
          <ul className="list-circle list-inside ml-6">
            <li>{"Begin eligibility in Year 9"}</li>
            <li>{"Repurchase limit increases quarterly for four years"}</li>
            <li>{"Vesting graph (to be visualized) will show forecasted buyback capacity growth"}</li>
          </ul>
          <li>{"Buybacks will only include fully vested and eligible stocks per class"}</li>
        </ul>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Stock Buyback Program | Twisted Artists Guild</title>
        <meta name="description" content="Learn about the Private Stock Repurchase Plan (PSRP) for TAG shareholders." />
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
      <PSRPOverview />
      <WhyItExists />
      <ProgramHighlights />
      <RepurchaseMechanics />
      <EligibilityAndShareClassRules />
      <TimingAndWaitlistLogic />
      <BoardAndGovernanceDisclosures />
      <LongTermLiquidityRoadmap />
    </div>
  )
}

export default Buyback

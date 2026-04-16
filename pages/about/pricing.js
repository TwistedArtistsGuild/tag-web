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

const Pricing = () => {
  const { setPageSections } = useAppContext() // Get access to context to set sections

  useEffect(() => {
    // Updated sections with more descriptive labels and IDs
    const updatedSections = [
      { id: "at-a-glance", label: "At a Glance" },
      { id: "public-access", label: "Public Access" },
      { id: "artist-membership", label: "Artist Membership" },
      { id: "extended-services", label: "Extended Services" },
      { id: "member-benefits", label: "Member Benefits" },
      { id: "ownership-governance", label: "Ownership & Governance" },
      { id: "community-visibility", label: "Community & Visibility" },
      { id: "artist-support-infrastructure", label: "Artist Support" },
    ]
    setPageSections(updatedSections)
    return () => {
      setPageSections([]) // Clear sections on unmount
    }
  }, [setPageSections])

  const AtAGlance = () => (
    <section id="at-a-glance" className="py-16 bg-base-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-primary">{"Twisted Artists Guild: At a Glance"}</h1>
        <p className="text-xl mb-4 text-base-content">
          {"Built by working artists to fix what’s broken. We are stronger together—and we’re inviting you to join us."}
        </p>
        <p className="text-lg text-base-content">
          {
            "The Twisted Artists Guild is a low-profit cooperative platform designed to center artistic ownership, fair pricing, and ethical governance. We exist to create shared success for independent creators through transparent tools and community infrastructure."
          }
        </p>
      </div>
    </section>
  )

  const PublicAccess = () => (
    <section id="public-access" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"Public Access"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Browse Freely</h3>
            <p>{"Browse freely, connect easily, and never feel pressured."}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Free Profiles</h3>
            <p>{"Create and explore artist profiles for free—forever."}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Transparent Pricing</h3>
            <p>{"The price you see is the price you pay: shipping and taxes included."}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Ad-Free Experience</h3>
            <p>{"Ad-free experience with no hidden fees, upsells, or external promotions."}</p>
          </div>
        </div>
      </div>
    </section>
  )

  const ArtistMembership = () => (
    <section id="artist-membership" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"Artist Membership: Sell with Integrity"}</h2>
        <p className="text-lg text-center mb-8">
          {"To enable sales, activate your artist membership with one of two plans:"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Monthly Plan – $10/month</h3>
            <p>
              {
                "Start with a free-tier path: the first two platform-processed sales each month apply $5 each toward your $10 membership. If you make no sales, there is no penalty."
              }
            </p>
          </div>
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Annual Plan – $120/year</h3>
            <p>
              {
                "Prefer one predictable payment? Pay once for the year and keep the same selling access and member benefits as the monthly plan, with no monthly billing cycle."
              }
            </p>
          </div>
        </div>
        <p className="text-base text-center mb-6">
          {"Both plans are intentionally balanced at the same annualized cost: $10/month or $120/year."}
        </p>
        <div className="max-w-4xl mx-auto border-2 border-primary rounded-xl bg-base-200 p-5">
          <p className="text-lg text-center font-medium">
            {
              "6.5% transaction fee applies only to items processed through TAG checkout services. This includes payment processing and platform facilitation for those transactions. No transaction fee is charged on member-recorded cash sales."
            }
          </p>
        </div>
      </div>
    </section>
  )

  const ExtendedServices = () => (
    <section id="extended-services" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"Extended Services: Cost + Minimal Margin"}</h2>
        <p className="text-lg text-center mb-8">
          {
            "As we roll out advanced support, our pricing model is simple: service cost plus a minimal operating margin to keep tools sustainable and artist-first."
          }
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Operations & Fulfillment Support</h3>
            <p>
              {
                "Planned options include printing coordination, shipping workflow support, and packaging supply access priced near cost with clear line-item visibility."
              }
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Growth & Business Services</h3>
            <p>
              {
                "Planned options include campaign support, bookkeeping automation, and compliance helpers offered at cost plus a small margin to fund continued maintenance."
              }
            </p>
          </div>
        </div>
        <p className="text-base text-center">
          {
            "Every extended service will publish pricing logic up front so members can evaluate value before opting in."
          }
        </p>
      </div>
    </section>
  )

  const MemberBenefits = () => (
    <section id="member-benefits" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"Member Benefits"}</h2>
        <p className="text-lg text-center mb-8">{"Designed for flexibility, trust, and growth:"}</p>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto">
          <li>{"Unlimited listings and relists — sell originals, prints, editions, merch"}</li>
          <li>{"No fees on cash sales recorded by members"}</li>
          <li>{"Early access to cross-platform import and unified accounting"}</li>
          <li>{"Upcoming tax automation tools to simplify compliance"}</li>
        </ul>
      </div>
    </section>
  )

  const CommunityAndVisibility = () => (
    <section id="community-visibility" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"🤝 Community & Visibility"}</h2>
        <p className="text-lg text-center mb-8">{"We’re more than a marketplace. We’re a movement."}</p>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto">
          <li>{"Ongoing monthly, quarterly, and annual art prompt contests to win prizes and bragging rights"}</li>
          <li>{"Unified messaging tools to engage fans across all platforms"}</li>
          <li>{"Both guild-sponsored promotion and self-initiated ad campaigns will spotlight your work"}</li>
          <li>{"Studio and event support: booking, ticketing, contracts"}</li>
          <li>{"Integrated vendor marketplace with trusted services at member discounts"}</li>
          <li>{"Art News Agency to showcase member achievements"}</li>
        </ul>
      </div>
    </section>
  )

  const ArtistSupportInfrastructure = () => (
    <section id="artist-support-infrastructure" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"❤️ Artist Support Infrastructure"}</h2>
        <p className="text-lg text-center mb-8">{"Real tools to support the whole artist:"}</p>
        <ul className="list-disc list-inside space-y-3 text-lg max-w-2xl mx-auto mb-8">

          <li>{"33%+ of platform profits devoted to artist-support causes"}</li>
          <li>{"Plans to launch a Foundation: grants, scholarships, and emergency relief "}</li>
          <li>{"Expert-curated knowledge base and functional modern library of best practices"}</li>
          <li>{"Dedicated IT support and automation tools to save time without sacrificing control"}</li>
        </ul>
        <p className="text-lg text-center font-semibold">
          {
            "Anyone can create an artist profile for free, forever. To enable sales and unlock benefits, become an Artist Member."
          }
        </p>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Pricing | Twisted Artists Guild</title>
        <meta
          name="description"
          content="Transparent pricing and benefits for artists and public on the Twisted Artists Guild platform."
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

      <AtAGlance />
      <PublicAccess />
      <ArtistMembership />
      <ExtendedServices />
      <MemberBenefits />
      <CommunityAndVisibility />
      <ArtistSupportInfrastructure />
    </div>
  )
}

export default Pricing

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
import CTA from "@/components/homepage/CTA"
import TagSEO from "@/components/TagSEO"

const Pricing = () => {
  const pageMetaData = {
    title: "Pricing",
    description: "Transparent pricing and membership options for creators and supporters.",
    keywords: "pricing, membership, artist plans",
    og: {
      title: "Pricing",
      description: "Transparent pricing and membership options for creators and supporters.",
    },
  }

  const { setPageSections } = useAppContext() // Get access to context to set sections

  useEffect(() => {
    // Updated sections with more descriptive labels and IDs
    const updatedSections = [
      { id: "at-a-glance", label: "At a Glance" },
      { id: "public-access", label: "Public Access" },
      { id: "registered-users", label: "Registered Users" },
      { id: "free-artist-profile", label: "Free Artist Profile" },
      { id: "artist-membership", label: "Artist Membership" },
      { id: "extended-services", label: "Extended Services" },
    ]
    setPageSections(updatedSections)
    return () => {
      setPageSections([]) // Clear sections on unmount
    }
  }, [setPageSections])

  const AtAGlance = () => (
    <section id="at-a-glance" className="py-16 bg-base-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-primary">{"TAG - Pricing"}</h1>
        <p className="text-xl mb-4 text-base-content">
          {"Built by working artists to fix what's broken. We're stronger together — and we're inviting you to join us."}
        </p>
        <p className="text-lg text-base-content">
          {
            "Twisted Artists Guild (TAG) is a low-profit cooperative platform designed to center artists. We exist to create shared success for independent creators through artist-built tools, fair pricing, and shared community infrastructure."
          }
        </p>
      </div>
    </section>
  )

  const PublicAccess = () => (
    <section id="public-access" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">{"Public Access"}</h2>
        <p className="text-center text-base-content/60 mb-8">{"No account required"}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">{"Bloomscroll Forever"}</h3>
            <p>{"Browse art, listings, and updates as much as you want. No ads. No tracking pressure. No expectation to buy."}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">{"Clear Pricing"}</h3>
            <p>{"What you see is what you pay — listing prices include taxes and shipping where applicable. No surprise fees at checkout."}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">{"Ad-Free by Design"}</h3>
            <p>{"The public experience is permanently ad-free. We don't sell attention, data, or placement."}</p>
          </div>
        </div>
      </div>
    </section>
  )

  const RegisteredUsers = () => (
    <section id="registered-users" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">{"Registered Users"}</h2>
        <p className="text-center text-base-content/60 mb-8">{"Free"}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">{"Personal Profile"}</h3>
            <p>{"Create a free user account to post thoughts about art, share projects, and follow artists you care about — with no requirement to sell."}</p>
          </div>
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">{"Community Participation"}</h3>
            <p>{"Join conversations, follow artists, and participate in contests and events without paying a cent."}</p>
          </div>
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">{"Still Ad-Free"}</h3>
            <p>{"No ads, no upsells, no external promotions — ever."}</p>
          </div>
        </div>
      </div>
    </section>
  )

  const FreeArtistProfile = () => (
    <section id="free-artist-profile" className="py-16 bg-base-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-4">{"Free Artist Profiles — For Hobbyists & Early Sellers"}</h2>
        <p className="text-lg text-center mb-4">
          {"You don't need to sell anything to belong here. Free artist profiles are available to every artist, forever — no credit card, no trial period, no catch."}
        </p>
        <p className="text-base text-center mb-8 text-base-content/70">
          {"Artists may register one or more artist personas to represent different creative identities, styles, or mediums."}
        </p>
        <div className="bg-base-100 rounded-xl shadow p-6 mb-6">
          <h3 className="text-2xl font-bold mb-4">{"What You Can Do on the Free Tier"}</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>{"Build a professional artist profile and portfolio"}</li>
            <li>{"Create listings and set prices for your work"}</li>
            <li>{"Use core business tools needed to sell, including:"}</li>
          </ul>
          <ul className="list-disc list-inside space-y-2 ml-8 mt-2 text-base-content/80">
            <li>{"CRM tools to manage conversations and inquiries"}</li>
            <li>{"Shipping tools to prepare fulfillment"}</li>
            <li>{"Core workflows to accept offers or negotiate commissions"}</li>
          </ul>
        </div>
        <div className="bg-base-100 rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold mb-4">{"Free Until You Sell — Bridge to Membership"}</h3>
          <p className="mb-4">
            {"If a hobbyist artist makes sales on the free tier, a $5 fee is added to each of the first two sales per calendar month, for a maximum of $10 per month."}
          </p>
          <p className="font-medium mb-2">{"This bridge fee:"}</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>{"Covers that month's Artist Membership dues"}</li>
            <li>{"Allows artists to sell before committing to a paid subscription"}</li>
            <li>{"Automatically transitions into the standard monthly membership once sales are consistent"}</li>
          </ul>
          <p className="text-sm text-base-content/60">{"If no sales occur, no fee is charged."}</p>
        </div>
      </div>
    </section>
  )

  const ArtistMembership = () => (
    <section id="artist-membership" className="py-16 bg-base-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-4">{"Artist Membership — Activate Full Access"}</h2>
        <p className="text-lg text-center mb-4">
          {"Artist Membership unlocks full selling capabilities, expanded tools, and long-term Guild benefits."}
        </p>
        <p className="text-base text-center mb-8 text-base-content/70">
          {"Your membership directly funds vendor subscriptions and platform development — keeping TAG independent, artist-run, and free from billionaire investors."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-3">{"Monthly Plan — $10 / month"}</h3>
            <p className="mb-2">{"Designed to be paid via debit, keeping costs low and predictable."}</p>
            <p className="text-sm text-base-content/60">{"This is the same $10 typically covered by the bridge fee once an artist makes two sales in a month."}</p>
          </div>
          <div className="card bg-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-3">{"Annual Plan — $120 / year"}</h3>
            <p className="mb-2">{"One predictable payment for the full year, with the same access and benefits as the monthly plan, billed once."}</p>
            <p className="text-sm text-base-content/60">{"Annual discounts are planned as the platform matures."}</p>
          </div>
        </div>
        <div className="border-2 border-primary rounded-xl bg-base-200 p-6">
          <h3 className="text-xl font-bold mb-4 text-center">{"Transaction Fees"}</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>{"A 6.5% transaction fee applies to items processed through TAG checkout"}</li>
            <li>{"Approximately 3% covers credit card processing fees we pay on your behalf"}</li>
            <li>{"The remaining ~3.5% supports platform operations"}</li>
          </ul>
          <p className="font-medium mb-2">{"No transaction fees on:"}</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>{"Member-recorded cash sales"}</li>
            <li>{"Sales made on other platforms (which we're happy to help track for bookkeeping)"}</li>
          </ul>
          <p className="text-sm text-center text-base-content/60">
            {"No listing fees. No expiration on listings. Archive your work forever and sell duplicates, editions, or merchandise with ease."}
          </p>
        </div>
      </div>
    </section>
  )

  const ExtendedServices = () => (
    <section id="extended-services" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">{"Extended Services: Cost + Minimal Margin"}</h2>
        <p className="text-lg text-center mb-4">
          {
            "As TAG grows, optional extended services are planned using a simple model: vendor cost plus a minimal operating margin, so access remains sustainable and artist-first."
          }
        </p>
        <p className="text-base text-center mb-8 text-base-content/70">
          {"TAG facilitates access to these services and does not operate as the insurer or financial institution."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">{"Planned Ala Carte Services"}</h3>
            <ul className="list-disc list-inside space-y-2 text-base-content">
              <li>{"Health insurance options including vision, dental, and mental health coverage"}</li>
              <li>{"Life insurance"}</li>
              <li>{"Business liability insurance"}</li>
              <li>{"Retirement plan access"}</li>
              <li>{"Bookkeeping support"}</li>
              <li>{"Tax preparation support"}</li>
              <li>{"Legal representation access"}</li>
              <li>{"Accounting representation access"}</li>
            </ul>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">{"Additional Benefits Under Consideration"}</h3>
            <ul className="list-disc list-inside space-y-2 text-base-content">
              <li>{"Disability insurance options"}</li>
              <li>{"Telehealth and wellness program access"}</li>
              <li>{"Software and equipment purchasing discounts"}</li>
              <li>{"Contract and IP review clinics"}</li>
              <li>{"Emergency assistance and hardship support pathways"}</li>
            </ul>
          </div>
        </div>
        <p className="text-base text-center">
          {"All extended services will publish pricing logic up front so members can evaluate value before opting in."}
        </p>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-linear-to-b from-base-200 to-base-300">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="about/pricing" />
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
           {/*<Link href="/about/investing" className="text-base-content hover:text-primary">
              Investing
            </Link>*/}
          </div>
        </div>
      </nav>

      <AtAGlance />
      <PublicAccess />
      <RegisteredUsers />
      <FreeArtistProfile />
      <ArtistMembership />
      <ExtendedServices />
      <CTA />
    </div>
  )
}

export default Pricing


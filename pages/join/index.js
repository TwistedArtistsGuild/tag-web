import Link from "next/link"

import TagSEO from "@/components/TagSEO"

const JOIN_SECTIONS = [
  {
    href: "/join/artist",
    title: "Artist",
    description: "Artist onboarding, registration forms, and creator application workflows.",
    countLabel: "2 registration pages available",
  },
  {
    href: "/join/user",
    title: "User",
    description: "General user onboarding and account-creation flows.",
    countLabel: "No forms published yet",
  },
  {
    href: "/join/vendor",
    title: "Vendor",
    description: "Vendor onboarding and marketplace participation forms.",
    countLabel: "No forms published yet",
  },
]

export default function JoinIndexPage() {
  const pageMetaData = {
    title: "Join",
    description: "Entry point for join and onboarding flows.",
    keywords: "join, onboarding, registration",
    robots: "noindex, nofollow",
    og: {
      title: "Join",
      description: "Entry point for join and onboarding flows.",
    },
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="join" />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-base-content">Join</h1>
            <p className="text-base-content/70">
              Choose a registration area below. Each section routes into its own onboarding folder and published forms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {JOIN_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="card bg-base-100 shadow border border-base-300 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="card-body">
                <h2 className="card-title">{section.title}</h2>
                <p className="text-sm text-base-content/70">{section.description}</p>
                <div className="pt-2">
                  <span className="badge badge-outline">{section.countLabel}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

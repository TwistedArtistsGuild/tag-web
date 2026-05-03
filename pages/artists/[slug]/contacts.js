/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import ContactCard, { DEFAULT_STORES } from "@/components/cards/card_contactList"
import ArtistCardSmall from "@/components/cards/card_artist_small"
import getApiURL from "@/components/widgets/GetApiURL"

import TagSEO from "@/components/TagSEO"

const ContactsPage = ({ links, slug, artistSummary }) => {
  const hasLinks = Array.isArray(links) && links.length > 0

  const defaultContactInfo = {
    email: "satarah@example.com",
    location: "Multnomah County, Oregon",
    customUrls: [
      {
        label: "Portfolio",
        url: "https://satarah-portfolio.com",
        purpose: "Full collection & commissions",
      },
      {
        label: "Commission Sheet",
        url: "https://commission.example.com",
        purpose: "Pricing & booking",
      },
    ],
  }

  const normalizedCustomUrls = hasLinks
    ? links
        .map((entry) => {
          const url = String(entry?.url || entry?.URL || entry?.href || entry?.link || "").trim()
          if (!url) return null
          return {
            label: String(entry?.label || entry?.Label || entry?.title || entry?.name || "Website").trim(),
            url: /^https?:\/\//i.test(url) ? url : `https://${url}`,
            purpose: String(entry?.purpose || entry?.description || "").trim(),
          }
        })
        .filter(Boolean)
    : defaultContactInfo.customUrls

  const contactInfo = {
    ...defaultContactInfo,
    customUrls: normalizedCustomUrls,
  }

  return (
    <div className="card bg-base-100 text-base-content border border-base-300 shadow-lg p-4 rounded-box">
      <TagSEO metadataProp={{ title: "Github Projects Web Pages Artists Slug Contacts", description: "Explore Github Projects Web Pages Artists Slug Contacts on Platform.", keywords: "artists, art community, marketplace", og: { title: "Github Projects Web Pages Artists Slug Contacts", description: "Explore Github Projects Web Pages Artists Slug Contacts on Platform." } }} canonicalSlug="/github_projects/tag/tag-web/pages/artists/[slug]/contacts" />
      <div className="mb-4">
        <ArtistCardSmall
          artist={{
            title: artistSummary?.title || "Satarah",
            byline: artistSummary?.byline || "Satarah Productions",
            path: slug,
            profilePic: {
              url: artistSummary?.profilePic?.url || "/blank_image.png",
              alttext: artistSummary?.profilePic?.alttext || `${artistSummary?.title || "Artist"} profile picture`,
            },
          }}
        />
      </div>
      <ContactCard
        compact={false}
        showIdentity={false}
        stores={DEFAULT_STORES}
        contactInfo={contactInfo}
      />
    </div>
  )
}

ContactsPage.getInitialProps = async (context) => {
  const { slug } = context.query
  const api_url = getApiURL()

  const defaultArtistSummary = {
    title: "Satarah",
    byline: "Satarah Productions",
    profilePic: {
      url: "/blank_image.png",
      alttext: "Satarah profile picture",
    },
  }

  try {
    const [contactsResponse, profileResponse] = await Promise.all([
      fetch(`${api_url}artists/${slug}/contacts`),
      fetch(`${api_url}artist/${slug}/profile`),
    ])

    const contactsData = contactsResponse.ok ? await contactsResponse.json() : { links: [] }
    const profileData = profileResponse.ok ? await profileResponse.json() : {}

    const artistSummary = {
      title: profileData?.artist?.title || defaultArtistSummary.title,
      byline: profileData?.artist?.byline || defaultArtistSummary.byline,
      profilePic: profileData?.profilePic || defaultArtistSummary.profilePic,
    }

    return { links: contactsData.links || [], slug, artistSummary }
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return { links: [], slug, artistSummary: defaultArtistSummary }
  }
}

export default ContactsPage


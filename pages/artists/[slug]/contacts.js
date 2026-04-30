/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import ContactCard from "@/components/cards/card_contact"
import getApiURL from "@/components/widgets/GetApiURL"

import TagSEO from "@/components/TagSEO"

const ContactsPage = ({ links }) => {
  return (
      <div className="card bg-base-100 text-base-content border border-base-300 shadow-lg p-4 rounded-box">
      <TagSEO metadataProp={{ title: "Github Projects Web Pages Artists Slug Contacts", description: "Explore Github Projects Web Pages Artists Slug Contacts on Platform.", keywords: "artists, art community, marketplace", og: { title: "Github Projects Web Pages Artists Slug Contacts", description: "Explore Github Projects Web Pages Artists Slug Contacts on Platform." } }} canonicalSlug="/github_projects/tag/tag-web/pages/artists/[slug]/contacts" />
      <ContactCard links={links} />
    </div>
  )
}

ContactsPage.getInitialProps = async (context) => {
  const { slug } = context.query
  const api_url = getApiURL()

  try {
    const response = await fetch(`${api_url}artists/${slug}/contacts`)
    const data = await response.json()
    return { links: data.links }
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return { links: [] }
  }
}

export default ContactsPage


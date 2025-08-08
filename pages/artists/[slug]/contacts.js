/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import ContactCard from "@/components/cards/card_contact"

const ContactsPage = ({ links }) => {
  return (
    <div className="card shadow-lg p-4 bg-base-100 rounded-box">
      <ContactCard links={links} />
    </div>
  )
}

ContactsPage.getInitialProps = async (context) => {
  const { slug } = context.query
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL

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


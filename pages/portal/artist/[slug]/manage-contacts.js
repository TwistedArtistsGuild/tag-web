/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { getServerSession } from "next-auth/next"

import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function ArtistManageContactsRedirectPage() {
  return null
}

export async function getServerSideProps(context) {
  const slug = String(context.query.slug || "").trim().toLowerCase()
  const editRoute = `/portal/artist/${slug}/edit`

  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(editRoute)}`,
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: editRoute,
      permanent: false,
    },
  }
}

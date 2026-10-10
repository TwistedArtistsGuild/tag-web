/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import SidebarRow from "@/components/sidebar/SidebarRow"

/**
 * Favorites shown in the Browse panel (moved from the retired Navigation tab).
 * Still the same demo data with local-only removal: there is no favorites API yet.
 */
export const SIDEBAR_FAVORITES = {
  artists: [
    {
      id: "fav-artist-twistedpassions",
      label: "TwistedPassions",
      href: "/artists/TwistedPassions",
    },
  ],
  artListings: [
    {
      id: "fav-tiedye3",
      label: "TwistedPassions - tiedye3",
      href: "/artists/TwistedPassions/listings/tiedye3",
    },
    {
      id: "fav-tiedye2",
      label: "TwistedPassions - tiedye2",
      href: "/artists/TwistedPassions/listings/tiedye2",
    },
  ],
}

const GROUPS = [
  { key: "artists", title: "Artists", media: "avatar" },
  { key: "artListings", title: "Art listings", media: "thumb" },
]

function RemoveButton({ label, onClick }) {
  return (
    <button type="button" className="tag-row__action" onClick={onClick} aria-label={`Unsubscribe from ${label}`} title="Unsubscribe">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  )
}

/** "Your favorites" block for signed-in visitors only. */
export default function SidebarFavorites() {
  const { data: session } = useSession()
  const [favorites, setFavorites] = useState(SIDEBAR_FAVORITES)

  if (!session?.user) return null

  const remove = (groupKey, favoriteId) => {
    setFavorites((current) => ({
      ...current,
      [groupKey]: current[groupKey].filter((item) => item.id !== favoriteId),
    }))
  }

  const hasAny = GROUPS.some((group) => favorites[group.key]?.length)
  if (!hasAny) return null

  return (
    <section className="tag-panel__section" aria-labelledby="tag-favorites-title">
      <h3 id="tag-favorites-title" className="tag-panel__section-title">Your favorites</h3>
      {GROUPS.map((group) => (favorites[group.key]?.length ? (
        <div key={group.key} className="tag-panel__group">
          <span className="tag-panel__group-title">{group.title}</span>
          <ul className="tag-rows">
            {favorites[group.key].map((favorite) => (
              <SidebarRow
                key={favorite.id}
                href={favorite.href}
                title={favorite.label}
                media={{ kind: group.media }}
                action={<RemoveButton label={favorite.label} onClick={() => remove(group.key, favorite.id)} />}
              />
            ))}
          </ul>
        </div>
      ) : null))}
    </section>
  )
}

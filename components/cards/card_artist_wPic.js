/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect } from "react"
import ArtistCard from "@/components/cards/card_artist"

/**
 * @deprecated Use ArtistCard from "@/components/cards/card_artist" directly.
 * This shim is kept for backward compatibility.
 */
const ArtistCardWithPic = (props) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[DEPRECATED] card_artist_wPic is deprecated. Use card_artist instead.")
    }
  }, [])

  return <ArtistCard {...props} />
}

export default ArtistCardWithPic

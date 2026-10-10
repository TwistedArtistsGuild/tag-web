/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source Â· low-profit Â· human-first*/

import BloomscrollButton from "@/components/homepage/BloomscrollButton"
import FeatureCard from "@/components/homepage/FeatureCard"

const CardBloomscroll = ({ index = 0 }) => {
  return (
    <FeatureCard
      flip={index % 2 === 1}
      tag="Bloomscroll"
      title="Bloomscroll, instead of doomscroll."
      image={{ src: "https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg", alt: "Paint palette with fresh colours" }}
    >
      <p>
        Discover new work, react and comment, find favorite artists to follow, and stay connected to what&apos;s
        happening across the Guild.
      </p>
      <p>It&apos;s social, but purpose-built for artists, artisans and their fans: no ads, no influencers, no fuss.</p>
      <div className="tag-cta-row tag-feature__cta">
        <BloomscrollButton>Open Bloomscroll</BloomscrollButton>
      </div>
    </FeatureCard>
  )
}

export default CardBloomscroll
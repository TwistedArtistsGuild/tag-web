/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import Image from "next/image"
import { getSeededStockPhotoByCategory } from "@/utils/stockPhotos"

const CardBloomscroll = ({ index = 0 }) => {
  const isImageLeft = index % 2 === 0
  const photoUrl = getSeededStockPhotoByCategory(`bloomscroll-${index}`, 'painting')

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] bg-base-100 shadow-brand rounded-box overflow-hidden">
      {/* Image Panel */}
      <div className={`relative w-full lg:w-1/2 min-h-[300px] lg:min-h-auto ${isImageLeft ? 'lg:order-first' : 'lg:order-last'}`}>
        <Image
          src={photoUrl}
          alt="Bloomscroll art feed"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Content Panel */}
      <div className={`w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center ${isImageLeft ? 'lg:order-last' : 'lg:order-first'}`}>
        <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">Bloomscroll! Instead of Doomscroll</h2>
        <div className="space-y-4 mb-8">
          <p className="text-lg text-base-content/90 leading-relaxed">
            Come bloomscroll our endlessly flowing art feed to discover new work, react and comment, find favorite
            artists to follow, and stay connected to what&apos;s happening across the Guild.
          </p>
          <p className="text-lg text-base-content/90 leading-relaxed">
            It&apos;s social, but purpose built for artists and artisans and their fans; no ads, no influencers, no fuss.
          </p>
        </div>
        <Link href="/art" className="btn btn-primary btn-wide text-base-100">
          Start Scrolling
        </Link>
      </div>
    </div>
  )
}

export default CardBloomscroll

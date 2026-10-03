/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import Image from "next/image"
import { getSeededStockPhotoByCategory } from "@/utils/stockPhotos"

const CardContests = ({ index = 2 }) => {
  const isImageLeft = index % 2 === 0
  const photoUrl = getSeededStockPhotoByCategory(`contests-${index}`, 'performance')

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] bg-base-100 shadow-brand rounded-box overflow-hidden">
      {/* Image Panel */}
      <div className={`relative w-full lg:w-1/2 min-h-[300px] lg:min-h-auto ${isImageLeft ? 'lg:order-first' : 'lg:order-last'}`}>
        <Image
          src={photoUrl}
          alt="Contests and engagement"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Content Panel */}
      <div className={`w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center ${isImageLeft ? 'lg:order-last' : 'lg:order-first'}`}>
        <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">Fun Prompt Contests.</h2>
        <p className="text-lg text-base-content/90 leading-relaxed mb-8">
          Monthly, quarterly, and/or annual art contests spotlight work through real community engagement. Prizes include
          being featured on the main page, cash, guild-sponsored ad campaigns, and more.
        </p>
        <Link href="/contests" className="btn btn-primary btn-wide text-base-100">
          View Contests
        </Link>
      </div>
    </div>
  )
}

export default CardContests

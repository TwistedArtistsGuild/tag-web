/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image"
import { getSeededStockPhotoByCategory } from "@/utils/stockPhotos"

const CardMembershipBenefits = ({ index = 0 }) => {
  const isImageLeft = index % 2 === 0
  const photoUrl = getSeededStockPhotoByCategory(`membership-${index}`, 'artist')

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] bg-base-100 shadow-brand rounded-box overflow-hidden">
      {/* Image Panel */}
      <div className={`relative w-full lg:w-1/2 min-h-[300px] lg:min-h-auto ${isImageLeft ? 'lg:order-first' : 'lg:order-last'}`}>
        <Image
          src={photoUrl}
          alt="Artist workspace"
          fill
          style={{ objectFit: 'cover' }}
          priority={index === 0}
        />
      </div>

      {/* Content Panel */}
      <div className={`w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center ${isImageLeft ? 'lg:order-last' : 'lg:order-first'}`}>
        <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
          More time creating. Less time juggling.
        </h2>
        <div className="space-y-4 mb-8">
          <p className="text-lg text-base-content/90 leading-relaxed">
            Register as an Artist Member to share your work, grow an audience, and sell directly through Guild-supported
            tools. A free tier for artists who simply want to share and have a link tree profile will always be
            available.
          </p>
          <p className="text-lg text-base-content/90 leading-relaxed">
            Whether you&apos;re visual, musical, movement based, or multidisciplinary, Twisted Artists Guild is built to
            support you at every stage from your first post to a sustainable, full-time practice.
          </p>
        </div>
        <p className="font-semibold text-base-content mb-4">Artist Membership includes:</p>
        <ul className="list-disc list-inside space-y-3 text-base-content/90 text-lg">
          <li>A professional portfolio with an integrated storefront for each of your artist personas</li>
          <li>Flexible art listings designed to support originals, duplicates, editions, and merchandise</li>
          <li>
            Access to a CRM to unify social media messaging, schedule posts across platforms, and run advertising
            campaigns from one place
          </li>
          <li>Ongoing art contests that reward real engagement and lasting visibility</li>
          <li>Studio coordination, event production, and booking support</li>
          <li>
            A long-term roadmap to extend business infrastructure with shared benefits like group health insurance and
            retirement savings, designed to support solo artists and small creative companies
          </li>
        </ul>
      </div>
    </div>
  )
}

export default CardMembershipBenefits

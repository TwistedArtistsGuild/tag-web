/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import Image from "next/image"
import { getSeededStockPhotoByCategory } from "@/utils/stockPhotos"

const CardPricing = ({ index = 1 }) => {
  const isImageLeft = index % 2 === 0
  const photoUrl = getSeededStockPhotoByCategory(`pricing-${index}`, 'merchandise')

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] bg-base-100 shadow-brand rounded-box overflow-hidden">
      {/* Image Panel */}
      <div className={`relative w-full lg:w-1/2 min-h-[300px] lg:min-h-auto ${isImageLeft ? 'lg:order-first' : 'lg:order-last'}`}>
        <Image
          src={photoUrl}
          alt="Pricing visualization"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Content Panel */}
      <div className={`w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center ${isImageLeft ? 'lg:order-last' : 'lg:order-first'}`}>
        <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">Designed around maximizing your earnings.</h2>
        <div className="space-y-4 mb-8">
          <p className="text-lg text-base-content/90 leading-relaxed">
            We ask a minimal monthly or annual membership dues, and a small transaction fee for sales through our
            systems that includes the credit card processing fees. Since we earn a percentage, our role is to recruit
            many artist members and maximize their sales, not to nickel and dime you with add-on fees or expensive
            subscriptions.
          </p>
          <p className="text-lg text-base-content/90 leading-relaxed">
            We will offer ala carte services using a cost plus minimial margin model- shipping discounts, group health
            insurance plans, liability insurance, and so many more.
          </p>
          <p className="text-lg text-base-content/90 leading-relaxed">
            The goal is to combine all the artists we can muster into one entity to maximize our collective bargaining
            power and resources.
          </p>
          <p className="text-lg text-base-content/90 leading-relaxed">
            Competitive pricing, transparent fees, and tools designed to work for artists, not against them.
          </p>
        </div>
        <Link href="/pricing" className="btn btn-outline btn-wide border-secondary text-secondary hover:bg-secondary hover:text-secondary-content">
          View Pricing
        </Link>
      </div>
    </div>
  )
}

export default CardPricing

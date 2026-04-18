/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"

const CardPricing = () => {
  return (
    <div className="card bg-base-100 shadow-lg rounded-box p-8 md:p-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content mb-6">Designed around maximizing your earnings.</h2>
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
      <Link href="/pricing" className="btn btn-outline btn-wide">
        View Pricing
      </Link>
    </div>
  )
}

export default CardPricing

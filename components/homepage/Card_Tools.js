/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image"
import { getSeededStockPhotoByCategory } from "@/utils/stockPhotos"

const CardTools = ({ index = 0 }) => {
  const isImageLeft = index % 2 === 0
  const photoUrl = getSeededStockPhotoByCategory(`tools-${index}`, 'general')
  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] bg-base-100 shadow-brand rounded-box overflow-hidden">
      {/* Image Panel */}
      <div className={`relative w-full lg:w-1/2 min-h-[300px] lg:min-h-auto ${isImageLeft ? 'lg:order-first' : 'lg:order-last'}`}>
        <Image
          src={photoUrl}
          alt="Business toolkit resources"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Content Panel */}
      <div className={`w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-center ${isImageLeft ? 'lg:order-last' : 'lg:order-first'}`}>
        <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">Artists deserve better resources.</h2>

        <div className="space-y-5 text-base-content/90">
          <p className="text-lg leading-relaxed">
            We are building a practical business toolkit that helps artists run sustainable creative careers.
          </p>

          <div className="rounded-box bg-base-200/50 border border-base-300 p-5">
            <ul className="list-disc ml-5 leading-relaxed">
              <li className="break-inside-avoid mb-2">Payments and POS</li>
              <li className="break-inside-avoid mb-2">Cost, margin, and pricing tools</li>
              <li className="break-inside-avoid mb-2">Mileage and expense tracking</li>
              <li className="break-inside-avoid mb-2">Budgeting, inventory, timesheets, and payroll</li>
              <li className="break-inside-avoid mb-2">Invoices, deposits, receipts, and contracts</li>
              <li className="break-inside-avoid mb-2">Project and event management workflows</li>
              <li className="break-inside-avoid mb-2">CRM, marketing campaign tools, and performance dashboards</li>
            </ul>
          </div>

          <p className="text-lg font-semibold text-primary">And more to come!</p>

          <p className="text-base leading-relaxed text-base-content/80">
            We want to hear from artists in our community about your biggest needs from our software developers,
            so we can prioritize what matters most.
          </p>

          <p className="text-sm text-base-content/70">
            Community feedback will directly shape our roadmap.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CardTools

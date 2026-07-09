/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

const CardTools = () => {
  return (
    <div className="card bg-base-100 shadow-brand border border-base-300 rounded-box p-8 md:p-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">Artists deserve better resources.</h2>

      <div className="space-y-5 text-base-content/90">
        <p className="text-lg leading-relaxed max-w-3xl">
          We are building a practical business toolkit that helps artists run sustainable creative careers.
        </p>

        <div className="rounded-box bg-base-200/50 border border-base-300 p-5">
          <ul className="list-disc ml-5 leading-relaxed columns-1 md:columns-2 gap-10">
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
  )
}

export default CardTools

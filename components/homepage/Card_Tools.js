/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

const CardTools = () => {
  return (
    <div className="card bg-base-100 shadow-lg rounded-box p-8 md:p-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content mb-6">Art deserves better tools.</h2>
      <div className="space-y-5">
        <p className="text-lg text-base-content/90 leading-relaxed">
          Our vision is to bring artists and their adoring public together through an ad-free social platform
          dedicated to art in all its forms.
        </p>
        <p className="text-lg text-base-content/90 leading-relaxed">
          Twisted Artists Guild exists to remove friction after creating: sharing, selling, shipping, and getting paid
          without forcing artists to become experts in marketing, accounting, or tech just to survive.
        </p>
        <p className="text-sm text-base-content/70">
          We apologize for any ads hosted by embedded YouTube videos and are working towards a full ad-free
          experience.
        </p>
      </div>
    </div>
  )
}

export default CardTools

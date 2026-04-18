/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"

const CardContests = () => {
  return (
    <div className="card bg-base-100 shadow-lg rounded-box p-8 md:p-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content mb-6">Fun Prompt Contests.</h2>
      <p className="text-lg text-base-content/90 leading-relaxed mb-8">
        Monthly, quarterly, and/or annual art contests spotlight work through real community engagement. Prizes include
        being featured on the main page, cash, guild-sponsored ad campaigns, and more.
      </p>
      <Link href="/contests" className="btn btn-primary btn-wide">
        View Contests
      </Link>
    </div>
  )
}

export default CardContests

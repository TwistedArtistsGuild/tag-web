/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import localFont from "next/font/local"
import { Sora } from "next/font/google"

/** Body: Manrope, TAG's official brand font (self-hosted from public/TAG OFFICIAL/FONT). */
export const manrope = localFont({
  src: "../public/TAG OFFICIAL/FONT/Manrope (Variable Font Weight).ttf",
  weight: "200 800",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})

/** Headings: Sora 600/700 (downloaded at build, served from our own domain). */
export const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
})

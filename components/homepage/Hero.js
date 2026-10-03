/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"

const Hero = () => {
	return (
		<section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
			<div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
				<h1 className="font-bold text-4xl lg:text-6xl tracking-tight md:-mb-4 text-base-content">
					Tired of Doomscrolling?
				</h1>
				<p className="text-lg opacity-80 leading-relaxed text-base-content">
					Come Bloomscroll our endlessly flowing art feed to discover new work, react and comment, follow favorite
					artists, and stay connected to what&apos;s happening across the Guild.
				</p>
				<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
					<Link href="/art" className="btn btn-primary btn-wide text-base-100">
						Bloomscroll
					</Link>
					<Link href="/join" className="btn btn-outline btn-wide border-secondary text-secondary hover:bg-secondary hover:text-secondary-content">
						Register as a User
					</Link>
				</div>
			</div>
			<div className="lg:w-full w-full">
				<div className="relative w-full overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-brand" style={{ paddingTop: '56.25%' }}>
					<iframe
						src="https://player.vimeo.com/video/1077782689"
						title="Twisted Artists Guild Hero Video"
						className="absolute inset-0 h-full w-full"
						allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					/>
				</div>
			</div>
		</section>
	)
}

export default Hero

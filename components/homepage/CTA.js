/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image"
import Link from "next/link"

const CTA = () => {
	return (
		<section className="relative hero overflow-hidden min-h-screen">
			<Image
				src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
				alt="Background"
				fill
				style={{ objectFit: 'cover' }}
			/>
			<div className="relative hero-overlay bg-neutral bg-opacity-70"></div>
			<div className="relative hero-content text-center text-neutral-content p-8">
				<div className="flex flex-col items-center max-w-xl p-8 md:p-0">
					<h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
						Please join us!
					</h2>
					<p className="text-lg opacity-80 mb-12 md:mb-16">
						Discover art, follow creators, and support the work you love, or become an artist member to share your own work with the world.
					</p>
					<p className="text-base md:text-lg opacity-90 mb-10">
						Twisted Artists Guild is built by artists for artists, with tools designed to help creativity turn into
						sustainability.
					</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<Link href="https://marketing.twistedartistsguild.com/membership-drive" className="btn btn-primary btn-wide">
							Join the waitlist
						</Link>
						<Link href="/art" className="btn btn-outline btn-wide text-neutral-content border-neutral-content hover:bg-neutral-content hover:text-neutral">
							Bloomscroll
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

export default CTA

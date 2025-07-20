/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image"
import TestimonialsAvatars from "./TestimonialsAvatars"

const Hero = () => {
	return (
		<section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
			<div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
				<h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 text-base-content">
          Become a full time artist with us 
				</h1>
				<p className="text-lg opacity-80 leading-relaxed text-base-content">
          Our vision is to bring artists and their adoring public together through a sales-enabled social platform dedicated to art in all its forms. 
				</p>
				<button className="btn btn-primary btn-wide">Join as an Artist Member</button>

				<TestimonialsAvatars priority={false} />
			</div>
			<div className="lg:w-full">
				<Image
					src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
					alt="Product Demo"
					className="w-full"
					fetchpriority="high"
					width={500}
					height={500}
					style={{ objectFit: 'cover' }}
				/>
			</div>
		</section>
	)
}

export default Hero

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import styles from "/styles/pages/index.module.css"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import Hero from "@/components/Hero"
import FAQ from "@/components/FAQ"
import CTA from "@/components/CTA"

/**
 * Home/index page component
 * Serves as the landing page for the site
 * Uses flex layout to ensure proper content flow and footer positioning
 * 
 * @returns {JSX.Element} Home page component with hero, parallax sections, FAQ, and CTA
 */
export default function Home() {
	const pageMetaData = {
		title: "Twisted Artists Guild (TAG) Main Page",
		description: "A social media site that hosts art portfolios and helps artists to do business",
		keywords: "blog, art, business, news, events, management, cloud services, tickets, e-commerce, sales",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Twisted Artists Guild (TAG) Main Page",
			description: "A social media site that hosts art portfolios and helps artists to do business",
		},
	} 
  
	return (
		<div className="flex flex-col w-full">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="" />
			
			<div className={`${styles.container} bg-base-100 text-base-content w-full`}>
				<div className="space-y-10 w-full">
					{/* Parallax Banner Section */}
					<section className={`${styles.parallax} flex flex-col`} aria-label="Featured Messages">
						<div className={`${styles.bgColor} bg-primary`}>
							<div className={`${styles.gradient} p-10`}>
								<span className={`${styles.leftTextContent} text-2xl font-bold`}>
									A platform made for artists.
								</span>
							</div>
						</div>
						<div className={`${styles.bgColor} bg-secondary`}>
							<div className={`${styles.gradient} p-10`}>
								<span className={`${styles.centerTextContent} text-2xl font-bold`}>
									A digital revolution.
								</span>
							</div>
						</div>
						<div className={`${styles.bgColor} bg-accent`}>
							<div className={`${styles.gradient} p-10`}>
								<span className={`${styles.rightTextContent} text-2xl font-bold`}>
									Tools at your fingertips.
								</span>
							</div>
						</div>
					</section>
					
					{/* Main Content Sections */}
					<Hero />
					<FAQ />
					<CTA />
				</div>
			</div>
		</div>
	)
}

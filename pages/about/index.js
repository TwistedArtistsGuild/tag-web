/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import TagSEO from "@/components/TagSEO";
import Link from "next/link";
import { FaUsers, FaImages, FaHandshake, FaFileContract, FaClipboardList, FaProjectDiagram } from 'react-icons/fa';
import MissionStatement from "/components/MissionStatement";
import { useEffect } from "react";
import { useAppContext } from "/components/Context";

export default function About() {
	const { setPageSections } = useAppContext();

	useEffect(() => {
		const sections = [
			{ id: "mission", label: "Mission Statement" },
			{ id: "intro-video", label: "Introduction Video" },
			{ id: "about", label: "About the Guild" },
			{ id: "new-pages", label: "Explore More" },
		];
		setPageSections(sections);

		return () => {
			setPageSections([]);
		};
	}, [setPageSections]);

	const pageMetaData = {
		title: "About the Twisted Artists Guild",
		description: "Information about our non-profit organization",
		keywords: "about, art, business, organizational charter, guild, sales, cloud platform",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "About the Twisted Artists Guild",
			description: "Information about our organization",
		},
	};

	const navCards = [
		{
			title: "Meet the Members",
			description: "Learn about the talented artists who make up our guild",
			href: "/about/us",
			icon: <FaUsers className="text-2xl" />
		},
		{
			title: "Guild Slideshow",
			description: "Visual introduction to our concepts and vision",
			href: "/about/slideshow",
			icon: <FaImages className="text-2xl" />
		},
		{
			title: "Code of Conduct",
			description: "Our principles and standards for engagement",
			href: "/about/codeofconduct",
			icon: <FaHandshake className="text-2xl" />
		},
		{
			title: "Terms of Service",
			description: "Legal guidelines for using our services",
			href: "/about/termsofservice",
			icon: <FaFileContract className="text-2xl" />
		},
		{
			title: "Guild Policies",
			description: "Official policies governing our operations",
			href: "/about/policies",
			icon: <FaClipboardList className="text-2xl" />
		},
		{
			title: "Active Projects",
			description: "Current initiatives and collaborations",
			href: "/about/activeprojects",
			icon: <FaProjectDiagram className="text-2xl" />
		},
		{
			title: "Vendor Information",
			description: "Details for vendors working with the Guild",
			href: "/about/vendor",
			icon: <FaHandshake className="text-2xl" />,
		},
		{
			title: "Pricing",
			description: "Learn about our pricing structure",
			href: "/about/pricing",
			icon: <FaClipboardList className="text-2xl" />,
		},
		{
			title: "Investing",
			description: "TAG Stock Plan Overview",
			href: "/about/investing",
			icon: <FaFileContract className="text-2xl" />,
		},
		{
			title: "Features",
			description: "Discover platform features",
			href: "/about/features",
			icon: <FaProjectDiagram className="text-2xl" />,
		},
		{
			title: "Development",
			description: "Developer resources and API documentation",
			href: "/about/development",
			icon: <FaUsers className="text-2xl" />,
		},
	];

	return (
		<div className="flex flex-col justify-start items-center min-h-screen w-full py-12 px-4 relative overflow-hidden bg-base-100 text-base-content">
			<div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full"></div>
			<div className="absolute bottom-[-5%] left-[-15%] w-[50%] h-[50%] bg-primary/5 rounded-full"></div>

			<div className="max-w-5xl mx-auto">
				<TagSEO metadataProp={pageMetaData} canonicalSlug="about" />

				{/* About Section */}
				<section id="about" className="mb-16">
					<div className="relative text-center">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-24 h-24 rounded-full bg-primary opacity-10"></div>
						</div>
						<h2 className="text-4xl md:text-5xl font-bold relative z-10 mb-3 text-primary">
							About the <span className="text-secondary">Twisted Artists&apos; Guild</span>
						</h2>
						<p className="text-lg opacity-75 max-w-2xl mx-auto">
							Discover our mission, members, and the creative vision that drives our community
						</p>
					</div>
				</section>
				{/* Mission Statement Section */}
				<section id="mission" className="mb-16">
					<div className="card bg-base-200 shadow-lg p-6">
						<MissionStatement />
					</div>
				</section>
				{/* Intro Video Section */}
				<section id="intro-video" className="mb-16">
					<h2 className="text-2xl font-bold text-primary mb-4">Introduction Video</h2>
					<div className="relative rounded-xl overflow-hidden shadow-lg bg-base-200" style={{ padding: "56.25% 0 0 0" }}>
						<iframe
							src="https://player.vimeo.com/video/1077782689?badge=0&autopause=0&player_id=0&app_id=58479"
							frameBorder="0"
							allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
							className="absolute top-0 left-0 w-full h-full"
							title="Twisted Artists Guild (TAG) Intro Reel"
						></iframe>
					</div>
				</section>
				{/* Navigation cards in a responsive grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{navCards.map((card, index) => (
						<Link key={index} href={card.href} className="group">
							<div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary h-full">
								<div className="card-body">
									<div className="flex items-center gap-3 mb-2">
										<div className="text-primary group-hover:scale-110 transition-transform duration-300">
											{card.icon}
										</div>
										<h3 className="card-title text-lg text-primary">{card.title}</h3>
									</div>
									<p className="text-sm opacity-75">{card.description}</p>
									<div className="card-actions justify-end mt-4">
										<span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
											Learn more →
										</span>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
				{/* Decorative element at bottom */}
				<div className="mt-16 flex justify-center">
					<div className="w-24 h-1 bg-primary opacity-50 rounded-full"></div>
				</div>
			</div>
		</div>
	);
}

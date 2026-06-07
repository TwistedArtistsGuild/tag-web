/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import Link from "next/link";
import TagSEO from "@/components/TagSEO";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isArtist, isStaff } from "@/utils/authHelpers";

export default function Portal_Artist() {
	const pageMetaData = {
		title: "Portal Links",
		description: "Dashboard and Reports",
		keywords: "Artist, Dashboard, Reports",
		robots: "no-index, no-follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Artist Portal",
			description: "Links to dashboards and reports for different scopes",
		},
	};

	const portalLinks = [
		{
			href: "/portal/user",
			title: "User Portal",
			description:
				"Review account activity, saved preferences, and personal dashboard updates.",
			badge: "Personal",
		},
		{
			href: "/portal/artist/",
			title: "Artist Portal",
			description:
				"Manage your listings, profile details, and artist-focused tools in one place.",
			badge: "Creative",
		},
		{
			href: "/portal/staff/",
			title: "Staff Portal",
			description:
				"Access moderation workflows, operational views, and internal support tools.",
			badge: "Operations",
		},
		{
			href: "/portal/vendor/",
			title: "Vendor Portal",
			description:
				"Track vendor-facing activity, updates, and resource management controls.",
			badge: "Commerce",
		},
		{
			href: "/portal/venue/",
			title: "Venue Portal",
			description:
				"Coordinate venue information, schedules, and participation-related actions.",
			badge: "Events",
		},
	];

	return (
		<div className="min-h-screen bg-base-200 px-4 py-6 md:px-8 md:py-10">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal" />
			<div className="mx-auto max-w-5xl rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg md:p-8">
				<h1 className="text-3xl font-black tracking-tight text-primary md:text-4xl">
					Portal Resource Center
				</h1>
				<p className="mt-3 max-w-3xl text-sm leading-relaxed text-base-content/80 md:text-base">
					Choose the workspace that matches your role. Each area includes tailored
					tools, dashboards, and workflows to keep your day moving smoothly.
				</p>

				<div className="mt-6 grid grid-cols-1 gap-4">
					{portalLinks.map((portalLink) => (
						<Link
							key={portalLink.href}
							href={portalLink.href}
							className="group rounded-xl border border-base-300 bg-base-100 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<div className="flex items-center justify-between gap-3">
								<h2 className="text-lg font-bold text-base-content group-hover:text-primary md:text-xl">
									{portalLink.title}
								</h2>
								<span className="badge badge-primary badge-outline">{portalLink.badge}</span>
							</div>
							<p className="mt-2 text-sm leading-relaxed text-base-content/75">
								{portalLink.description}
							</p>
							<span className="mt-4 inline-block text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1">
								Open portal now
							</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal")}`,
				permanent: false,
			},
		};
	}

	if (!isArtist(session) && !isStaff(session) && !isAdmin(session)) {
		return {
			notFound: true,
		};
	}

	return { props: {} };
}

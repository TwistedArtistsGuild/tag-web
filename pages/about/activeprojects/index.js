/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Head from "next/head";
import Link from "next/link";

export default function About() {
	return (
		<div className="container mx-auto max-w-5xl p-4 md:p-6">
			<Head>
				<title>TAG Active Projects Main Page</title>
				<meta name="description" content="Shows our past and current projects" key="desc" />
				<meta name="keywords" content="art, guild, non-profit, charitable, projects, beneficiaries" />
				<meta name="robots" content="index, follow" />
				<meta name="author" content="Bobb Shields" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta property="og:title" content="TAG Active Projects Main Page" />
				<meta property="og:description" content="Shows our past and current projects" />
			</Head>
			<h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
				Links to active projects being pursued by the guild.
			</h1>
			<div className="card bg-base-100 border border-base-300 shadow-md">
				<div className="card-body">
					<p className="text-base-content/80">
						Explore current projects and interviews that spotlight our artist community.
					</p>
					<Link href="/about/activeprojects/interviews" className="link link-primary font-medium">
						Interview series with artists of many types.
					</Link>
				</div>
			</div>
		</div>
	);
}


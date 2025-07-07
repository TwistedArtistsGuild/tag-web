/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Head from "next/head";

export default function SlideShow() {
	return (
		<div >
			<Head>
				<title>TAG Slideshow</title>
				<meta
					name="description"
					content="A slideshow explaining the idea behind and guiding ideals of the Twisted Artist Guild"
					key="desc"
				/>
				<meta name="keywords" content="art, guild, organization, reason, purpose, transparency" />
				<meta name="robots" content="index, follow" />
				<meta name="author" content="Bobb Shields" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta property="og:title" content="TAG Slideshow" />
				<meta
					property="og:description"
					content="A slideshow explaining the idea behind and guiding ideals of the Twisted Artist Guild"
				/>
			</Head>
			<div className="flex justify-center items-center w-full h-[600px] bg-base-200">
				<iframe
					src="https://view.officeapps.live.com/op/embed.aspx?src=https://tagstatic.blob.core.windows.net/content/TAG_Values_and_MVP_Features.pptx"
					width="65%"
					height="100%"
					frameBorder="0"
					className="rounded-lg shadow-lg"
				></iframe>
			</div>
		</div>
	);
}

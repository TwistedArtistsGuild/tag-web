/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Head from "next/head"

export default function CodeOfConduct() {
	return (
		<div className="container mx-auto p-4">
			<Head>
				<title>TAG Interview Disclosure Page</title>
				<meta name="description" content="Shows our interview guide for questions we want to ask participating artists" key="desc" />
				<meta name="keywords" content="art, interview, news, market research" />
				<meta name="robots" content="index, follow" />
				<meta name="author" content="Bobb Shields" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta property="og:title" content="TAG Interview Disclosure Page" />
				<meta property="og:description" content="Shows our interview guide for questions we want to ask participating artists" />
			</Head>
			<h2 className="text-2xl font-bold mb-4">
        The interview guide to be used to ask artists about their businesses: 
			</h2>
			{/* 
      <iframe src="https://docs.google.com/document/d/e/2PACX-1vRq-QB5PeNT5ox5mBLAb36x2pZhVAnyKYm6fEdId5rZFknaHJZStfWH5q4T4JjvqW_kYBt03guhJlDu/pub?embedded=true"
        width='50%' height="75%">
      </iframe>
      */}
			<p>
				Our active project at the moment is building this website prototype into a functional business tool suite. And forming our corporation.
			</p>
		</div>
	)
}

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Image from "next/image";
import Link from "next/link";

export default function AboutProfileCard({ profile }) {
	const primaryImage = profile.images?.[0] || "/blank_image.png";

	return (
		<article className="card h-full bg-base-100 text-base-content shadow-lg border border-base-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
			<div className="card-body items-center text-center p-6">
				<div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-base-300 shadow-md">
					<Image
						src={primaryImage}
						alt={`${profile.name}'s profile`}
						fill
						sizes="160px"
						style={{ objectFit: "cover" }}
					/>
				</div>
				<h4 className="mt-4 text-xl font-bold text-primary">
					<Link href={`/about/us/${profile.slug}`} className="hover:underline">
						{profile.name}
					</Link>
				</h4>
				<p className="text-sm font-semibold text-base-content/80">{profile.title}</p>
				<p className="text-sm text-base-content/70">{profile.roleSummary}</p>
				<p className="text-sm text-base-content/70">
					<strong>Art Forms:</strong> {profile.artForms.join(", ")}
				</p>
				<div className="card-actions mt-4 justify-center gap-3">
					<Link href={`/about/us/${profile.slug}`} className="btn btn-primary btn-sm">
						Read Profile
					</Link>
					<a
						href={profile.linkToArtistPage}
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-outline btn-sm"
					>
						Artist Page
					</a>
				</div>
			</div>
		</article>
	);
}

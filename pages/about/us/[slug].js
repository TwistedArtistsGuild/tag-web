/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { useRouter } from "next/router";
import profiles from "/content/us/profiles";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Link from "next/link";

export default function ProfilePage() {
	const router = useRouter();
	const { slug } = router.query;

	const profile = profiles.find((p) => p.slug === slug);

	if (!profile) {
		return <p className="text-center mt-10 text-error">Profile not found.</p>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold text-center mb-6">{profile.name}</h1>
			<h2 className="text-xl font-semibold text-center text-gray-700 mb-4">{profile.title}</h2>
			<h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
				<strong>Art Forms:</strong> {profile.artForms.join(", ")}{" "}
				<span className="text-primary">
					<Link href={profile.linkToArtistPage} className="link link-primary">
						(View {profile.name.split(" ")[0]}'s Artist Page)
					</Link>
				</span>
			</h3>
			
			{profile.images.length > 0 && (
				<div className="mb-8">
					<ImageGallery
						items={profile.images.map((url) => ({ original: url, thumbnail: url }))}
						showThumbnails={true}
						showPlayButton={false}
					/>
				</div>
			)}
            <div className="mb-8">
				<p className="text-gray-700">{profile.bio}</p>
			</div>
			<div className="text-center">
				<button
					className="btn btn-primary"
					onClick={() => router.back()}
				>
					Go Back
				</button>
			</div>
		</div>
	);
}

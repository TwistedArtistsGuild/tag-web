/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import Image from "next/image"
import styles from "/styles/components/card_x.module.css"

/**
 * Card component for displaying artist information
 * @param {Object} props - Component properties 
 * @param {Object} props.artist - Artist data object with profilePic object
 * @returns {JSX.Element} - Artist card component
 */
const ArtistCard = ({ artist }) => {
	// Debug output that shows what we're dealing with
	if (process.env.DEBUG === "true" ) {
		console.group("ArtistCard Debug Info -", artist.title);
		console.log("Artist object:", artist);
		console.log("ProfilePic value:", artist?.profilePic);
		console.log("ProfilePic URL (if exists):", artist?.profilePic?.url);
		console.groupEnd();
	}

	return (
		<div className={styles.card}>
			<Image
				src={artist?.profilePic?.url ||  "/blank_image.png"}
				alt={artist?.profilePic?.alttext || `${artist?.title}'s profile picture`}
				width={100}
				height={100}
				className={styles.profilePic}
				style={{ width: "auto", height: "auto" }}
			/>
			<div className={styles.details}>
				<Link href={`/artists/${artist.path}`} className={styles.link}>
					{artist.title}
				</Link>
				<p className={styles.byline}>{artist.byline}</p>
			</div>
		</div>
	)
}

export default ArtistCard

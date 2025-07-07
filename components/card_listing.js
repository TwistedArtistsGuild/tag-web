/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import Image from "next/image"
import styles from "/styles/components/card_x.module.css"

const ListingCard = ({ listing }) => {
		return (
		<div className={styles.card}>
			<div className={styles.imageContainer}>
				<Link href={`/artists/${listing?.artist?.path}/listings/${listing?.path}`}><Image
					src={listing?.profilePic?.url || "/blank_image.png"}
					alt={listing?.profilePic?.alttext || `${listing?.title || 'Unknown'}'s picture`}
					width={240} // Increased width 3x from original 80
					height={240} // Increased height 3x from original 80
					className={styles.listingPic}
				/></Link>
			</div>
			<div className={styles.details}>
				<Link href={`/artists/${listing?.artist?.path}/listings/${listing?.path}`} className={styles.link}>
					{listing?.title || 'Untitled'}
				</Link>
				<p className={styles.description}>{listing?.description || 'No description available'}</p>
				<p className={styles.time}>Listing created: {listing?.created ? new Date(listing.created).toLocaleDateString("en-US") : 'No date available'}</p>
				<p className={styles.artistid}>Artist: {listing?.artist?.title || 'No artist found'}</p>
				<p className={styles.listingtypefk}>Category : {listing?.artCategory?.category || 'No category found'}</p>
			</div>
		</div>
	)
}

export default ListingCard

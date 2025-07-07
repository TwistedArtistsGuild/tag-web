/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import React, { useState, useEffect } from "react"
import Link from "next/link"
import styles from "/styles/components/sidebar.module.css"
import ArtistCard from "/components/card_artist"
import ListingCard from "/components/card_listing"
import { useRouter } from "next/router"

const Sidebar = (props) => {
	const [show, setShow] = useState(false)
	const [searchTerm, setSearchTerm] = useState("")
	const router = useRouter()

	useEffect(() => {
		if (!show) {
			setTimeout(() => {
				setShow(true)
			}, 100)
		}
	}, [show])

	return (
		<div
			className={`${show ? styles.sidebarContainer : styles.hidden} ${
				props.open ? styles.sidebarOpen : styles.sidebarClosing
			}`}
		>
			{!props.open && (
				<button onClick={() => props.setOpen(true)} className={styles.openButton}>&lt;&lt;</button>
			)}
			{props.open && (
				<>
					<div className={styles.topBar}>
						<button onClick={() => props.setOpen(false)} className={styles.minimizeButton}>&gt;&gt;</button>
						<Link href="/" passHref>
							<div className={`${styles.navLink} ${styles.logo}`} id="logo">
								<img
									id="logo"
									src="/tag_logo.png"
									alt="Home"
									height="30"
									width="60"
								/>
							</div>
						</Link>
					</div>

					<div className={`${props.open ? styles.containerOpen : styles.containerClosed}`}>
						<form action={`/search`} method="GET" className={styles.searchForm}>
							<input
								type="text"
								name="term"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search..."
								className={styles.searchInput}
							/>
							<button type="submit" className={styles.searchButton}>Search</button>
						</form>
					</div>

					<div className={styles.contentFrame}>
						{props.listings && props.listings.length > 0 ? (
							props.listings.map((listing, index) => (
								<ListingCard key={index} listing={listing} />
							))
						) : props.artists && props.artists.length > 0 ? (
							props.artists.map((artist, index) => (
								<ArtistCard key={index} artist={artist} />
							))
						) : (
							<div className={styles.emptyFrame}>
								<p>Dynamic Content coming soon!</p>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	)
}

export default Sidebar

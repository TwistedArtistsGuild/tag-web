"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"

export const defaultNavigationTree = [
	{
		id: "home",
		label: "Home",
		href: "/",
		children: [
			{
				id: "discover",
				label: "Discover",
				children: [
					{
						id: "bloomscroll",
						label: "Bloomscroll",
						href: "/art",
					},
				],
			},
			{
				id: "account",
				label: "Account",
				children: [
					{
						id: "user-portal",
						label: "User Portal",
						href: "/user/portal",
					},
					{
						id: "privacy-settings",
						label: "Privacy Settings",
						href: "/user/privacy-settings",
					},
					{
						id: "artist-admin",
						label: "Artist Admin",
						children: [
							{
								id: "artist-portal-twistedpassions",
								label: "TwistedPassions Portal",
								href: "/artists/TwistedPassions/portal",
							},
							{
								id: "artist-portal-campfirecirque",
								label: "CampfireCirque Portal",
								href: "/artists/CampfireCirque/portal",
							},
						],
					},
				],
			},
		],
	},
]

export const defaultNavigationFavorites = {
	artists: [
		{
			id: "fav-artist-twistedpassions",
			label: "TwistedPassions",
			href: "/artists/TwistedPassions",
		},
	],
	artListings: [
		{
			id: "fav-tiedye3",
			label: "TwistedPassions - tiedye3",
			href: "/artists/TwistedPassions/listings/tiedye3",
		},
		{
			id: "fav-tiedye2",
			label: "TwistedPassions - tiedye2",
			href: "/artists/TwistedPassions/listings/tiedye2",
		},
	],
}

function cleanPath(path) {
	return String(path || "/").split("?")[0].split("#")[0]
}

function isActiveHref(pathname, href) {
	if (!href) return false
	const hrefPath = cleanPath(href)
	if (hrefPath === "/") return pathname === "/"
	return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)
}

function getDefaultExpandedMap(tree) {
	const expanded = {}

	const walk = (node) => {
		if (Array.isArray(node.children) && node.children.length > 0) {
			expanded[node.id] = true
			node.children.forEach(walk)
		}
	}

	tree.forEach(walk)
	return expanded
}

function NavNode({ node, pathname, expandedMap, onToggle, depth = 0 }) {
	const hasChildren = Array.isArray(node.children) && node.children.length > 0
	const isExpanded = expandedMap[node.id]
	const isActive = isActiveHref(pathname, node.href)

	return (
		<li>
			<div
				className="flex items-center gap-1.5 rounded-md border border-base-content/10 px-1.5 py-1"
				style={{ marginLeft: `${depth * 10}px` }}
			>
				{hasChildren ? (
					<button
						type="button"
						onClick={() => onToggle(node.id)}
						className="inline-flex h-5 w-5 items-center justify-center rounded-sm p-0 text-xs font-semibold leading-none text-base-content/50 transition-colors hover:text-base-content focus:outline-none focus-visible:ring-1 focus-visible:ring-base-content/30"
						aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
					>
						<span aria-hidden="true">{isExpanded ? "-" : "+"}</span>
					</button>
				) : (
					<span className="inline-block w-6 text-center text-xs text-base-content/40">•</span>
				)}

				{node.href ? (
					<Link
						href={node.href}
						className={`flex-1 rounded px-1.5 py-0.5 text-sm transition-colors ${
							isActive
								? "bg-primary text-primary-content"
								: "text-base-content hover:bg-base-300"
						}`}
					>
						{node.label}
					</Link>
				) : (
					<span className="flex-1 px-1.5 py-0.5 text-sm font-medium text-base-content/80">{node.label}</span>
				)}
			</div>

			{hasChildren && isExpanded ? (
				<ul className="mt-1 space-y-1">
					{node.children.map((child) => (
						<NavNode
							key={child.id}
							node={child}
							pathname={pathname}
							expandedMap={expandedMap}
							onToggle={onToggle}
							depth={depth + 1}
						/>
					))}
				</ul>
			) : null}
		</li>
	)
}

function UnsubscribeButton({ onClick, label }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="btn btn-ghost btn-xs h-6 min-h-0 w-6 p-0 text-base-content/60 hover:text-error"
			aria-label={`Unsubscribe from ${label}`}
			title="Unsubscribe"
		>
			<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
			</svg>
		</button>
	)
}

function FavoritesSection({ pathname, favorites, onUnsubscribe }) {
	const sections = [
		{ key: "artists", title: "Artists", items: favorites.artists },
		{ key: "artListings", title: "Art Listings", items: favorites.artListings },
	]

	return (
		<div className="mt-6 border-t border-base-content/10 pt-4">
			<h2 className="mb-2 text-sm font-semibold text-base-content">User Favorites</h2>
			{sections.map((section) => (
				<div key={section.key} className="mb-3 last:mb-0">
					<h3 className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-base-content/60">{section.title}</h3>
					<ul className="space-y-1">
						{section.items.map((favorite) => {
							const isActive = isActiveHref(pathname, favorite.href)
							return (
								<li key={favorite.id} className="flex items-center gap-1">
									<Link
										href={favorite.href}
										className={`flex-1 rounded px-2 py-1 text-sm transition-colors ${
											isActive
												? "bg-primary text-primary-content"
												: "text-base-content hover:bg-base-300"
										}`}
									>
										{favorite.label}
									</Link>
									<UnsubscribeButton
										onClick={() => onUnsubscribe(section.key, favorite.id)}
										label={favorite.label}
									/>
								</li>
							)
						})}
					</ul>
				</div>
			))}
		</div>
	)
}

export default function Navigation({
	navItems = defaultNavigationTree,
	initialFavorites = defaultNavigationFavorites,
	title = "Navigation",
	subtitle,
	showFavorites = true,
	className = "",
	embedded = false,
}) {
	const ContainerTag = embedded ? "div" : "aside"
	const router = useRouter()
	const pathname = useMemo(() => cleanPath(router.asPath), [router.asPath])
	const [manualExpandedMap, setManualExpandedMap] = useState({})
	const [favorites, setFavorites] = useState(initialFavorites)
	const defaultExpandedMap = useMemo(() => getDefaultExpandedMap(navItems), [navItems])
	const expandedMap = useMemo(
		() => ({
			...defaultExpandedMap,
			...manualExpandedMap,
		}),
		[defaultExpandedMap, manualExpandedMap]
	)

	const onToggle = (id) => {
		setManualExpandedMap((prev) => ({
			...prev,
			[id]: !(id in prev ? prev[id] : defaultExpandedMap[id]),
		}))
	}

	const onUnsubscribe = (sectionKey, favoriteId) => {
		setFavorites((prev) => ({
			...prev,
			[sectionKey]: prev[sectionKey].filter((item) => item.id !== favoriteId),
		}))
	}

	return (
		<ContainerTag className={`${embedded ? "" : "rounded-xl border border-base-content/10 bg-base-200 p-4 shadow"} ${className}`.trim()}>
			{title ? <h1 className="mb-1 text-lg font-semibold">{title}</h1> : null}
			{subtitle ? <p className="mb-4 text-xs text-base-content/70">{subtitle}</p> : null}

			<nav aria-label="Left sidebar navigation">
				<ul className="space-y-1">
					{navItems.map((node) => (
						<NavNode
							key={node.id}
							node={node}
							pathname={pathname}
							expandedMap={expandedMap}
							onToggle={onToggle}
						/>
					))}
				</ul>
			</nav>

			{showFavorites ? (
				<FavoritesSection pathname={pathname} favorites={favorites} onUnsubscribe={onUnsubscribe} />
			) : null}
		</ContainerTag>
	)
}

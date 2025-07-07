/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import {useAppContext} from "/components/Context"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import LoginProfile from "/components/Header/LoginProfile"
import TableOfContents from "/components/widgets/TableOfContents"
import DirectMessages from "/components/DirectMessages" // Import DirectMessages component
import logo from "@/public/logo.png"
import config from "@/config"
import DropdownMenu from "/components/Header/DropdownMenu"
import ThemeDropdownMenu from "/components/Header/ThemeDropdownMenu"
// Import icons from react-icons
import { FiBell, FiMessageSquare, FiChevronUp, FiChevronDown } from 'react-icons/fi'

// Available themes 
const themes = [
	"tag-theme",
	"light", 
	"dark", 
	"cupcake", 
	"bumblebee", 
	"emerald", 
	"corporate", 
	"synthwave", 
	"retro",  
	"valentine", 
	"halloween", 
	"garden",  
	"aqua", 
	"pastel", 
	"fantasy", 
	"black", 
	"luxury", 
	"dracula"
];

/**
 * Main header component for the application
 * Provides navigation, user profile, and theme selection
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.pageSections - Page sections for table of contents
 * @returns {JSX.Element} Header component with navigation and controls
 */
export default function Header ({ pageSections = [] }) {
	const {active, setActive, user, pageSections: contextPageSections} = useAppContext()
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(false)
	const [theme, setTheme] = useState("tag-theme") // Set default theme to tag-theme
	const [themeMenuOpen, setThemeMenuOpen] = useState(false) // State for theme menu
	const [dmModalOpen, setDmModalOpen] = useState(false) // State for DM modal
	const [notificationsOpen, setNotificationsOpen] = useState(false) // State for notifications dropdown
	const [notificationCount, setNotificationCount] = useState(3) // Mock notification count
	const [unreadMessages, setUnreadMessages] = useState(2) // Mock unread messages count
	const [scrolled, setScrolled] = useState(false) // Track if page has scrolled
	const [navBarMinimized, setNavBarMinimized] = useState(false) // Track if secondary nav is minimized
	
	// Use sections from context if available
	const sectionsToUse = contextPageSections.length > 0 ? contextPageSections : pageSections;

	function handleActive (link) {
		setActive(link)
	}

	function handleThemeChange(newTheme) {
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
		// Save user's theme preference
		localStorage.setItem("theme", newTheme);
	}

	function toggleThemeMenu() {
		setThemeMenuOpen(!themeMenuOpen);
		// Close other dropdowns
		if (!themeMenuOpen) {
			setNotificationsOpen(false);
			setDmModalOpen(false);
		}
	}
	
	function toggleDmModal() {
		setDmModalOpen(!dmModalOpen);
		// Close other dropdowns
		if (!dmModalOpen) {
			setThemeMenuOpen(false);
			setNotificationsOpen(false);
		}
		
		// Mark messages as read when opening
		if (!dmModalOpen && unreadMessages > 0) {
			setUnreadMessages(0);
		}
	}
	
	function toggleNotifications() {
		setNotificationsOpen(!notificationsOpen);
		// Close other dropdowns
		if (!notificationsOpen) {
			setThemeMenuOpen(false);
			setDmModalOpen(false);
		}
		
		// Mark notifications as read when opened
		if (!notificationsOpen && notificationCount > 0) {
			setNotificationCount(0);
		}
	}

	// Toggle secondary navigation bar minimized state
	function toggleNavBar() {
		setNavBarMinimized(!navBarMinimized);
		
		// Save preference in localStorage
		localStorage.setItem("navBarMinimized", (!navBarMinimized).toString());
	}

	// Get the appropriate CSS class for header styling based on the current theme
	function getHeaderClassName() {
		// Base classes that are always applied
		const baseClasses = "flex justify-evenly items-center border-b border-base-300 w-full px-8 header-custom";
		
		// Special case for tag-theme with paint drip effect
		if (theme === 'tag-theme') {
			return `${baseClasses} header-paint-drip`;
		}
		
		return baseClasses;
	}

	// Enhanced text styling that ensures visibility across all themes
	function getTextColorClass(isActive = false) {
		// Base text styling with enhanced visibility
		let baseTextClass = 'font-josefin-sans font-extrabold transition-all';
		
		// Apply theme-specific text colors
		if (isActive) {
			// When active, use primary color with enhanced visibility
			return `${baseTextClass} text-primary enhanced-text-visibility`;
		}
		
		// Default text with enhanced visibility
		return `${baseTextClass} text-base-content enhanced-text-visibility`;
	}

	// Load user's preferred theme from localStorage or use tag-theme as default
	useEffect(() => {
		// Force application of theme CSS variables immediately
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem("theme") || "tag-theme";
			setTheme(savedTheme);
			document.documentElement.setAttribute("data-theme", savedTheme);
			
			// Load navbar minimized preference
			const savedNavBarMinimized = localStorage.getItem("navBarMinimized");
			if (savedNavBarMinimized) {
				setNavBarMinimized(savedNavBarMinimized === "true");
			}
		}
	}, []);

	// setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
	useEffect(() => {
		setIsOpen(false)
	}, [router.asPath]);
	
	// Add scroll event listener to enhance the sticky header
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 100) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};
		
		window.addEventListener('scroll', handleScroll);
		
		// Cleanup
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const headerClass = getHeaderClassName();

	// Mock notifications data
	const mockNotifications = [
		{
			id: 1,
			type: "comment",
			title: "New Comment",
			content: "ArtEnthusiast42 commented on your artwork",
			time: "10 minutes ago",
			read: false,
			link: "/artists/self/listings/artwork-1"
		},
		{
			id: 2,
			type: "like",
			title: "New Like",
			content: "GalleryOwner liked your recent post",
			time: "1 hour ago",
			read: false,
			link: "/blog/post-1"
		},
		{
			id: 3,
			type: "system",
			title: "Welcome to TAG",
			content: "Welcome to Twisted Artists Guild! Get started by completing your profile.",
			time: "2 days ago",
			read: true,
			link: "/profile"
		}
	];

	return (
		<header className="w-full">
			{/* Main header with logo and site title - not sticky */}
			<div className={headerClass}>
				<div className="flex justify-end">
					<Link
						href="/"
						className="text-base-content font-bold"
						id="logo"
						onClick={e => setActive("")}>
						<Image
							id="logo"
							src="/tag_logo.png"
							alt="Home"
							height={100}
							width={200}
						/>
					</Link>
				</div>
				<div className="w-full">
					<Link
						href="/"
						className="font-josefin-sans text-[3rem] font-extrabold italic transition-all outline-text ml-8 site-title">
						Twisted Artists Guild
					</Link>
				</div>
				{/* Burger button to open menu on mobile */}
				<div className="flex lg:hidden">
					<button
						type="button"
						className="btn btn-square btn-ghost"
						onClick={() => setIsOpen(true)}
					>
						<span className="sr-only">Open main menu</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
					</button>
				</div>
				
				{/* Main navigation menu */}
				<div className="hidden md:flex justify-center items-right w-full text-center space-x-6">
					<Link
						href="/artists"
						className={`text-[2rem] ${getTextColorClass(active === "artist")}`}
						onClick={e => handleActive(e.target.name)}
						name="artist">
						Artists
					</Link>
					<DropdownMenu
						title="Art"
						titleHref="/art/"
						active={active === "art"}
						onActivate={() => handleActive("art")}
						options={[
							{ label: "Physical", href: "/art/physical" },
							{ label: "Digital", href: "/art/digital" },
							{ label: "Performance", href: "/art/performance" },
							{ label: "Search", href: "/search/" },
						]}
						className={`text-[2rem] ${getTextColorClass(active === "art")}`}
					/>
					<Link
						href="/events"
						className={`text-[2rem] ${getTextColorClass(active === "events")}`}
						onClick={e => handleActive(e.target.name)}
						name="events">
						Events
					</Link>
					<Link
						href="/blogs"
						className={`text-[2rem] ${getTextColorClass(active === "blog")}`}
						onClick={e => handleActive(e.target.name)}
						name="blog">
						Blog
					</Link>
					<Link
						href="/news"
						className={`text-[2rem] ${getTextColorClass(active === "news")}`}
						onClick={e => handleActive(e.target.name)}
						name="news">
						News
					</Link>
					<Link
						href="/vote/"
						className={`text-[2rem] ${getTextColorClass(active === "vote")}`}
						onClick={e => handleActive(e.target.name)}
						name="vote">
						Vote
					</Link>
					<LoginProfile className="btn btn-sm btn-circle btn-ghost" />
				</div>
			</div>
			
			{/* Second layer with table of contents, theme selector and notification icons */}
				<div className="bg-base-100 text-base-content text-center py-1 sticky top-50 z-50 flex justify-between items-center px-8 py-2 border-b border-base-300/50 transition-all duration-300 ease-in-out"
					style={{
						backdropFilter: scrolled ? 'blur(8px)' : 'none',
						boxShadow: scrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none',
						height: navBarMinimized ? '2rem' : 'auto',
						overflow: navBarMinimized ? 'hidden' : 'visible',
						opacity: scrolled ? 0.95 : 1,
					}}
				>
					 {/* Search input box and button */}
					<div className="flex items-center gap-2">
						<input
							type="text"
							placeholder="Search..."
							className="input input-bordered input-sm"
						/>
						<button className="btn btn-sm btn-primary">Search</button>
					</div>

					{/* Table of Contents */}
					<div className="flex-grow max-w-4xl overflow-x-auto no-scrollbar">
						{sectionsToUse && sectionsToUse.length > 0 && (
							<TableOfContents 
								sections={sectionsToUse} 
								displayInline={true}
								className={`hidden md:flex items-center transition-opacity duration-200 ${navBarMinimized ? 'opacity-0' : 'opacity-100'}`}
								title=""
							/>
						)}
					</div>

					{/* Right side with theme selector, DM, notifications, and LoginProfile */}
					<div className="flex items-center gap-4">
						<ThemeDropdownMenu
							themes={themes}
							currentTheme={theme}
							onThemeChange={handleThemeChange}
							className="btn btn-sm btn-ghost"
							isOpen={themeMenuOpen}
							onToggle={toggleThemeMenu}
							/>
						{user && (
							<>
								<button 
									onClick={toggleDmModal} 
									className="btn btn-sm btn-circle btn-ghost relative"
									aria-label="Open messages"
								>
									<FiMessageSquare size={18} />
									{unreadMessages > 0 && (
										<span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{unreadMessages}
										</span>
									)}
								</button>
								<button 
									onClick={toggleNotifications} 
									className="btn btn-sm btn-circle btn-ghost relative"
									aria-label="Open notifications"
								>
									<FiBell size={18} />
									{notificationCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{notificationCount}
										</span>
									)}
								</button>
							</>
						)}
						
					</div>
				</div>

			{/* Toggle button to minimize/restore navbar - Positioned at the bottom of the header */}
			<button
				onClick={toggleNavBar}
				className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-base-200 text-base-content hover:bg-base-300 p-1 rounded-full border border-base-300 shadow-md z-[51]"
				style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translate(-50%, 50%)' }}
				aria-label={navBarMinimized ? "Expand navigation" : "Minimize navigation"}
				title={navBarMinimized ? "Show navigation" : "Hide navigation"}
			>
				{navBarMinimized ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
			</button>

			{/* Mobile menu, show/hide based on menu state. */}
			<div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
				<div
					className="fixed inset-y-0 right-0 z-[100] w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300"
				>
					{/* Your logo/name on small screens */}
					<div className="flex items-center justify-between">
						<Link
							className="flex items-center gap-2 shrink-0"
							title={`${config.appName} hompage`}
							href="/"
						>
							<Image
								src={logo}
								alt={`${config.appName} logo`}
								className="w-8"
								placeholder="blur"
								priority={true}
							/>
							<span className="font-extrabold text-lg">{config.appName}</span>
						</Link>
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5"
							onClick={() => setIsOpen(false)}
						>
							<span className="sr-only">Close menu</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Links on small screens */}
					<div className="flow-root mt-6">
						<div className="py-4">
							<div className="flex flex-col gap-y-4 items-start">
								<Link
									href="/artists"
									className={`text-[1rem] ${getTextColorClass(active === "artist")}`}
									onClick={e => handleActive (e.target.name)}
									name="artist">
									Artists
								</Link>
								<Link
									href="/art"
									className={`text-[1rem] ${getTextColorClass(active === "art")}`}
									onClick={e => handleActive (e.target.name)}
									name="art">
									Art
								</Link>
								<Link
									href="/events"
									className={`text-[1rem] ${getTextColorClass(active === "events")}`}
									onClick={e => handleActive(e.target.name)}
									name="events">
									Events
								</Link>
								<Link
									href="/blog"
									className={`text-[1rem] ${getTextColorClass(active === "blog")}`}
									onClick={e => handleActive (e.target.name)}
									name="blog">
									Blog
								</Link>
								<Link
									href="/news"
									className={`text-[1rem] ${getTextColorClass(active === "news")}`}
									onClick={e => handleActive (e.target.name)}
									name="news">
									News
								</Link>
								
								{/* User controls for mobile */}
								{user && (
									<>
										<div className="flex items-center gap-2 mt-2">
											<button 
												onClick={toggleDmModal}
												className="btn btn-sm btn-outline gap-1"
											>
												<FiMessageSquare size={16} />
												Messages
												{unreadMessages > 0 && (
													<span className="badge badge-sm badge-error">{unreadMessages}</span>
												)}
											</button>
											<button 
												onClick={toggleNotifications}
												className="btn btn-sm btn-outline gap-1"
											>
												<FiBell size={16} />
												Notifications
												{notificationCount > 0 && (
													<span className="badge badge-sm badge-error">{notificationCount}</span>
												)}
											</button>
										</div>
									</>
								)}
								
								<div className="flex items-center gap-2 mt-2">
									<span>Theme: </span>
									<select 
										value={theme} 
										onChange={(e) => handleThemeChange(e.target.value)}
										className="select select-bordered select-sm"
									>
										{themes.map(t => (
											<option key={t} value={t}>
												{t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
											</option>
										))}
									</select>
								</div>
								
								{/* Mobile Table of Contents */}
								{sectionsToUse && sectionsToUse.length > 0 && (
									<div className="mt-4 w-full">
										<h3 className="font-medium mb-2">On This Page:</h3>
										<ul className="space-y-1 pl-2">
											{sectionsToUse.map(section => (
												<li key={section.id}>
													<button 
														onClick={() => {
															const element = document.getElementById(section.id);
															if (element) {
																element.scrollIntoView({ behavior: 'smooth' });
																setIsOpen(false);
															}
														}}
														className="text-primary hover:underline text-left"
													>
														{section.label}
													</button>
												</li>
											))}
										</ul>
									</div>
								)}
								
								<LoginProfile />
							</div>
						</div>
						<div className="divider"></div>
						{/* Your CTA on small screens */}
						<div className="flex flex-col">
							<button className="btn btn-primary">Get started</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

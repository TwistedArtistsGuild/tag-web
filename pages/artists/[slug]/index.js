/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



//Imports
import Image from "next/image" // Next v10+ (Not working and not called at this time)
import ImageGallery from "react-image-gallery" //tested on home page with static images, looks pretty good
import Link from "next/link"
import { useState, useEffect } from "react" //Sidebar state
import TagSEO from "@/components/TagSEO"
import longDateOptions from "/utils/longdateoptions"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Pagination from "@/components/widgets/Pagination" // Assume a reusable pagination component exists
import { useAppContext } from "/components/Context" // Import context to update header sections


/**
 * @desc Displays an individual artist's details by the shortname, passed by POST
 * @param {object} props - Component props containing artist data and related information
 * @returns {JSX.Element} - Individual artist page
 */
const Artist = props => {
	const options = longDateOptions;
	const { setPageSections } = useAppContext(); // Get access to context to set sections

	// State for search functionality
	const [searchTerm, setSearchTerm] = useState("");
	
	// Navigation sections for quick jump
	const sections = [
		{ id: "profile", label: "Profile" },
		{ id: "artwork", label: "Featured Artwork" },
		{ id: "events", label: "Events & Exhibitions" },
		{ id: "listings", label: "Art Listings" },
		{ id: "comments", label: "Comments & Feedback" },
	];

	// Set page sections in context when component mounts
	useEffect(() => {
		setPageSections(sections);
		
		// Clean up when component unmounts
		return () => {
			setPageSections([]);
		};
	}, [setPageSections]);

	const pageMetaData = {
		title: `TAG Artist Member - ${props.artist?.title || "Unknown Artist"}`,
		description: props.artist?.byline || "Artist details unavailable.",
		keywords: props.artist?.seoTags || "",
		robots: "index, follow",
		author: props.artist?.title || "Unknown",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: props.artist?.title || "Unknown Artist",
			description: props.artist?.byline || "Artist details unavailable.",
		},
	};

	// Sample artwork data for slideshow
	const sampleArtworks = [
		{
			original: "https://picsum.photos/id/1015/1000/600",
			thumbnail: "https://picsum.photos/id/1015/250/150",
			description: "Landscape painting with mountains",
			title: "Mountain Vista"
		},
		{
			original: "https://picsum.photos/id/1016/1000/600",
			thumbnail: "https://picsum.photos/id/1016/250/150",
			description: "Abstract mixed media piece",
			title: "Convergence"
		},
		{
			original: "https://picsum.photos/id/1018/1000/600",
			thumbnail: "https://picsum.photos/id/1018/250/150",
			description: "Watercolor portrait",
			title: "Serene Waters"
		},
		{
			original: "https://picsum.photos/id/1019/1000/600",
			thumbnail: "https://picsum.photos/id/1019/250/150",
			description: "Digital art landscape",
			title: "Digital Dreams"
		},
		{
			original: "https://picsum.photos/id/1022/1000/600",
			thumbnail: "https://picsum.photos/id/1022/250/150",
			description: "Oil on canvas",
			title: "Eternal Light"
		}
	];

	// Sample comments
	const sampleComments = [
		{
			id: 1,
			author: "ArtEnthusiast42",
			avatar: "https://i.pravatar.cc/100?img=1",
			date: "2023-11-15",
			content: "Your use of color in the landscape series is absolutely breathtaking! I'd love to see your work in person someday.",
			likes: 7,
			replies: []
		},
		{
			id: 2,
			author: "GalleryOwner",
			avatar: "https://i.pravatar.cc/100?img=2", 
			date: "2023-11-10",
			content: "We featured your work in our downtown exhibition last month and received incredible feedback. Looking forward to collaborating again!",
			likes: 12,
			replies: [
				{
					id: 21,
					author: "ArtistInResidence",
					avatar: "https://i.pravatar.cc/100?img=8",
					date: "2023-11-11",
					content: "Thank you for the opportunity! It was an honor to be featured alongside such talented artists.",
					likes: 3
				}
			]
		},
		{
			id: 3,
			author: "ArtStudent22",
			avatar: "https://i.pravatar.cc/100?img=3",
			date: "2023-11-05",
			content: "Your technique is inspiring! I've been studying your brush work and it's helping me develop my own style. Thank you for sharing your journey!",
			likes: 5,
			replies: [
				{
					id: 31,
					author: "MasterPainter",
					avatar: "https://i.pravatar.cc/100?img=9",
					date: "2023-11-06",
					content: "As a fellow artist, I agree completely. The texture work is particularly noteworthy!",
					likes: 2
				}
			]
		},
		{
			id: 4, 
			author: "LocalCollector",
			avatar: "https://i.pravatar.cc/100?img=4",
			date: "2023-10-28",
			content: "I purchased one of your pieces last year and it's still my favorite item in my collection. The way it captures light is magical.",
			likes: 9,
			replies: []
		},
		{
			id: 5,
			author: "CreativeMind",
			avatar: "https://i.pravatar.cc/100?img=5",
			date: "2023-10-20",
			content: "The evolution of your style over the years has been fascinating to watch. Each new series brings something fresh while maintaining your unique perspective.",
			likes: 14,
			replies: []
		}
	];

	const [likeCount, setLikeCount] = useState(42);
	const [liked, setLiked] = useState(false);
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [commentText, setCommentText] = useState("");

	// Handle like button click
	const handleLikeClick = () => {
		if (liked) {
			setLikeCount(likeCount - 1);
		} else {
			setLikeCount(likeCount + 1);
		}
		setLiked(!liked);
	};

	// Handle comment submission
	const handleCommentSubmit = (e) => {
		e.preventDefault();
		if (commentText.trim()) {
			alert("Comment feature coming soon! Your comment would be: " + commentText);
			setCommentText("");
			setShowCommentForm(false);
		}
	};

	// Slideshow settings
	const gallerySettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		adaptiveHeight: true,
	};

	const listings = props.listings || [];
	const links = props.links || [];

	// Dummy events data
	const events = [
		{
			id: 1,
			title: "Gallery Opening",
			date: "2023-12-15",
			location: "Downtown Art Gallery",
			description: "Come see the latest collection of works in this exclusive gallery opening."
		},
		{
			id: 2,
			title: "Art Workshop",
			date: "2024-01-10",
			location: "Community Center",
			description: "Learn techniques and tips in this hands-on workshop for artists of all levels."
		},
		{
			id: 3,
			title: "Virtual Exhibition",
			date: "2024-01-25",
			location: "Online",
			description: "Join us online for a virtual tour of the newest artistic creations."
		}
	];

	// Dummy social links
	const socialLinks = [
		{ icon: "facebook", url: "#", label: "Facebook" },
		{ icon: "instagram", url: "#", label: "Instagram" },
		{ icon: "twitter", url: "#", label: "Twitter" },
		{ icon: "pinterest", url: "#", label: "Pinterest" },
	];

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle contact button click
	const handleContactClick = () => {
		alert("Contact functionality coming soon!");
		// This will be replaced with actual direct message functionality later
	};

	useEffect(() => {
		if (!props.artist) {
			console.warn("Artist data failed to load.");
		}
	}, [props.artist]);

	// Scroll to section function
	const scrollToSection = (id) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<div className="mx-auto p-4 relative">
			<TagSEO metadataProp={pageMetaData} canonicalSlug={`artists/${props.slug}`} />
			
			 {/* Cover Picture */}
			<div className="relative w-full h-60 md:h-96 overflow-hidden">
				<Image
					src={props.coverPic?.url || "/blank_image.png"}
					alt={props.coverPic?.altText || "Cover Picture"}
					layout="fill"
					objectFit="cover"
					className="rounded-lg shadow-lg"
					priority
				/>
			</div>

			{/* Loading Message */}
			{!props.artist && <p className="text-center text-gray-500 mt-4">Loading artist details... Please wait.</p>}

			{/* Artist Details */}
			{props.artist && (
				<>
					<div id="profile" className="card lg:card-side bg-base-100 shadow-xl mt-8">
						<figure className="px-4 pt-4 lg:pl-4 lg:pr-0">
							<Image
								src={props.profilePic?.url || "/blank_image.png"}
								alt={`Profile picture of ${props.artist.title}`}
								width={250}
								height={250}
								className="rounded-xl object-cover shadow-lg"
							/>
						</figure>
						<div className="card-body">
							<div className="flex flex-wrap justify-between items-start">
								<div>
									<h1 className="card-title text-3xl font-bold text-primary">{props.artist.title || "Unknown Artist"}</h1>
									<p className="text-xl italic text-secondary">{props.artist.byline || "Artist at Twisted Artists Guild"}</p>
									<div className="badge badge-accent mt-2">TAG Member</div>
									<div className="mt-4">
										<p className="text-lg">
											<span className="font-semibold">Artist Since:</span> {new Date(props.artist.applied).toLocaleDateString("en-US", options)}
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-2 mt-2 lg:mt-0">
									<button onClick={handleContactClick} className="btn btn-primary">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
											<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
										</svg>
										Contact Me
									</button>
									<div className="flex gap-2 justify-end">
										{socialLinks.map((link, index) => (
											<a 
												key={index} 
												href={link.url} 
												target="_blank" 
												rel="noopener noreferrer"
												className="btn btn-circle btn-sm btn-outline"
												aria-label={link.label}
											>
												{/* Simple icon representation - replace with real icons later */}
												{link.icon.charAt(0).toUpperCase()}
											</a>
										))}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-4 mt-4">
								<button 
									onClick={handleLikeClick} 
									className={`btn btn-sm ${liked ? "btn-primary" : "btn-outline"}`}
									aria-label="Like this artist"
								>
									<svg xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
									</svg>
									<span className="ml-2">{likeCount} Likes</span>
								</button>
								<button 
									onClick={() => setShowCommentForm(!showCommentForm)} 
									className="btn btn-sm btn-outline"
									aria-label="Comment on this artist"
								>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span className="ml-2">Comment</span>
								</button>
							</div>
							{showCommentForm && (
								<form onSubmit={handleCommentSubmit} className="mt-4">
									<textarea 
										className="textarea textarea-bordered w-full" 
										placeholder="Write your comment here..." 
										value={commentText}
										onChange={(e) => setCommentText(e.target.value)}
									/>
									<div className="flex justify-end mt-2">
										<button type="submit" className="btn btn-primary btn-sm">Submit</button>
									</div>
								</form>
							)}
						</div>
					</div>

					{/* Artist Statement Section */}
					<div
						id="statement"
						className="mt-8 prose max-w-none"
						dangerouslySetInnerHTML={{ __html: props.artist.statement || "No statement available." }}
					/>
					
					 {/* Featured Artwork Gallery */}
					<div className="mt-12">
						<h2 className="text-2xl font-bold mb-4 border-b pb-2">Featured Artwork</h2>
						<div className="card bg-base-100 shadow-lg p-4">
							<div className="rounded-lg overflow-hidden" style={{ maxHeight: '600px' }}>
								<ImageGallery 
									items={sampleArtworks}
									showPlayButton={true}
									showFullscreenButton={true}
									showThumbnails={true}
									showBullets={true}
									showNav={true}
									thumbnailPosition="bottom"
									additionalClass="artwork-gallery"
									useBrowserFullscreen={true}
									slideInterval={5000}
									lazyLoad={true}
									renderItem={(item) => (
										<div className="image-gallery-image">
											<img
												src={item.original}
												alt={item.description}
												style={{ objectFit: 'contain', maxHeight: '500px', margin: '0 auto' }}
											/>
											{item.description && (
												<div className="image-gallery-description">{item.description}</div>
											)}
										</div>
										)}
									renderThumbInner={(item) => (
										<div className="image-gallery-thumbnail-inner">
											<img 
												src={item.thumbnail} 
												alt={item.description}
												className="image-gallery-thumbnail-image"
												style={{ objectFit: 'cover', height: '80px' }}
											/>
											<div className="image-gallery-thumbnail-label">
												{item.title}
											</div>
										</div>
									)}
								/>
							</div>
							<div className="mt-4 flex justify-between items-center">
								<p className="text-lg font-medium">Browse the artist's featured collection</p>
								<button className="btn btn-primary btn-sm">View All Works</button>
							</div>
						</div>
					</div>
					
					{/* Events Section */}
					<div id="events" className="mt-12">
						<h2 className="text-2xl font-bold mb-4 border-b pb-2">Upcoming Events</h2>
						{events.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{events.map((event) => (
									<div key={event.id} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
										<div className="card-body">
											<h3 className="card-title text-primary">{event.title}</h3>
											<div className="flex items-center text-sm mb-2">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
													<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
												</svg>
												{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
											</div>
											<div className="flex items-center text-sm mb-3">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
													<path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
												</svg>
												{event.location}
											</div>
											<p className="text-sm">{event.description}</p>
											<div className="card-actions justify-end mt-2">
												<button className="btn btn-sm btn-outline btn-primary">Details</button>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-500">No upcoming events for this artist.</p>
						)}
					</div>
				</>
			)}

			{/* Listings Section */}
			<div id="listings" className="mt-12">
				<h2 className="text-2xl font-bold mb-4 border-b pb-2">Top Listings</h2>
				{listings.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{listings.map((listing) => (
							<div key={listing.listingID} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
								<figure className="px-4 pt-4">
									<Link href={`/artists/${props.slug}/listings/${listing.path || listing.listingID}`}>
										<Image
											src={listing.profilePic?.url || "/blank_image.png"}
											alt={listing.profilePic?.altText || "Listing Image"}
											width={150}
											height={150}
											className="rounded-lg object-cover h-40 w-full"
										/>
									</Link>
								</figure>
								<div className="card-body">
									<Link href={`/artists/${props.slug}/listings/${listing.path || listing.listingID}`}>
										<h3 className="card-title hover:text-primary transition-colors">{listing.title || "Untitled"}</h3>
									</Link>
									<p className="text-sm line-clamp-2">{listing.description || "No description available."}</p>
									<div className="flex justify-between items-center mt-2">
										<span className="font-medium">{listing.price ? `$${listing.price}` : "Price on request"}</span>
										<span className="badge badge-outline">{listing.artCategory?.category || "Uncategorized"}</span>
									</div>
									<div className="card-actions justify-end mt-3">
										<Link href={`/artists/${props.slug}/listings/${listing.path || listing.listingID}`} className="btn btn-sm btn-primary">
											View Details
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500">No listings available for this artist.</p>
				)}
			</div>

			{/* Search Section */}
			<div id="search" className="mt-12">
				<h2 className="text-2xl font-bold mb-4 border-b pb-2">Search Works</h2>
				<div className="card bg-base-100 shadow-lg p-6">
					<div className="form-control mb-4">
						<div className="input-group w-full">
							<input 
								type="text" 
								placeholder="Search by title, medium, or style..." 
								className="input input-bordered w-full" 
								value={searchTerm}
								onChange={handleSearchChange}
								aria-label="Search for artist's works"
							/>
							<button className="btn btn-primary">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
								</svg>
							</button>
						</div>
					</div>

					<div className="flex flex-wrap gap-3 mb-4">
						<span className="text-sm font-medium mr-2">Quick Filters:</span>
						<button className="btn btn-sm btn-outline">Paintings</button>
						<button className="btn btn-sm btn-outline">Digital Art</button>
						<button className="btn btn-sm btn-outline">Sculptures</button>
						<button className="btn btn-sm btn-outline">Photography</button>
						<button className="btn btn-sm btn-outline">Recent Works</button>
					</div>

					<div className="bg-base-200 p-4 rounded-lg text-center">
						<p>Enter search terms above to find works by this artist</p>
						<p className="text-sm text-gray-500 mt-1">Advanced search options coming soon!</p>
					</div>
				</div>
			</div>

			{/* Social Section */}
			<div id="social" className="mt-12 mb-8">
				<h2 className="text-2xl font-bold mb-4 border-b pb-2">Comments & Feedback</h2>
				<div className="card bg-base-100 shadow-lg p-6">
					{/* Comments Section */}
					<div className="space-y-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-semibold">Recent Comments ({sampleComments.length})</h3>
							<button 
								onClick={() => setShowCommentForm(!showCommentForm)} 
								className="btn btn-primary btn-sm"
							>
								{showCommentForm ? "Cancel" : "Add Comment"}
							</button>
						</div>
						
						{/* Comment Form */}
						{showCommentForm && (
							<form onSubmit={handleCommentSubmit} className="card bg-base-200 p-4 mb-6">
								<div className="form-control mb-3">
									<textarea 
										className="textarea textarea-bordered w-full" 
										placeholder="Share your thoughts about this artist's work..." 
										value={commentText}
										onChange={(e) => setCommentText(e.target.value)}
										rows="3"
									/>
								</div>
								<div className="flex justify-end">
									<button type="submit" className="btn btn-primary">Submit Comment</button>
								</div>
							</form>
						)}
						
						{/* Comment List */}
						{sampleComments.map(comment => (
							<div key={comment.id} className="border-b pb-4 last:border-b-0">
								<div className="flex gap-4">
									<div className="avatar">
										<div className="w-12 h-12 rounded-full">
											<img src={comment.avatar} alt={`${comment.author}'s avatar`} />
										</div>
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<h3 className="font-medium">{comment.author}</h3>
											<span className="text-sm text-gray-500">{comment.date}</span>
										</div>
										<p className="mt-1">{comment.content}</p>
										<div className="mt-2 flex items-center gap-4">
											<button className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
												</svg>
												{comment.likes} likes
											</button>
											<button className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
												</svg>
												Reply
											</button>
										</div>
									</div>
								</div>
								
								{/* Replies */}
								{comment.replies && comment.replies.length > 0 && (
									<div className="mt-4 space-y-4 pl-8 ml-12 border-l-2 border-gray-200">
										{comment.replies.map(reply => (
											<div key={reply.id} className="flex gap-4">
												<div className="avatar">
													<div className="w-10 h-10 rounded-full">
														<img src={reply.avatar} alt={`${reply.author}'s avatar`} />
													</div>
												</div>
												<div className="flex-1">
													<div className="flex items-center justify-between">
														<h4 className="font-medium">{reply.author}</h4>
														<span className="text-sm text-gray-500">{reply.date}</span>
													</div>
													<p className="mt-1">{reply.content}</p>
													<div className="mt-2 flex items-center gap-4">
														<button className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
															<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
																<path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
															</svg>
															{reply.likes} likes
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Update Link */}
			<div className="mt-8 text-center">
				<Link
					href={`/artists/${props.slug}/update`}
					className="btn btn-primary">
					Update this artist page
				</Link>
			</div>
		</div>
	);
};

/**
 * Fetches artist data from the API during server-side rendering
 * @param {object} context - Next.js context object containing query parameters
 * @returns {object} - Props to be passed to the Artist component
 */
Artist.getInitialProps = async function (context) {
	const { slug } = context.query;
	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
	const defaultPic = {
		picturenum: 1,
		context: "artists",
		slug: "default",
		metadata: "default",
		title: "default",
		alttext: "default",
		url: "/blank_image.png",
	};

	// Debug startup info
	if (process.env.DEBUG === "true") {
		console.group(`Artist Slug Page (${slug}) - Data Fetch`);
		console.log("API URL for profile:", `${api_url}artist/${slug}/profile`);
	}

	const fetchData = async (url, defaultData) => {
		try {
			const res = await fetch(url);
			
			if (process.env.DEBUG === "true") {
				console.log(`Fetch response for ${url}:`, {
					status: res.status,
					ok: res.ok,
					statusText: res.statusText
				});
			}
			
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			
			const data = await res.json();
			
			if (process.env.DEBUG === "true") {
				console.log("Response data structure:", Object.keys(data));
			}
			
			return data;
		} catch (error) {
			console.error(`Error fetching ${url}:`, error);
			return defaultData;
		}
	};

	// Fetch artist profile data
	let artistData = await fetchData(`${api_url}artist/${slug}/profile`, {
		artist: null,
		profilePic: defaultPic,
		coverPic: defaultPic,
		listings: [],
		links: [],
	});

	// Debug logs for troubleshooting
	if (process.env.DEBUG === "true") {
		console.log("Artist object structure:", artistData.artist ? Object.keys(artistData.artist) : "No artist data");
		
		if (artistData.artist) {
			console.log("Artist profilePic ID:", artistData.artist.profilePicID);
			console.log("Artist profilePic object:", artistData.artist.profilePic);
		}
		
		console.log("Separate profilePic from API:", artistData.profilePic);
		
		// Check if profilePic paths match what's expected
		if (artistData.artist?.profilePic && artistData.profilePic) {
			const artistPicUrl = artistData.artist.profilePic.url;
			const separatePicUrl = artistData.profilePic.url;
			
			console.log("Artist's embedded profilePic URL:", artistPicUrl);
			console.log("Separate profilePic URL:", separatePicUrl);
			console.log("URLs match:", artistPicUrl === separatePicUrl);
		}
		
		console.groupEnd();
	}

	return {
		artist: artistData.artist,
		slug: slug,
		profilePic: artistData.profilePic,
		coverPic: artistData.coverPic,
		listings: artistData.listings,
		links: artistData.links,
	};
};

export default Artist;

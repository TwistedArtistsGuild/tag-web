/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { useState, useEffect } from "react";
import TagSEO from "@/components/TagSEO";
import SocialComments from "/components/SocialComments";
import DirectMessages from "/components/DirectMessages";
//import { defaultButtonClass } from "/utils/formSettings"; DNE

/**
 * TestQuill - Component to test and demonstrate our rich text editing components
 * Shows both SocialComments and DirectMessages in action
 */
export default function TestQuill() {
	// Demo state for currentUser - in a real app this would come from auth context
	const [currentUser, setCurrentUser] = useState({
		id: "current-user",
		username: "ArtistUser",
		displayName: "Demo Artist",
		avatarUrl: "https://i.pravatar.cc/150?img=37",
		isAdmin: true
	});
	
	// Toggle between demo components
	const [activeView, setActiveView] = useState("comments"); // "comments" or "messages"
	
	// Test data for comments
	const [comments, setComments] = useState([]);
	// Test data for messages
	const [messages, setMessages] = useState([]);
	// Test conversation data
	const [conversation, setConversation] = useState(null);
	// Whether to use the integrated demo mode of DirectMessages
	const [useDemoMode, setUseDemoMode] = useState(true);
	
	// Tab selection 
	const tabClass = "tab tab-bordered flex-1";
	const activeTabClass = "tab tab-bordered tab-active flex-1";
	
	// Page metadata for SEO
	const pageMetaData = {
		title: "Rich Text Components Demo",
		description: "Testing component for rich text editing, comments and messaging",
		keywords: "quill, editor, comments, social media, messaging, chat",
		robots: "noindex, nofollow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Rich Text Components Demo",
			description: "Testing component for rich text editing, comments and messaging",
		},
	};
	
	// Initialize demo data
	useEffect(() => {
		// Load mock comments data
		const mockComments = [
			{ 
				id: 1, 
				body: "<p>This is the first comment with an embedded image!</p><p><img src=\"https://picsum.photos/400/300\" alt=\"Random sample image\" /></p><p>What do you think of this artwork?</p>", 
				author: "User1",
				authorId: "user1",
				authorDisplayName: "Sarah Johnson", 
				avatarUrl: "https://i.pravatar.cc/150?img=32", 
				likes: 5,
				created: "2023-07-10T12:00:00Z",
				replies: [
					{ 
						id: 3, 
						body: "<p>I really love the composition! The use of color is striking.</p><p>Have you seen this related piece? <a href=\"https://example.com/art\">Check it out</a></p>", 
						author: "User3",
						authorId: "user3",
						authorDisplayName: "Miguel Gonzalez", 
						avatarUrl: "https://i.pravatar.cc/150?img=11", 
						likes: 2,
						created: "2023-07-10T14:30:00Z"
					},
					{ 
						id: 4, 
						body: "<p>Here's my reaction to this piece:</p><p><iframe width=\"320\" height=\"180\" src=\"https://www.youtube.com/embed/dQw4w9WgXcQ\" frameborder=\"0\" allowfullscreen></iframe></p>", 
						author: "User4",
						authorId: "user4",
						authorDisplayName: "Taylor Wright", 
						avatarUrl: "https://i.pravatar.cc/150?img=23", 
						likes: 7,
						created: "2023-07-10T16:45:00Z"
					}
				]
			},
			{ 
				id: 2, 
				body: "<p>Another interesting point to discuss. I've been working on some techniques that might help:</p><ul><li>Start with a solid foundation</li><li>Layer carefully</li><li>Don't rush the drying process</li></ul><p>I documented my process in this video:</p><p><iframe width=\"320\" height=\"180\" src=\"https://www.youtube.com/embed/dQw4w9WgXcQ\" frameborder=\"0\" allowfullscreen></iframe></p>", 
				author: "User2",
				authorId: "user2",
				authorDisplayName: "Alex Foster", 
				avatarUrl: "https://i.pravatar.cc/150?img=53", 
				likes: 3,
				created: "2023-07-10T13:15:00Z",
				replies: []
			}
		];
		
		setComments(mockComments);
		
		// Load mock conversation and messages
		const mockConversation = {
			id: "conv1",
			name: "Creative Projects Discussion",
			isGroup: true,
			isOnline: true,
			participants: [
				{
					id: "user1",
					username: "SarahJ",
					displayName: "Sarah Johnson",
					avatarUrl: "https://i.pravatar.cc/150?img=32",
				},
				{
					id: "user2",
					username: "AlexF",
					displayName: "Alex Foster",
					avatarUrl: "https://i.pravatar.cc/150?img=53",
				},
				{
					id: "user3",
					username: "MiguelG",
					displayName: "Miguel Gonzalez",
					avatarUrl: "https://i.pravatar.cc/150?img=11",
				}
			]
		};
		
		const mockMessages = [
			{
				id: "msg1",
				content: "<p>Hey everyone! I'm working on a new painting for the exhibition next month.</p>",
				senderId: "user1",
				senderName: "Sarah Johnson",
				senderAvatar: "https://i.pravatar.cc/150?img=32",
				timestamp: "2023-10-15T10:30:00Z",
				status: "read"
			},
			{
				id: "msg2",
				content: "<p>That sounds interesting! What's the theme?</p>",
				senderId: "user2",
				senderName: "Alex Foster",
				senderAvatar: "https://i.pravatar.cc/150?img=53",
				timestamp: "2023-10-15T10:32:00Z",
				status: "read"
			},
			{
				id: "msg3",
				content: "<p>It's about urban landscapes at night. Here's my concept sketch:</p><p><img src=\"https://picsum.photos/320/240\" alt=\"Concept sketch\" /></p>",
				senderId: "user1",
				senderName: "Sarah Johnson",
				senderAvatar: "https://i.pravatar.cc/150?img=32",
				timestamp: "2023-10-15T10:35:00Z",
				status: "read"
			},
			{
				id: "msg4",
				content: "<p>I love the atmosphere! The lighting is perfect.</p>",
				senderId: "current-user",
				senderName: "Demo Artist",
				senderAvatar: "https://i.pravatar.cc/150?img=37",
				timestamp: "2023-10-15T10:40:00Z",
				status: "read"
			},
			{
				id: "msg5",
				content: "<p>Thanks! I'm thinking about using a darker palette than I usually do.</p>",
				senderId: "user1", 
				senderName: "Sarah Johnson",
				senderAvatar: "https://i.pravatar.cc/150?img=32",
				timestamp: "2023-10-15T10:42:00Z",
				status: "read"
			},
			{
				id: "msg6",
				content: "<p>Have you all seen this technique? It might work well for the night scenes:</p><p><a href=\"https://example.com/technique\">https://example.com/night-painting-technique</a></p>",
				senderId: "user3",
				senderName: "Miguel Gonzalez",
				senderAvatar: "https://i.pravatar.cc/150?img=11",
				timestamp: "2023-10-15T10:45:00Z",
				status: "read"
			},
			{
				id: "msg7",
				content: "<p>I'll check that out! I've been experimenting with some new brushes too.</p>",
				senderId: "current-user",
				senderName: "Demo Artist",
				senderAvatar: "https://i.pravatar.cc/150?img=37",
				timestamp: "2023-10-15T10:50:00Z",
				status: "sent"
			}
		];
		
		setConversation(mockConversation);
		setMessages(mockMessages);
	}, []);
	
	// Handlers for comment actions
	const handleAddComment = (comment, parentId = null) => {
		// In a real app, this would send to an API
		console.log("Adding comment:", comment, "to parent:", parentId);
		
		if (parentId) {
			// Add reply to existing comment
			setComments(comments.map(c => {
				if (c.id === parentId) {
					return {
						...c,
						replies: [...c.replies, { 
							...comment,
							id: Date.now() // Replace temp ID with a "real" one
						}]
					};
				}
				return c;
			}));
		} else {
			// Add new top-level comment
			setComments([...comments, {
				...comment,
				id: Date.now(), // Replace temp ID with a "real" one
				replies: []
			}]);
		}
	};
	
	const handleUpdateComment = (comment, parentId = null) => {
		// In a real app, this would send to an API
		console.log("Updating comment:", comment, "parent:", parentId);
		
		if (parentId) {
			// Update reply
			setComments(comments.map(c => {
				if (c.id === parentId) {
					return {
						...c,
						replies: c.replies.map(r => r.id === comment.id ? comment : r)
					};
				}
				return c;
			}));
		} else {
			// Update top-level comment
			setComments(comments.map(c => c.id === comment.id ? { ...c, ...comment, replies: c.replies } : c));
		}
	};
	
	const handleLikeComment = (comment, parentId = null) => {
		// In a real app, this would send to an API
		console.log("Liking comment:", comment, "parent:", parentId);
	};
	
	// Handler for sending a message
	const handleSendMessage = (message, conversationId) => {
		// In a real app, this would send to an API
		console.log("Sending message:", message, "to conversation:", conversationId);
		
		// Add the new message to the list
		setMessages([...messages, {
			...message,
			id: `msg${messages.length + 1}`, // Replace temp ID with a "real" one
			status: "sent" // Update status
		}]);
	};

	return (
		<div className="p-6 bg-base-300 min-h-screen">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="test/testquill" />
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">Rich Text Components Demo</h1>
				
				{/* User switcher - in a real app you'd use auth */}
				<div className="mb-8">
					<div className="flex items-center gap-3">
						<div className="avatar">
							<div className="w-12 h-12 rounded-full">
								<img 
									src={currentUser?.avatarUrl} 
									alt={currentUser?.displayName} 
								/>
							</div>
						</div>
						<div>
							<p className="font-semibold">{currentUser?.displayName}</p>
							<p className="text-sm opacity-70">@{currentUser?.username}</p>
						</div>
						<div className="ml-auto">
							{currentUser ? (
								<button className="btn btn-sm"
									onClick={() => setCurrentUser(null)}
								>
									Logout
								</button>
							) : (
								<button className="btn btn-primary"
									onClick={() => setCurrentUser({
										id: "current-user",
										username: "ArtistUser",
										displayName: "Demo Artist",
										avatarUrl: "https://i.pravatar.cc/150?img=37",
										isAdmin: true
									})}
								>
									Login as Demo User
								</button>
							)}
						</div>
					</div>
				</div>
				
				{/* Component selector */}
				<div className="tabs tabs-boxed mb-6">
					<a 
						className={activeView === "comments" ? activeTabClass : tabClass}
						onClick={() => setActiveView("comments")}
					>
						Social Comments
					</a>
					<a 
						className={activeView === "messages" ? activeTabClass : tabClass}
						onClick={() => setActiveView("messages")}
					>
						Direct Messages
					</a>
				</div>
				
				{/* Demo components */}
				{activeView === "comments" && (
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title">Social Comments</h2>
							<p className="text-base-content/70 mb-4">
								A full-featured comments system with support for replies, likes, and rich media content.
							</p>
							
							<SocialComments 
								initialComments={comments}
								onAddComment={handleAddComment}
								onUpdateComment={handleUpdateComment}
								onLikeComment={handleLikeComment}
								currentUser={currentUser}
								allowMedia={true}
								readOnly={false}
								theme="light"
							/>
						</div>
					</div>
				)}
				
				{activeView === "messages" && (
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body p-0 overflow-hidden"> {/* Remove padding for chat UI */}
							<div className="flex justify-between items-center p-4 border-b border-base-300">
								<h2 className="font-bold text-xl">Direct Messages Demo</h2>
								<div className="form-control">
									<label className="cursor-pointer label">
										<span className="label-text mr-2">Use Built-in Demo Conversations</span> 
										<input 
											type="checkbox" 
											className="toggle toggle-primary" 
											checked={useDemoMode}
											onChange={() => setUseDemoMode(!useDemoMode)}
										/>
									</label>
								</div>
							</div>
							{useDemoMode ? (
								<DirectMessages 
									demoMode={true}
									allowMedia={true}
									readOnly={false}
									theme="light"
									maxHeight={500}
								/>
							) : (
								<DirectMessages 
									messages={messages}
									onSendMessage={handleSendMessage}
									currentUser={currentUser}
									conversation={conversation}
									compact={false}
									allowMedia={true}
									readOnly={false}
									theme="light"
									maxHeight={500}
								/>
							)}
						</div>
					</div>
				)}
				
				{/* Component documentation */}
				<div className="mt-8 bg-base-100 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-bold mb-4">Documentation</h2>
					<div className="tabs mb-6">
						<a 
							className={activeView === "comments" ? "tab tab-lifted tab-active" : "tab tab-lifted"}
							onClick={() => setActiveView("comments")}
						>
							SocialComments API
						</a>
						<a 
							className={activeView === "messages" ? "tab tab-lifted tab-active" : "tab tab-lifted"}
							onClick={() => setActiveView("messages")}
						>
							DirectMessages API
						</a>
					</div>
					
					{activeView === "comments" && (
						<div className="space-y-4">
							<p>The <code>SocialComments</code> component provides a complete comment system for social media interactions.</p>
							
							<div className="overflow-x-auto">
								<table className="table table-zebra w-full">
									<thead>
										<tr>
											<th>Prop</th>
											<th>Type</th>
											<th>Default</th>
											<th>Description</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td><code>initialComments</code></td>
											<td>Array</td>
											<td>[]</td>
											<td>Initial comments data to display</td>
										</tr>
										<tr>
											<td><code>onAddComment</code></td>
											<td>Function</td>
											<td>() =&gt; {}</td>
											<td>Callback when a comment is added</td>
										</tr>
										<tr>
											<td><code>onUpdateComment</code></td>
											<td>Function</td>
											<td>() =&gt; {}</td>
											<td>Callback when a comment is updated</td>
										</tr>
										<tr>
											<td><code>onLikeComment</code></td>
											<td>Function</td>
											<td>{"() => {}"}</td>
											<td>Callback when a comment is liked</td>
										</tr>
										<tr>
											<td><code>currentUser</code></td>
											<td>Object</td>
											<td>null</td>
											<td>Current user information</td>
										</tr>
										<tr>
											<td><code>allowMedia</code></td>
											<td>Boolean</td>
											<td>true</td>
											<td>Whether to allow image/video embedding</td>
										</tr>
										<tr>
											<td><code>readOnly</code></td>
											<td>Boolean</td>
											<td>false</td>
											<td>Whether the comments are read-only</td>
										</tr>
										<tr>
											<td><code>theme</code></td>
											<td>String</td>
											<td>"light"</td>
											<td>Theme variant ('light' or 'dark')</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					)}
					
					{activeView === "messages" && (
						<div className="space-y-4">
							<p>The <code>DirectMessages</code> component provides a messaging interface for 1:1 and group conversations.</p>
							
							<div className="overflow-x-auto">
								<table className="table table-zebra w-full">
									<thead>
										<tr>
											<th>Prop</th>
											<th>Type</th>
											<th>Default</th>
											<th>Description</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td><code>messages</code></td>
											<td>Array</td>
											<td>[]</td>
											<td>Array of message objects to display</td>
										</tr>
										<tr>
											<td><code>onSendMessage</code></td>
											<td>Function</td>
											<td>{"() => {}"}</td>
											<td>Callback when a new message is sent</td>
										</tr>
										<tr>
											<td><code>currentUser</code></td>
											<td>Object</td>
											<td>null</td>
											<td>Current user information</td>
										</tr>
										<tr>
											<td><code>conversation</code></td>
											<td>Object</td>
											<td>null</td>
											<td>Conversation object with participants</td>
										</tr>
										<tr>
											<td><code>compact</code></td>
											<td>Boolean</td>
											<td>false</td>
											<td>Whether to show in compact mode (for notification panels)</td>
										</tr>
										<tr>
											<td><code>allowMedia</code></td>
											<td>Boolean</td>
											<td>true</td>
											<td>Whether to allow image/video embedding</td>
										</tr>
										<tr>
											<td><code>readOnly</code></td>
											<td>Boolean</td>
											<td>false</td>
											<td>Whether the messages are read-only</td>
										</tr>
										<tr>
											<td><code>theme</code></td>
											<td>String</td>
											<td>"light"</td>
											<td>Theme variant ('light' or 'dark')</td>
										</tr>
										<tr>
											<td><code>maxHeight</code></td>
											<td>Number</td>
											<td>{"compact ? 300 : 600"}</td>
											<td>Max height for the messages container</td>
										</tr>
										<tr>
											<td><code>demoMode</code></td>
											<td>Boolean</td>
											<td>false</td>
											<td>Whether to use built-in demo data (3 conversations with interactive messaging)</td>
										</tr>
									</tbody>
								</table>
							</div>
							
							{useDemoMode && (
								<div className="alert alert-info">
									<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<div>
										<p className="font-medium">Demo Mode Active</p>
										<p className="text-sm">Currently using built-in demo conversations. You can interact with the demo by:</p>
										<ul className="list-disc list-inside text-sm mt-1">
											<li>Selecting different conversations from the list</li>
											<li>Typing and sending new messages</li>
											<li>Seeing real-time message status updates (sending → sent → delivered → read)</li>
										</ul>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
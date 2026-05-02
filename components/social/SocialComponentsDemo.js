/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from 'react';
import Image from 'next/image';
import { SocialRealtimeProvider } from './SocialRealtimeContext';
import SocialComments from './Comments';
import DirectMessages from './DirectMessages';
import SocialReactions from './Reactions';
import ContactCard, { DEFAULT_STORES } from '@/components/cards/card_contactList';

// Mock data for demo
const MOCK_CURRENT_USER = {
    id: "current-user",
    username: "ArtistDemo",
    displayName: "Demo Artist",
    avatarUrl: "https://i.pravatar.cc/150?img=37",
    isAdmin: false
};

const MOCK_COMMENTS = [
    {
        id: "comment-1",
        body: "<p>This is absolutely stunning! The way you've captured the light in this piece is incredible. The brushwork shows such confidence and skill.</p>",
        authorId: "user-1",
        author: "EmmaWaters",
        authorDisplayName: "Emma Waters",
        avatarUrl: "https://i.pravatar.cc/150?img=32",
        likes: 15,
        created: "2025-08-07T10:30:00Z",
        replies: [
            {
                id: "reply-1",
                body: "<p>Thank you so much, Emma! I spent weeks studying the lighting in that particular setting.</p>",
                authorId: "current-user",
                author: "ArtistDemo",
                authorDisplayName: "Demo Artist",
                avatarUrl: "https://i.pravatar.cc/150?img=37",
                likes: 3,
                created: "2025-08-07T11:00:00Z"
            }
        ],
        reactions: [
            { emoji: '❤️', userId: 'user-2', username: 'DavidChen', timestamp: '2025-08-07T10:35:00Z' },
            { emoji: '🔥', userId: 'user-3', username: 'SophiaRodriguez', timestamp: '2025-08-07T10:40:00Z' },
            { emoji: '🎨', userId: 'current-user', username: 'ArtistDemo', timestamp: '2025-08-07T10:45:00Z' }
        ]
    },
    {
        id: "comment-2",
        body: "<p>The color palette is so harmonious. How do you approach color mixing for such vibrant yet balanced tones?</p>",
        authorId: "user-2",
        author: "DavidChen",
        authorDisplayName: "David Chen",
        avatarUrl: "https://i.pravatar.cc/150?img=11",
        likes: 8,
        created: "2025-08-07T12:15:00Z",
        replies: [],
        reactions: [
            { emoji: '👏', userId: 'user-1', username: 'EmmaWaters', timestamp: '2025-08-07T12:20:00Z' },
            { emoji: '💯', userId: 'current-user', username: 'ArtistDemo', timestamp: '2025-08-07T12:25:00Z' }
        ]
    }
];

const MOCK_REACTIONS = [
    { emoji: '❤️', userId: 'user-1', username: 'EmmaWaters', timestamp: '2025-08-07T09:00:00Z' },
    { emoji: '👏', userId: 'user-2', username: 'DavidChen', timestamp: '2025-08-07T09:15:00Z' },
    { emoji: '🔥', userId: 'user-3', username: 'SophiaRodriguez', timestamp: '2025-08-07T09:30:00Z' },
    { emoji: '😍', userId: 'user-4', username: 'ArtCollector', timestamp: '2025-08-07T09:45:00Z' },
    { emoji: '🎨', userId: 'current-user', username: 'ArtistDemo', timestamp: '2025-08-07T10:00:00Z' }
];

/**
 * SocialComponentsDemo - Demonstrates all social components with real-time functionality
 */
const SocialComponentsDemo = () => {
    const [activeTab, setActiveTab] = useState('comments');

    return (
        <SocialRealtimeProvider>
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Social Components Demo</h1>
                    <p className="text-lg text-base-content/70 mb-6">
                        Real-time social features with live updates, reactions, and messaging
                    </p>
                    <div className="alert alert-info">
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse">🔗</span>
                            <span>
                                <strong>Live Demo Mode:</strong> Watch for automatic updates and interactions! 
                                Try adding comments, reactions, or messages to see real-time functionality.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="tabs tabs-boxed justify-center">
                    <button 
                        className={`tab ${activeTab === 'comments' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('comments')}
                    >
                        Comments & Reactions
                    </button>
                    <button 
                        className={`tab ${activeTab === 'messages' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        Direct Messages
                    </button>
                    <button 
                        className={`tab ${activeTab === 'reactions' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('reactions')}
                    >
                        Reactions Only
                    </button>
                    <button 
                        className={`tab ${activeTab === 'contact' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('contact')}
                    >
                        Contact Card
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-150">
                    {activeTab === 'comments' && (
                        <div className="space-y-6">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">Comments System</h2>
                                    <p className="text-base-content/70 mb-4">
                                        Real-time comment system with replies, likes, and reactions. 
                                        New comments will appear automatically!
                                    </p>
                                    
                                    {/* Beautiful Artwork Post */}
                                    <div className="card bg-base-100 shadow-xl overflow-hidden mb-6">
                                        <figure className="relative h-80 bg-linear-to-br from-primary/20 to-secondary/20">
                                            <Image
                                                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80"
                                                alt="Abstract colorful painting - demo artwork"
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <h2 className="text-2xl font-bold">Abstract Expression #7</h2>
                                                <p className="text-sm opacity-90">Mixed media on canvas, 2025</p>
                                            </div>
                                        </figure>
                                        <div className="card-body">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-full">
                                                            <Image 
                                                                src={MOCK_CURRENT_USER.avatarUrl} 
                                                                alt={MOCK_CURRENT_USER.displayName}
                                                                width={48}
                                                                height={48}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{MOCK_CURRENT_USER.displayName}</h3>
                                                        <p className="text-sm text-base-content/70">@{MOCK_CURRENT_USER.username}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-base-content/70">Posted today</p>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span>👁️ 247 views</span>
                                                        <span>❤️ 18 likes</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-base-content/80 mt-2">
                                                This piece explores the relationship between color and emotion, using bold strokes 
                                                and vibrant hues to create a sense of movement and energy. What emotions does this 
                                                piece evoke for you? I&apos;d love to hear your thoughts in the comments below!
                                            </p>
                                        </div>
                                    </div>

                                    <SocialComments
                                        initialComments={MOCK_COMMENTS}
                                        contextId="demo-artwork-1"
                                        currentUser={MOCK_CURRENT_USER}
                                        onAddComment={(comment, parentId) => {
                                            console.log('Comment added:', comment, parentId);
                                        }}
                                        onUpdateComment={(comment, parentId) => {
                                            console.log('Comment updated:', comment, parentId);
                                        }}
                                        onLikeComment={(commentId, isReply, parentId) => {
                                            console.log('Comment liked:', commentId, isReply, parentId);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Direct Messages</h2>
                                <p className="text-base-content/70 mb-4">
                                    Real-time messaging with typing indicators and message status updates.
                                    Try sending messages and watch for live updates!
                                </p>
                                
                                <div className="h-125">
                                    <DirectMessages
                                        currentUser={MOCK_CURRENT_USER}
                                        demoMode={true}
                                        onSendMessage={(message, conversationId) => {
                                            console.log('Message sent:', message, conversationId);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reactions' && (
                        <div className="space-y-6">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">Reactions System</h2>
                                    <p className="text-base-content/70 mb-6">
                                        Real-time reactions that update across all users instantly.
                                        Click to add or remove reactions!
                                    </p>
                                    
                                    {/* Different Content Types */}
                                    <div className="space-y-6">
                                        <div className="border border-base-300 rounded-lg p-4">
                                            <h3 className="font-semibold mb-2">Post Reactions</h3>
                                            <p className="text-sm text-base-content/70 mb-4">React to posts and artwork</p>
                                            <SocialReactions
                                                targetId="content-1"
                                                targetType="post"
                                                initialReactions={MOCK_REACTIONS}
                                                currentUser={MOCK_CURRENT_USER}
                                                size="lg"
                                                onReactionAdd={(data) => console.log('Reaction added:', data)}
                                                onReactionRemove={(data) => console.log('Reaction removed:', data)}
                                            />
                                        </div>

                                        <div className="border border-base-300 rounded-lg p-4">
                                            <h3 className="font-semibold mb-2">Comment Reactions</h3>
                                            <p className="text-sm text-base-content/70 mb-4">Smaller reactions for comments</p>
                                            <SocialReactions
                                                targetId="content-2"
                                                targetType="comment"
                                                initialReactions={[
                                                    { emoji: '👍', userId: 'user-1', username: 'EmmaWaters', timestamp: '2025-08-07T09:00:00Z' },
                                                    { emoji: '❤️', userId: 'user-2', username: 'DavidChen', timestamp: '2025-08-07T09:15:00Z' }
                                                ]}
                                                currentUser={MOCK_CURRENT_USER}
                                                size="sm"
                                                onReactionAdd={(data) => console.log('Comment reaction added:', data)}
                                                onReactionRemove={(data) => console.log('Comment reaction removed:', data)}
                                            />
                                        </div>

                                        <div className="border border-base-300 rounded-lg p-4">
                                            <h3 className="font-semibold mb-2">Read-Only Reactions</h3>
                                            <p className="text-sm text-base-content/70 mb-4">View-only mode for public displays</p>
                                            <SocialReactions
                                                targetId="content-3"
                                                targetType="post"
                                                initialReactions={[
                                                    { emoji: '🔥', userId: 'user-1', username: 'EmmaWaters', timestamp: '2025-08-07T09:00:00Z' },
                                                    { emoji: '🎨', userId: 'user-2', username: 'DavidChen', timestamp: '2025-08-07T09:15:00Z' },
                                                    { emoji: '✨', userId: 'user-3', username: 'SophiaRodriguez', timestamp: '2025-08-07T09:30:00Z' }
                                                ]}
                                                currentUser={MOCK_CURRENT_USER}
                                                readOnly={true}
                                                size="md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-6">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">Contact Card / Link Tree</h2>
                                    <p className="text-base-content/70 mb-6">
                                        Display social media links, email, address, and custom URLs for users and artists.
                                        Works great for profiles and artist pages!
                                    </p>

                                    <div className="grid lg:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <h3 className="font-semibold text-sm mb-2">Long Format</h3>
                                            <ContactCard
                                                displayName="Satarah Designs"
                                                compact={false}
                                                stores={DEFAULT_STORES}
                                                contactInfo={{
                                                    location: 'Multnomah County, Oregon',
                                                    email: 'satarah@example.com',
                                                    customUrls: [
                                                        { label: 'Portfolio', url: 'https://satarah-portfolio.com', purpose: 'Full collection & commissions' },
                                                    ]
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm mb-2">Short Format (1/4 Panel)</h3>
                                            <ContactCard
                                                displayName="Satarah Designs"
                                                compact={true}
                                                stores={DEFAULT_STORES}
                                                contactInfo={{
                                                    location: 'Multnomah County, Oregon',
                                                    email: 'satarah@example.com',
                                                    customUrls: [
                                                        { label: 'Portfolio', url: 'https://satarah-portfolio.com', purpose: 'Full collection & commissions' },
                                                    ]
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Example 1: Artist with full contact info */}
                                        <ContactCard
                                            displayName="Satarah Designs"
                                            stores={DEFAULT_STORES}
                                            contactInfo={{
                                                email: 'satarah@example.com',
                                                location: 'Portland, Multnomah County, Oregon',
                                                customUrls: [
                                                { label: 'Portfolio', url: 'https://satarah-portfolio.com', purpose: 'Full collection & commissions' },
                                                { label: 'Commission Sheet', url: 'https://commission.example.com', purpose: 'Pricing & booking' },
                                                { label: 'Ko-fi Support', url: 'https://ko-fi.com/satarah', purpose: 'Support my work' }
                                            ]
                                        }}
                                        socials={[
                                            {
                                                name: "Instagram",
                                                url: "https://instagram.com/satarah",
                                                handle: "@satarah",
                                                purpose: "Follow my pottery work",
                                                color: "#c13584",
                                                icon: (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                                    </svg>
                                                ),
                                            },
                                            {
                                                name: "TikTok",
                                                url: "https://tiktok.com/@satarah",
                                                handle: "@satarah",
                                                purpose: "Running a pottery studio + tips",
                                                color: "#6a76ac",
                                                icon: (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                        <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                                                    </svg>
                                                ),
                                            }
                                        ]}
                                        />

                                        {/* Example 2: Compact artist with minimal info */}
                                        <ContactCard
                                            displayName="Luna Art Studio"
                                            contactInfo={{
                                                email: 'studio@lunaart.com',
                                                customUrls: [
                                                    { label: 'Portfolio', url: 'https://shop.lunaart.com', purpose: 'Buy original pieces' }
                                                ]
                                            }}
                                            socials={[
                                                {
                                                    name: "Instagram",
                                                    url: "https://instagram.com/lunaarts",
                                                    handle: "@lunaarts",
                                                    purpose: "Daily art posts & stories",
                                                    color: "#c13584",
                                                    icon: (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                                        </svg>
                                                    ),
                                                }
                                            ]}
                                            compact={true}
                                        />

                                        {/* Example 3: Artist with only socials (defaults) */}
                                        <ContactCard
                                            displayName="Morgan Creations"
                                        />

                                        {/* Example 4: With custom socials override */}
                                        <ContactCard
                                            displayName="Alex Studios"
                                            contactInfo={{
                                                location: 'New York, New York'
                                            }}
                                            socials={[
                                                {
                                                    name: "Website",
                                                    url: "https://alexstudios.com",
                                                    handle: "alexstudios.com",
                                                    purpose: "Full portfolio & shop",
                                                    color: "#6366f1",
                                                    icon: (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                        </svg>
                                                    ),
                                                },
                                                {
                                                    name: "Email",
                                                    url: "mailto:contact@alexstudios.com",
                                                    handle: "contact@alexstudios.com",
                                                    purpose: "Inquiries & collaborations",
                                                    color: "#ec4899",
                                                    icon: (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                                        </svg>
                                                    ),
                                                }
                                            ]}
                                        />
                                    </div>

                                    <div className="mt-6 p-4 bg-base-200 rounded-lg">
                                        <h3 className="font-semibold mb-2">Component Props</h3>
                                        <ul className="text-sm space-y-1">
                                            <li><code className="bg-base-300 px-2 py-1 rounded">displayName</code> - Optional override for card title</li>
                                            <li><code className="bg-base-300 px-2 py-1 rounded">contactInfo</code> - Object with email, location, customUrls (each with label, url, optional purpose)</li>
                                            <li><code className="bg-base-300 px-2 py-1 rounded">socials</code> - Array of social objects (defaults to TAG socials, each with handle, purpose, color, icon)</li>
                                            <li><code className="bg-base-300 px-2 py-1 rounded">stores</code> - Array of store objects (Etsy and Redbubble with SVG logos)</li>
                                            <li><code className="bg-base-300 px-2 py-1 rounded">compact</code> - true short format, false long format</li>
                                            <li><code className="bg-base-300 px-2 py-1 rounded">iconOnly</code> - Icon-only links with hover tooltips</li>
                                            <li><code className="bg-base-300 px-2 py-1 rounded">user/artist</code> - Pass user or artist object for automatic naming</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Card Demo */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Backend Integration Requirements</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-3">Database Tables Needed</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li><strong>comments</strong> - id, content, author_id, context_id, parent_id, created_at, updated_at</li>
                                    <li><strong>reactions</strong> - id, target_id, target_type, emoji, user_id, created_at</li>
                                    <li><strong>messages</strong> - id, content, sender_id, conversation_id, created_at, status</li>
                                    <li><strong>conversations</strong> - id, name, type, participants, created_at, updated_at</li>
                                    <li><strong>conversation_participants</strong> - conversation_id, user_id, role, joined_at</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3">API Endpoints Required</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li><strong>GET/POST /api/comments</strong> - CRUD operations for comments</li>
                                    <li><strong>GET/POST /api/reactions</strong> - Add/remove reactions</li>
                                    <li><strong>GET/POST /api/messages</strong> - Send/receive messages</li>
                                    <li><strong>GET /api/conversations</strong> - List user conversations</li>
                                    <li><strong>WebSocket /ws/realtime</strong> - Real-time updates</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-semibold mb-3">Real-time Events</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <div className="badge badge-primary">comment_added</div>
                                <div className="badge badge-secondary">reaction_added</div>
                                <div className="badge badge-accent">message_received</div>
                                <div className="badge badge-info">user_typing</div>
                                <div className="badge badge-success">user_online</div>
                                <div className="badge badge-warning">user_offline</div>
                                <div className="badge badge-error">message_deleted</div>
                                <div className="badge badge-neutral">comment_updated</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SocialRealtimeProvider>
    );
};

export default SocialComponentsDemo;

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import { IoSend, IoTimeOutline, IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";

// Import components
import Image from "next/image";

// Dynamically import Quill to avoid SSR issues
const QuillEditor = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => <div className="h-20 bg-base-200 animate-pulse rounded-lg"></div>,
});

// Mock demo data for conversations
const MOCK_CONVERSATIONS = [
    {
        id: "conv-1",
        name: "Art Exhibition Planning",
        isGroup: true,
        isOnline: true,
        lastMessage: "Let's finalize the lineup by Friday!",
        lastMessageTime: "10:42 AM",
        unreadCount: 2,
        participants: [
            {
                id: "artist-1",
                username: "EmmaWaters",
                displayName: "Emma Waters",
                avatarUrl: "https://i.pravatar.cc/150?img=32",
                isOnline: true,
                role: "Curator"
            },
            {
                id: "artist-2",
                username: "DavidChen",
                displayName: "David Chen",
                avatarUrl: "https://i.pravatar.cc/150?img=11",
                isOnline: false,
                role: "Sculptor"
            },
            {
                id: "artist-3",
                username: "SophiaRodriguez",
                displayName: "Sophia Rodriguez",
                avatarUrl: "https://i.pravatar.cc/150?img=24",
                isOnline: true,
                role: "Painter"
            }
        ]
    },
    {
        id: "conv-2",
        name: null, // 1:1 conversation
        isGroup: false,
        isOnline: true,
        lastMessage: "I'm interested in your latest piece",
        lastMessageTime: "Yesterday",
        unreadCount: 0,
        participants: [
            {
                id: "client-1",
                username: "JamesCollector",
                displayName: "James Wilson",
                avatarUrl: "https://i.pravatar.cc/150?img=53",
                isOnline: true,
                role: "Art Collector"
            }
        ]
    },
    {
        id: "conv-3",
        name: null, // 1:1 conversation
        isGroup: false,
        isOnline: false,
        lastMessage: "Could we discuss commission details?",
        lastMessageTime: "Aug 24",
        unreadCount: 1,
        participants: [
            {
                id: "client-2",
                username: "MiaTaylor",
                displayName: "Mia Taylor",
                avatarUrl: "https://i.pravatar.cc/150?img=47",
                isOnline: false,
                role: "Gallery Owner"
            }
        ]
    }
];

// Mock messages for each conversation
const MOCK_MESSAGES = {
    "conv-1": [
        {
            id: "msg1-1",
            content: "<p>Hi everyone! I wanted to discuss the upcoming Fall Exhibition. We need to finalize the artist lineup and space allocations.</p>",
            senderId: "artist-1",
            senderName: "Emma Waters",
            senderAvatar: "https://i.pravatar.cc/150?img=32",
            timestamp: "2023-08-20T10:30:00Z",
            status: "read"
        },
        {
            id: "msg1-2",
            content: "<p>I've prepared three large sculptures for the central hall. Can I get the dimensions of the pedestals again?</p>",
            senderId: "artist-2",
            senderName: "David Chen",
            senderAvatar: "https://i.pravatar.cc/150?img=11",
            timestamp: "2023-08-20T10:35:00Z",
            status: "read"
        },
        {
            id: "msg1-3",
            content: "<p>For sure, David. The pedestals are 120cm x 120cm with a height of 90cm. We can adjust if needed though.</p>",
            senderId: "artist-1",
            senderName: "Emma Waters",
            senderAvatar: "https://i.pravatar.cc/150?img=32",
            timestamp: "2023-08-20T10:40:00Z",
            status: "read"
        },
        {
            id: "msg1-4",
            content: "<p>I was thinking of displaying my new series along the east wall. It's a sequence of 7 paintings that tell a story when viewed in order.</p>",
            senderId: "artist-3",
            senderName: "Sophia Rodriguez",
            senderAvatar: "https://i.pravatar.cc/150?img=24",
            timestamp: "2023-08-20T10:41:00Z",
            status: "read"
        },
        {
            id: "msg1-5",
            content: "<p>That sounds perfect, Sophia! The east wall gets beautiful morning light which would complement your color palette.</p><p>Let's all meet at the gallery on Wednesday to mark spaces and plan the flow.</p>",
            senderId: "artist-1",
            senderName: "Emma Waters",
            senderAvatar: "https://i.pravatar.cc/150?img=32",
            timestamp: "2023-08-20T10:42:00Z",
            status: "read"
        }
    ],
    "conv-2": [
        {
            id: "msg2-1",
            content: "<p>Hello! I saw your 'Urban Echoes' series at the downtown gallery last week and was completely captivated.</p>",
            senderId: "client-1",
            senderName: "James Wilson",
            senderAvatar: "https://i.pravatar.cc/150?img=53",
            timestamp: "2023-08-23T14:22:00Z",
            status: "read"
        },
        {
            id: "msg2-2",
            content: "<p>Thank you, James! I'm glad you connected with the work. It's a series I've been developing for almost two years.</p>",
            senderId: "current-user",
            senderName: "You",
            senderAvatar: "https://i.pravatar.cc/150?img=37",
            timestamp: "2023-08-23T14:30:00Z",
            status: "read"
        },
        {
            id: "msg2-3",
            content: "<p>The depth and texture really stood out to me. Is 'Midnight Crossing' still available for purchase?</p>",
            senderId: "client-1",
            senderName: "James Wilson",
            senderAvatar: "https://i.pravatar.cc/150?img=53",
            timestamp: "2023-08-23T15:05:00Z",
            status: "read"
        },
        {
            id: "msg2-4",
            content: "<p>Yes, it is! It's currently priced at $3,200. Would you like to see some additional photos of the piece in different lighting?</p>",
            senderId: "current-user",
            senderName: "You",
            senderAvatar: "https://i.pravatar.cc/150?img=37",
            timestamp: "2023-08-23T15:17:00Z",
            status: "read"
        },
        {
            id: "msg2-5",
            content: "<p>That would be great. I'm seriously considering it for my office. The colors would work perfectly with the space.</p>",
            senderId: "client-1",
            senderName: "James Wilson",
            senderAvatar: "https://i.pravatar.cc/150?img=53",
            timestamp: "2023-08-24T09:30:00Z",
            status: "read"
        },
        {
            id: "msg2-6",
            content: "<p>Perfect! Here are some additional photos showing the piece in different lighting conditions.</p><p><img src='https://picsum.photos/id/1015/500/300' alt='Artwork in morning light' /></p><p><img src='https://picsum.photos/id/1019/500/300' alt='Artwork in evening light' /></p>",
            senderId: "current-user",
            senderName: "You",
            senderAvatar: "https://i.pravatar.cc/150?img=37",
            timestamp: "2023-08-24T10:45:00Z",
            status: "read"
        },
        {
            id: "msg2-7",
            content: "<p>I'm interested in your latest piece. Can we arrange a private viewing?</p>",
            senderId: "client-1",
            senderName: "James Wilson",
            senderAvatar: "https://i.pravatar.cc/150?img=53",
            timestamp: "2023-08-24T11:10:00Z",
            status: "read"
        }
    ],
    "conv-3": [
        {
            id: "msg3-1",
            content: "<p>Hi there! I'm Mia from Horizon Gallery. We've been following your work for some time and would love to discuss a potential exhibition.</p>",
            senderId: "client-2",
            senderName: "Mia Taylor",
            senderAvatar: "https://i.pravatar.cc/150?img=47",
            timestamp: "2023-08-15T11:20:00Z",
            status: "read"
        },
        {
            id: "msg3-2",
            content: "<p>Hello Mia! I'm honored you're interested in my work. I'd love to hear more about the exhibition opportunity.</p>",
            senderId: "current-user",
            senderName: "You",
            senderAvatar: "https://i.pravatar.cc/150?img=37",
            timestamp: "2023-08-15T13:45:00Z",
            status: "read"
        },
        {
            id: "msg3-3",
            content: "<p>Wonderful! We're planning a 'New Perspectives' show in October featuring emerging artists who push boundaries. We'd like to feature 4-6 of your pieces.</p><p>Our gallery space: <img src='https://picsum.photos/id/1048/500/300' alt='Gallery space photo' /></p>",
            senderId: "client-2",
            senderName: "Mia Taylor",
            senderAvatar: "https://i.pravatar.cc/150?img=47",
            timestamp: "2023-08-16T09:15:00Z",
            status: "read"
        },
        {
            id: "msg3-4",
            content: "<p>The space looks beautiful! I'm definitely interested. Would you be looking for existing works, or would you be open to new pieces created specifically for the exhibition?</p>",
            senderId: "current-user",
            senderName: "You",
            senderAvatar: "https://i.pravatar.cc/150?img=37",
            timestamp: "2023-08-16T10:20:00Z",
            status: "read"
        },
        {
            id: "msg3-5",
            content: "<p>We'd be thrilled to feature new works created for the exhibition! That would align perfectly with our theme. We could also include 1-2 of your existing pieces that represent your artistic journey.</p>",
            senderId: "client-2",
            senderName: "Mia Taylor",
            senderAvatar: "https://i.pravatar.cc/150?img=47",
            timestamp: "2023-08-16T11:05:00Z",
            status: "read"
        },
        {
            id: "msg3-6",
            content: "<p>That sounds like an exciting opportunity. I've been experimenting with some new techniques that would be perfect for this show.</p>",
            senderId: "current-user",
            senderName: "You",
            senderAvatar: "https://i.pravatar.cc/150?img=37",
            timestamp: "2023-08-16T14:30:00Z",
            status: "read"
        },
        {
            id: "msg3-7",
            content: "<p>Could we discuss commission details? We typically offer a 70/30 split on sales, with the gallery handling all marketing, installation, and sales processing.</p>",
            senderId: "client-2",
            senderName: "Mia Taylor",
            senderAvatar: "https://i.pravatar.cc/150?img=47",
            timestamp: "2023-08-24T15:45:00Z",
            status: "delivered"
        }
    ]
};

// Mock current user data
const MOCK_CURRENT_USER = {
    id: "current-user",
    username: "ArtistUser",
    displayName: "Morgan Reed",
    avatarUrl: "https://i.pravatar.cc/150?img=37",
    isAdmin: false
};

/**
 * DirectMessages - A chat component for 1:1 and group conversations with rich text support
 * 
 * @param {Object} props
 * @param {Array} props.messages - Array of message objects to display
 * @param {Function} props.onSendMessage - Callback when a new message is sent
 * @param {Object} props.currentUser - Current user information
 * @param {Object} props.conversation - Conversation object with participants
 * @param {boolean} props.compact - Whether to show in compact mode (for notification panels)
 * @param {boolean} props.allowMedia - Whether to allow image/video embedding (default: true)
 * @param {boolean} props.readOnly - Whether the messages are read-only (default: false)
 * @param {string} props.theme - Optional theme variant ('light' or 'dark', default is 'light')
 * @param {number} props.maxHeight - Optional max height for the messages container
 * @param {boolean} props.demoMode - Whether to use demo data (default: false)
 */
const DirectMessages = ({
    messages = [],
    onSendMessage = () => {},
    currentUser = null,
    conversation = null,
    compact = false,
    allowMedia = true,
    readOnly = false,
    theme = "light",
    maxHeight = compact ? 300 : 600,
    demoMode = false
}) => {
    // State management for messages and composition
    const [messageList, setMessageList] = useState([]);
    const [newMessageContent, setNewMessageContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientTheme, setClientTheme] = useState(theme);
    
    // Demo mode states
    const [demoConversations, setDemoConversations] = useState(MOCK_CONVERSATIONS);
    const [demoMessages, setDemoMessages] = useState(MOCK_MESSAGES);
    const [activeConversation, setActiveConversation] = useState(null);
    const [showConversationList, setShowConversationList] = useState(true);
    const [demoUser, setDemoUser] = useState(MOCK_CURRENT_USER);
    
    // Ref for auto-scrolling to latest messages
    const messagesEndRef = useRef(null);

    // Get theme from localStorage on client-side only
    useEffect(() => {
        const storedTheme = typeof window !== 'undefined' ? localStorage.getItem("theme") : null;
        if (storedTheme) {
            setClientTheme(storedTheme);
        }
    }, []);
    
    // Initialize with provided messages or demo data
    useEffect(() => {
        if (demoMode) {
            // In demo mode, start with conversation list
            setIsLoading(false);
        } else if (messages) {
            setMessageList(messages);
            setIsLoading(false);
            // Scroll to bottom when messages change
            scrollToBottom();
        } else {
            setMessageList([]);
            setIsLoading(false);
        }
    }, [messages, demoMode]);
    
    // Scroll to the end of messages when new ones arrive
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Small delay to ensure DOM is updated
    };
    
    // Format timestamp to human-readable format
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        
        // Check if the message is from today
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Check if the message is from yesterday
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        // Format for older messages
        return date.toLocaleDateString([], { 
            month: 'short', 
            day: 'numeric' 
        }) + ' at ' + date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };
    
    /**
     * Handle sending a new message
     */
    const handleSendMessage = () => {
        // Don't send empty messages (just HTML tags with no content)
        const textOnly = newMessageContent.replace(/<[^>]*>/g, '').trim();
        if (!textOnly || readOnly) return;
        
        // Sanitize content to prevent XSS attacks
        const sanitizedContent = DOMPurify.sanitize(newMessageContent);
        
        // User to use for the message
        const userToUse = demoMode ? demoUser : currentUser;
        if (!userToUse) return;
        
        // Create new message object
        const newMessage = {
            id: `temp-${Date.now()}`, // Temporary ID, will be replaced by server
            content: sanitizedContent,
            senderId: userToUse.id,
            senderName: userToUse.displayName || userToUse.username,
            senderAvatar: userToUse.avatarUrl || "/images/default-avatar.png",
            timestamp: new Date().toISOString(),
            status: "sending" // Initial status (will be updated by server)
        };
        
        if (demoMode && activeConversation) {
            // Add message to the demo conversation
            const updatedMessages = [...demoMessages[activeConversation.id], newMessage];
            setDemoMessages({
                ...demoMessages,
                [activeConversation.id]: updatedMessages
            });
            
            // Update last message in conversation list
            const updatedConversations = demoConversations.map(conv => {
                if (conv.id === activeConversation.id) {
                    return {
                        ...conv,
                        lastMessage: newMessageContent.replace(/<[^>]*>/g, '').trim().substring(0, 50) + (newMessageContent.length > 50 ? '...' : ''),
                        lastMessageTime: 'Just now',
                        unreadCount: 0
                    };
                }
                return conv;
            });
            setDemoConversations(updatedConversations);
            
            // Simulate status changes
            setTimeout(() => {
                const sentMessages = demoMessages[activeConversation.id].map(msg => 
                    msg.id === newMessage.id ? {...msg, status: "sent"} : msg
                );
                setDemoMessages({
                    ...demoMessages,
                    [activeConversation.id]: sentMessages
                });
                
                // Simulate delivered after another delay
                setTimeout(() => {
                    const deliveredMessages = sentMessages.map(msg => 
                        msg.id === newMessage.id ? {...msg, status: "delivered"} : msg
                    );
                    setDemoMessages({
                        ...demoMessages,
                        [activeConversation.id]: deliveredMessages
                    });
                    
                    // Simulate read after another delay
                    setTimeout(() => {
                        const readMessages = deliveredMessages.map(msg => 
                            msg.id === newMessage.id ? {...msg, status: "read"} : msg
                        );
                        setDemoMessages({
                            ...demoMessages,
                            [activeConversation.id]: readMessages
                        });
                    }, 2000);
                }, 1000);
            }, 500);
        } else {
            // Update local state optimistically for real mode
            setMessageList([...messageList, newMessage]);
            
            // Send to parent component/API
            onSendMessage(newMessage, conversation?.id);
        }
        
        // Clear the editor
        setNewMessageContent("");
        
        // Scroll to bottom
        scrollToBottom();
    };
    
    // Select a conversation in demo mode
    const handleSelectConversation = (conv) => {
        setActiveConversation(conv);
        setShowConversationList(false);
        
        // Mark conversation as read
        const updatedConversations = demoConversations.map(c => 
            c.id === conv.id ? {...c, unreadCount: 0} : c
        );
        setDemoConversations(updatedConversations);
    };
    
    // Go back to conversation list in demo mode
    const handleBackToList = () => {
        setActiveConversation(null);
        setShowConversationList(true);
    };
    
    // Group messages by sender for nicer UI
    const groupMessagesBySender = (messagesToGroup) => {
        const grouped = [];
        
        messagesToGroup.forEach((message, index) => {
            // Start a new group if this is the first message or the sender changed
            if (index === 0 || message.senderId !== messagesToGroup[index - 1].senderId) {
                grouped.push({
                    senderId: message.senderId,
                    senderName: message.senderName,
                    senderAvatar: message.senderAvatar,
                    messages: [message]
                });
            } else {
                // Add to the last group
                grouped[grouped.length - 1].messages.push(message);
            }
        });
        
        return grouped;
    };
    
    // Configuration for Quill editor
    const quillModules = {
        toolbar: allowMedia ? [
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            ['clean']
        ] : [
            ['bold', 'italic', 'underline'],
            ['link'],
            ['clean']
        ]
    };
    
    // Handle keyboard shortcuts
    const handleKeyDown = (e) => {
        // Send message on Shift+Enter
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    // Show loading state
    if (isLoading) {
        return <div className="p-4 animate-pulse">Loading messages...</div>;
    }
    
    // Show error state
    if (error) {
        return (
            <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Error loading messages: {error}</span>
            </div>
        );
    }
    
    // Demo Mode: Show conversation list
    if (demoMode && showConversationList) {
        return (
            <div 
                className={`direct-messages ${compact ? 'dm-compact' : 'dm-full'} flex flex-col h-full`} 
                data-theme={clientTheme}
            >
                {/* Conversation list header */}
                <div className="conversation-header sticky top-0 z-10 p-3 bg-base-200 border-b border-base-300 flex items-center">
                    <h3 className="font-bold text-lg flex-1">Messages</h3>
                    <span className="badge badge-sm">Demo Mode</span>
                </div>
                
                {/* Search box */}
                <div className="p-2 border-b border-base-300">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="input input-sm input-bordered w-full pr-8"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                
                {/* Conversation list */}
                <div className="flex-grow overflow-y-auto">
                    {demoConversations.map((conv) => (
                        <div 
                            key={conv.id}
                            className={`p-3 border-b border-base-200 hover:bg-base-200/60 cursor-pointer transition-colors ${conv.unreadCount > 0 ? 'bg-primary/10' : ''}`}
                            onClick={() => handleSelectConversation(conv)}
                        >
                            <div className="flex items-center">
                                {/* Avatar */}
                                <div className="avatar mr-3">
                                    {conv.isGroup ? (
                                        <div className="avatar-group -space-x-2">
                                            {conv.participants.slice(0, 2).map((participant) => (
                                                <div key={participant.id} className="avatar w-8 h-8">
                                                    <div className="rounded-full">
                                                        <Image
                                                            src={participant.avatarUrl || "/images/default-avatar.png"}
                                                            alt={participant.displayName || participant.username}
                                                            width={32}
                                                            height={32}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full relative">
                                            <Image
                                                src={conv.participants[0]?.avatarUrl || "/images/default-avatar.png"}
                                                alt={conv.participants[0]?.displayName || conv.participants[0]?.username}
                                                width={40}
                                                height={40}
                                                className="rounded-full object-cover"
                                            />
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${conv.participants[0]?.isOnline ? 'bg-success' : 'bg-base-300'}`}></div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Conversation details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-medium truncate">
                                            {conv.isGroup ? conv.name : (conv.participants[0]?.displayName || conv.participants[0]?.username)}
                                        </h4>
                                        <span className="text-xs text-base-content/70 whitespace-nowrap ml-2">{conv.lastMessageTime}</span>
                                    </div>
                                    <p className="text-sm text-base-content/70 truncate">{conv.lastMessage}</p>
                                </div>
                                
                                {/* Unread indicator */}
                                {conv.unreadCount > 0 && (
                                    <div className="ml-2">
                                        <div className="badge badge-sm badge-primary">{conv.unreadCount}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* User info footer */}
                <div className="border-t border-base-300 p-3">
                    <div className="flex items-center">
                        <div className="avatar mr-3">
                            <div className="w-8 h-8 rounded-full">
                                <Image
                                    src={demoUser.avatarUrl || "/images/default-avatar.png"}
                                    alt={demoUser.displayName || demoUser.username}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{demoUser.displayName}</p>
                            <p className="text-xs text-base-content/70">@{demoUser.username}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Demo Mode: Show active conversation
    if (demoMode && activeConversation) {
        const currentConversationMessages = demoMessages[activeConversation.id] || [];
        const groupedMessages = groupMessagesBySender(currentConversationMessages);
        
        return (
            <div 
                className={`direct-messages ${compact ? 'dm-compact' : 'dm-full'} flex flex-col h-full`} 
                data-theme={clientTheme}
            >
                {/* Conversation header */}
                <div className="conversation-header sticky top-0 z-10 p-3 bg-base-200 border-b border-base-300 flex items-center">
                    <button 
                        onClick={handleBackToList}
                        className="btn btn-ghost btn-sm btn-circle mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    {/* Group conversation */}
                    {activeConversation.isGroup ? (
                        <>
                            <div className="avatar-group -space-x-2 mr-2">
                                {activeConversation.participants.slice(0, 3).map((participant) => (
                                    <div key={participant.id} className="avatar">
                                        <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <Image
                                                src={participant.avatarUrl || "/images/default-avatar.png"}
                                                alt={participant.displayName || participant.username}
                                                width={32}
                                                height={32}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {activeConversation.participants.length > 3 && (
                                    <div className="avatar placeholder">
                                        <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <span>+{activeConversation.participants.length - 3}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold">{activeConversation.name}</h3>
                                <p className="text-xs text-base-content/70">
                                    {activeConversation.participants.length} participants
                                </p>
                            </div>
                        </>
                    ) : (
                        /* 1:1 conversation */
                        <>
                            <div className="avatar mr-3">
                                <div className="w-10 h-10 rounded-full relative">
                                    <Image
                                        src={activeConversation.participants[0]?.avatarUrl || "/images/default-avatar.png"}
                                        alt={activeConversation.participants[0]?.displayName || activeConversation.participants[0]?.username}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${activeConversation.participants[0]?.isOnline ? 'bg-success' : 'bg-base-300'}`}></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold">{activeConversation.participants[0]?.displayName || activeConversation.participants[0]?.username}</h3>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full ${activeConversation.isOnline ? 'bg-success' : 'bg-gray-400'} mr-2`}></div>
                                    <p className="text-xs text-base-content/70">
                                        {activeConversation.isOnline ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {/* Additional actions */}
                    <div className="ml-auto flex items-center">
                        <span className="badge badge-sm mr-2">Demo</span>
                        <button className="btn btn-ghost btn-sm btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Messages area */}
                <div 
                    className="flex-grow overflow-y-auto p-3 space-y-4" 
                    style={{ maxHeight: `${maxHeight}px` }}
                >
                    {groupedMessages.length === 0 && (
                        <div className="text-center py-8 text-base-content/70">
                            <div className="mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="font-semibold">No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    )}
                    
                    {groupedMessages.map((group, groupIndex) => {
                        const isCurrentUser = demoUser?.id === group.senderId;
                        
                        return (
                            <div 
                                key={`${group.senderId}-${groupIndex}`}
                                className={`message-group flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Avatar for the other user */}
                                {!isCurrentUser && !compact && (
                                    <div className="avatar self-end mb-2 mr-2">
                                        <div className="w-8 h-8 rounded-full">
                                            <Image
                                                src={group.senderAvatar || "/images/default-avatar.png"}
                                                alt={group.senderName}
                                                width={32}
                                                height={32}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {/* Message bubbles */}
                                <div className={`message-bubbles max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                    {/* Sender name - only show for others in group chats or non-compact mode */}
                                    {(!isCurrentUser && (!compact || activeConversation?.isGroup)) && (
                                        <div className="px-1 mb-1 text-sm font-semibold">
                                            {group.senderName}
                                        </div>
                                    )}
                                    
                                    {/* Message bubbles */}
                                    <div className="space-y-1">
                                        {group.messages.map((message, msgIndex) => (
                                            <div 
                                                key={message.id} 
                                                className={`message flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                                            >
                                                <div 
                                                    className={`py-2 px-3 rounded-lg shadow-sm max-w-full
                                                        ${isCurrentUser 
                                                            ? 'bg-primary text-primary-content' 
                                                            : 'bg-base-200 text-base-content'
                                                        }
                                                        ${msgIndex === 0 
                                                            ? isCurrentUser ? 'rounded-tr-xl' : 'rounded-tl-xl' 
                                                            : ''
                                                        }
                                                        ${msgIndex === group.messages.length - 1 
                                                            ? isCurrentUser ? 'rounded-br-xl' : 'rounded-bl-xl' 
                                                            : ''
                                                        }
                                                    `}
                                                >
                                                    <div 
                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }}
                                                        className="prose prose-sm max-w-none break-words"
                                                    />
                                                </div>
                                                
                                                {/* Time and status - only show for the last message in a group */}
                                                {msgIndex === group.messages.length - 1 && (
                                                    <div className={`text-xs mt-1 flex items-center gap-1 text-base-content/60
                                                        ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <time dateTime={message.timestamp}>
                                                            {formatTimestamp(message.timestamp)}
                                                        </time>
                                                        
                                                        {/* Message status indicators - only for current user */}
                                                        {isCurrentUser && (
                                                            <span className="ml-1">
                                                                {message.status === 'sending' && (
                                                                    <IoTimeOutline className="h-3 w-3" />
                                                                )}
                                                                {message.status === 'sent' && (
                                                                    <IoCheckmarkSharp className="h-3 w-3" />
                                                                )}
                                                                {message.status === 'delivered' && (
                                                                    <IoCheckmarkSharp className="h-3 w-3" />
                                                                )}
                                                                {message.status === 'read' && (
                                                                    <IoCheckmarkDoneSharp className="h-3 w-3 text-info" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Avatar for current user - only in full mode */}
                                {isCurrentUser && !compact && (
                                    <div className="avatar self-end mb-2 ml-2">
                                        <div className="w-8 h-8 rounded-full">
                                            <Image
                                                src={demoUser?.avatarUrl || "/images/default-avatar.png"}
                                                alt={demoUser?.displayName || "You"}
                                                width={32}
                                                height={32}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    
                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Message composer */}
                <div className="message-composer bg-base-200 p-3 border-t border-base-300">
                    <div className="flex flex-col">
                        <QuillEditor
                            modules={quillModules}
                            value={newMessageContent}
                            onChange={setNewMessageContent}
                            placeholder="Write your message..."
                            className="bg-base-100 rounded min-h-[60px] max-h-[150px] overflow-y-auto"
                            onKeyDown={handleKeyDown}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-base-content/70">
                                Press Shift+Enter to send
                            </div>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={handleSendMessage}
                                disabled={!newMessageContent.replace(/<[^>]*>/g, '').trim()}
                            >
                                <IoSend className="h-5 w-5" />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Regular mode - use the provided messages
    const groupedMessages = groupMessagesBySender(messageList);
    
    return (
        <div 
            className={`direct-messages ${compact ? 'dm-compact' : 'dm-full'} flex flex-col`} 
            data-theme={clientTheme}
        >
            {/* Conversation header - only show in full mode */}
            {!compact && conversation && (
                <div className="conversation-header sticky top-0 z-10 p-3 bg-base-200 border-b border-base-300 flex items-center">
                    {/* Group conversation */}
                    {conversation.isGroup ? (
                        <>
                            <div className="avatar-group -space-x-2">
                                {conversation.participants.slice(0, 3).map((participant) => (
                                    <div key={participant.id} className="avatar">
                                        <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <Image
                                                src={participant.avatarUrl || "/images/default-avatar.png"}
                                                alt={participant.displayName || participant.username}
                                                width={32}
                                                height={32}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {conversation.participants.length > 3 && (
                                    <div className="avatar placeholder">
                                        <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <span>+{conversation.participants.length - 3}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="ml-3">
                                <h3 className="font-bold">{conversation.name}</h3>
                                <p className="text-xs text-base-content/70">
                                    {conversation.participants.length} participants
                                </p>
                            </div>
                        </>
                    ) : (
                        /* 1:1 conversation - show the other participant */
                        <>
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    {conversation.participants[0]?.avatarUrl && (
                                        <Image
                                            src={conversation.participants[0].avatarUrl}
                                            alt={conversation.participants[0].displayName || conversation.participants[0].username}
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="ml-3">
                                <h3 className="font-bold">{conversation.participants[0]?.displayName || conversation.participants[0]?.username}</h3>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full ${conversation.isOnline ? 'bg-success' : 'bg-gray-400'} mr-2`}></div>
                                    <p className="text-xs text-base-content/70">
                                        {conversation.isOnline ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            
            {/* Messages area */}
            <div 
                className="flex-grow overflow-y-auto p-3 space-y-4" 
                style={{ maxHeight: `${maxHeight}px` }}
            >
                {groupedMessages.length === 0 && (
                    <div className="text-center py-8 text-base-content/70">
                        <div className="mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="font-semibold">No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                    </div>
                )}
                
                {groupedMessages.map((group, groupIndex) => {
                    const isCurrentUser = currentUser?.id === group.senderId;
                    
                    return (
                        <div 
                            key={`${group.senderId}-${groupIndex}`}
                            className={`message-group flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Avatar for the other user */}
                            {!isCurrentUser && !compact && (
                                <div className="avatar self-end mb-2 mr-2">
                                    <div className="w-8 h-8 rounded-full">
                                        <Image
                                            src={group.senderAvatar || "/images/default-avatar.png"}
                                            alt={group.senderName}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {/* Message bubbles */}
                            <div className={`message-bubbles max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                {/* Sender name - only show for others in group chats or non-compact mode */}
                                {(!isCurrentUser && (!compact || conversation?.isGroup)) && (
                                    <div className="px-1 mb-1 text-sm font-semibold">
                                        {group.senderName}
                                    </div>
                                )}
                                
                                {/* Message bubbles */}
                                <div className="space-y-1">
                                    {group.messages.map((message, msgIndex) => (
                                        <div 
                                            key={message.id} 
                                            className={`message flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                                        >
                                            <div 
                                                className={`py-2 px-3 rounded-lg shadow-sm max-w-full
                                                    ${isCurrentUser 
                                                        ? 'bg-primary text-primary-content' 
                                                        : 'bg-base-200 text-base-content'
                                                    }
                                                    ${msgIndex === 0 
                                                        ? isCurrentUser ? 'rounded-tr-xl' : 'rounded-tl-xl' 
                                                        : ''
                                                    }
                                                    ${msgIndex === group.messages.length - 1 
                                                        ? isCurrentUser ? 'rounded-br-xl' : 'rounded-bl-xl' 
                                                        : ''
                                                    }
                                                `}
                                            >
                                                <div 
                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }}
                                                    className="prose prose-sm max-w-none break-words"
                                                />
                                            </div>
                                            
                                            {/* Time and status - only show for the last message in a group */}
                                            {msgIndex === group.messages.length - 1 && (
                                                <div className={`text-xs mt-1 flex items-center gap-1 text-base-content/60
                                                    ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <time dateTime={message.timestamp}>
                                                        {formatTimestamp(message.timestamp)}
                                                    </time>
                                                    
                                                    {/* Message status indicators - only for current user */}
                                                    {isCurrentUser && (
                                                        <span className="ml-1">
                                                            {message.status === 'sending' && (
                                                                <IoTimeOutline className="h-3 w-3" />
                                                            )}
                                                            {message.status === 'sent' && (
                                                                <IoCheckmarkSharp className="h-3 w-3" />
                                                            )}
                                                            {message.status === 'read' && (
                                                                <IoCheckmarkDoneSharp className="h-3 w-3 text-info" />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Avatar for current user - only in full mode */}
                            {isCurrentUser && !compact && (
                                <div className="avatar self-end mb-2 ml-2">
                                    <div className="w-8 h-8 rounded-full">
                                        <Image
                                            src={currentUser?.avatarUrl || "/images/default-avatar.png"}
                                            alt={currentUser?.displayName || "You"}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Message composer - only if not read-only and user is logged in */}
            {!readOnly && (currentUser || demoMode) && (
                <div className="message-composer bg-base-200 p-3 border-t border-base-300">
                    <div className="flex flex-col">
                        <QuillEditor
                            modules={quillModules}
                            value={newMessageContent}
                            onChange={setNewMessageContent}
                            placeholder="Write your message..."
                            className="bg-base-100 rounded min-h-[60px] max-h-[150px] overflow-y-auto"
                            onKeyDown={handleKeyDown}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-base-content/70">
                                Press Shift+Enter to send
                            </div>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={handleSendMessage}
                                disabled={!newMessageContent.replace(/<[^>]*>/g, '').trim()}
                            >
                                <IoSend className="h-5 w-5" />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectMessages;
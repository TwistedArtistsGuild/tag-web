/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SocialRealtimeContext = createContext();

/**
 * Mock WebSocket service for simulating real-time updates
 * In production, this would connect to actual WebSocket endpoints
 */
class MockRealtimeService {
    constructor() {
        this.listeners = new Map();
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect() {
        // Simulate connection delay
        setTimeout(() => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log('🔗 Mock realtime service connected');
            
            // Start simulating random updates
            this.startMockUpdates();
        }, 1000);
    }

    disconnect() {
        this.isConnected = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        console.log('🔌 Mock realtime service disconnected');
    }

    subscribe(channel, callback) {
        if (!this.listeners.has(channel)) {
            this.listeners.set(channel, new Set());
        }
        this.listeners.get(channel).add(callback);
        
        return () => {
            const channelListeners = this.listeners.get(channel);
            if (channelListeners) {
                channelListeners.delete(callback);
                if (channelListeners.size === 0) {
                    this.listeners.delete(channel);
                }
            }
        };
    }

    emit(channel, data) {
        const channelListeners = this.listeners.get(channel);
        if (channelListeners) {
            channelListeners.forEach(callback => callback(data));
        }
    }

    // Simulate random real-time updates for demo purposes
    startMockUpdates() {
        this.updateInterval = setInterval(() => {
            if (!this.isConnected) return;

            const updateTypes = [
                'new_comment',
                'new_message',
                'new_reaction',
                'user_typing',
                'user_online',
                'user_offline'
            ];

            const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
            const timestamp = new Date().toISOString();

            switch (randomType) {
                case 'new_comment':
                    this.emit('comments', {
                        type: 'comment_added',
                        data: {
                            id: `mock-${Date.now()}`,
                            body: this.getRandomComment(),
                            authorId: `user-${Math.floor(Math.random() * 5) + 1}`,
                            author: this.getRandomUsername(),
                            authorDisplayName: this.getRandomDisplayName(),
                            avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
                            likes: Math.floor(Math.random() * 10),
                            created: timestamp,
                            contextId: 'demo-context',
                            replies: []
                        }
                    });
                    break;

                case 'new_message':
                    this.emit('messages', {
                        type: 'message_received',
                        data: {
                            id: `msg-${Date.now()}`,
                            content: this.getRandomMessage(),
                            senderId: `user-${Math.floor(Math.random() * 5) + 1}`,
                            sender: this.getRandomUsername(),
                            senderDisplayName: this.getRandomDisplayName(),
                            avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
                            timestamp: timestamp,
                            conversationId: 'conv-1',
                            isRead: false,
                            messageType: 'text'
                        }
                    });
                    break;

                case 'new_reaction':
                    this.emit('reactions', {
                        type: 'reaction_added',
                        data: {
                            targetId: `content-${Math.floor(Math.random() * 3) + 1}`,
                            targetType: 'post', // 'post', 'comment', 'message'
                            reaction: this.getRandomReaction(),
                            userId: `user-${Math.floor(Math.random() * 5) + 1}`,
                            username: this.getRandomUsername(),
                            timestamp: timestamp
                        }
                    });
                    break;

                case 'user_typing':
                    this.emit('typing', {
                        type: 'user_typing',
                        data: {
                            userId: `user-${Math.floor(Math.random() * 5) + 1}`,
                            username: this.getRandomUsername(),
                            conversationId: 'conv-1',
                            isTyping: true
                        }
                    });
                    
                    // Stop typing after a few seconds
                    setTimeout(() => {
                        this.emit('typing', {
                            type: 'user_typing',
                            data: {
                                userId: `user-${Math.floor(Math.random() * 5) + 1}`,
                                username: this.getRandomUsername(),
                                conversationId: 'conv-1',
                                isTyping: false
                            }
                        });
                    }, 3000);
                    break;

                case 'user_online':
                case 'user_offline':
                    this.emit('presence', {
                        type: 'presence_update',
                        data: {
                            userId: `user-${Math.floor(Math.random() * 5) + 1}`,
                            isOnline: randomType === 'user_online',
                            lastSeen: timestamp
                        }
                    });
                    break;
            }
        }, Math.random() * 10000 + 5000); // Random interval between 5-15 seconds
    }

    getRandomComment() {
        const comments = [
            "This is absolutely stunning! The detail work is incredible.",
            "Love the color palette you chose here 🎨",
            "Your technique has really evolved - this shows great progress!",
            "The lighting in this piece is phenomenal",
            "This speaks to me on so many levels",
            "Beautiful composition! How long did this take?",
            "The texture work here is amazing",
            "This would look perfect in my gallery space"
        ];
        return comments[Math.floor(Math.random() * comments.length)];
    }

    getRandomMessage() {
        const messages = [
            "Hey! Just saw your latest piece - it's incredible!",
            "Are you available for a commission?",
            "The exhibition opening was fantastic",
            "Let's collaborate on something",
            "Your art style is so unique",
            "Thanks for the inspiration!",
            "When's your next show?",
            "Love following your creative process"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    getRandomUsername() {
        const usernames = ['ArtLover23', 'CreativeCanvas', 'VisionaryArt', 'ColorMaster', 'SketchyVibes'];
        return usernames[Math.floor(Math.random() * usernames.length)];
    }

    getRandomDisplayName() {
        const names = ['Emma Chen', 'Marcus Rodriguez', 'Sophia Kim', 'Alex Thompson', 'Maya Patel'];
        return names[Math.floor(Math.random() * names.length)];
    }

    getRandomReaction() {
        const reactions = ['❤️', '👏', '🔥', '😍', '🎨', '✨', '👀', '💯'];
        return reactions[Math.floor(Math.random() * reactions.length)];
    }
}

/**
 * SocialRealtimeProvider - Provides real-time functionality for social components
 */
export const SocialRealtimeProvider = ({ children }) => {
    const [realtimeService] = useState(() => new MockRealtimeService());
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    useEffect(() => {
        // Connect to realtime service
        setConnectionStatus('connecting');
        realtimeService.connect();
        
        // Simulate connection status updates
        const statusTimer = setTimeout(() => {
            setIsConnected(true);
            setConnectionStatus('connected');
        }, 1000);

        return () => {
            clearTimeout(statusTimer);
            realtimeService.disconnect();
            setIsConnected(false);
            setConnectionStatus('disconnected');
        };
    }, [realtimeService]);

    const subscribe = useCallback((channel, callback) => {
        return realtimeService.subscribe(channel, callback);
    }, [realtimeService]);

    const emit = useCallback((channel, data) => {
        realtimeService.emit(channel, data);
    }, [realtimeService]);

    const value = {
        isConnected,
        connectionStatus,
        subscribe,
        emit,
        realtimeService
    };

    return (
        <SocialRealtimeContext.Provider value={value}>
            {children}
        </SocialRealtimeContext.Provider>
    );
};

/**
 * Hook to use the social realtime context
 */
export const useSocialRealtime = () => {
    const context = useContext(SocialRealtimeContext);
    if (!context) {
        throw new Error('useSocialRealtime must be used within a SocialRealtimeProvider');
    }
    return context;
};

/**
 * Hook for subscribing to real-time updates for comments
 */
export const useRealtimeComments = (contextId, onUpdate) => {
    const { subscribe } = useSocialRealtime();

    useEffect(() => {
        const unsubscribe = subscribe('comments', (update) => {
            if (update.data.contextId === contextId || !contextId) {
                onUpdate(update);
            }
        });

        return unsubscribe;
    }, [subscribe, contextId, onUpdate]);
};

/**
 * Hook for subscribing to real-time updates for messages
 */
export const useRealtimeMessages = (conversationId, onUpdate) => {
    const { subscribe } = useSocialRealtime();

    useEffect(() => {
        const unsubscribe = subscribe('messages', (update) => {
            if (update.data.conversationId === conversationId || !conversationId) {
                onUpdate(update);
            }
        });

        return unsubscribe;
    }, [subscribe, conversationId, onUpdate]);
};

/**
 * Hook for subscribing to real-time reactions
 */
export const useRealtimeReactions = (onUpdate) => {
    const { subscribe } = useSocialRealtime();

    useEffect(() => {
        const unsubscribe = subscribe('reactions', onUpdate);
        return unsubscribe;
    }, [subscribe, onUpdate]);
};

/**
 * Hook for typing indicators
 */
export const useTypingIndicator = (conversationId, onTypingUpdate) => {
    const { subscribe } = useSocialRealtime();

    useEffect(() => {
        const unsubscribe = subscribe('typing', (update) => {
            if (update.data.conversationId === conversationId) {
                onTypingUpdate(update.data);
            }
        });

        return unsubscribe;
    }, [subscribe, conversationId, onTypingUpdate]);
};

/**
 * Hook for user presence updates
 */
export const useUserPresence = (onPresenceUpdate) => {
    const { subscribe } = useSocialRealtime();

    useEffect(() => {
        const unsubscribe = subscribe('presence', onPresenceUpdate);
        return unsubscribe;
    }, [subscribe, onPresenceUpdate]);
};

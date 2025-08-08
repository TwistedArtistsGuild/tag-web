/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useRealtimeReactions, useSocialRealtime } from './SocialRealtimeContext';

/**
 * SocialReactions - Real-time reaction system for posts, comments, and messages
 * 
 * @param {Object} props
 * @param {string} props.targetId - ID of the target content (post, comment, message)
 * @param {string} props.targetType - Type of target ('post', 'comment', 'message')
 * @param {Array} props.initialReactions - Initial reactions data
 * @param {Function} props.onReactionAdd - Callback when reaction is added
 * @param {Function} props.onReactionRemove - Callback when reaction is removed
 * @param {Object} props.currentUser - Current user information
 * @param {boolean} props.readOnly - Whether reactions are read-only
 * @param {boolean} props.showDetails - Whether to show detailed reaction info
 * @param {boolean} props.showQuickReactions - Whether to show first 4 reactions as quick buttons
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 */
const SocialReactions = ({
    targetId,
    targetType = 'post',
    initialReactions = [],
    onReactionAdd = () => {},
    onReactionRemove = () => {},
    currentUser = null,
    readOnly = false,
    showDetails = true,
    showQuickReactions = false,
    size = 'md'
}) => {
    const [reactions, setReactions] = useState(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [animatingReactions, setAnimatingReactions] = useState(new Set());
    const { emit, isConnected } = useSocialRealtime();
    const pickerRef = useRef(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowReactionPicker(false);
            }
        };

        if (showReactionPicker) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showReactionPicker]);

    // Available reaction options
    const availableReactions = [
        { emoji: '❤️', name: 'love', label: 'Love' },
        { emoji: '👏', name: 'applause', label: 'Applause' },
        { emoji: '🔥', name: 'fire', label: 'Fire' },
        { emoji: '🙏', name: 'gratitude', label: 'Gratitude' },
        { emoji: '🎨', name: 'art', label: 'Art' },
        { emoji: '✨', name: 'sparkles', label: 'Sparkles' },
        { emoji: '👀', name: 'eyes', label: 'Eyes' },
        { emoji: '💯', name: 'hundred', label: 'Hundred' },
        { emoji: '🤩', name: 'star_struck', label: 'Star Struck' },
        { emoji: '🙌', name: 'praise', label: 'Praise' }
    ];

    // Quick reactions (first 4) and remaining reactions
    const quickReactions = availableReactions.slice(0, 4);
    const remainingReactions = availableReactions.slice(4);

    // Initialize reactions from props
    useEffect(() => {
        const reactionMap = new Map();
        
        // Process initial reactions
        initialReactions.forEach(reaction => {
            if (!reactionMap.has(reaction.emoji)) {
                reactionMap.set(reaction.emoji, {
                    emoji: reaction.emoji,
                    count: 0,
                    users: [],
                    hasReacted: false
                });
            }
            
            const current = reactionMap.get(reaction.emoji);
            current.count++;
            current.users.push({
                id: reaction.userId,
                username: reaction.username,
                timestamp: reaction.timestamp
            });
            
            if (currentUser && reaction.userId === currentUser.id) {
                current.hasReacted = true;
            }
        });
        
        setReactions(reactionMap);
    }, [initialReactions, currentUser]);

    // Handle real-time reaction updates
    const handleRealtimeUpdate = useCallback((update) => {
        if (update.data.targetId !== targetId || update.data.targetType !== targetType) {
            return;
        }

        const { reaction, userId, username, timestamp } = update.data;
        
        setReactions(prev => {
            const newReactions = new Map(prev);
            
            if (!newReactions.has(reaction)) {
                newReactions.set(reaction, {
                    emoji: reaction,
                    count: 0,
                    users: [],
                    hasReacted: false
                });
            }
            
            const current = newReactions.get(reaction);
            
            if (update.type === 'reaction_added') {
                // Check if user already reacted with this emoji
                const existingUser = current.users.find(user => user.id === userId);
                if (!existingUser) {
                    current.count++;
                    current.users.push({ id: userId, username, timestamp });
                    
                    if (currentUser && userId === currentUser.id) {
                        current.hasReacted = true;
                    }
                    
                    // Trigger animation
                    setAnimatingReactions(prev => new Set([...prev, reaction]));
                    setTimeout(() => {
                        setAnimatingReactions(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(reaction);
                            return newSet;
                        });
                    }, 600);
                }
            } else if (update.type === 'reaction_removed') {
                const userIndex = current.users.findIndex(user => user.id === userId);
                if (userIndex > -1) {
                    current.count--;
                    current.users.splice(userIndex, 1);
                    
                    if (currentUser && userId === currentUser.id) {
                        current.hasReacted = false;
                    }
                    
                    // Remove reaction if count reaches 0
                    if (current.count === 0) {
                        newReactions.delete(reaction);
                    }
                }
            }
            
            return newReactions;
        });
    }, [targetId, targetType, currentUser]);

    useRealtimeReactions(handleRealtimeUpdate);

    // Add reaction
    const addReaction = useCallback(async (emoji) => {
        if (!currentUser || readOnly || isLoading) return;
        
        setIsLoading(true);
        
        try {
            // Optimistically update UI
            setReactions(prev => {
                const newReactions = new Map(prev);
                
                if (!newReactions.has(emoji)) {
                    newReactions.set(emoji, {
                        emoji,
                        count: 0,
                        users: [],
                        hasReacted: false
                    });
                }
                
                const current = newReactions.get(emoji);
                
                if (!current.hasReacted) {
                    current.count++;
                    current.users.push({
                        id: currentUser.id,
                        username: currentUser.username,
                        timestamp: new Date().toISOString()
                    });
                    current.hasReacted = true;
                    
                    // Trigger animation
                    setAnimatingReactions(prev => new Set([...prev, emoji]));
                    setTimeout(() => {
                        setAnimatingReactions(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(emoji);
                            return newSet;
                        });
                    }, 600);
                }
                
                return newReactions;
            });
            
            // Emit real-time update
            if (isConnected) {
                emit('reactions', {
                    type: 'reaction_added',
                    data: {
                        targetId,
                        targetType,
                        reaction: emoji,
                        userId: currentUser.id,
                        username: currentUser.username,
                        timestamp: new Date().toISOString()
                    }
                });
            }
            
            // Call parent callback
            await onReactionAdd({
                targetId,
                targetType,
                reaction: emoji,
                userId: currentUser.id
            });
            
        } catch (error) {
            console.error('Failed to add reaction:', error);
            // Revert optimistic update on error
            setReactions(prev => {
                const newReactions = new Map(prev);
                const current = newReactions.get(emoji);
                if (current && current.hasReacted) {
                    current.count--;
                    current.users = current.users.filter(user => user.id !== currentUser.id);
                    current.hasReacted = false;
                    
                    if (current.count === 0) {
                        newReactions.delete(emoji);
                    }
                }
                return newReactions;
            });
        } finally {
            setIsLoading(false);
            setShowReactionPicker(false);
        }
    }, [currentUser, readOnly, isLoading, targetId, targetType, onReactionAdd, emit, isConnected]);

    // Remove reaction
    const removeReaction = useCallback(async (emoji) => {
        if (!currentUser || readOnly || isLoading) return;
        
        setIsLoading(true);
        
        try {
            // Optimistically update UI
            setReactions(prev => {
                const newReactions = new Map(prev);
                const current = newReactions.get(emoji);
                
                if (current && current.hasReacted) {
                    current.count--;
                    current.users = current.users.filter(user => user.id !== currentUser.id);
                    current.hasReacted = false;
                    
                    if (current.count === 0) {
                        newReactions.delete(emoji);
                    }
                }
                
                return newReactions;
            });
            
            // Emit real-time update
            if (isConnected) {
                emit('reactions', {
                    type: 'reaction_removed',
                    data: {
                        targetId,
                        targetType,
                        reaction: emoji,
                        userId: currentUser.id,
                        username: currentUser.username,
                        timestamp: new Date().toISOString()
                    }
                });
            }
            
            // Call parent callback
            await onReactionRemove({
                targetId,
                targetType,
                reaction: emoji,
                userId: currentUser.id
            });
            
        } catch (error) {
            console.error('Failed to remove reaction:', error);
            // Revert optimistic update on error
            setReactions(prev => {
                const newReactions = new Map(prev);
                if (!newReactions.has(emoji)) {
                    newReactions.set(emoji, {
                        emoji,
                        count: 0,
                        users: [],
                        hasReacted: false
                    });
                }
                
                const current = newReactions.get(emoji);
                current.count++;
                current.users.push({
                    id: currentUser.id,
                    username: currentUser.username,
                    timestamp: new Date().toISOString()
                });
                current.hasReacted = true;
                
                return newReactions;
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentUser, readOnly, isLoading, targetId, targetType, onReactionRemove, emit, isConnected]);

    // Toggle reaction (add if not reacted, remove if already reacted)
    const toggleReaction = useCallback((emoji) => {
        const current = reactions.get(emoji);
        if (current && current.hasReacted) {
            removeReaction(emoji);
        } else {
            addReaction(emoji);
        }
    }, [reactions, addReaction, removeReaction]);

    // Get size classes
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return {
                    container: 'gap-1.5',
                    reaction: 'text-sm px-2 py-1 min-w-[2rem]',
                    picker: 'text-lg w-10 h-10',
                    addButton: 'text-sm px-2 py-1',
                    quickReaction: 'text-sm px-1.5 py-1 min-w-[1.75rem]'
                };
            case 'lg':
                return {
                    container: 'gap-3',
                    reaction: 'text-lg px-4 py-2 min-w-[3rem]',
                    picker: 'text-2xl w-14 h-14',
                    addButton: 'text-lg px-4 py-2',
                    quickReaction: 'text-lg px-3 py-2 min-w-[2.5rem]'
                };
            default: // md
                return {
                    container: 'gap-2',
                    reaction: 'text-base px-3 py-1.5 min-w-[2.5rem]',
                    picker: 'text-xl w-12 h-12',
                    addButton: 'text-base px-3 py-1.5',
                    quickReaction: 'text-base px-2 py-1.5 min-w-[2rem]'
                };
        }
    };

    const sizeClasses = getSizeClasses();
    const reactionArray = Array.from(reactions.values());

    if (reactionArray.length === 0 && readOnly) {
        return null;
    }

    return (
        <div className={`flex items-center flex-wrap ${sizeClasses.container}`}>
            {/* Existing Reactions */}
            {reactionArray.map((reaction) => (
                <button
                    key={reaction.emoji}
                    onClick={() => !readOnly && toggleReaction(reaction.emoji)}
                    disabled={readOnly || isLoading}
                    className={`
                        inline-flex items-center justify-center gap-1.5 rounded-full border-2 transition-all duration-200
                        ${sizeClasses.reaction}
                        ${reaction.hasReacted 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-base-100 border-base-300 text-base-content hover:border-primary/50'
                        }
                        ${!readOnly ? 'hover:scale-105 active:scale-95' : ''}
                        ${animatingReactions.has(reaction.emoji) ? 'animate-bounce' : ''}
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    title={showDetails ? reaction.users.map(u => u.username).join(', ') : undefined}
                >
                    <span className={`leading-none ${animatingReactions.has(reaction.emoji) ? 'animate-pulse' : ''}`}>
                        {reaction.emoji}
                    </span>
                    {showDetails && (
                        <span className="font-medium leading-none">
                            {reaction.count}
                        </span>
                    )}
                </button>
            ))}

            {/* Quick Reactions (if enabled and user hasn't used them) */}
            {showQuickReactions && !readOnly && currentUser && (
                <>
                    {quickReactions.map((reactionOption) => {
                        const existing = reactions.get(reactionOption.emoji);
                        
                        // Only show quick reaction if it's not already in the reactions list
                        if (existing && existing.count > 0) return null;
                        
                        return (
                            <button
                                key={`quick-${reactionOption.name}`}
                                onClick={() => addReaction(reactionOption.emoji)}
                                disabled={isLoading}
                                className={`
                                    inline-flex items-center justify-center rounded-full border border-dashed 
                                    border-base-300 bg-base-100/50 text-base-content/50 transition-all duration-200
                                    hover:border-primary/50 hover:text-primary hover:bg-primary/5 hover:scale-110 active:scale-95
                                    ${sizeClasses.quickReaction}
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                title={`Add ${reactionOption.label} reaction`}
                            >
                                <span className="leading-none">
                                    {reactionOption.emoji}
                                </span>
                            </button>
                        );
                    })}
                </>
            )}

            {/* Add Reaction Button */}
            {!readOnly && currentUser && (
                <div className="relative" ref={pickerRef}>
                    <button
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        disabled={isLoading}
                        className={`
                            inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-dashed 
                            border-base-300 bg-base-100 text-base-content/60 transition-all duration-200
                            hover:border-primary/50 hover:text-primary hover:scale-105 active:scale-95
                            ${sizeClasses.addButton}
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        title="More reactions"
                    >
                        <span className="text-lg leading-none">+</span>
                        {showDetails && <span className="text-sm leading-none">More</span>}
                    </button>

                    {/* Reaction Picker Dropdown */}
                    {showReactionPicker && (
                        <div className="absolute bottom-full left-0 mb-2 p-4 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200 min-w-[280px]">
                            <div className="grid grid-cols-5 gap-4">
                                {availableReactions.map((reactionOption) => (
                                    <button
                                        key={reactionOption.name}
                                        onClick={() => addReaction(reactionOption.emoji)}
                                        className={`
                                            flex items-center justify-center rounded-lg transition-all duration-200 
                                            hover:bg-base-200 hover:scale-110 active:scale-95 ${sizeClasses.picker}
                                        `}
                                        title={reactionOption.label}
                                    >
                                        {reactionOption.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Connection Status Indicator (for development) */}
            {process.env.NODE_ENV === 'development' && (
                <div className={`text-xs px-2 py-1 rounded-full ${
                    isConnected ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                    {isConnected ? '🔗' : '⚠️'}
                </div>
            )}
        </div>
    );
};

// Memoize component to prevent unnecessary re-renders
export default memo(SocialReactions);

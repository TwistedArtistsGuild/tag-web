/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useCallback, memo, useRef } from 'react';

function buildReactionMap(initialReactions = [], currentUser) {
    const reactionMap = new Map();

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

    return reactionMap;
}

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
 * @param {Array} props.availableReactions - Available reaction options (optional, falls back to default)
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
    size = 'md',
    availableReactions: customAvailableReactions = null
}) => {
    const [reactions, setReactions] = useState(() => buildReactionMap(initialReactions, currentUser));
    const [isLoading, setIsLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const collapseTimer = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(collapseTimer.current);
        setExpanded(true);
    };

    const handleMouseLeave = () => {
        collapseTimer.current = setTimeout(() => setExpanded(false), 300);
    };

    // Default available reaction options (can be overridden via props)
    const defaultAvailableReactions = [
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

    const availableReactions = customAvailableReactions || defaultAvailableReactions;

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
                }
                
                return newReactions;
            });
            
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
        }
    }, [currentUser, readOnly, isLoading, targetId, targetType, onReactionAdd]);

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
    }, [currentUser, readOnly, isLoading, targetId, targetType, onReactionRemove]);

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
    const totalCount = reactionArray.reduce((sum, r) => sum + r.count, 0);
    const hasAnyReaction = reactionArray.some(r => r.hasReacted);

    // Show component even with 0 count, but only hide if explicitly set to not show
    // Allow users to see available reactions even if no one has reacted yet

    return (
        <div
            className="flex items-center gap-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Collapsed: show active emojis + total count */}
            {!expanded && (
                <button
                    className={`
                        inline-flex items-center gap-1 rounded-full border-2 px-3 py-1.5 text-sm
                        transition-colors duration-150 select-none
                        ${hasAnyReaction
                            ? 'bg-primary/10 border-primary text-primary cursor-pointer hover:bg-primary/20'
                            : 'bg-base-100 border-base-300 text-base-content/60 cursor-pointer hover:border-primary/30'
                        }
                    `}
                    onClick={() => setExpanded(true)}
                    aria-label={`${totalCount} reaction${totalCount !== 1 ? 's' : ''}`}
                >
                    <span className="flex items-center gap-0.5 leading-none">
                        {reactionArray.length > 0
                            ? reactionArray.map(r => (
                                <span key={r.emoji} className="text-base">{r.emoji}</span>
                            ))
                            : availableReactions.slice(0, 3).map(r => (
                                <span key={r.name} className="text-base opacity-40">{r.emoji}</span>
                            ))
                        }
                    </span>
                    <span className="font-medium leading-none ml-1">{totalCount}</span>
                </button>
            )}

            {/* Expanded: all reaction buttons inline + close */}
            {expanded && (
                <>
                    {availableReactions.map((reactionOption) => {
                        const current = reactions.get(reactionOption.emoji);
                        const hasReacted = current?.hasReacted || false;
                        const count = current?.count || 0;

                        return (
                            <div key={reactionOption.name} className="relative group/reaction">
                                {/* Label tooltip above the button */}
                                <span className="
                                    pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5
                                    whitespace-nowrap rounded bg-neutral text-neutral-content text-xs px-2 py-0.5
                                    opacity-0 group-hover/reaction:opacity-100 transition-opacity duration-150 z-50
                                ">
                                    {reactionOption.label} {count > 0 && `(${count})`}
                                </span>
                                <button
                                    onClick={() => !readOnly && toggleReaction(reactionOption.emoji)}
                                    disabled={readOnly || isLoading}
                                    className={`
                                        inline-flex items-center justify-center gap-1 rounded-full border-2
                                        ${sizeClasses.reaction} transition-colors duration-150
                                        ${hasReacted
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-base-100 border-base-300 text-base-content hover:border-primary/50 hover:bg-base-200'
                                        }
                                        ${(readOnly || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    <span className="leading-none">{reactionOption.emoji}</span>
                                    {count > 0 && <span className="text-xs font-medium">{count}</span>}
                                </button>
                            </div>
                        );
                    })}

                    {/* Collapse button */}
                    <button
                        onClick={() => setExpanded(false)}
                        className="inline-flex items-center justify-center rounded-full border-2 border-base-300 bg-base-100 text-base-content/50 hover:bg-base-200 hover:text-base-content px-2 py-1.5 text-sm transition-colors duration-150"
                        title="Collapse"
                    >
                        <span className="font-medium leading-none">‹</span>
                    </button>
                </>
            )}
        </div>
    );
};

// Memoize component to prevent unnecessary re-renders
export default memo(SocialReactions);

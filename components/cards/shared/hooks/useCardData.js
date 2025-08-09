/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useMemo } from 'react';

/**
 * useCardData - Hook to format and standardize card data from API
 * Ensures consistent data structure across all card variants
 */
export const useCardData = (data, type = 'artist') => {
    return useMemo(() => {
        if (!data) return null;

        if (type === 'artist') {
            // Standard demo numbers for consistent display
            const demoNumbers = [42, 127, 89, 234, 156, 73, 298, 67, 445, 312, 188, 91, 567, 123, 789, 34, 456, 678, 901, 245];
            
            // Gallery photos for medium and large cards (demo data)
            const demoGalleryPhotos = [
                { url: "/blank_image.png", alttext: "Art piece 1" },
                { url: "/blank_image.png", alttext: "Art piece 2" },
                { url: "/blank_image.png", alttext: "Art piece 3" },
                { url: "/blank_image.png", alttext: "Art piece 4" }
            ];

            return {
                // Core artist data
                id: data.artistid || data.id || 'unknown',
                title: data.title || data.name || data.artistName || 'Unknown Artist',
                byline: data.byline || data.description || data.bio || 'No description available',
                path: data.path || data.slug || data.artistid || '#',
                
                // Profile picture with fallbacks
                profilePic: {
                    url: data.profilePic?.url || data.profileImage || data.avatar || "/blank_image.png",
                    alttext: data.profilePic?.alttext || `${data.title || 'Artist'}'s profile picture`
                },
                
                // Gallery data (for medium/large cards)
                gallery: data.gallery || demoGalleryPhotos,
                
                // Social engagement data
                social: {
                    loves: data.loves || demoNumbers[0],
                    likes: data.likes || demoNumbers[1], 
                    followers: data.followers || demoNumbers[2],
                    reactionCounts: {
                        '❤️': demoNumbers[0],
                        '👏': demoNumbers[1],
                        '🎨': demoNumbers[2],
                        '🔥': demoNumbers[3],
                    },
                    commentsCount: demoNumbers[4]
                },
                
                // Additional metadata
                metadata: {
                    isVerified: data.isVerified || false,
                    memberSince: data.memberSince || null,
                    location: data.location || null,
                    specialties: data.specialties || []
                }
            };
        }

        // Future: Add other entity types (listings, events, etc.)
        // if (type === 'listing') { ... }
        
        return data;
    }, [data, type]);
};

/**
 * useCardConfig - Hook to get size-specific configuration
 */
export const useCardConfig = (size = 'medium') => {
    return useMemo(() => {
        const configs = {
            small: {
                card: 'max-w-sm',
                image: { width: 48, height: 48 },
                imageContainer: 'w-12 h-12',
                title: 'text-sm font-medium',
                byline: 'text-xs',
                socialIcon: 'w-4 h-4',
                socialText: 'text-xs',
                padding: 'p-2',
                bodyPadding: 'p-2',
                socialPadding: 'p-2',
                gap: 'gap-1',
                galleryImages: 0, // No gallery in small
                showPreview: false
            },
            medium: {
                card: 'max-w-md',
                image: { width: 64, height: 64 },
                imageContainer: 'w-16 h-16',
                title: 'text-base font-semibold',
                byline: 'text-sm',
                socialIcon: 'w-5 h-5',
                socialText: 'text-sm',
                padding: 'p-3',
                bodyPadding: 'p-3',
                socialPadding: 'p-3',
                gap: 'gap-2',
                galleryImages: 2,
                showPreview: true
            },
            large: {
                card: 'max-w-2xl',
                image: { width: 96, height: 96 },
                imageContainer: 'w-24 h-24',
                title: 'text-lg font-semibold',
                byline: 'text-sm',
                socialIcon: 'w-6 h-6',
                socialText: 'text-sm',
                padding: 'p-4',
                bodyPadding: 'p-4',
                socialPadding: 'p-4',
                gap: 'gap-2',
                galleryImages: 4,
                showPreview: true,
                showMetadata: true // Only large cards show additional metadata
            },
            fullwidth: {
                card: 'w-full',
                image: { width: 128, height: 128 },
                imageContainer: 'w-32 h-32',
                title: 'text-xl font-bold',
                byline: 'text-base',
                socialIcon: 'w-7 h-7',
                socialText: 'text-base',
                padding: 'p-6',
                bodyPadding: 'p-6',
                socialPadding: 'p-6',
                gap: 'gap-3',
                galleryImages: 8,
                showPreview: true,
                showMetadata: true,
                showComments: true // Only fullwidth cards show comments by default
            }
        };

        return configs[size] || configs.medium;
    }, [size]);
};

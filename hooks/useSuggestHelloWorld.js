/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source - low-profit - human-first*/

import { useState } from 'react';

/**
 * Hook to suggest and create a quirky "Hello World" first post after profile/listing creation.
 *
 * Usage:
 *   const { suggest, suggesting, suggestedPost, dismissed, dismiss } = useSuggestHelloWorld();
 *   // After creating an artist: suggest(userId, "Artist", artistId)
 *   // After creating a listing: suggest(userId, "Listing", listingId)
 */
export function useSuggestHelloWorld() {
    const [suggesting, setSuggesting] = useState(false);
    const [suggestedPost, setSuggestedPost] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    const suggest = async (userId, entityType, entityId) => {
        setSuggesting(true);
        setDismissed(false);
        try {
            const res = await fetch('/api/Feed/suggest-hello-world?userId=' + userId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entityType, entityID: entityId }),
            });
            if (res.ok) {
                const post = await res.json();
                setSuggestedPost(post);
            }
        } catch (err) {
            console.error('Failed to suggest hello world post', err);
        }
        setSuggesting(false);
    };

    const dismiss = () => {
        setDismissed(true);
        setSuggestedPost(null);
    };

    return { suggest, suggesting, suggestedPost, dismissed, dismiss };
}
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source - low-profit - human-first*/

/**
 * Returns relative time for posts within 24 hours ("just now", "5m", "3h"),
 * otherwise returns formatted date and time ("Aug 29, 2026 at 2:30 PM").
 * @param {string|Date} dateValue - ISO date string or Date object
 * @returns {string}
 */
export function timeAgo(dateValue) {
    if (!dateValue) return '';

    const now = Date.now();
    const then = new Date(dateValue).getTime();
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';

    // Beyond 24 hours — show date and time
    return new Date(dateValue).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }) + ' at ' + new Date(dateValue).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
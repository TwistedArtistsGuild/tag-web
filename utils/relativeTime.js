/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source - low-profit - human-first*/

/**
 * Returns a human-friendly relative time string like "2m", "5h", "3d", "2w", "4mo", "1y"
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
    if (minutes < 60) return minutes + 'm';

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h';

    const days = Math.floor(hours / 24);
    if (days < 7) return days + 'd';

    const weeks = Math.floor(days / 7);
    if (weeks < 5) return weeks + 'w';

    const months = Math.floor(days / 30);
    if (months < 12) return months + 'mo';

    const years = Math.floor(days / 365);
    return years + 'y';
}
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source - low-profit - human-first*/

import Link from 'next/link';
import { IoSparklesOutline, IoCloseOutline, IoFlowerOutline } from 'react-icons/io5';

/**
 * Shows after a profile or listing is created, linking to the auto-posted hello world.
 *
 * @param {Object} props
 * @param {Object} props.post - The suggested FeedPostSummaryDTO
 * @param {Function} props.onDismiss - Called when user closes the banner
 */
export default function HelloWorldBanner({ post, onDismiss }) {
    if (!post) return null;

    return (
        <div className="alert bg-primary/10 border border-primary/20 shadow-sm">
            <IoSparklesOutline className="text-2xl text-primary" />
            <div className="flex-1">
                <p className="font-bold text-sm">Your first post is live on the Bloomscroll!</p>
                <p className="text-xs text-base-content/60 mt-0.5 line-clamp-2">{post.body_Plaintext || post.body}</p>
            </div>
            <div className="flex gap-2">
                <Link href="/feed" className="btn btn-primary btn-xs gap-1">
                    <IoFlowerOutline /> View Feed
                </Link>
                <button className="btn btn-ghost btn-xs btn-circle" onClick={onDismiss}>
                    <IoCloseOutline />
                </button>
            </div>
        </div>
    );
}
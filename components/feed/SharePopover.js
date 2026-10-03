/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source - low-profit - human-first*/

import { useState } from 'react';
import { IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5';

export default function SharePopover({ post, onClose }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? window.location.origin + '/feed?post=' + post.feedPostID : '';

    const copyLink = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareExternal = (platform) => {
        const text = encodeURIComponent(post.body_Plaintext || post.body || 'Check this out on TAG!');
        const link = encodeURIComponent(url);
        const urls = {
            twitter: 'https://twitter.com/intent/tweet?text=' + text + '&url=' + link,
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + link,
            bluesky: 'https://bsky.app/intent/compose?text=' + text + ' ' + link,
        };
        window.open(urls[platform], '_blank', 'width=600,height=400');
        onClose();
    };

    return (
        <div className="absolute right-0 top-8 z-20 card bg-base-100 shadow-xl border border-base-300 w-56">
            <div className="card-body p-3 gap-2">
                <p className="text-xs font-bold text-base-content/50 uppercase">Share externally</p>
                <button className="btn btn-xs btn-ghost justify-start" onClick={() => shareExternal('twitter')}>X / Twitter</button>
                <button className="btn btn-xs btn-ghost justify-start" onClick={() => shareExternal('facebook')}>Facebook</button>
                <button className="btn btn-xs btn-ghost justify-start" onClick={() => shareExternal('bluesky')}>Bluesky</button>
                <div className="divider my-0"></div>
                <button className="btn btn-xs btn-ghost justify-start gap-1" onClick={copyLink}>
                    {copied ? <><IoCheckmarkOutline /> Copied!</> : <><IoCopyOutline /> Copy Link</>}
                </button>
            </div>
        </div>
    );
}
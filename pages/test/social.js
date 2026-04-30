/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { useEffect, useState } from 'react';
import SocialComponentsDemo from '@/components/social/SocialComponentsDemo';

import TagSEO from "@/components/TagSEO"

/**
 * Social Components Test Page
 * Demonstrates all the real-time social features
 */
export default function SocialTest() {
    const [mounted, setMounted] = useState(false);
    const pageMetaData = {
        title: "Social Components Demo",
        description: "Real-time social components demonstration with live updates, reactions, and messaging",
        keywords: "social components, live reactions, messaging demo",
        robots: "noindex, nofollow",
        og: {
            title: "Social Components Demo",
            description: "Real-time social components demonstration with live updates, reactions, and messaging",
        },
    }

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            setMounted(true);
        });

        return () => window.cancelAnimationFrame(frameId);
    }, []);

    if (!mounted) {
        return (
      <div className="min-h-screen flex items-center justify-center">
            <TagSEO metadataProp={pageMetaData} canonicalSlug="test/social" />
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
      <>
            <TagSEO metadataProp={pageMetaData} canonicalSlug="test/social" />
            
            <div className="min-h-screen bg-base-200">
                <SocialComponentsDemo />
            </div>
        </>
    );
}

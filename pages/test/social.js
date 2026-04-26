/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useState } from 'react';
import Head from 'next/head';
import SocialComponentsDemo from '@/components/social/SocialComponentsDemo';
import TagSEO from "@/components/TagSEO"

/**
 * Social Components Test Page
 * Demonstrates all the real-time social features
 */
export default function SocialTest() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
      <div className="min-h-screen flex items-center justify-center">
      <TagSEO metadataProp={{ title: "Github Projects Tag Tag Web Pages Test Social | Twisted Artists Guild", description: "Explore Github Projects Tag Tag Web Pages Test Social on Twisted Artists Guild.", keywords: "artists, art community, marketplace", og: { title: "Github Projects Tag Tag Web Pages Test Social | Twisted Artists Guild", description: "Explore Github Projects Tag Tag Web Pages Test Social on Twisted Artists Guild." } }} canonicalSlug="/github_projects/tag/tag-web/pages/test/social" />
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
      <>
      <TagSEO metadataProp={{ title: "Github Projects Tag Tag Web Pages Test Social | Twisted Artists Guild", description: "Explore Github Projects Tag Tag Web Pages Test Social on Twisted Artists Guild.", keywords: "artists, art community, marketplace", og: { title: "Github Projects Tag Tag Web Pages Test Social | Twisted Artists Guild", description: "Explore Github Projects Tag Tag Web Pages Test Social on Twisted Artists Guild." } }} canonicalSlug="/github_projects/tag/tag-web/pages/test/social" />
            <Head>
                <title>Social Components Demo - Twisted Artists Guild</title>
                <meta name="description" content="Real-time social components demonstration with live updates, reactions, and messaging" />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            
            <div className="min-h-screen bg-base-200">
                <SocialComponentsDemo />
            </div>
        </>
    );
}

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { CardBase, CardHeader } from '@/components/cards/shared/CardBase';
import CardSocial from '@/components/cards/shared/CardSocial';
import CardGallery from '@/components/cards/shared/CardGallery';
import { useCardData, useCardConfig } from '@/components/cards/shared/hooks/useCardData';

/**
 * ArtistCardMedium - Standard artist card with gallery support
 */
const ArtistCardMedium = ({ 
    artist, 
    orientation = 'horizontal',
    showSocials = true,
    className = ''
}) => {
    const artistData = useCardData(artist, 'artist');
    const config = useCardConfig('medium');

    if (!artistData) return null;

    const cardContent = (
        <>
            <div className={`card-body ${config.bodyPadding} flex-grow ${orientation === 'vertical' ? 'text-center' : ''}`}>
                <CardHeader
                    profilePic={artistData.profilePic}
                    title={artistData.title}
                    byline={artistData.byline}
                    size="medium"
                    orientation={orientation}
                    href={`/artists/${artistData.path}`}
                />

                {/* Gallery for medium cards using new ArtworkGallery component */}
                {artistData.gallery && artistData.gallery.length > 0 && (
                    <div className={`mt-4 ${orientation === 'vertical' ? 'flex justify-center' : ''}`}>
                        <CardGallery
                            images={artistData.gallery}
                            size="medium"
                            className="max-w-sm"
                        />
                    </div>
                )}
            </div>

            {showSocials && (
                <CardSocial
                    targetId={artistData.id}
                    targetType="artist"
                    orientation={orientation}
                    size="medium"
                />
            )}
        </>
    );

    return (
        <CardBase
            orientation={orientation}
            size="medium"
            className={className}
        >
            {cardContent}
        </CardBase>
    );
};

export default ArtistCardMedium;

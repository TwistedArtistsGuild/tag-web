/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import ArtistCardMicro from './variants/ArtistCard/ArtistCardMicro';
import ArtistCardSmall from './variants/ArtistCard/ArtistCardSmall';
import ArtistCardMedium from './variants/ArtistCard/ArtistCardMedium';
import ArtistCardLarge from './variants/ArtistCard/ArtistCardLarge';
import ArtistCardFullWidth from './variants/ArtistCard/ArtistCardFullWidth';

/**
 * CardFactory - Central factory for rendering card components
 * @param {Object} props
 * @param {string} props.type - Card type ('artist', 'listing', etc.)
 * @param {string} props.variant - Size variant ('small', 'medium', 'large', 'fullwidth')
 * @param {Object} props.data - Data object matching API contract
 * @param {boolean} props.interactive - Whether card should include interactive elements
 * @param {string} props.orientation - Layout orientation ('horizontal', 'vertical')
 * @param {string} props.galleryType - Gallery display type ('tiled', 'carousel') - for large/fullwidth only
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Appropriate card component
 */
const CardFactory = ({ 
    type = 'artist', 
    variant = 'medium',
    data,
    interactive = true,
    orientation = 'horizontal',
    className = '',
    ...otherProps
}) => {
    // Artist card variants
    if (type === 'artist') {
        const commonProps = {
            artist: data,
            showSocials: interactive,
            orientation,
            className,
            ...otherProps
        };

        switch (variant) {
            case 'micro':
                return <ArtistCardMicro {...commonProps} />;
            case 'small':
                return <ArtistCardSmall {...commonProps} />;
            case 'large':
                return <ArtistCardLarge {...commonProps} />;
            case 'fullwidth':
                return <ArtistCardFullWidth {...commonProps} />;
            case 'medium':
            default:
                return <ArtistCardMedium {...commonProps} />;
        }
    }

    // Future: Add listing cards, event cards, etc.
    // if (type === 'listing') { ... }
    
    // Fallback for unknown types
    console.warn(`CardFactory: Unknown card type "${type}"`);
    return null;
};

export default CardFactory;

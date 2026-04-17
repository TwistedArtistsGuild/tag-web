/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css';

/**
 * @desc A reusable photo gallery component styled with daisyUI and Tailwind CSS.
 * @param {object} props - Contains the images array for the gallery.
 */
const PhotoGallery = ({ images }) => {
	return (
		<div className="container mx-auto my-8">
			<div className="card shadow-lg bg-base-100">
				<ImageGallery
					items={images}
					showThumbnails={true} // Enable thumbnails
					showFullscreenButton={true}
					showPlayButton={false}
					autoPlay={false}
					additionalClass="custom-gallery"
					infinite={true}
					showNav={true} // Disable navigation arrows to focus on a single image
				/>
			</div>
			<style jsx global>{`
				.custom-gallery .image-gallery-slide img {
					border-radius: 0.5rem;
					border: 0.125rem solid #000;
				}
				.custom-gallery .image-gallery-thumbnail img {
					width: 6.25rem !important; 
					height: 4.125rem !important; 
					border: 0.0625rem solid #000; 
					margin: 0.3125rem; 
				}
				.custom-gallery .image-gallery-thumbnails-wrapper {
					margin-top: 1rem; 
				}
			`}</style>
		</div>
	);
};

export default PhotoGallery;

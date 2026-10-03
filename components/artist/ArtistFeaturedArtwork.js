/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image"
import ImageGallery from "react-image-gallery"
import "react-image-gallery/styles/image-gallery.css"

// Placeholder artwork until real listing images are wired up
const SAMPLE_ARTWORKS = [
  {
    original: "https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg",
    thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg",
    description: "Artist at work on a canvas",
    title: "Creative Process",
  },
  {
    original: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg",
    thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg",
    description: "Artist painting a vibrant mural",
    title: "Mural Art",
  },
  {
    original: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg",
    thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg",
    description: "Another perspective of mural painting",
    title: "Urban Canvas",
  },
  {
    original: "https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg",
    thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg",
    description: "Artist's paint palette with various colors",
    title: "Palette of Colors",
  },
  {
    original: "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
    thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
    description: "Art brushes ready for use",
    title: "Tools of the Trade",
  },
]

const ArtistFeaturedArtwork = ({ artworks = SAMPLE_ARTWORKS }) => (
  <div id="artwork" className="mt-12">
    <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Featured Artwork</h2>
    <div className="card bg-base-100 shadow-lg p-4">
      {artworks.length > 0 ? (
        <div className="rounded-lg overflow-hidden" style={{ maxHeight: "600px" }}>
          <ImageGallery
            items={artworks}
            showPlayButton={true}
            showFullscreenButton={true}
            showThumbnails={true}
            showBullets={true}
            showNav={true}
            thumbnailPosition="bottom"
            additionalClass="artwork-gallery"
            useBrowserFullscreen={true}
            slideInterval={5000}
            lazyLoad={true}
            renderItem={(item) => (
              <div className="image-gallery-image">
                <div className="relative mx-auto h-125 w-full max-w-4xl">
                  <Image
                    src={item.original || "/placeholder.svg"}
                    alt={item.description || item.title || "Featured artwork"}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 896px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                {item.description && <div className="image-gallery-description">{item.description}</div>}
              </div>
            )}
            renderThumbInner={(item) => (
              <div className="image-gallery-thumbnail-inner">
                <Image
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.description || item.title || "Artwork thumbnail"}
                  className="image-gallery-thumbnail-image"
                  width={120}
                  height={80}
                  unoptimized
                  style={{ objectFit: "cover", height: "80px" }}
                />
                <div className="image-gallery-thumbnail-label">{item.title}</div>
              </div>
            )}
          />
        </div>
      ) : (
        <div className="text-center text-base-content/60 p-4">
          <p>No featured artwork available for this artist yet.</p>
          <p className="text-sm mt-1">Check back soon for updates!</p>
        </div>
      )}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-medium">Browse the artist&apos;s featured collection</p>
        <button className="btn btn-primary btn-sm">View All Works</button>
      </div>
    </div>
  </div>
)

export default ArtistFeaturedArtwork

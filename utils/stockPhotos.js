/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/**
 * Stock photos from Pexels for placeholder images
 * @type {string[]}
 */
export const stockPhotos = [
  "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-carlo-junemann-156928830-12407580-merchandisehats.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-joshsorenson-995301-drummer.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-jovanvasiljevic-32146479-merchandisesweater.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-karolina-grabowska-4471894-blackguitar.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-marcela-alessandra-789314-1885213-pianist.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-markus-winkler-1430818-3812433-merchandiseclothingrack.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-nappy-936030-violin.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-210922-guitarist.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-victorfreitas-733767-sultrysax.jpg",
]

/**
 * Returns a random stock photo URL from the collection
 * @returns {string} Random stock photo URL
 */
export function getRandomStockPhoto() {
  return stockPhotos[Math.floor(Math.random() * stockPhotos.length)]
}

/**
 * Returns multiple random stock photos (without duplicates)
 * @param {number} count - Number of photos to return
 * @returns {string[]} Array of random stock photo URLs
 */
export function getRandomStockPhotos(count = 1) {
  if (count >= stockPhotos.length) {
    // If requesting more photos than available, return shuffled array
    return [...stockPhotos].sort(() => Math.random() - 0.5)
  }
  
  const shuffled = [...stockPhotos].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Returns a random stock photo based on category/content type
 * @param {'artist'|'instrument'|'merchandise'|'painting'|'performance'|'general'} category - Category of image to return
 * @returns {string} Random stock photo URL matching the category
 */
export function getRandomStockPhotoByCategory(category = 'general') {
  const categoryMap = {
    artist: [0, 1, 12, 14], // Artist painting murals, artist painting
    instrument: [4, 6, 9, 10], // Drummer, guitar, violin, guitarist
    merchandise: [2, 5, 8], // Hats, sweater, clothing rack
    painting: [1, 3, 11, 12, 14], // Artist painting, paint palette, brushes, artist painting mural, artist painting
    performance: [4, 7, 9, 10, 13], // Drummer, pianist, violin, guitarist, band & crowd
    general: null // All photos
  }
  
  const indices = categoryMap[category]
  if (!indices) {
    // Return random from all photos
    return getRandomStockPhoto()
  }
  
  const randomIndex = indices[Math.floor(Math.random() * indices.length)]
  return stockPhotos[randomIndex]
}

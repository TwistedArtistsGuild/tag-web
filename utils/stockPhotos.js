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
 * Returns a deterministic stock photo URL based on a seed string
 * @param {string} seed - Seed string (e.g. blog path or id)
 * @returns {string} Seeded stock photo URL
 */
export function getSeededStockPhoto(seed = "") {
  const hash = String(seed).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return stockPhotos[hash % stockPhotos.length]
}

/**
 * Returns a deterministic stock photo URL based on a seed string and category.
 * Use this instead of getRandomStockPhotoByCategory to avoid SSR hydration mismatches.
 * @param {string} seed - Seed string (e.g. user id, name, or path)
 * @param {'artist'|'instrument'|'merchandise'|'painting'|'performance'|'general'} category
 * @returns {string} Seeded stock photo URL
 */
export function getSeededStockPhotoByCategory(seed = "", category = 'general') {
  const categoryMap = {
    artist: [0, 1, 12, 14],
    instrument: [4, 6, 9, 10, 15],
    merchandise: [2, 5, 8],
    painting: [1, 3, 11, 12, 14],
    performance: [4, 7, 9, 10, 13, 15],
    general: null,
  }
  const hash = String(seed).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const indices = categoryMap[category]
  if (!indices) return stockPhotos[hash % stockPhotos.length]
  return stockPhotos[indices[hash % indices.length]]
}

/**
 * @deprecated Use getSeededStockPhoto(seed) instead to avoid SSR hydration mismatches.
 * Returns a random stock photo URL from the collection.
 * Safe only when called server-side in getInitialProps/getServerSideProps, never in render.
 * @returns {string} Random stock photo URL
 */
export function getRandomStockPhoto() {
  return stockPhotos[Math.floor(Math.random() * stockPhotos.length)]
}

/**
 * @deprecated Use multiple getSeededStockPhoto(seed) calls instead to avoid SSR hydration mismatches.
 * Returns multiple random stock photos (without duplicates).
 * Safe only when called server-side in getInitialProps/getServerSideProps, never in render.
 * @param {number} count - Number of photos to return
 * @returns {string[]} Array of random stock photo URLs
 */
export function getRandomStockPhotos(count = 1) {
  if (count >= stockPhotos.length) {
    return [...stockPhotos].sort(() => Math.random() - 0.5)
  }
  const shuffled = [...stockPhotos].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * @deprecated Use getSeededStockPhotoByCategory(seed, category) instead to avoid SSR hydration mismatches.
 * Returns a random stock photo based on category/content type.
 * Safe only when called server-side in getInitialProps/getServerSideProps, never in render.
 * @param {'artist'|'instrument'|'merchandise'|'painting'|'performance'|'general'} category
 * @returns {string} Random stock photo URL matching the category
 */
export function getRandomStockPhotoByCategory(category = 'general') {
  const categoryMap = {
    artist: [0, 1, 12, 14],
    instrument: [4, 6, 9, 10, 15],
    merchandise: [2, 5, 8],
    painting: [1, 3, 11, 12, 14],
    performance: [4, 7, 9, 10, 13, 15],
    general: null,
  }
  const indices = categoryMap[category]
  if (!indices) return getRandomStockPhoto()
  return stockPhotos[indices[Math.floor(Math.random() * indices.length)]]
}

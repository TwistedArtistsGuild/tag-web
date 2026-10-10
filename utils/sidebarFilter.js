/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/** Fields searched per item type (unchanged from the original Browse sidebar). */
const SEARCH_FIELDS = {
  artists: ["biography", "byline", "title", "path", "seotags", "statement"],
  events: ["description", "title", "note", "path"],
  listings: ["description", "title", "culture", "medium", "path", "artCategory"],
}

/**
 * Browse-panel filter: category chip + free-text search.
 * @param {Array<object>} items
 * @param {{ type: "listings"|"artists"|"events", term: string, category: string|number }} options
 *   category "-1" means all categories.
 * @returns {Array<object>}
 */
export function filterSidebarItems(items, { type, term, category }) {
  if (!Array.isArray(items)) return []
  const fields = SEARCH_FIELDS[type] || SEARCH_FIELDS.listings
  const search = String(term || "").toLowerCase()
  const allCategories = String(category) === "-1"

  return items.filter((item) => {
    const categoryMatch = allCategories || String(item?.artCategoryID) === String(category)
    if (!categoryMatch) return false
    if (!search) return true
    return fields.some((field) => String(item?.[field] ?? "").toLowerCase().includes(search))
  })
}

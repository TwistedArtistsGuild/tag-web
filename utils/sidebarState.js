/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/**
 * Next open/closed state of the two dashboard panels.
 * @param {{ left: boolean, right: boolean }} current
 * @param {"left"|"right"} side the panel being opened, closed or toggled
 * @param {boolean|undefined} force true opens, false closes, undefined toggles
 * @param {boolean} isOverlay below 1280px panels overlay the page, so only one may be open
 * @returns {{ left: boolean, right: boolean }}
 */
export function nextSidebarState(current, side, force, isOverlay) {
  const other = side === "left" ? "right" : "left"
  const open = typeof force === "boolean" ? force : !current[side]
  return {
    [side]: open,
    [other]: open && isOverlay ? false : current[other],
  }
}

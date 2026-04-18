/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TiptapEditor from "@/components/social/tiptap-editor";

/**
 * @deprecated Use TiptapEditor directly with singleLine={true} and preset="minimal".
 * This wrapper will be removed in a future release.
 *
 * WysiwygSingleLine - A single line rich text editor component
 * Perfect for short rich text inputs like titles, comments, etc.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.value - Initial/controlled value for the editor
 * @param {function} props.onChange - Callback function when content changes
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.style - Additional style properties for the container
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.readOnly - Whether editor is read-only
 * @param {Object} props.toolbar - Custom toolbar configuration
 * @param {string} props.theme - Theme for the editor ('light' or 'dark')
 */
const WysiwygSingleLine = ({
  value = "",
  onChange = () => {},
  placeholder = "Write something...",
  style = {},
  className = "",
  readOnly = false,
  toolbar = null,
  theme = "light",
  preset,
}) => {
  const resolvedPreset = preset || (toolbar ? "medium" : "minimal");
  const themeClass = theme === "dark" ? "is-dark" : "is-light";

  return (
    <div
      className={`wysiwyg-single-line ${themeClass} ${className}`}
      style={style}
    >
      <TiptapEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        preset={resolvedPreset}
        singleLine
        minHeight={42}
      />
    </div>
  );
};

export default WysiwygSingleLine;
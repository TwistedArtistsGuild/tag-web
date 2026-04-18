/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TiptapEditor from "@/components/social/tiptap-editor";

/**
 * @deprecated Use TiptapEditor directly with preset="full" (or "medium").
 * This wrapper will be removed in a future release.
 *
 * WysiwygTextArea - A multi-line rich text editor component
 * Perfect for longer content like descriptions, blog posts, etc.
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
 * @param {number} props.minHeight - Minimum height of the editor in pixels
 * @param {number} props.maxHeight - Maximum height of the editor in pixels (0 for unlimited)
 */
const WysiwygTextArea = ({
  value = "",
  onChange = () => {},
  placeholder = "Write something...",
  style = {},
  className = "",
  readOnly = false,
  toolbar = null,
  theme = "light",
  minHeight = 150,
  maxHeight = 400,
  preset = "full",
}) => {
  const resolvedPreset = preset || (toolbar ? "full" : "full");
  const themeClass = theme === "dark" ? "is-dark" : "is-light";

  const editorStyle = {
    minHeight: `${minHeight}px`,
    maxHeight: maxHeight > 0 ? `${maxHeight}px` : "none",
    ...style,
  };

  return (
    <div
      className={`wysiwyg-text-area ${themeClass} ${className}`}
      style={editorStyle}
    >
      <TiptapEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        preset={resolvedPreset}
        minHeight={minHeight}
      />
    </div>
  );
};

WysiwygTextArea.focus = () => {};

export default WysiwygTextArea;
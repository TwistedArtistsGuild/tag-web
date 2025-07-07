/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import PropTypes from "prop-types";

/**
 * Table of Contents component for navigating page sections
 * @param {Object} props - Component properties
 * @param {Array} props.sections - List of sections with id and label
 * @param {boolean} props.displayInline - Whether to display the TOC inline
 * @param {string} props.className - Additional CSS classes for styling
 * @param {string} props.title - Title for the TOC
 * @returns {JSX.Element} Table of Contents component
 */
export default function TableOfContents({ sections, displayInline, className, title }) {
  return (
    <nav className={`toc ${className}`} aria-label="Table of Contents">
      {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
      <ul className={displayInline ? "flex space-x-4" : "space-y-2"}>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

TableOfContents.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  displayInline: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
};

TableOfContents.defaultProps = {
  displayInline: false,
  className: "",
  title: "",
};
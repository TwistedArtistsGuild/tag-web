/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/**
 * @desc Reusable section component for documentation pages (development, vendor, etc.)
 * @param {object} props - Component props
 * @param {string} props.id - Section ID for anchor links
 * @param {string} props.title - Section heading with optional emoji
 * @param {JSX.Element} props.children - Section content (paragraphs, lists, etc.)
 * @param {string} props.bgColor - Tailwind background class (e.g., "bg-base-100", "bg-base-200")
 * @param {boolean} props.centered - Whether to center the title and content (default: false)
 */
export default function DocumentationSection({
	id,
	title,
	children,
	bgColor = "bg-base-100",
	centered = false,
	sectionClassName = "",
	contentClassName = "",
}) {
	const containerClasses = centered ? "text-center" : "";
	const titleClasses = "text-3xl md:text-4xl font-bold mb-6 text-primary";
	const bodyClasses = [
		"space-y-4",
		"text-base-content",
		"[&_p]:text-base-content/80",
		"[&_ul]:ml-5",
		"[&_ul]:list-disc",
		"[&_ul]:space-y-2",
		"[&_ol]:ml-5",
		"[&_ol]:list-decimal",
		"[&_ol]:space-y-2",
		"[&_li]:text-base-content/80",
		"[&_strong]:text-base-content",
		"[&_a]:link",
		"[&_a]:link-primary",
		contentClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<section id={id} className={`py-16 ${bgColor} ${sectionClassName}`.trim()}>
			<div className="container mx-auto px-4">
				<div className="rounded-box border border-base-300/70 bg-base-100/60 p-6 shadow-md backdrop-blur-sm md:p-8">
					<h2 className={titleClasses}>{title}</h2>
					<div className={`${containerClasses} ${bodyClasses}`.trim()}>{children}</div>
				</div>
			</div>
		</section>
	);
}

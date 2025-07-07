/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { useState } from "react";
import Link from "next/link";

const DropdownMenu = ({ title, titleHref, options, active, onActivate, className }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleMouseEnter = () => setIsOpen(true);
	const handleMouseLeave = () => setIsOpen(false);

	return (
		<div
			className={`relative inline-block ${active ? "font-bold" : ""}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Link
				href={titleHref}
				className={`cursor-pointer ${className}`}
				onClick={onActivate}
			>
				{title}
			</Link>
			{isOpen && (
				<div className="absolute bg-base-100 shadow-lg z-10 min-w-[10rem] mt-1 rounded-md">
					{options.map((option, index) => (
						<Link
							key={index}
							href={option.href}
							className="block px-4 py-2 text-base-content hover:bg-base-200"
						>
							{option.label}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;

/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

function getSizeClasses(size) {
	if (size === "large") {
		return {
			title: "text-base",
			role: "text-sm",
			name: "text-sm",
			note: "text-sm",
			container: "p-4",
		};
	}

	if (size === "medium") {
		return {
			title: "text-sm",
			role: "text-xs",
			name: "text-sm",
			note: "text-xs",
			container: "p-3",
		};
	}

	return {
		title: "text-xs",
		role: "text-[0.70rem]",
		name: "text-xs",
		note: "text-[0.70rem]",
		container: "p-2.5",
	};
}

function normalizeCreditEntry(credit) {
	if (!credit) return null;

	return {
		role: credit.role || credit.roleLabel || credit.keyName || "Contributor",
		name: credit.displayName || credit.name || credit.partyName || "Unnamed contributor",
		url: credit.externalURL || credit.url || "",
		note: credit.creditText || credit.note || credit.bioNote || "",
	};
}

export default function MediaCredits({
	title = "Credits",
	credits = [],
	size = "small",
	emptyLabel = "No credits were provided.",
	className = "",
}) {
	const normalizedCredits = Array.isArray(credits)
		? credits.map(normalizeCreditEntry).filter(Boolean)
		: [];

	const sizeClasses = getSizeClasses(size);

	return (
		<div className={`rounded-lg border border-base-300 bg-base-100 ${sizeClasses.container} ${className}`.trim()}>
			<h4 className={`font-semibold uppercase tracking-wide text-primary ${sizeClasses.title}`}>{title}</h4>
			{normalizedCredits.length === 0 ? (
				<p className={`mt-2 text-base-content/70 ${sizeClasses.note}`}>{emptyLabel}</p>
			) : (
				<ul className="mt-2 space-y-2">
					{normalizedCredits.map((credit, index) => (
						<li key={`${credit.role}-${credit.name}-${index}`} className="rounded-md border border-base-300/70 bg-base-200/40 p-2">
							<p className={`font-semibold text-primary ${sizeClasses.role}`}>{credit.role}</p>
							{credit.url ? (
								<a
									href={credit.url}
									target="_blank"
									rel="noopener noreferrer"
									className={`mt-0.5 block underline decoration-primary/60 underline-offset-2 hover:decoration-primary ${sizeClasses.name}`}
								>
									{credit.name}
								</a>
							) : (
								<p className={`mt-0.5 ${sizeClasses.name}`}>{credit.name}</p>
							)}
							{credit.note ? <p className={`mt-1 text-base-content/75 ${sizeClasses.note}`}>{credit.note}</p> : null}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

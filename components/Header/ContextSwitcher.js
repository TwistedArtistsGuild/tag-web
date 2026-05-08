/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

const PRESET_COLORS = [
	"#3B82F6",
	"#22C55E",
	"#EF4444",
	"#F59E0B",
	"#8B5CF6",
	"#14B8A6",
	"#EC4899",
	"#F97316",
]

function getContextRoleVisual(type) {
	const normalizedType = String(type || "").toLowerCase()

	if (normalizedType === "admin") {
		return {
			label: "Admin",
			pillClass: "bg-error/15 text-error border border-error/35",
			ringClass: "border-error/70",
		}
	}

	if (normalizedType === "moderator") {
		return {
			label: "Moderator",
			pillClass: "bg-warning/20 text-warning-content border border-warning/40",
			ringClass: "border-warning/70 border-dashed",
		}
	}

	if (normalizedType === "staff") {
		return {
			label: "Staff",
			pillClass: "bg-secondary/20 text-secondary-content border border-secondary/40",
			ringClass: "border-secondary/70 border-dotted",
		}
	}

	return {
		label: String(type || "profile"),
		pillClass: "bg-base-200 text-base-content/70 border border-base-content/15",
		ringClass: "",
	}
}

function getInitials(label) {
	if (!label) {
		return "?"
	}

	return label
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase()
}

function getHaloClasses(isActive, needsAttention) {
	if (needsAttention) {
		return "ring-2 ring-offset-2 ring-offset-base-100 animate-pulse motion-reduce:animate-none"
	}

	if (isActive) {
		return "ring-2 ring-offset-2 ring-offset-base-100"
	}

	return "ring-1 ring-offset-1 ring-offset-base-100"
}

function AvatarWithHalo({ context, isActive, size = "md" }) {
	const color = context.color || PRESET_COLORS[0]
	const roleVisual = getContextRoleVisual(context.type)
	const sizeClass = size === "sm" ? "w-8" : "w-10"
	const haloStyle = {
		boxShadow: isActive || context.needsAttention ? `0 0 0 3px ${color}66, 0 0 14px ${color}88` : `0 0 0 1px ${color}66`,
		borderColor: color,
	}

	return (
		<div className={`avatar relative ${getHaloClasses(isActive, context.needsAttention)}`} style={haloStyle}>
			{roleVisual.ringClass ? <span className={`absolute -inset-1 rounded-full border-2 ${roleVisual.ringClass}`} /> : null}
			<div className={`${sizeClass} rounded-full bg-base-200 overflow-hidden flex items-center justify-center text-xs font-semibold text-base-content relative z-10 border`} style={{ borderColor: `${color}88` }}>
				{context.avatarUrl ? (
					<Image
						src={context.avatarUrl}
						alt={`${context.label} avatar`}
						width={40}
						height={40}
					/>
				) : (
					<span>{getInitials(context.label)}</span>
				)}
			</div>
		</div>
	)
}

function ContextListItem({ context, isActive, onSelect }) {
	const roleVisual = getContextRoleVisual(context.type)
	const color = context.color || PRESET_COLORS[0]
	const rowStyle = {
		backgroundColor: isActive ? `${color}24` : `${color}14`,
		borderColor: isActive ? `${color}66` : `${color}44`,
		boxShadow: `inset 0 0 0 1px ${isActive ? `${color}33` : `${color}1F`}`,
	}

	return (
		<button
			type="button"
			onClick={() => onSelect(context.id)}
			className="w-full flex items-center gap-3 rounded-box px-2 py-2 text-left transition-colors border hover:brightness-95"
			style={rowStyle}
		>
			<span className="h-8 w-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
			<AvatarWithHalo context={context} isActive={isActive} />
			<div className="min-w-0 flex-1">
				<div className="font-medium text-sm text-base-content truncate flex items-center gap-1.5">
					<span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
					<span className="truncate">{context.label}</span>
				</div>
				{context.subtitle ? <div className="text-[11px] text-base-content/60 truncate">{context.subtitle}</div> : null}
				<div className="mt-0.5 flex items-center gap-1">
					<span className={`badge badge-xs ${roleVisual.pillClass}`}>{roleVisual.label}</span>
					{["admin", "moderator", "staff"].includes(String(context.type || "").toLowerCase()) ? (
						<span className="badge badge-xs bg-base-300/50 text-base-content/70 border border-base-content/15">TAG Core</span>
					) : null}
				</div>
			</div>
			{context.unreadCount > 0 ? (
				<span className="badge badge-error badge-sm">{context.unreadCount}</span>
			) : null}
			{isActive ? <Check className="w-4 h-4 text-primary" /> : null}
		</button>
	)
}

export default function ContextSwitcher({
	contexts = [],
	variant = "applet",
	activeContextId,
	onChange,
	compactSize = "md",
	compactMenuPosition = "bottom-right",
	title = "Context Switcher",
}) {
	const [internalActiveId, setInternalActiveId] = useState(activeContextId || contexts[0]?.id || null)
	const [isOpen, setIsOpen] = useState(false)

	const selectedContextId = activeContextId ?? internalActiveId
	const selectedContext = useMemo(
		() => contexts.find((context) => context.id === selectedContextId) || contexts[0] || null,
		[contexts, selectedContextId],
	)
	const panelColor = selectedContext?.color || PRESET_COLORS[0]
	const subPanelTintStyle = {
		borderColor: `${panelColor}88`,
		backgroundColor: `${panelColor}20`,
		backgroundImage: `linear-gradient(180deg, ${panelColor}2B 0%, ${panelColor}18 100%)`,
		boxShadow: `inset 0 0 0 1px ${panelColor}33`,
	}

	const handleSelect = (contextId) => {
		if (activeContextId === undefined) {
			setInternalActiveId(contextId)
		}

		onChange?.(contextId)
		setIsOpen(false)
	}

	if (!selectedContext) {
		return (
			<div className="rounded-box border border-base-300 bg-base-100 p-3 text-sm text-base-content/70">
				No contexts available.
			</div>
		)
	}

	if (variant === "compact") {
		const isSmall = compactSize === "sm"
		const compactMenuPositionClassMap = {
			"bottom-right": "right-0 mt-2",
			"bottom-left": "left-0 mt-2",
			"top-right": "right-0 bottom-full mb-2",
			"top-left": "left-0 bottom-full mb-2",
		}
		const compactMenuPositionClass = compactMenuPositionClassMap[compactMenuPosition] || compactMenuPositionClassMap["bottom-right"]
		return (
			<div className="relative">
				<button
					type="button"
					className={`btn btn-ghost btn-circle ${isSmall ? "w-9 h-9" : "w-11 h-11"} border border-base-content/10 bg-base-100/30 relative overflow-visible`}
					onClick={() => setIsOpen((current) => !current)}
					aria-label="Open profile context switcher"
					aria-expanded={isOpen}
					style={{ borderColor: `${selectedContext.color || PRESET_COLORS[0]}66` }}
				>
					<AvatarWithHalo context={selectedContext} isActive size={isSmall ? "sm" : "md"} />
					<span className={`absolute ${isSmall ? "-bottom-1 -right-1 w-4 h-4" : "-bottom-1 -right-1 w-5 h-5"}`}>
						<span className="absolute inset-0 rounded-full border border-primary/70 border-dashed animate-[spin_2.4s_linear_infinite] motion-reduce:animate-none" />
						<span className="absolute inset-0 rounded-full bg-primary text-primary-content flex items-center justify-center border border-base-100 shadow">
							<ChevronsUpDown className={isSmall ? "w-2.5 h-2.5" : "w-3 h-3"} />
						</span>
					</span>
				</button>

				{isOpen ? (
					<>
						<div className="fixed inset-0" style={{ zIndex: 210 }} onClick={() => setIsOpen(false)} />
						<div className={`absolute ${compactMenuPositionClass} w-80 max-w-[calc(100vw-2rem)] rounded-box border border-base-300 bg-base-100 p-3 shadow-xl space-y-3`} style={{ zIndex: 220 }}>
							<div className="flex items-center justify-between">
								<div>
									<div className="text-xs uppercase tracking-wider text-base-content/50">Profile Context</div>
									<div className="font-semibold text-base-content">{selectedContext.label}</div>
								</div>
								<ChevronsUpDown className="w-4 h-4 text-base-content/50" />
							</div>

							<div className="space-y-1 max-h-64 overflow-y-auto rounded-box border p-2" style={subPanelTintStyle}>
								{contexts.map((context) => (
									<ContextListItem
										key={context.id}
										context={context}
										isActive={context.id === selectedContextId}
										onSelect={handleSelect}
									/>
								))}
							</div>

							<div className="text-xs text-base-content/70 rounded-box border p-2" style={subPanelTintStyle}>
								Compact variant preview for Login Profile integration. This popup is intended for quick context switches.
							</div>
						</div>
					</>
				) : null}
			</div>
		)
	}

	return (
		<section className="card bg-base-100 border border-base-300 shadow">
			<div className="card-body gap-4">
				<div className="flex items-center justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold text-base-content">{title}</h3>
						<p className="text-xs text-base-content/60">Applet variant for page-level embedding.</p>
					</div>
				</div>

				<div className="space-y-1 rounded-box border p-2" style={{ borderColor: `${panelColor}55` }}>
					{contexts.map((context) => (
						<ContextListItem
							key={context.id}
							context={context}
							isActive={context.id === selectedContextId}
							onSelect={handleSelect}
						/>
					))}
				</div>
			</div>
		</section>
	)
}


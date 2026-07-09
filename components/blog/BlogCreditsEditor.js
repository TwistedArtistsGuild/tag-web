/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useMemo, useState } from "react";
import MediaCredits from "@/components/forms/media-credits";

function buildBlankRow(sortOrder = 0) {
	return {
		clientId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		creditPartyID: null,
		creditRoleID: "",
		sortOrder,
		creditText: "",
		displayName: "",
		externalURL: "",
		bioNote: "",
		userID: "",
		artistID: "",
	};
}

function toPreviewCredit(row, roleLabelById) {
	return {
		role: roleLabelById[String(row.creditRoleID)] || "Contributor",
		name: row.displayName || "Unnamed contributor",
		url: row.externalURL || "",
		note: row.creditText || row.bioNote || "",
	};
}

export default function BlogCreditsEditor({ blogId }) {
	const [roles, setRoles] = useState([]);
	const [rows, setRows] = useState([buildBlankRow(0)]);
	const [loading, setLoading] = useState(Boolean(blogId));
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const roleLabelById = useMemo(() => {
		return roles.reduce((acc, role) => {
			acc[String(role.creditRoleID)] = role.label;
			return acc;
		}, {});
	}, [roles]);

	useEffect(() => {
		if (!blogId) {
			return;
		}

		let cancelled = false;
		async function loadCreditsData() {
			setLoading(true);
			setError("");
			setMessage("");
			try {
				const [rolesResponse, creditsResponse] = await Promise.all([
					fetch(`/api/blog/credit-roles`),
					fetch(`/api/blog/${blogId}/credits`),
				]);

				if (!rolesResponse.ok) {
					throw new Error("Unable to load credit roles.");
				}

				if (!creditsResponse.ok) {
					throw new Error("Unable to load existing blog credits.");
				}

				const loadedRoles = await rolesResponse.json();
				const loadedCredits = await creditsResponse.json();

				if (cancelled) {
					return;
				}

				setRoles(Array.isArray(loadedRoles) ? loadedRoles : []);

				if (Array.isArray(loadedCredits) && loadedCredits.length > 0) {
					setRows(
						loadedCredits
							.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
							.map((credit, index) => ({
								clientId: `existing-${credit.mediaCreditID || index}`,
								creditPartyID: credit.creditPartyID || null,
								creditRoleID: String(credit.creditRoleID || ""),
								sortOrder: Number.isFinite(credit.sortOrder) ? credit.sortOrder : index,
								creditText: credit.creditText || "",
								displayName: credit.displayName || "",
								externalURL: credit.externalURL || "",
								bioNote: credit.bioNote || "",
								userID: credit.userID ? String(credit.userID) : "",
								artistID: credit.artistID ? String(credit.artistID) : "",
							}))
					);
				} else {
					setRows([buildBlankRow(0)]);
				}
			} catch (loadError) {
				if (!cancelled) {
					setError(loadError.message || "Unable to load blog credits.");
					setRows([buildBlankRow(0)]);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void loadCreditsData();
		return () => {
			cancelled = true;
		};
	}, [blogId]);

	const updateRow = (clientId, patch) => {
		setRows((currentRows) =>
			currentRows.map((row) => (row.clientId === clientId ? { ...row, ...patch } : row))
		);
	};

	const removeRow = (clientId) => {
		setRows((currentRows) => {
			const nextRows = currentRows.filter((row) => row.clientId !== clientId);
			return nextRows.length > 0 ? nextRows : [buildBlankRow(0)];
		});
	};

	const addRow = () => {
		setRows((currentRows) => [...currentRows, buildBlankRow(currentRows.length)]);
	};

	const handleSave = async () => {
		if (!blogId) {
			setError("Save disabled until the blog record exists.");
			return;
		}

		setSaving(true);
		setError("");
		setMessage("");

		const normalizedRows = rows
			.filter((row) => row.creditRoleID && (row.creditPartyID || row.displayName || row.userID || row.artistID))
			.map((row, index) => ({
				creditPartyID: row.creditPartyID,
				creditRoleID: Number(row.creditRoleID),
				sortOrder: index,
				creditText: row.creditText || "",
				party: row.creditPartyID
					? null
					: {
						userID: row.userID ? Number(row.userID) : null,
						artistID: row.artistID ? Number(row.artistID) : null,
						displayName: row.displayName || null,
						externalURL: row.externalURL || null,
						bioNote: row.bioNote || null,
					},
			}));

		try {
			const response = await fetch(`/api/blog/${blogId}/credits`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ credits: normalizedRows }),
			});

			if (!response.ok) {
				const errorPayload = await response.text();
				throw new Error(errorPayload || "Unable to save blog credits.");
			}

			const savedCredits = await response.json();
			setRows(
				Array.isArray(savedCredits) && savedCredits.length > 0
					? savedCredits
							.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
							.map((credit, index) => ({
								clientId: `saved-${credit.mediaCreditID || index}`,
								creditPartyID: credit.creditPartyID || null,
								creditRoleID: String(credit.creditRoleID || ""),
								sortOrder: Number.isFinite(credit.sortOrder) ? credit.sortOrder : index,
								creditText: credit.creditText || "",
								displayName: credit.displayName || "",
								externalURL: credit.externalURL || "",
								bioNote: credit.bioNote || "",
								userID: credit.userID ? String(credit.userID) : "",
								artistID: credit.artistID ? String(credit.artistID) : "",
							}))
					: [buildBlankRow(0)]
			);

			setMessage("Blog credits saved.");
		} catch (saveError) {
			setError(saveError.message || "Unable to save credits.");
		} finally {
			setSaving(false);
		}
	};

	const previewCredits = rows
		.filter((row) => row.creditRoleID && (row.displayName || row.creditText || row.bioNote))
		.map((row) => toPreviewCredit(row, roleLabelById));

	if (loading) {
		return <div className="rounded-lg border border-base-300 bg-base-100 p-4 text-sm">Loading credit settings...</div>;
	}

	return (
		<div className="space-y-4 rounded-lg border border-base-300 bg-base-100 p-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h3 className="text-lg font-semibold">Blog Production Credits</h3>
				<button type="button" className="btn btn-sm btn-outline" onClick={addRow}>
					Add Credit
				</button>
			</div>

			<p className="text-sm text-base-content/70">
				Credits can link to existing users/artists or use an external identity for collaborators without accounts.
			</p>

			{error ? <div className="alert alert-error py-2 text-sm">{error}</div> : null}
			{message ? <div className="alert alert-success py-2 text-sm">{message}</div> : null}

			<div className="space-y-3">
				{rows.map((row, index) => (
					<div key={row.clientId} className="rounded-lg border border-base-300 bg-base-200/40 p-3">
						<div className="mb-2 flex items-center justify-between">
							<p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Credit {index + 1}</p>
							<button type="button" className="btn btn-xs btn-ghost text-error" onClick={() => removeRow(row.clientId)}>
								Remove
							</button>
						</div>

						<div className="grid gap-2 md:grid-cols-2">
							<label className="form-control">
								<span className="label-text text-xs">Role</span>
								<select
									className="select select-bordered select-sm"
									value={row.creditRoleID}
									onChange={(event) => updateRow(row.clientId, { creditRoleID: event.target.value })}
								>
									<option value="">Select role</option>
									{roles.map((role) => (
										<option key={role.creditRoleID} value={role.creditRoleID}>
											{role.label}
										</option>
									))}
								</select>
							</label>

							<label className="form-control">
								<span className="label-text text-xs">Display Name</span>
								<input
									className="input input-bordered input-sm"
									value={row.displayName}
									onChange={(event) => updateRow(row.clientId, { displayName: event.target.value })}
									placeholder="Contributor name"
								/>
							</label>

							<label className="form-control">
								<span className="label-text text-xs">External URL</span>
								<input
									className="input input-bordered input-sm"
									value={row.externalURL}
									onChange={(event) => updateRow(row.clientId, { externalURL: event.target.value })}
									placeholder="https://portfolio.example"
								/>
							</label>

							<label className="form-control">
								<span className="label-text text-xs">User ID (optional)</span>
								<input
									type="number"
									className="input input-bordered input-sm"
									value={row.userID}
									onChange={(event) => updateRow(row.clientId, { userID: event.target.value })}
									placeholder="Existing user"
								/>
							</label>

							<label className="form-control">
								<span className="label-text text-xs">Artist ID (optional)</span>
								<input
									type="number"
									className="input input-bordered input-sm"
									value={row.artistID}
									onChange={(event) => updateRow(row.clientId, { artistID: event.target.value })}
									placeholder="Existing artist"
								/>
							</label>

							<label className="form-control md:col-span-2">
								<span className="label-text text-xs">Credit Note</span>
								<input
									className="input input-bordered input-sm"
									value={row.creditText}
									onChange={(event) => updateRow(row.clientId, { creditText: event.target.value })}
									placeholder="Role details, ownership note, or contribution specifics"
								/>
							</label>

							<label className="form-control md:col-span-2">
								<span className="label-text text-xs">Profile Bio Note (optional)</span>
								<input
									className="input input-bordered input-sm"
									value={row.bioNote}
									onChange={(event) => updateRow(row.clientId, { bioNote: event.target.value })}
									placeholder="Short resume-style summary"
								/>
							</label>
						</div>
					</div>
				))}
			</div>

			<div className="flex justify-end">
				<button type="button" className="btn btn-primary btn-sm" disabled={saving} onClick={handleSave}>
					{saving ? "Saving..." : "Save Credits"}
				</button>
			</div>

			<MediaCredits title="Preview" credits={previewCredits} size="small" />
		</div>
	);
}

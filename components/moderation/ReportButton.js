/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { IoFlagOutline, IoClose, IoCheckmarkCircle } from 'react-icons/io5';

/**
 * Global report button that can be placed next to any content.
 *
 * @param {Object} props
 * @param {"Listing"|"Artist"|"User"|"Comment"|"Message"|"Blog"|"Event"} props.targetType
 * @param {number} props.targetId - ID of the content being reported
 * @param {string} [props.className] - Additional button class overrides
 * @param {"icon"|"text"|"full"} [props.variant] - Button display variant
 */
export default function ReportButton({ targetType, targetId, className = '', variant = 'icon', targetURL = null }) {
    const { data: session } = useSession();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [warningGroups, setWarningGroups] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || warningGroups.length > 0) return;

        const fetchLabels = async () => {
            try {
                const res = await fetch('/api/ContentWarningGroup');
                if (res.ok) {
                    const data = await res.json();
                    setWarningGroups(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Failed to load content warning labels", err);
            }
        };
        fetchLabels();
    }, [isOpen, warningGroups.length]);

    const handleOpen = () => {
        if (!session?.user) {
            router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`);
            return;
        }
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setError(null);
        if (submitted) {
            setSubmitted(false);
            setSelectedLabels([]);
            setDescription('');
        }
    };

    const toggleLabel = (itemId) => {
        setSelectedLabels(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedLabels.length === 0 && !description.trim()) {
            setError("Please select at least one label or describe the issue.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/ContentReport?reporterUserId=${session.user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetType,
                    targetID: targetId,
                    targetURL: targetURL || (typeof window !== 'undefined' ? window.location.pathname : null),
                    description: description.trim(),
                    labelIDs: selectedLabels,
                }),
            });

            if (!res.ok) throw new Error("Failed to submit report");
            setSubmitted(true);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        }
        setSubmitting(false);
    };

    const buttonContent = variant === 'icon'
        ? <IoFlagOutline />
        : variant === 'text'
            ? <><IoFlagOutline /> Report</>
            : <><IoFlagOutline /> Report Content</>;

    return (
        <>
            <button
                type="button"
                className={`btn btn-ghost btn-sm text-base-content/50 hover:text-error gap-1 ${className}`}
                onClick={handleOpen}
                title="Report this content"
            >
                {buttonContent}
            </button>

            {isOpen && (
                <div className="modal modal-open z-50">
                    <div className="modal-box max-w-lg">
                        {submitted ? (
                            <div className="text-center py-6">
                                <IoCheckmarkCircle className="text-5xl text-success mx-auto mb-3" />
                                <h3 className="font-bold text-xl mb-2">Report Submitted</h3>
                                <p className="text-base-content/60">Thank you. Our moderation team will review this content.</p>
                                <button type="button" className="btn btn-primary mt-6" onClick={handleClose}>Done</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <IoFlagOutline className="text-error" /> Report Content
                                    </h3>
                                    <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={handleClose}>
                                        <IoClose className="text-xl" />
                                    </button>
                                </div>

                                <p className="text-sm text-base-content/60 mb-4">
                                    What is wrong with this {targetType.toLowerCase()}? Select all that apply.
                                </p>

                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
                                    {warningGroups.map(group => (
                                        <div key={group.id}>
                                            <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                                                {group.title}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {(group.items || []).map(item => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        className={`badge badge-lg cursor-pointer transition-all ${
                                                            selectedLabels.includes(item.id)
                                                                ? 'badge-error text-error-content'
                                                                : 'badge-outline hover:badge-error hover:badge-outline'
                                                        }`}
                                                        onClick={() => toggleLabel(item.id)}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {warningGroups.length === 0 && (
                                        <div className="text-center py-4">
                                            <span className="loading loading-spinner loading-sm"></span>
                                        </div>
                                    )}
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Tell us more (optional)</span>
                                        <span className="label-text-alt">{description.length}/500</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered w-full"
                                        rows={3}
                                        maxLength={500}
                                        placeholder="Describe what is wrong..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-error alert-sm mb-4">
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                <div className="modal-action">
                                    <button type="button" className="btn btn-ghost" onClick={handleClose}>Cancel</button>
                                    <button
                                        type="submit"
                                        className="btn btn-error"
                                        disabled={submitting}
                                    >
                                        {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Submit Report'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    <div className="modal-backdrop" onClick={handleClose}></div>
                </div>
            )}
        </>
    );
}
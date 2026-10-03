/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect, useCallback } from 'react';
import {
    IoAddOutline,
    IoTrashOutline,
    IoCalculatorOutline,
    IoWarningOutline,
    IoCheckmarkCircleOutline,
    IoChevronDownOutline,
    IoChevronUpOutline,
    IoPencilOutline,
    IoPersonOutline,
    IoCubeOutline,
    IoBusinessOutline,
    IoCarOutline,
} from 'react-icons/io5';

const COST_CATEGORIES = {
    Materials: { label: 'Materials', icon: IoCubeOutline, placeholder: 'e.g. Canvas, Paint, Resin...' },
    Business: { label: 'Business Overhead', icon: IoBusinessOutline, placeholder: 'e.g. Studio Rent, Utilities...' },
    Consumables: { label: 'Consumables', icon: IoCarOutline, placeholder: 'e.g. Sandpaper, Gloves, Tape...' },
};

const emptyLineItem = (category) => ({
    category,
    description: '',
    amount: '',
    displayOrder: 0,
});

const emptyLaborEntry = () => ({
    workerName: '',
    hourlyRate: '',
    hoursWorked: '',
    role: '',
    displayOrder: 0,
});

// ─── Collapsible Section ─────────────────────────────────────────────
const Section = ({ title, icon: Icon, children, defaultOpen = true, badge }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="card bg-base-100 shadow-sm border border-base-300">
            <button
                type="button"
                className="card-body py-3 px-5 flex flex-row items-center justify-between cursor-pointer hover:bg-base-200 transition-colors rounded-t-2xl"
                onClick={() => setOpen(!open)}
            >
                <span className="flex items-center gap-2 font-bold text-lg">
                    {Icon && <Icon className="text-primary" />} {title}
                    {badge !== undefined && <span className="badge badge-sm badge-primary">{badge}</span>}
                </span>
                {open ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
            </button>
            {open && <div className="card-body pt-0">{children}</div>}
        </div>
    );
};

// ─── Cost Line Items Table ───────────────────────────────────────────
const CostLineItemsEditor = ({ category, items, onChange }) => {
    const meta = COST_CATEGORIES[category];

    const addRow = () => {
        onChange([...items, { ...emptyLineItem(category), displayOrder: items.length }]);
    };

    const removeRow = (idx) => {
        onChange(items.filter((_, i) => i !== idx).map((item, i) => ({ ...item, displayOrder: i })));
    };

    const updateRow = (idx, field, value) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        onChange(updated);
    };

    const subtotal = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

    return (
        <Section title={meta.label} icon={meta.icon} badge={items.length > 0 ? `$${subtotal.toFixed(2)}` : null}>
            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead>
                        <tr>
                            <th className="w-8">#</th>
                            <th>Description</th>
                            <th className="w-32 text-right">Amount ($)</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="text-base-content/50">{idx + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        className="input input-bordered input-sm w-full"
                                        placeholder={meta.placeholder}
                                        value={item.description}
                                        onChange={(e) => updateRow(idx, 'description', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="input input-bordered input-sm w-full text-right font-mono"
                                        placeholder="0.00"
                                        value={item.amount}
                                        onChange={(e) => updateRow(idx, 'amount', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => removeRow(idx)}>
                                        <IoTrashOutline />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center text-base-content/40 py-4">No items yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button type="button" className="btn btn-outline btn-primary btn-sm mt-2 gap-1" onClick={addRow}>
                <IoAddOutline /> Add {meta.label} Item
            </button>
        </Section>
    );
};

// ─── Labor Entries Table ─────────────────────────────────────────────
const LaborEditor = ({ entries, onChange }) => {
    const addRow = () => {
        onChange([...entries, { ...emptyLaborEntry(), displayOrder: entries.length }]);
    };

    const removeRow = (idx) => {
        onChange(entries.filter((_, i) => i !== idx).map((e, i) => ({ ...e, displayOrder: i })));
    };

    const updateRow = (idx, field, value) => {
        const updated = [...entries];
        updated[idx] = { ...updated[idx], [field]: value };
        onChange(updated);
    };

    const subtotal = entries.reduce((sum, e) => sum + (parseFloat(e.hourlyRate) || 0) * (parseFloat(e.hoursWorked) || 0), 0);

    return (
        <Section title="Labor" icon={IoPersonOutline} badge={entries.length > 0 ? `$${subtotal.toFixed(2)}` : null}>
            <p className="text-sm text-base-content/60 mb-3">
                Solo artist? Add a single entry as your base pay. Teams can add multiple workers with different rates.
            </p>
            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead>
                        <tr>
                            <th>Name / Worker</th>
                            <th>Role</th>
                            <th className="w-28 text-right">Rate ($/hr)</th>
                            <th className="w-24 text-right">Hours</th>
                            <th className="w-28 text-right">Subtotal</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, idx) => {
                            const lineCost = (parseFloat(entry.hourlyRate) || 0) * (parseFloat(entry.hoursWorked) || 0);
                            return (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            type="text"
                                            className="input input-bordered input-sm w-full"
                                            placeholder="Your name"
                                            value={entry.workerName}
                                            onChange={(e) => updateRow(idx, 'workerName', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="input input-bordered input-sm w-full"
                                            placeholder="e.g. Sculptor"
                                            value={entry.role}
                                            onChange={(e) => updateRow(idx, 'role', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="input input-bordered input-sm w-full text-right font-mono"
                                            placeholder="0.00"
                                            value={entry.hourlyRate}
                                            onChange={(e) => updateRow(idx, 'hourlyRate', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.25"
                                            className="input input-bordered input-sm w-full text-right font-mono"
                                            placeholder="0"
                                            value={entry.hoursWorked}
                                            onChange={(e) => updateRow(idx, 'hoursWorked', e.target.value)}
                                        />
                                    </td>
                                    <td className="text-right font-mono font-medium">${lineCost.toFixed(2)}</td>
                                    <td>
                                        <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => removeRow(idx)}>
                                            <IoTrashOutline />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-base-content/40 py-4">No labor entries yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button type="button" className="btn btn-outline btn-primary btn-sm mt-2 gap-1" onClick={addRow}>
                <IoAddOutline /> Add Worker
            </button>
        </Section>
    );
};

// ─── Below-ASMRP Confirmation Modal ─────────────────────────────────
const BelowASMRPModal = ({ asmrp, finalPrice, onConfirm, onCancel }) => {
    const [firstConfirm, setFirstConfirm] = useState(false);

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg flex items-center gap-2 text-warning">
                    <IoWarningOutline className="text-2xl" /> Price Below ASMRP
                </h3>
                <div className="py-4 space-y-3">
                    <p>
                        Your price of <span className="font-mono font-bold">${parseFloat(finalPrice).toFixed(2)}</span> is below your
                        Artist Suggested Minimum Retail Price of <span className="font-mono font-bold text-warning">${parseFloat(asmrp).toFixed(2)}</span>.
                    </p>
                    <p className="text-base-content/70 text-sm">
                        Pricing below ASMRP means you may not cover your costs. Are you sure?
                    </p>
                    <div className="bg-warning/10 border border-warning/30 rounded-box p-3">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-warning"
                                checked={firstConfirm}
                                onChange={() => setFirstConfirm(!firstConfirm)}
                            />
                            <span className="label-text">I understand this price may not be sustainable</span>
                        </label>
                    </div>
                </div>
                <div className="modal-action">
                    <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                    <button
                        type="button"
                        className="btn btn-warning"
                        disabled={!firstConfirm}
                        onClick={onConfirm}
                    >
                        Confirm Override
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onCancel}></div>
        </div>
    );
};

// ─── Pricing Summary Card ────────────────────────────────────────────
const PricingSummary = ({ result, overridePrice, onOverridePriceChange, artistPriceOverride, onToggleOverride }) => {
    if (!result) return null;

    return (
        <div className="card bg-primary/5 border border-primary/20 shadow-md">
            <div className="card-body">
                <h3 className="card-title text-primary gap-2"><IoCalculatorOutline /> Pricing Summary</h3>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-3">
                    <span className="text-base-content/70">Materials</span>
                    <span className="text-right font-mono">${result.materialsCost.toFixed(2)}</span>

                    <span className="text-base-content/70">Business Overhead</span>
                    <span className="text-right font-mono">${result.businessCost.toFixed(2)}</span>

                    <span className="text-base-content/70">Consumables</span>
                    <span className="text-right font-mono">${result.consumablesCost.toFixed(2)}</span>

                    <span className="text-base-content/70">Labor</span>
                    <span className="text-right font-mono">${result.laborCost.toFixed(2)}</span>

                    <span className="text-base-content/70">Packaging</span>
                    <span className="text-right font-mono">${result.packagingCost.toFixed(2)}</span>

                    <span className="text-base-content/70">Shipping Estimate</span>
                    <span className="text-right font-mono">${result.shippingEstimate.toFixed(2)}</span>

                    <div className="col-span-2 divider my-1"></div>

                    <span className="font-bold">Total Cost</span>
                    <span className="text-right font-mono font-bold">${result.totalCost.toFixed(2)}</span>

                    <span className="text-base-content/70">Min Profit</span>
                    <span className="text-right font-mono text-success">+${result.minProfit.toFixed(2)}</span>

                    <span className="text-base-content/70">Max Profit</span>
                    <span className="text-right font-mono text-success">+${result.maxProfit.toFixed(2)}</span>

                    <div className="col-span-2 divider my-1"></div>

                    <span className="font-bold text-warning">ASMRP</span>
                    <span className="text-right font-mono font-bold text-warning">${result.asmrp.toFixed(2)}</span>

                    <span className="font-bold text-primary">Suggested Price</span>
                    <span className="text-right font-mono font-bold text-primary text-lg">${result.suggestedFinalPrice.toFixed(2)}</span>

                    <span className="text-base-content/70">In-Person Pickup Price</span>
                    <span className="text-right font-mono">${result.inPersonPickupPrice.toFixed(2)}</span>
                </div>

                {/* Override toggle */}
                <div className="divider my-2"></div>
                <label className="label cursor-pointer justify-start gap-3">
                    <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={artistPriceOverride}
                        onChange={onToggleOverride}
                    />
                    <span className="label-text font-medium">Override final price manually</span>
                </label>
                {artistPriceOverride && (
                    <div className="form-control mt-2">
                        <label className="label"><span className="label-text">Your Final Price ($)</span></label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="input input-bordered font-mono text-lg"
                            value={overridePrice}
                            onChange={(e) => onOverridePriceChange(e.target.value)}
                        />
                        {overridePrice && parseFloat(overridePrice) < result.asmrp && (
                            <p className="text-warning text-sm mt-1 flex items-center gap-1">
                                <IoWarningOutline /> Below your ASMRP — will require double confirmation on save
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════
// ─── Main CostCalculator Component ──────────────────────────────────
// ═════════════════════════════════════════════════════════════════════
export default function CostCalculator({ listingId, onPriceCalculated, saveMode = "immediate" }) {
    const baseApiUrl = '/api';

    // Cost data state
    const [breakdownId, setBreakdownId] = useState(null);
    const [materialItems, setMaterialItems] = useState([]);
    const [businessItems, setBusinessItems] = useState([]);
    const [consumableItems, setConsumableItems] = useState([]);
    const [laborEntries, setLaborEntries] = useState([]);

    // Packaging & shipping
    const [packagingCost, setPackagingCost] = useState('');
    const [shippingEstimate, setShippingEstimate] = useState('');
    const [inPersonPickupDiscount, setInPersonPickupDiscount] = useState('');
    const [inPersonVendingCost, setInPersonVendingCost] = useState('');

    // Profit controls
    const [profitMode, setProfitMode] = useState('percent'); // 'percent' or 'amount'
    const [profitMinAmount, setProfitMinAmount] = useState('');
    const [profitMaxAmount, setProfitMaxAmount] = useState('');
    const [profitMinPercent, setProfitMinPercent] = useState('');
    const [profitMaxPercent, setProfitMaxPercent] = useState('');

    // Pricing
    const [artistPriceOverride, setArtistPriceOverride] = useState(false);
    const [overridePrice, setOverridePrice] = useState('');
    const [pricingResult, setPricingResult] = useState(null);

    // UI state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [showASMRPModal, setShowASMRPModal] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState(null);

    // ── Build payload from state ─────────────────────────────────────
    const buildPayload = useCallback(() => {
        const allCostItems = [
            ...materialItems.map((i, idx) => ({ ...i, category: 'Materials', amount: parseFloat(i.amount) || 0, displayOrder: idx })),
            ...businessItems.map((i, idx) => ({ ...i, category: 'Business', amount: parseFloat(i.amount) || 0, displayOrder: idx })),
            ...consumableItems.map((i, idx) => ({ ...i, category: 'Consumables', amount: parseFloat(i.amount) || 0, displayOrder: idx })),
        ];

        const allLaborEntries = laborEntries.map((e, idx) => ({
            ...e,
            hourlyRate: parseFloat(e.hourlyRate) || 0,
            hoursWorked: parseFloat(e.hoursWorked) || 0,
            displayOrder: idx,
        }));

        return {
            ...(breakdownId ? { listingCostBreakdownID: breakdownId } : {}),
            listingID: listingId,
            packagingCost: parseFloat(packagingCost) || 0,
            shippingEstimate: parseFloat(shippingEstimate) || 0,
            inPersonPickupDiscount: parseFloat(inPersonPickupDiscount) || 0,
            inPersonVendingCost: parseFloat(inPersonVendingCost) || 0,
            profitMinAmount: profitMode === 'amount' ? (parseFloat(profitMinAmount) || null) : null,
            profitMaxAmount: profitMode === 'amount' ? (parseFloat(profitMaxAmount) || null) : null,
            profitMinPercent: profitMode === 'percent' ? (parseFloat(profitMinPercent) || null) : null,
            profitMaxPercent: profitMode === 'percent' ? (parseFloat(profitMaxPercent) || null) : null,
            asmrp: pricingResult?.asmrp || 0,
            finalPrice: artistPriceOverride ? (parseFloat(overridePrice) || 0) : (pricingResult?.suggestedFinalPrice || 0),
            artistPriceOverride,
            belowASMRPConfirmed: false,
            costLineItems: allCostItems,
            laborEntries: allLaborEntries,
        };
    }, [
        listingId, breakdownId, materialItems, businessItems, consumableItems, laborEntries,
        packagingCost, shippingEstimate, inPersonPickupDiscount, inPersonVendingCost,
        profitMode, profitMinAmount, profitMaxAmount, profitMinPercent, profitMaxPercent,
        artistPriceOverride, overridePrice, pricingResult,
    ]);

    // ── Load existing breakdown ──────────────────────────────────────
    useEffect(() => {
        const fetchBreakdown = async () => {
            if (!listingId) { setLoading(false); return; }
            try {
                const res = await fetch(`${baseApiUrl}/ListingCostBreakdown/by-listing/${listingId}`);
                if (res.ok) {
                    const data = await res.json();
                    setBreakdownId(data.listingCostBreakdownID);
                    setPackagingCost(data.packagingCost?.toString() || '');
                    setShippingEstimate(data.shippingEstimate?.toString() || '');
                    setInPersonPickupDiscount(data.inPersonPickupDiscount?.toString() || '');
                    setInPersonVendingCost(data.inPersonVendingCost?.toString() || '');

                    if (data.profitMinPercent != null || data.profitMaxPercent != null) {
                        setProfitMode('percent');
                        setProfitMinPercent(data.profitMinPercent?.toString() || '');
                        setProfitMaxPercent(data.profitMaxPercent?.toString() || '');
                    } else {
                        setProfitMode('amount');
                        setProfitMinAmount(data.profitMinAmount?.toString() || '');
                        setProfitMaxAmount(data.profitMaxAmount?.toString() || '');
                    }

                    setArtistPriceOverride(data.artistPriceOverride || false);
                    if (data.artistPriceOverride) {
                        setOverridePrice(data.finalPrice?.toString() || '');
                    }

                    const items = data.costLineItems || [];
                    setMaterialItems(items.filter(i => i.category === 'Materials').map(i => ({ ...i, amount: i.amount?.toString() || '' })));
                    setBusinessItems(items.filter(i => i.category === 'Business').map(i => ({ ...i, amount: i.amount?.toString() || '' })));
                    setConsumableItems(items.filter(i => i.category === 'Consumables').map(i => ({ ...i, amount: i.amount?.toString() || '' })));
                    setLaborEntries((data.laborEntries || []).map(e => ({
                        ...e,
                        hourlyRate: e.hourlyRate?.toString() || '',
                        hoursWorked: e.hoursWorked?.toString() || '',
                    })));
                }
                // 404 = no breakdown yet, that's fine
            } catch (err) {
                console.error("Failed to load cost breakdown", err);
            }
            setLoading(false);
        };

        fetchBreakdown();
    }, [listingId]);

    // ── Calculate (preview) ──────────────────────────────────────────
    const handleCalculate = async () => {
        setCalculating(true);
        setError(null);
        try {
            const payload = buildPayload();
            const res = await fetch(`${baseApiUrl}/ListingCostBreakdown/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Calculation failed");
            const result = await res.json();
            setPricingResult(result);
            if (onPriceCalculated) onPriceCalculated(result, payload);
        } catch (err) {
            setError("Failed to calculate pricing. Check your inputs.");
            console.error(err);
        }
        setCalculating(false);
    };

    // ── Save ─────────────────────────────────────────────────────────
    const handleSave = async (belowASMRPConfirmed = false) => {
        setSaving(true);
        setError(null);
        setSaveSuccess(false);

        try {
            const payload = buildPayload();
            payload.belowASMRPConfirmed = belowASMRPConfirmed;

            // Check if override is below ASMRP and not yet confirmed
            if (artistPriceOverride && pricingResult && parseFloat(overridePrice) < pricingResult.asmrp && !belowASMRPConfirmed) {
                setShowASMRPModal(true);
                setSaving(false);
                return;
            }

            const isUpdate = !!breakdownId;
            const url = isUpdate
                ? `${baseApiUrl}/ListingCostBreakdown/${breakdownId}`
                : `${baseApiUrl}/ListingCostBreakdown`;

            const res = await fetch(url, {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                if (errData?.error === 'below_asmrp') {
                    setShowASMRPModal(true);
                    setSaving(false);
                    return;
                }
                throw new Error(errData?.message || "Failed to save");
            }

            if (!isUpdate) {
                const saved = await res.json();
                setBreakdownId(saved.listingCostBreakdownID);
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setError(err.message || "Failed to save cost breakdown.");
            console.error(err);
        }
        setSaving(false);
    };

    const handleASMRPConfirm = () => {
        setShowASMRPModal(false);
        handleSave(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Cost of Materials ── */}
            <CostLineItemsEditor category="Materials" items={materialItems} onChange={setMaterialItems} />

            {/* ── Cost of Doing Business ── */}
            <CostLineItemsEditor category="Business" items={businessItems} onChange={setBusinessItems} />

            {/* ── Consumables ── */}
            <CostLineItemsEditor category="Consumables" items={consumableItems} onChange={setConsumableItems} />

            {/* ── Labor ── */}
            <LaborEditor entries={laborEntries} onChange={setLaborEntries} />

            {/* ── Packaging & Shipping ── */}
            <Section title="Packaging & Shipping" icon={IoCarOutline}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Packaging Cost ($)</span></label>
                        <input
                            type="number" min="0" step="0.01"
                            className="input input-bordered font-mono"
                            placeholder="0.00"
                            value={packagingCost}
                            onChange={(e) => setPackagingCost(e.target.value)}
                        />
                        <label className="label"><span className="label-text-alt text-base-content/50">Materials for packing — even for in-person pickup</span></label>
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Shipping Estimate ($)</span></label>
                        <input
                            type="number" min="0" step="0.01"
                            className="input input-bordered font-mono"
                            placeholder="0.00"
                            value={shippingEstimate}
                            onChange={(e) => setShippingEstimate(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">In-Person Pickup Discount ($)</span></label>
                        <input
                            type="number" min="0" step="0.01"
                            className="input input-bordered font-mono"
                            placeholder="0.00"
                            value={inPersonPickupDiscount}
                            onChange={(e) => setInPersonPickupDiscount(e.target.value)}
                        />
                        <label className="label"><span className="label-text-alt text-base-content/50">Amount refunded when buyer picks up in person</span></label>
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">In-Person Vending Cost ($)</span></label>
                        <input
                            type="number" min="0" step="0.01"
                            className="input input-bordered font-mono"
                            placeholder="0.00"
                            value={inPersonVendingCost}
                            onChange={(e) => setInPersonVendingCost(e.target.value)}
                        />
                        <label className="label"><span className="label-text-alt text-base-content/50">Booth fee, table fee, travel to vending events</span></label>
                    </div>
                </div>
            </Section>

            {/* ── Profit Controls ── */}
            <Section title="Desired Profit Range" icon={IoPencilOutline}>
                <div className="flex gap-4 mb-4">
                    <label className="label cursor-pointer gap-2">
                        <input
                            type="radio"
                            className="radio radio-primary radio-sm"
                            checked={profitMode === 'percent'}
                            onChange={() => setProfitMode('percent')}
                        />
                        <span className="label-text">Percentage (%)</span>
                    </label>
                    <label className="label cursor-pointer gap-2">
                        <input
                            type="radio"
                            className="radio radio-primary radio-sm"
                            checked={profitMode === 'amount'}
                            onChange={() => setProfitMode('amount')}
                        />
                        <span className="label-text">Fixed Amount ($)</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profitMode === 'percent' ? (
                        <>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Minimum Profit (%)</span></label>
                                <input
                                    type="number" min="0" max="999" step="0.5"
                                    className="input input-bordered font-mono"
                                    placeholder="e.g. 20"
                                    value={profitMinPercent}
                                    onChange={(e) => setProfitMinPercent(e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Maximum Profit (%)</span></label>
                                <input
                                    type="number" min="0" max="999" step="0.5"
                                    className="input input-bordered font-mono"
                                    placeholder="e.g. 50"
                                    value={profitMaxPercent}
                                    onChange={(e) => setProfitMaxPercent(e.target.value)}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Minimum Profit ($)</span></label>
                                <input
                                    type="number" min="0" step="0.01"
                                    className="input input-bordered font-mono"
                                    placeholder="0.00"
                                    value={profitMinAmount}
                                    onChange={(e) => setProfitMinAmount(e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Maximum Profit ($)</span></label>
                                <input
                                    type="number" min="0" step="0.01"
                                    className="input input-bordered font-mono"
                                    placeholder="0.00"
                                    value={profitMaxAmount}
                                    onChange={(e) => setProfitMaxAmount(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Section>

            {/* ── Calculate Button ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    className="btn btn-secondary gap-2 flex-1"
                    onClick={handleCalculate}
                    disabled={calculating}
                >
                    {calculating ? <span className="loading loading-spinner loading-sm"></span> : <IoCalculatorOutline />}
                    Calculate Pricing
                </button>
                {saveMode === "immediate" && (
                    <button
                        type="button"
                        className="btn btn-primary gap-2 flex-1"
                        onClick={() => handleSave(false)}
                        disabled={saving || !pricingResult}
                    >
                        {saving ? <span className="loading loading-spinner loading-sm"></span> : <IoCheckmarkCircleOutline />}
                        {breakdownId ? 'Update Cost Breakdown' : 'Save Cost Breakdown'}
                    </button>
                )}
            </div>

            {/* ── Feedback ── */}
            {error && (
                <div className="alert alert-error shadow-sm">
                    <IoWarningOutline className="text-xl" />
                    <span>{error}</span>
                </div>
            )}
            {saveSuccess && (
                <div className="alert alert-success shadow-sm">
                    <IoCheckmarkCircleOutline className="text-xl" />
                    <span>Cost breakdown saved successfully!</span>
                </div>
            )}

            {/* ── Pricing Summary ── */}
            <PricingSummary
                result={pricingResult}
                overridePrice={overridePrice}
                onOverridePriceChange={setOverridePrice}
                artistPriceOverride={artistPriceOverride}
                onToggleOverride={() => setArtistPriceOverride(!artistPriceOverride)}
            />

            {/* ── Below-ASMRP Double Confirmation Modal ── */}
            {showASMRPModal && pricingResult && (
                <BelowASMRPModal
                    asmrp={pricingResult.asmrp}
                    finalPrice={overridePrice}
                    onConfirm={handleASMRPConfirm}
                    onCancel={() => setShowASMRPModal(false)}
                />
            )}
        </div>
    );
}
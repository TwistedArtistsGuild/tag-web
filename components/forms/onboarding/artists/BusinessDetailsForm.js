import Link from "next/link";

const businessEntityOptions = [
  { value: "", label: "Select business entity" },
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" },
];

const incorporationOptions = [
  { value: "", label: "Select incorporation status" },
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export default function BusinessDetailsForm({
  city,
  stateOrProvince,
  zipCode,
  country,
  businessEntityType,
  incorporationStatus,
  incorporatedYear,
  isSaving,
  error,
  onCityChange,
  onStateChange,
  onZipChange,
  onCountryChange,
  onEntityTypeChange,
  onIncorporationStatusChange,
  onIncorporatedYearChange,
  onSave,
  backHref,
}) {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Business Details</h2>
          <p className="text-sm text-base-content/70">Complete your business information.</p>
        </div>

        <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-4">
          <label className="form-control w-full">
            <div className="label flex-col items-start gap-0.5">
              <span className="label-text font-semibold">Formally Incorporated?</span>
              <span className="label-text-alt text-base-content/60">Formally incorporated companies are given priority access to premium and exact-match slugs.</span>
            </div>
            <select
              className="select select-bordered w-full"
              value={incorporationStatus}
              onChange={(event) => onIncorporationStatusChange(event.target.value)}
            >
              {incorporationOptions.map((option) => (
                <option key={option.value || "empty"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">City</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={city}
                onChange={(event) => onCityChange(event.target.value)}
                placeholder="City"
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">State or Region</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={stateOrProvince}
                onChange={(event) => onStateChange(event.target.value)}
                placeholder="State or Region"
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Zip / Postal Code</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={zipCode}
                onChange={(event) => onZipChange(event.target.value)}
                placeholder="Zip / Postal Code"
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Country</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={country}
                onChange={(event) => onCountryChange(event.target.value)}
                placeholder="Country"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Business Entity Type</span>
              </div>
              <select
                className="select select-bordered w-full"
                value={businessEntityType}
                onChange={(event) => onEntityTypeChange(event.target.value)}
              >
                {businessEntityOptions.map((option) => (
                  <option key={option.value || "empty"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {incorporationStatus === "true" && (
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Year Incorporated</span>
                </div>
                <input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  step="1"
                  className="input input-bordered w-full"
                  placeholder={`e.g. ${new Date().getFullYear() - 5}`}
                  value={incorporatedYear}
                  onChange={(event) => onIncorporatedYearChange(event.target.value)}
                />
                <div className="label">
                  <span className="label-text-alt">Optional — four-digit year your entity was formally incorporated.</span>
                </div>
              </label>
            )}
          </div>
        </div>

        {error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : null}

        <div className="mt-4 flex gap-2 justify-between flex-wrap">
          <Link href={backHref} className="btn btn-sm btn-outline">Back</Link>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={isSaving}
            onClick={onSave}
          >
            {isSaving ? "Saving..." : "Continue to Business Contacts"}
          </button>
        </div>
      </div>
    </div>
  );
}

function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  const source = String(value).trim();
  if (!source) {
    return "";
  }

  if (source.includes("T")) {
    return source.slice(0, 10);
  }

  return source;
}

export default function UserCoreFields({ formState, onChange }) {
  const setField = (key, value) => {
    onChange({
      ...formState,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-box border border-primary/30 bg-primary/5 p-4">
        <div className="text-sm font-semibold text-primary">Hi User!</div>
        <div className="mt-1 text-sm text-base-content/80">
          Here is your reserved username and registered email. Those are locked at this point in the flow.
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Public Username / Slug</div>
            <div className="mt-1 font-mono text-sm">{formState.username || "Not reserved yet"}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Registered Email</div>
            <div className="mt-1 text-sm">{formState.emailOne || "No email on file"}</div>
          </div>
        </div>
      </div>

      <div className="rounded-box border border-base-300 bg-base-100 p-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Personal Profile</h3>
          <p className="mt-1 text-sm text-base-content/70">Preferred Name and username are the way we will call you in public.</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Preferred Name</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formState.preferredName || ""}
              onChange={(event) => setField("preferredName", event.target.value)}
              placeholder="Public display name"
            />
            <div className="label">
              <span className="label-text-alt">This and your username are the public-facing names for your account.</span>
            </div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Secondary Email</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full"
              value={formState.emailTwo || ""}
              onChange={(event) => setField("emailTwo", event.target.value)}
              placeholder="optional@example.com"
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Given First Name</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formState.firstName || ""}
              onChange={(event) => setField("firstName", event.target.value)}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Given Last Name</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formState.famName || ""}
              onChange={(event) => setField("famName", event.target.value)}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Nationality</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formState.nationality || ""}
              onChange={(event) => setField("nationality", event.target.value)}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Gender</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formState.gender || ""}
              onChange={(event) => setField("gender", event.target.value)}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Birth Date</span>
            </div>
            <input
              type="date"
              className="input input-bordered w-full"
              value={toDateInputValue(formState.birthDate)}
              onChange={(event) => setField("birthDate", event.target.value || null)}
            />
          </label>
        </div>
      </div>

      <div className="rounded-box border border-base-300 bg-base-100 p-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Professional Details</h3>
          <p className="mt-1 text-sm text-base-content/70">Keep company details separate from your personal identity fields.</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Company Name</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formState.companyName || ""}
              onChange={(event) => setField("companyName", event.target.value)}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Title</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formState.companyTitle || ""}
              onChange={(event) => setField("companyTitle", event.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

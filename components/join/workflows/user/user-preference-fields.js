export default function UserPreferenceFields({ preference, onChange }) {
  const setField = (key, value) => {
    onChange({
      ...preference,
      [key]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Metric or Imperial</span>
        </div>
        <select
          className="select select-bordered w-full"
          value={preference.metricOrImperial || "Metric"}
          onChange={(event) => setField("metricOrImperial", event.target.value)}
        >
          <option value="Metric">Metric</option>
          <option value="Imperial">Imperial</option>
        </select>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Theme Preference</span>
        </div>
        <select
          className="select select-bordered w-full"
          value={preference.themePreference || "Light"}
          onChange={(event) => setField("themePreference", event.target.value)}
        >
          <option value="Light">Light</option>
          <option value="Dark">Dark</option>
          <option value="System">System</option>
        </select>
      </label>
    </div>
  );
}

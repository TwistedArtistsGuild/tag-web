function booleanSelectValue(value) {
  return value ? "true" : "false";
}

function parseBooleanSelect(value) {
  return String(value || "").toLowerCase() === "true";
}

export default function UserPrivacyFields({ privacy, onChange }) {
  const setField = (key, value) => {
    onChange({
      ...privacy,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Hide Profile From Public</span>
          </div>
          <select
            className="select select-bordered w-full"
            value={booleanSelectValue(privacy.hideProfileFromPublic)}
            onChange={(event) => setField("hideProfileFromPublic", parseBooleanSelect(event.target.value))}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Hiding From Abuser</span>
          </div>
          <select
            className="select select-bordered w-full"
            value={booleanSelectValue(privacy.hidingFromAbuser)}
            onChange={(event) => setField("hidingFromAbuser", parseBooleanSelect(event.target.value))}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>
      </div>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Hiding From Name and Description</span>
        </div>
        <input
          type="text"
          className="input input-bordered w-full"
          value={privacy.hidingFrom_NameAndDescription || ""}
          onChange={(event) => setField("hidingFrom_NameAndDescription", event.target.value)}
          maxLength={50}
        />
      </label>
    </div>
  );
}

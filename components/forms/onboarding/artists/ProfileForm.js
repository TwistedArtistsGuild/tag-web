import Link from "next/link";
import TTTitleLine from "@/components/tiptap/TT_TitleLine";
import TTArticle from "@/components/tiptap/TT_Article";

export default function ProfileForm({
  profileTitle,
  profileByline,
  profileBiography,
  profileStatement,
  profileSeoTags,
  isSaving,
  error,
  onTitleChange,
  onBylineChange,
  onBiographyChange,
  onStatementChange,
  onSeoTagsChange,
  onSave,
  backHref = "/join/artist",
}) {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Profile Details</h2>
          <p className="text-sm text-base-content/70">Complete your artist profile information.</p>
        </div>

        <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-4">
          <h3 className="font-semibold text-base-content">Profile Details</h3>

          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Title (H1)</span>
            </div>
            <TTTitleLine
              value={profileTitle}
              onChange={onTitleChange}
              headingLevel={1}
              placeholder="Artist or group title"
            />
          </div>

          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Byline (H2)</span>
            </div>
            <TTTitleLine
              value={profileByline}
              onChange={onBylineChange}
              headingLevel={2}
              placeholder="Short byline"
            />
          </div>

          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Biography</span>
            </div>
            <TTArticle
              value={profileBiography}
              onChange={onBiographyChange}
              actionPreset="none"
              minHeight={220}
            />
          </div>

          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Statement</span>
            </div>
            <TTArticle
              value={profileStatement}
              onChange={onStatementChange}
              actionPreset="none"
              minHeight={240}
            />
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">SEO Tags</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={profileSeoTags}
              onChange={(event) => onSeoTagsChange(event.target.value)}
              placeholder="abstract art, mixed media, surrealism"
            />
            <div className="label">
              <span className="label-text-alt">Use commas to separate tags.</span>
            </div>
          </label>
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
            {isSaving ? "Saving..." : "Continue to Business Details"}
          </button>
        </div>
      </div>
    </div>
  );
}

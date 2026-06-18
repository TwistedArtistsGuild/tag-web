import Link from "next/link";

export default function ReviewAndPublishForm({
  profileTitle,
  artistSlug,
  businessAddressContacts,
  businessPhoneContacts,
  businessEmailContacts,
  publicAddressContacts,
  publicEmailContacts,
  publicPhoneContacts,
  publicSocialContacts,
  publicUrlContacts,
  postSlugPercentComplete,
  isPublishing,
  publishFeedback,
  isPublished,
  onPublish,
  backHref,
  extractPlainText,
}) {
  const totalPublicContacts = publicAddressContacts.length + publicEmailContacts.length + publicPhoneContacts.length + publicSocialContacts.length + publicUrlContacts.length;

  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Review &amp; Publish</h2>
          <p className="text-sm text-base-content/70">Review your setup and publish when ready. Publishing removes this registration from your join-in-progress list and makes your profile visible on the site.</p>
        </div>

        <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-2 text-sm">
          <div><span className="font-semibold">Title:</span> {extractPlainText(profileTitle) || "Missing"}</div>
          <div><span className="font-semibold">Slug:</span> {artistSlug || "Missing"}</div>
          <div><span className="font-semibold">Business address on file:</span> {businessAddressContacts.length > 0 ? "Yes ✓" : "No"}</div>
          <div><span className="font-semibold">Business phone on file:</span> {businessPhoneContacts.length > 0 ? "Yes ✓" : "No"}</div>
          <div><span className="font-semibold">Business email on file:</span> {businessEmailContacts.length > 0 ? "Yes ✓" : "No"}</div>
          <div><span className="font-semibold">Public contact count:</span> {totalPublicContacts}</div>
          <div><span className="font-semibold">Workflow progress:</span> {postSlugPercentComplete}%</div>
        </div>

        {publishFeedback ? (
          <div className="alert alert-error">
            <span>{publishFeedback}</span>
          </div>
        ) : null}

        <div className="flex gap-2 justify-between flex-wrap pt-2">
          <Link href={backHref} className="btn btn-sm btn-outline">Back to Public Contacts</Link>
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={onPublish}
            disabled={isPublishing || isPublished}
          >
            {isPublishing ? "Publishing..." : isPublished ? "Published" : "Publish Artist Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

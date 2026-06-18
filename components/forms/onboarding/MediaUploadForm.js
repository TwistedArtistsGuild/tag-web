import Link from "next/link";
import Image from "next/image";
import GalleryManager from "@/components/gallery/GalleryManager";

export default function MediaUploadForm({
  artistID,
  artistLabel,
  sessionUser,
  activeProfileFile,
  activeCoverFile,
  galleryPrefix,
  profilePrefix,
  coverPrefix,
  mediaFeedback,
  isSaving,
  onSaveMediaSelection,
  onContinue,
  backHref,
}) {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Profile Media Editor</h2>
          <p className="text-sm text-base-content/70">Manage media in standardized folders. Anything in the folder root is active; anything moved into a timestamped subfolder is archived.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-3">
            <h3 className="font-semibold text-base-content">Active Profile Photo</h3>
            {activeProfileFile ? (
              <>
                <div className="relative h-48 rounded-box overflow-hidden bg-base-100 border border-base-300">
                  <Image src={activeProfileFile.url} alt="Active profile" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="text-xs text-base-content/70">Current root file: {activeProfileFile.name}</div>
              </>
            ) : (
              <div className="text-sm text-base-content/60">No active profile photo found in the profile folder root.</div>
            )}
          </div>

          <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-3">
            <h3 className="font-semibold text-base-content">Active Cover Photo</h3>
            {activeCoverFile ? (
              <>
                <div className="relative h-48 rounded-box overflow-hidden bg-base-100 border border-base-300">
                  <Image src={activeCoverFile.url} alt="Active cover" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="text-xs text-base-content/70">Current root file: {activeCoverFile.name}</div>
              </>
            ) : (
              <div className="text-sm text-base-content/60">No active cover photo found in the cover folder root.</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <GalleryManager
            entityType="artist"
            entityId={artistID}
            entityLabel={artistLabel}
            currentUser={sessionUser}
            folderKind="profile"
            title="Profile Photo Manager"
            allowVideo={false}
            basePrefix={profilePrefix}
          />

          <GalleryManager
            entityType="artist"
            entityId={artistID}
            entityLabel={artistLabel}
            currentUser={sessionUser}
            folderKind="cover"
            title="Cover Photo Manager"
            allowVideo={false}
            basePrefix={coverPrefix}
          />
        </div>

        <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
          <h3 className="font-semibold text-base-content mb-2">Gallery Media Tools</h3>
          <p className="text-sm text-base-content/70 mb-3">Root files in the gallery folder are active gallery entries. Archive older gallery media with the archive button.</p>
          <GalleryManager
            entityType="artist"
            entityId={artistID}
            entityLabel={artistLabel}
            currentUser={sessionUser}
            folderKind="gallery"
            title="Gallery Media Manager"
            basePrefix={galleryPrefix}
          />
        </div>

        {mediaFeedback.message && (
          <div className={`alert ${mediaFeedback.type === "error" ? "alert-error" : "alert-success"}`}>
            <span>{mediaFeedback.message}</span>
          </div>
        )}

        <div className="flex gap-2 justify-between flex-wrap">
          <Link href={backHref} className="btn btn-sm btn-outline">Back to Business Contact Info</Link>
          <div className="flex gap-2">
            <button type="button" className="btn btn-sm btn-primary" onClick={onSaveMediaSelection} disabled={isSaving}>
              {isSaving ? "Saving..." : "Sync Active Profile + Cover"}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={onContinue}
            >
              Continue to Public Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

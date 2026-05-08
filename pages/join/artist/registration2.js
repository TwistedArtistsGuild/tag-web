import Link from "next/link"

import TagSEO from "@/components/TagSEO"

const ARTIST_FIELDS = [
  "ArtistID",
  "Applied",
  "Biography",
  "Byline",
  "Path",
  "SEOTags",
  "Since",
  "Statement",
  "Title",
  "CoverPicID",
  "ProfilePicID",
]

const CATEGORY_LINK_FIELDS = [
  "Linker_ArtistToCategoryID",
  "ArtistID",
  "ArtistCategoryID",
  "Genre",
  "ExpertiseLevel",
  "IsProfessional",
]

const PICTURE_FIELDS = [
  "PictureID",
  "AltText",
  "ArtistID",
  "Context",
  "Created",
  "Description",
  "EmbedURL",
  "Height",
  "Path",
  "ThumbnailHeight",
  "ThumbnailURL",
  "ThumbnailWidth",
  "Title",
  "URL",
  "UserID",
  "Width",
]

export function Registration2Notes() {
  return (
    <div className="space-y-6">
      <div className="alert alert-warning shadow-sm">
        <div>
          <div className="font-semibold">Planning Page Only</div>
          <div className="text-sm opacity-80">
            This page is notes-only for now. It documents the second registration step and does not render a dynaform yet.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-4 gap-2">
            <h3 className="font-semibold text-base-content">New Requirements For Registration 2</h3>
            <ul className="list-disc pl-5 text-sm text-base-content/75 space-y-1">
              <li>Business entity type selector for sole proprietor, LLC, partnership, nonprofit, or other entity structure.</li>
              <li>Category selector backed by the artist category hierarchy so artists can choose their primary lane.</li>
              <li>Genre capture during onboarding. The database already has a Genre field on the artist-to-category linker, but the API flow still needs to add and persist it during registration.</li>
              <li>Profile picture uploader that stores a picture record first, then assigns the resulting PictureID back to the artist ProfilePicID field.</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-4 gap-2">
            <h3 className="font-semibold text-base-content">Implementation Notes</h3>
            <ul className="list-disc pl-5 text-sm text-base-content/75 space-y-1">
              <li>Registration 1 currently handles the base artist form. Registration 2 should extend the workflow instead of duplicating the first page.</li>
              <li>Category and genre likely need a combined API contract so the Artist record and LinkerArtistToCategory row are created together.</li>
              <li>Picture upload should likely happen before final submit so preview and assignment can be confirmed.</li>
              <li>Existing artist variables below should be reviewed before building the second form contract.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body gap-3">
          <h3 className="text-lg font-semibold text-base-content">Existing Artist Table Variables</h3>
          <div className="flex gap-2 flex-wrap">
            {ARTIST_FIELDS.map((field) => (
              <span key={field} className="badge badge-outline">{field}</span>
            ))}
          </div>
          <p className="text-sm text-base-content/65">
            These are the fields already present on the core Artist table and should be accounted for when defining a fuller registration workflow.
          </p>
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body gap-3">
          <h3 className="text-lg font-semibold text-base-content">Existing Category Link Variables</h3>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_LINK_FIELDS.map((field) => (
              <span key={field} className="badge badge-outline">{field}</span>
            ))}
          </div>
          <p className="text-sm text-base-content/65">
            Genre already exists here rather than on the core Artist table, which is why registration 2 needs API-side support for category-link creation.
          </p>
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body gap-3">
          <h3 className="text-lg font-semibold text-base-content">Picture Uploader Data Considerations</h3>
          <div className="flex gap-2 flex-wrap">
            {PICTURE_FIELDS.map((field) => (
              <span key={field} className="badge badge-outline">{field}</span>
            ))}
          </div>
          <p className="text-sm text-base-content/65">
            Profile image upload should create or reuse a Picture row, then write its id back to ProfilePicID on the Artist record. The same pattern can later support CoverPicID.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Registration2Page() {
  const pageMetaData = {
    title: "Artist Registration 2",
    description: "Planning notes for the second artist registration step.",
    keywords: "artist, registration, onboarding, notes",
    robots: "noindex, nofollow",
    og: {
      title: "Artist Registration 2",
      description: "Planning notes for the second artist registration step.",
    },
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="join/artist/registration2" />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-base-content">Artist Registration 2</h1>
              <Link href="/join/artist" className="btn btn-sm btn-ghost">Back to Artist Join</Link>
            </div>
            <p className="text-base-content/70">
              Notes-only planning page for the next registration step. This is intentionally not a dynaform yet.
            </p>
          </div>
        </div>

        <Registration2Notes />
      </div>
    </div>
  )
}

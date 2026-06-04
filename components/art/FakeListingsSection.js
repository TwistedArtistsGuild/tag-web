/* Delete MEEEE: temporary fake listings showcase component for visual testing only. */

import ListingCard from "@/components/cards/card_listing"
import { getPanelClass } from "@/components/cards/sizes/panel-layout"

export default function FakeListingsSection({ fakeListings }) {
  return (
    <div className="mt-24 mb-20 md:flex md:items-stretch md:gap-6">
      <div className="hidden md:block w-px bg-base-300/70" aria-hidden="true" />
      <div className="flex-1">
        <h3 className="text-3xl font-bold mb-8 text-center">Coming Soon: Bloomscrolling (example artist links may be broken)</h3>
        <p className="mb-12 text-xl text-center max-w-4xl mx-auto">Imagine endlessly viewing listings from our artistic community, with no advertisements!.</p>
        <div className="grid grid-cols-1 items-start md:grid-cols-6 lg:grid-cols-12 gap-6">
          {(fakeListings || []).map((listing, index) => (
            <div
              key={listing.path || listing.listingid || `${listing.title || "fake-listing"}-${index}`}
              className={`${getPanelClass(listing.panelSize)} self-start`}
            >
              <ListingCard
                listing={listing}
                panelSize={listing.panelSize}
                artistCardMode={listing.artistCardMode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

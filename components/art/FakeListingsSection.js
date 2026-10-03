/* Delete MEEEE: temporary fake listings showcase component for visual testing only. */

import ListingCard from "@/components/cards/card_listing"
import { getPanelClass } from "@/components/cards/sizes/panel-layout"

export default function FakeListingsSection({ fakeListings }) {
  return (
    <div className="mt-8 mb-20">
      <p className="text-xs text-base-content/40 mb-6 text-center tracking-wide uppercase">Fake listings</p>
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
  )
}

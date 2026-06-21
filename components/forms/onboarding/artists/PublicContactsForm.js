import Link from "next/link";
import AddressForm from "@/components/forms/contact/address-form";
import PhoneForm from "@/components/forms/contact/phone-form";
import EmailForm from "@/components/forms/contact/email-form";
import SocialHandlesForm from "@/components/forms/contact/social-handles-form";
import UrlLinksForm from "@/components/forms/contact/url-links-form";
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext";

const PUBLIC_CONTACT_TABS = [
  { key: "public-address", label: "Public Address" },
  { key: "public-email", label: "Public Email" },
  { key: "public-phone", label: "Public Phone" },
  { key: "public-social", label: "Public Social" },
  { key: "public-urls", label: "Public URLs" },
];

export default function PublicContactsForm({
  artistID,
  contactsTab,
  onTabChange,
  publicAddressContacts,
  publicEmailContacts,
  publicPhoneContacts,
  publicSocialContacts,
  publicUrlContacts,
  loading,
  onRefresh,
  onContinue,
  backHref,
  backLabel = "Back to Profile Media Editor",
}) {
  return (
    <SocialRealtimeProvider>
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body gap-4">
          <div>
            <h2 className="card-title">Public Contacts</h2>
            <p className="text-sm text-base-content/70">These contacts will be visible on your public artist profile. ⚠️ Do NOT publish personal phone numbers or home studio addresses unless you welcome drop-in business. Use city/state only for sensitive locations, or add those details in Business Contact Info instead.</p>
          </div>

          <div className="alert alert-warning text-sm">
            <span>Active bug: business and public contact save is currently unstable. Engineering is actively fixing this.</span>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <span className="loading loading-spinner loading-sm" />
              Loading existing contacts...
            </div>
          ) : (
            <>
              <div role="tablist" className="tabs tabs-bordered">
                {PUBLIC_CONTACT_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    role="tab"
                    type="button"
                    className={`tab${contactsTab === tab.key ? " tab-active" : ""}`}
                    onClick={() => onTabChange(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {contactsTab === "public-address" && (
                <AddressForm
                  artistID={artistID}
                  existingContacts={publicAddressContacts}
                  defaultScope="secondary"
                  availableScopes={["secondary"]}
                  defaultLabel="office"
                  requireCityStateCountry
                  onSaved={onRefresh}
                />
              )}
              {contactsTab === "public-email" && (
                <EmailForm
                  context="artist"
                  entityID={artistID}
                  existingContacts={publicEmailContacts}
                  defaultScope="secondary"
                  availableScopes={["secondary"]}
                  onSaved={onRefresh}
                />
              )}
              {contactsTab === "public-phone" && (
                <PhoneForm
                  artistID={artistID}
                  existingContacts={publicPhoneContacts}
                  defaultScope="secondary"
                  availableScopes={["secondary"]}
                  onSaved={onRefresh}
                />
              )}
              {contactsTab === "public-social" && (
                <SocialHandlesForm
                  artistID={artistID}
                  existingContacts={publicSocialContacts}
                  defaultScope="secondary"
                  availableScopes={["secondary"]}
                  onSaved={onRefresh}
                />
              )}
              {contactsTab === "public-urls" && (
                <UrlLinksForm
                  artistID={artistID}
                  existingContacts={publicUrlContacts}
                  defaultScope="secondary"
                  availableScopes={["secondary"]}
                  onSaved={onRefresh}
                />
              )}
            </>
          )}

          <div className="flex gap-2 justify-between flex-wrap pt-2">
            <Link href={backHref} className="btn btn-sm btn-outline">{backLabel}</Link>
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={onContinue}
            >
              Continue to Review
            </button>
          </div>
        </div>
      </div>
    </SocialRealtimeProvider>
  );
}

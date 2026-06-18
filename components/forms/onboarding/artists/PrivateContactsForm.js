import Link from "next/link";
import { useEffect, useRef } from "react";
import AddressForm from "@/components/forms/contact/address-form";
import PhoneForm from "@/components/forms/contact/phone-form";
import EmailForm from "@/components/forms/contact/email-form";
import UrlLinksForm from "@/components/forms/contact/url-links-form";
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext";

const primaryScopeLabels = {
  private: "Guild Only",
  primary: "Public Primary",
};

export default function PrivateContactsForm({
  artistID,
  businessAddressContacts,
  businessPhoneContacts,
  businessEmailContacts,
  businessUrlContacts,
  loading,
  error,
  onRefresh,
  onContinue,
  backHref,
}) {
  const errorRef = useRef(null);

  useEffect(() => {
    if (!error || !errorRef.current) {
      return;
    }

    errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    errorRef.current.focus();
  }, [error]);

  return (
    <SocialRealtimeProvider>
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body gap-4">
          <div>
            <h2 className="card-title">Primary Contact Form <span className="badge badge-sm badge-info">Guild Operations</span></h2>
            <p className="text-sm text-base-content/70">
              This form defines how the guild should primarily contact you for operations and account support.
              Choose <strong>Guild Only</strong> to keep a contact internal, or <strong>Public Primary</strong> to make it visible on your public contact forms.
              If we cannot reach you through the primary contacts here, we may fall back to additional public contact entries.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <span className="loading loading-spinner loading-sm" />
              Loading existing contacts...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                <h3 className="font-semibold text-base-content mb-1">Primary Address</h3>
                <p className="text-xs text-base-content/60 mb-4">Required fields are clearly marked: city, state/region, and country. Use Public Primary only if this address should appear on your public contact profile.</p>
                <AddressForm
                  artistID={artistID}
                  existingContacts={businessAddressContacts}
                  defaultScope="private"
                  availableScopes={["private", "primary"]}
                  scopeLabelMap={primaryScopeLabels}
                  singleEntryOnly
                  hideDeleteAction
                  requireCityStateCountry
                  defaultLabel="work"
                  onSaved={onRefresh}
                />
              </div>

              <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                <h3 className="font-semibold text-base-content mb-1">Primary Phone</h3>
                <p className="text-xs text-base-content/60 mb-4">Optional, but strongly recommended for fast guild response. Public Primary will display this number on your public contact forms.</p>
                <PhoneForm
                  artistID={artistID}
                  existingContacts={businessPhoneContacts}
                  defaultScope="private"
                  availableScopes={["private", "primary"]}
                  scopeLabelMap={primaryScopeLabels}
                  singleEntryOnly
                  hideDeleteAction
                  onSaved={onRefresh}
                />
              </div>

              <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                <h3 className="font-semibold text-base-content mb-1">Primary Email</h3>
                <p className="text-sm text-base-content/70 mb-4">Optional, but recommended for official guild communication. Public Primary makes this email visible on your public contact forms.</p>
                <EmailForm
                  context="artist"
                  entityID={artistID}
                  existingContacts={businessEmailContacts}
                  onSaved={onRefresh}
                  defaultScope="private"
                  availableScopes={["private", "primary"]}
                  scopeLabelMap={primaryScopeLabels}
                  singleEntryOnly
                  hideDeleteAction
                />
              </div>

              <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                <h3 className="font-semibold text-base-content mb-1">Primary Website</h3>
                <p className="text-xs text-base-content/60 mb-1">Optional</p>
                <p className="text-sm text-base-content/70 mb-4">Use this for your main website. Public Primary will show this URL on your public contact forms.</p>
                <UrlLinksForm
                  artistID={artistID}
                  existingContacts={businessUrlContacts}
                  onSaved={onRefresh}
                  defaultScope="private"
                  availableScopes={["private", "primary"]}
                  scopeLabelMap={primaryScopeLabels}
                  singleEntryOnly
                  hideDeleteAction
                />
              </div>
            </div>
          )}

          {error ? (
            <div ref={errorRef} tabIndex={-1} className="alert alert-error outline-none">
              <span>{error}</span>
            </div>
          ) : null}

          <div className="flex gap-2 justify-between flex-wrap pt-2">
            <Link href={backHref} className="btn btn-sm btn-outline">Back to Profile</Link>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onContinue}
            >
              Continue to Profile Media
            </button>
          </div>
        </div>
      </div>
    </SocialRealtimeProvider>
  );
}

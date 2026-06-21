import AddressForm from "@/components/forms/contact/address-form"
import EmailForm from "@/components/forms/contact/email-form"
import PhoneForm from "@/components/forms/contact/phone-form"
import SocialHandlesForm from "@/components/forms/contact/social-handles-form"
import UrlLinksForm from "@/components/forms/contact/url-links-form"
import OnboardingStepActions from "@/components/forms/onboarding/common/OnboardingStepActions"
import OnboardingStepCard from "@/components/forms/onboarding/common/OnboardingStepCard"

const PUBLIC_CONTACT_TABS = [
  { key: "public-address", label: "Public Address" },
  { key: "public-email", label: "Public Email" },
  { key: "public-phone", label: "Public Phone" },
  { key: "public-social", label: "Public Social" },
  { key: "public-urls", label: "Public URLs" },
]

export default function OrganizationPublicContactsStep({
  context,
  entityId,
  loadingContacts,
  contactsTab,
  setContactsTab,
  publicAddressContacts,
  publicEmailContacts,
  publicPhoneContacts,
  publicSocialContacts,
  publicUrlContacts,
  refreshContacts,
  backHref,
  continueHref,
}) {
  return (
    <OnboardingStepCard
      title="Step 6: Public Contacts"
      description="These contacts are public-facing. Keep private operations details in Step 4."
    >
      <div className="alert alert-warning text-sm">
        <span>Active bug: business and public contact save is currently unstable. Engineering is actively fixing this.</span>
      </div>

      {loadingContacts ? (
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
                onClick={() => setContactsTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {contactsTab === "public-address" ? (
            <AddressForm
              context={context}
              entityID={entityId}
              existingContacts={publicAddressContacts}
              defaultScope="secondary"
              availableScopes={["secondary"]}
              defaultLabel="office"
              requireCityStateCountry
              onSaved={refreshContacts}
            />
          ) : null}

          {contactsTab === "public-email" ? (
            <EmailForm
              context={context}
              entityID={entityId}
              existingContacts={publicEmailContacts}
              defaultScope="secondary"
              availableScopes={["secondary"]}
              onSaved={refreshContacts}
            />
          ) : null}

          {contactsTab === "public-phone" ? (
            <PhoneForm
              context={context}
              entityID={entityId}
              existingContacts={publicPhoneContacts}
              defaultScope="secondary"
              availableScopes={["secondary"]}
              onSaved={refreshContacts}
            />
          ) : null}

          {contactsTab === "public-social" ? (
            <SocialHandlesForm
              context={context}
              entityID={entityId}
              existingContacts={publicSocialContacts}
              defaultScope="secondary"
              availableScopes={["secondary"]}
              onSaved={refreshContacts}
            />
          ) : null}

          {contactsTab === "public-urls" ? (
            <UrlLinksForm
              context={context}
              entityID={entityId}
              existingContacts={publicUrlContacts}
              defaultScope="secondary"
              availableScopes={["secondary"]}
              onSaved={refreshContacts}
            />
          ) : null}
        </>
      )}

      <OnboardingStepActions
        backHref={backHref}
        backLabel="Back to Media"
        continueLabel="Continue to Review"
        onContinue={() => {
          window.location.href = continueHref
        }}
      />
    </OnboardingStepCard>
  )
}

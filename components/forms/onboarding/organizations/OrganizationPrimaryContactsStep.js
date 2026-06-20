import AddressForm from "@/components/forms/contact/address-form"
import EmailForm from "@/components/forms/contact/email-form"
import PhoneForm from "@/components/forms/contact/phone-form"
import UrlLinksForm from "@/components/forms/contact/url-links-form"
import ContactSectionBlock from "@/components/forms/onboarding/common/ContactSectionBlock"
import OnboardingStepActions from "@/components/forms/onboarding/common/OnboardingStepActions"
import OnboardingStepCard from "@/components/forms/onboarding/common/OnboardingStepCard"

export default function OrganizationPrimaryContactsStep({
  context,
  entityId,
  loadingContacts,
  addressContacts,
  emailContacts,
  phoneContacts,
  urlContacts,
  refreshContacts,
  hasRequiredContactTypes,
  contactError,
  setContactError,
  backHref,
  backLabel,
  continueHref,
}) {
  return (
    <OnboardingStepCard
      title="Step 4: Primary Business Contact Info"
      description="Enter your business contact details for guild records and operations. Use the scope selector on any entry to mark it as Private or Primary."
    >
      <div className="badge badge-sm badge-info w-fit">Guild Only</div>

      {loadingContacts ? (
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          <span className="loading loading-spinner loading-sm" />
          Loading existing contacts...
        </div>
      ) : null}

      <div className="space-y-6">
        <ContactSectionBlock title="Business Address">
          <AddressForm
            context={context}
            entityID={entityId}
            existingContacts={addressContacts}
            defaultScope="private"
            availableScopes={["private", "primary"]}
            requireFullAddressFields
            defaultLabel="work"
            onSaved={refreshContacts}
          />
        </ContactSectionBlock>

        <ContactSectionBlock title="Business Email">
          <EmailForm
            context={context}
            entityID={entityId}
            existingContacts={emailContacts}
            defaultScope="private"
            availableScopes={["private", "primary"]}
            onSaved={refreshContacts}
          />
        </ContactSectionBlock>

        <ContactSectionBlock title="Business Phone">
          <PhoneForm
            context={context}
            entityID={entityId}
            existingContacts={phoneContacts}
            defaultScope="private"
            availableScopes={["private", "primary"]}
            requirePrimaryPhone
            onSaved={refreshContacts}
          />
        </ContactSectionBlock>

        <ContactSectionBlock title="Business Website URLs">
          <UrlLinksForm
            context={context}
            entityID={entityId}
            existingContacts={urlContacts}
            defaultScope="private"
            availableScopes={["private", "primary"]}
            onSaved={refreshContacts}
          />
        </ContactSectionBlock>
      </div>

      {contactError ? (
        <div className="alert alert-error"><span>{contactError}</span></div>
      ) : null}

      <OnboardingStepActions
        backHref={backHref}
        backLabel={backLabel}
        continueLabel="Continue to Media and Gallery"
        onContinue={() => {
          if (!hasRequiredContactTypes) {
            setContactError("Save at least one primary address, email, and phone before continuing.")
            return
          }

          setContactError("")
          window.location.href = continueHref
        }}
      />
    </OnboardingStepCard>
  )
}

import AddressForm from "@/components/forms/contact/address-form"
import EmailForm from "@/components/forms/contact/email-form"
import PhoneForm from "@/components/forms/contact/phone-form"
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
  refreshContacts,
  contactError,
  setContactError,
  backHref,
  backLabel,
  continueHref,
  continueLabel = "Continue to Public Contacts",
}) {
  return (
    <OnboardingStepCard
      title="Primary Business Contact Info"
      description="Enter business contact details for guild records and operations."
    >
      <div className="badge badge-sm badge-info w-fit">Guild Only</div>
      <div className="alert alert-warning text-sm">
        <span>Active bug: business and public contact save is currently unstable. Engineering is actively fixing this.</span>
      </div>

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
            availableScopes={["private"]}
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
            availableScopes={["private"]}
            onSaved={refreshContacts}
          />
        </ContactSectionBlock>

        <ContactSectionBlock title="Business Phone">
          <PhoneForm
            context={context}
            entityID={entityId}
            existingContacts={phoneContacts}
            defaultScope="private"
            availableScopes={["private"]}
            requirePrimaryPhone
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
        continueLabel={continueLabel}
        onContinue={() => {
          setContactError("")
          window.location.href = continueHref
        }}
      />
    </OnboardingStepCard>
  )
}

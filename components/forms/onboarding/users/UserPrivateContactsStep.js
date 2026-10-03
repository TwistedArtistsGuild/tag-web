import AddressForm from "@/components/forms/contact/address-form"
import EmailForm from "@/components/forms/contact/email-form"
import PhoneForm from "@/components/forms/contact/phone-form"
import SocialHandlesForm from "@/components/forms/contact/social-handles-form"
import UrlLinksForm from "@/components/forms/contact/url-links-form"
import ContactSectionBlock from "@/components/forms/onboarding/common/ContactSectionBlock"
import OnboardingStepActions from "@/components/forms/onboarding/common/OnboardingStepActions"
import OnboardingStepCard from "@/components/forms/onboarding/common/OnboardingStepCard"

export default function UserPrivateContactsStep({
  userId,
  loadingContacts,
  addressContacts,
  emailContacts,
  phoneContacts,
  socialContacts,
  urlContacts,
  refreshContacts,
  contactError,
  setContactError,
  totalContacts,
  backHref,
  continueHref,
}) {
  return (
    <OnboardingStepCard
      title="Step 3: Private Contact Details"
      description="Add the contact details you want kept on file for your user account. Everything saved here stays private and is never shown on your public profile."
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
        <div className="space-y-6">
          <ContactSectionBlock
            title="Private Address"
            description="Optional. Store a mailing address here for account support, billing, or internal records."
            descriptionClassName="text-xs"
          >
            <AddressForm
              context="user"
              entityID={userId}
              existingContacts={addressContacts}
              defaultScope="private"
              availableScopes={["private"]}
              defaultLabel="home"
              onSaved={refreshContacts}
            />
          </ContactSectionBlock>

          <ContactSectionBlock
            title="Private Email"
            description="Recommended. Add an email address staff can use for account support, follow-up, or membership communication."
          >
            <EmailForm
              context="user"
              entityID={userId}
              existingContacts={emailContacts}
              defaultScope="private"
              availableScopes={["private"]}
              onSaved={refreshContacts}
            />
          </ContactSectionBlock>

          <ContactSectionBlock
            title="Private Phone"
            description="Optional. Keep a direct phone number on file for account verification or support follow-up."
            descriptionClassName="text-xs"
          >
            <PhoneForm
              context="user"
              entityID={userId}
              existingContacts={phoneContacts}
              defaultScope="private"
              availableScopes={["private"]}
              onSaved={refreshContacts}
            />
          </ContactSectionBlock>

          <ContactSectionBlock
            title="Private Social Handles"
            description="Optional. Save social links here if TAG staff may need them to verify or support your account."
          >
            <SocialHandlesForm
              context="user"
              entityID={userId}
              existingContacts={socialContacts}
              defaultScope="private"
              availableScopes={["private"]}
              onSaved={refreshContacts}
            />
          </ContactSectionBlock>

          <ContactSectionBlock
            title="Private Website URL"
            description="Store websites that help guild staff verify your identity or account details without exposing them publicly from this step."
            descriptionClassName="text-sm"
          >
            <p className="text-xs text-base-content/60 mb-1">Optional but helpful</p>
            <UrlLinksForm
              context="user"
              entityID={userId}
              existingContacts={urlContacts}
              defaultScope="private"
              availableScopes={["private"]}
              onSaved={refreshContacts}
            />
          </ContactSectionBlock>
        </div>
      )}

      {contactError ? (
        <div className="alert alert-error">
          <span>{contactError}</span>
        </div>
      ) : null}

      <OnboardingStepActions
        backHref={backHref}
        backLabel="Back to Profile"
        continueLabel="Continue to Privacy"
        onContinue={() => {
          if (totalContacts <= 0) {
            setContactError("Save at least one contact method before continuing.")
            return
          }

          setContactError("")
          window.location.href = continueHref
        }}
      />
    </OnboardingStepCard>
  )
}

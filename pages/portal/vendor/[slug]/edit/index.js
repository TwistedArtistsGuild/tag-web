/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect } from "react"
import { getServerSession } from "next-auth/next"
import Link from "next/link"

import { authOptions } from "@/pages/api/auth/[...nextauth]"
import RegisterSlug from "@/components/forms/onboarding/register-slug"
import AddressForm from "@/components/forms/contact/address-form"
import EmailForm from "@/components/forms/contact/email-form"
import PhoneForm from "@/components/forms/contact/phone-form"
import SocialHandlesForm from "@/components/forms/contact/social-handles-form"
import UrlLinksForm from "@/components/forms/contact/url-links-form"
import GalleryManager from "@/components/gallery/GalleryManager"
import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"

const apiUrl = getApiURL()

function getRequestOrigin(req) {
  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "").split(",")[0].trim()
  const forwardedHost = String(req?.headers?.["x-forwarded-host"] || "").trim()
  const host = forwardedHost || String(req?.headers?.host || "").trim()

  if (!host) {
    return null
  }

  const protocol = forwardedProto || (process.env.NODE_ENV === "development" ? "http" : "https")
  return `${protocol}://${host}`
}

async function getSessionFromRequest(context) {
  const origin = getRequestOrigin(context?.req)
  if (!origin) {
    return null
  }

  try {
    const response = await fetch(`${origin}/api/auth/session`, {
      headers: {
        cookie: context?.req?.headers?.cookie || "",
      },
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const sessionUser = await getSessionFromRequest(context)

  if (!session || !sessionUser) {
    return {
      redirect: { destination: "/api/auth/signin", permanent: false },
    }
  }

  const { slug } = context.params
  const normalizedSlug = String(slug || "").trim().toLowerCase()
  const apiUrl = getApiURL()

  try {
    const vendorResponse = await fetch(`${apiUrl}vendor/by-slug/${encodeURIComponent(normalizedSlug)}`)
    const vendorData = vendorResponse.ok ? await vendorResponse.json() : null
    const vendorId = vendorData?.id || vendorData?.ID || vendorData?.vendorID || vendorData?.VendorID || null

    if (!vendorId) {
      return { notFound: true }
    }

    return {
      props: { vendorId, vendorData: vendorData || {} },
    }
  } catch {
    return { notFound: true }
  }
}

const steps = [
  { num: 1, label: "Update Slug", key: "slug" },
  { num: 2, label: "Profile", key: "profile" },
  { num: 3, label: "Business Contacts", key: "business-contacts" },
  { num: 4, label: "Media", key: "media" },
  { num: 5, label: "Public Contacts", key: "public-contacts" },
]

export default function VendorEditPage({ vendorId, vendorData }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({})
  const [businessAddressContacts, setBusinessAddressContacts] = useState([])
  const [businessEmailContacts, setBusinessEmailContacts] = useState([])
  const [businessPhoneContacts, setBusinessPhoneContacts] = useState([])
  const [businessSocialContacts, setBusinessSocialContacts] = useState([])
  const [businessUrlContacts, setBusinessUrlContacts] = useState([])
  const [publicAddressContacts, setPublicAddressContacts] = useState([])
  const [publicEmailContacts, setPublicEmailContacts] = useState([])
  const [publicPhoneContacts, setPublicPhoneContacts] = useState([])
  const [publicSocialContacts, setPublicSocialContacts] = useState([])
  const [publicUrlContacts, setPublicUrlContacts] = useState([])
  const [businessContactsTab, setBusinessContactsTab] = useState("address")
  const [publicContactsTab, setPublicContactsTab] = useState("address")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!vendorId) return

    const loadContacts = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${apiUrl}contact/vendor/${vendorId}?includePrivate=true`)
        if (res.ok) {
          const data = await res.json()
          const rows = Array.isArray(data?.contacts) ? data.contacts : []
          const businessRows = rows.filter((c) => ["private", "primary"].includes(String(c?.scope || "").toLowerCase()))
          const publicRows = rows.filter((c) => String(c?.scope || "").toLowerCase() === "secondary")

          setBusinessAddressContacts(businessRows.filter((c) => String(c?.contactType || "").toLowerCase() === "address"))
          setBusinessEmailContacts(businessRows.filter((c) => String(c?.contactType || "").toLowerCase() === "email"))
          setBusinessPhoneContacts(businessRows.filter((c) => String(c?.contactType || "").toLowerCase() === "phone"))
          setBusinessSocialContacts(businessRows.filter((c) => String(c?.contactType || "").toLowerCase() === "social"))
          setBusinessUrlContacts(businessRows.filter((c) => String(c?.contactType || "").toLowerCase() === "url"))

          setPublicAddressContacts(publicRows.filter((c) => String(c?.contactType || "").toLowerCase() === "address"))
          setPublicEmailContacts(publicRows.filter((c) => String(c?.contactType || "").toLowerCase() === "email"))
          setPublicPhoneContacts(publicRows.filter((c) => String(c?.contactType || "").toLowerCase() === "phone"))
          setPublicSocialContacts(publicRows.filter((c) => String(c?.contactType || "").toLowerCase() === "social"))
          setPublicUrlContacts(publicRows.filter((c) => String(c?.contactType || "").toLowerCase() === "url"))
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadContacts()
  }, [vendorId])

  const handleStepChange = (step) => {
    setCurrentStep(step)
  }

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <>
      <TagSEO title={`Edit ${vendorData?.path || "Vendor"} - Portal`} description={`Edit profile`} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Edit Your Vendor Profile</h1>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => (
            <button
              key={step.key}
              onClick={() => handleStepChange(step.num)}
              className={`flex-1 py-2 px-4 text-center rounded transition ${
                currentStep === step.num
                  ? "bg-primary text-primary-content font-bold"
                  : currentStep > step.num
                    ? "bg-success text-success-content"
                    : "bg-base-200 text-base-content"
              }`}
            >
              {step.num}. {step.label}
            </button>
          ))}
        </div>

        {/* Step 1: Update Slug */}
        {currentStep === 1 && vendorId && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Update Slug</h2>
              <RegisterSlug
                domain="vendor"
                reserveEndpoint={`${apiUrl}vendor/reserve-slug`}
                updateEndpoint={(id) => `${apiUrl}vendor/${id}/update-slug`}
                checkEndpoint={(candidateSlug) =>
                  `${apiUrl}vendor/check-slug/${candidateSlug}?excludeId=${vendorId}`
                }
                currentSlug={vendorData?.path}
                entityId={vendorId}
                progressApi={{
                  getProgress: () => ({ slug, vendorId }),
                  setProgress: () => {},
                  markStepComplete: () => {},
                }}
              />
            </div>
          </div>
        )}

        {/* Step 2: Profile */}
        {currentStep === 2 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Profile Information</h2>

              <label className="form-control">
                <div className="label">
                  <span className="label-text">Tagline</span>
                </div>
                <input
                  type="text"
                  placeholder="Your tagline"
                  className="input input-bordered"
                  value={profileData.tagline}
                  onChange={(e) => handleProfileChange("tagline", e.target.value)}
                />
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text">Bio</span>
                </div>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Your bio"
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                ></textarea>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Business Contacts */}
        {currentStep === 3 && vendorId && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Business Contacts</h2>

              <div className="tabs tabs-bordered">
                {[
                  { key: "address", label: "Address" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "social", label: "Social" },
                  { key: "url", label: "URL" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setBusinessContactsTab(tab.key)}
                    className={`tab ${businessContactsTab === tab.key ? "tab-active" : ""}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {businessContactsTab === "address" && (
                <AddressForm
                  contacts={businessAddressContacts}
                  onUpdate={setBusinessAddressContacts}
                  entityId={vendorId}
                  scope="private"
                />
              )}
              {businessContactsTab === "email" && (
                <EmailForm
                  contacts={businessEmailContacts}
                  onUpdate={setBusinessEmailContacts}
                  entityId={vendorId}
                  scope="private"
                />
              )}
              {businessContactsTab === "phone" && (
                <PhoneForm
                  contacts={businessPhoneContacts}
                  onUpdate={setBusinessPhoneContacts}
                  entityId={vendorId}
                  scope="private"
                />
              )}
              {businessContactsTab === "social" && (
                <SocialHandlesForm
                  contacts={businessSocialContacts}
                  onUpdate={setBusinessSocialContacts}
                  entityId={vendorId}
                  scope="private"
                />
              )}
              {businessContactsTab === "url" && (
                <UrlLinksForm
                  contacts={businessUrlContacts}
                  onUpdate={setBusinessUrlContacts}
                  entityId={vendorId}
                  scope="private"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 4: Media */}
        {currentStep === 4 && vendorId && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Profile Media</h2>
              <GalleryManager
                entityType="vendor"
                entityId={vendorId}
                storagePrefix={`platformpics/vendorcontent/${vendorId}/`}
                allowMultiple={true}
              />
            </div>
          </div>
        )}

        {/* Step 5: Public Contacts */}
        {currentStep === 5 && vendorId && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Public Contacts</h2>

              <div className="tabs tabs-bordered">
                {[
                  { key: "address", label: "Address" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "social", label: "Social" },
                  { key: "url", label: "URL" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setPublicContactsTab(tab.key)}
                    className={`tab ${publicContactsTab === tab.key ? "tab-active" : ""}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {publicContactsTab === "address" && (
                <AddressForm
                  contacts={publicAddressContacts}
                  onUpdate={setPublicAddressContacts}
                  entityId={vendorId}
                  scope="secondary"
                />
              )}
              {publicContactsTab === "email" && (
                <EmailForm
                  contacts={publicEmailContacts}
                  onUpdate={setPublicEmailContacts}
                  entityId={vendorId}
                  scope="secondary"
                />
              )}
              {publicContactsTab === "phone" && (
                <PhoneForm
                  contacts={publicPhoneContacts}
                  onUpdate={setPublicPhoneContacts}
                  entityId={vendorId}
                  scope="secondary"
                />
              )}
              {publicContactsTab === "social" && (
                <SocialHandlesForm
                  contacts={publicSocialContacts}
                  onUpdate={setPublicSocialContacts}
                  entityId={vendorId}
                  scope="secondary"
                />
              )}
              {publicContactsTab === "url" && (
                <UrlLinksForm
                  contacts={publicUrlContacts}
                  onUpdate={setPublicUrlContacts}
                  entityId={vendorId}
                  scope="secondary"
                />
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => handleStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="btn btn-outline"
          >
            Back
          </button>

          {currentStep === steps.length ? (
            <Link href={`/portal/vendor/${vendorData?.path}`} className="btn btn-primary">
              Done - Back to Profile
            </Link>
          ) : (
            <button onClick={() => handleStepChange(currentStep + 1)} className="btn btn-primary">
              Next
            </button>
          )}
        </div>
      </div>
    </>
  )
}

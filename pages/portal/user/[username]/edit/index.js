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
    console.log("[UserEdit] No session found, redirecting to signin")
    return {
      redirect: { destination: "/api/auth/signin", permanent: false },
    }
  }

  const { username } = context.params
  const normalizedUsername = String(username || "").trim().toLowerCase()
  const apiUrl = getApiURL()

  console.log(`[UserEdit] Loading user: ${normalizedUsername} from ${apiUrl}user/by-username/${encodeURIComponent(normalizedUsername)}`)

  try {
    const userResponse = await fetch(`${apiUrl}user-details/by-username/${encodeURIComponent(normalizedUsername)}`)
    console.log(`[UserEdit] API response status: ${userResponse.status}`)
    const userData = userResponse.ok ? await userResponse.json() : null
    console.log(`[UserEdit] User data:`, userData)
    const userId = userData?.UserID || userData?.id || userData?.ID || null
    console.log(`[UserEdit] Extracted userId: ${userId}`)

    if (!userId) {
      console.log("[UserEdit] No userId found, returning notFound")
      return { notFound: true }
    }

    console.log("[UserEdit] Returning props with userId:", userId)
    return {
      props: { userId, userData: userData || {} },
    }
  } catch (error) {
    console.error("[UserEdit] Error:", error)
    return { notFound: true }
  }
}

const steps = [
  { num: 1, label: "Update Username", key: "username" },
  { num: 2, label: "Profile", key: "profile" },
  { num: 3, label: "Media", key: "media" },
  { num: 4, label: "Contacts", key: "contacts" },
]

export default function UserEditPage({ userId, userData }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({})
  const [addressContacts, setAddressContacts] = useState([])
  const [emailContacts, setEmailContacts] = useState([])
  const [phoneContacts, setPhoneContacts] = useState([])
  const [socialContacts, setSocialContacts] = useState([])
  const [urlContacts, setUrlContacts] = useState([])
  const [contactsTab, setContactsTab] = useState("address")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    const loadContacts = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${apiUrl}contact/user/${userId}`)
        if (res.ok) {
          const data = await res.json()
          const rows = Array.isArray(data?.contacts) ? data.contacts : []

          setAddressContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "address"))
          setEmailContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "email"))
          setPhoneContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "phone"))
          setSocialContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "social"))
          setUrlContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "url"))
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadContacts()
  }, [userId])

  const handleStepChange = (step) => {
    setCurrentStep(step)
  }

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressUpdate = (addresses) => {
    setAddressContacts(addresses)
  }

  const handleEmailUpdate = (emails) => {
    setEmailContacts(emails)
  }

  const handlePhoneUpdate = (phones) => {
    setPhoneContacts(phones)
  }

  const handleSocialUpdate = (socials) => {
    setSocialContacts(socials)
  }

  const handleUrlUpdate = (urls) => {
    setUrlContacts(urls)
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
      <TagSEO title={`Edit ${userData?.username || "User"} - Portal`} description={`Edit profile`} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Edit Your Profile</h1>

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

        {/* Step 1: Update Username */}
        {currentStep === 1 && userId && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Update Username</h2>
              <RegisterSlug
                domain="user"
                reserveEndpoint={`${apiUrl}user/reserve-username`}
                updateEndpoint={(id) => `${apiUrl}user/${id}/update-username`}
                checkEndpoint={(candidateUsername) =>
                  `${apiUrl}user/check-username/${candidateUsername}?excludeId=${userId}`
                }
                currentSlug={userData?.username}
                entityId={userId}
                progressApi={{
                  getProgress: () => ({ username, userId }),
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

        {/* Step 3: Media */}
        {currentStep === 3 && userId && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Profile Media</h2>
              <GalleryManager
                entityType="user"
                entityId={userId}
                storagePrefix={`platformpics/usercontent/${userId}/`}
                allowMultiple={false}
              />
            </div>
          </div>
        )}

        {/* Step 4: Contacts */}
        {currentStep === 4 && userId && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Contacts</h2>

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
                    onClick={() => setContactsTab(tab.key)}
                    className={`tab ${contactsTab === tab.key ? "tab-active" : ""}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {contactsTab === "address" && (
                <AddressForm contacts={addressContacts} onUpdate={handleAddressUpdate} userId={userId} />
              )}
              {contactsTab === "email" && (
                <EmailForm contacts={emailContacts} onUpdate={handleEmailUpdate} userId={userId} />
              )}
              {contactsTab === "phone" && (
                <PhoneForm contacts={phoneContacts} onUpdate={handlePhoneUpdate} userId={userId} />
              )}
              {contactsTab === "social" && (
                <SocialHandlesForm
                  contacts={socialContacts}
                  onUpdate={handleSocialUpdate}
                  userId={userId}
                />
              )}
              {contactsTab === "url" && (
                <UrlLinksForm contacts={urlContacts} onUpdate={handleUrlUpdate} userId={userId} />
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
            <Link href={`/portal/user/${userData?.username}`} className="btn btn-primary">
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

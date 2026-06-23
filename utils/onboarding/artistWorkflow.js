const STORAGE_KEY = "tag-registration-progress:artist";

// Workflow step keys for UnifiedWorkflow tracking
export const ARTIST_WORKFLOW_STEPS = {
  ACCEPTED_TC: "accepted_tc",
  RESERVED_SLUG: "reserved_slug",
  ADDED_BIO: "added_bio",
  PRIVATE_CONTACTS: "private_contacts",
  UPLOADED_PHOTOS: "uploaded_photos",
  ADDED_CONTACTS: "added_contacts",
  PUBLISHED: "published",
  TUTORIAL_FIRST_LISTING: "tutorial_first_listing",
  FIRST_POST: "first_post",
};

// Simplified steps for registration flow (subset of full workflow)
export const ARTIST_REGISTRATION_STEPS = {
  ACCEPTED_TC: "accepted_tc",
  RESERVED_SLUG: "reserved_slug",
  PROFILE_INFO: "added_bio",
  BUSINESS_DETAILS: "business_details",
  PRIVATE_CONTACTS: "private_contacts",
  MEDIA_SETUP: "uploaded_photos",
  PUBLIC_CONTACTS: "added_contacts",
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getArtistRegistrationProgress() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setArtistRegistrationProgress(progress) {
  if (!canUseStorage()) {
    return;
  }

  const current = getArtistRegistrationProgress() || {};
  const next = {
    ...current,
    ...progress,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function markArtistRegistrationStepComplete(step, details = {}) {
  const current = getArtistRegistrationProgress() || {};
  const steps = {
    ...(current.steps || {}),
    [step]: {
      completed: true,
      completedAt: new Date().toISOString(),
      ...details,
    },
  };

  setArtistRegistrationProgress({
    ...current,
    currentStep: step,
    steps,
  });
}

/**
 * Mark a workflow step as complete via the API.
 * @param {number} artistId - Artist ID (EntityID)
 * @param {string} stepKey - Step key from ARTIST_WORKFLOW_STEPS
 * @param {string} apiUrl - Base API URL
 * @returns {Promise<boolean>} - True if successful
 */
export async function markWorkflowStepComplete(artistId, stepKey, apiUrl) {
  if (!artistId || !stepKey) {
    console.warn("markWorkflowStepComplete: missing artistId or stepKey");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}workflows/upsert-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityId: artistId,
        entityType: "Artist",
        workflowName: "default",
        stepKey: stepKey,
        isCompleted: true,
      }),
    });

    if (!response.ok) {
      console.error(`Failed to mark workflow step complete: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error marking workflow step complete:", error.message);
    return false;
  }
}

/**
 * Fetch all workflow steps for an artist and check if registration is complete.
 * @param {number} artistId - Artist ID (EntityID)
 * @param {string} apiUrl - Base API URL
 * @returns {Promise<{allComplete: boolean, steps: Array}>}
 */
export async function checkArtistRegistrationComplete(artistId, apiUrl) {
  if (!artistId) {
    return { allComplete: false, steps: [], requiredSteps: [] };
  }

  try {
    const response = await fetch(`${apiUrl}workflows/artist/${artistId}?workflowName=default`);

    if (!response.ok) {
      console.error(`Failed to fetch workflow steps: ${response.status}`);
      return { allComplete: false, steps: [], requiredSteps: [] };
    }

    const summary = await response.json();
    const steps = Array.isArray(summary?.steps) ? summary.steps : [];
    const requiredSteps = Array.isArray(summary?.requiredSteps) ? summary.requiredSteps : [];
    const completedSteps = steps.filter((s) => s.isCompleted).map((s) => s.stepKey);
    const allComplete = requiredSteps.every((step) => completedSteps.includes(step));

    return { allComplete, steps, requiredSteps };
  } catch (error) {
    console.error("Error checking registration completion:", error.message);
    return { allComplete: false, steps: [], requiredSteps: [] };
  }
}

const STORAGE_KEY = "tag-registration-progress:artist";

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

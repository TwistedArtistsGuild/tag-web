const STORAGE_KEY = "tag-registration-progress:venue";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getVenueRegistrationProgress() {
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

export function clearVenueRegistrationProgress() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function setVenueRegistrationProgress(progress) {
  if (!canUseStorage()) {
    return;
  }

  const current = getVenueRegistrationProgress() || {};
  const next = {
    ...current,
    ...progress,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function markVenueRegistrationStepComplete(step, details = {}) {
  const current = getVenueRegistrationProgress() || {};
  const steps = {
    ...(current.steps || {}),
    [step]: {
      completed: true,
      completedAt: new Date().toISOString(),
      ...details,
    },
  };

  setVenueRegistrationProgress({
    ...current,
    currentStep: step,
    steps,
  });
}

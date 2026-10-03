const STORAGE_KEY = "tag-registration-progress:vendor";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getVendorRegistrationProgress() {
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

export function clearVendorRegistrationProgress() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function setVendorRegistrationProgress(progress) {
  if (!canUseStorage()) {
    return;
  }

  const current = getVendorRegistrationProgress() || {};
  const next = {
    ...current,
    ...progress,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function markVendorRegistrationStepComplete(step, details = {}) {
  const current = getVendorRegistrationProgress() || {};
  const steps = {
    ...(current.steps || {}),
    [step]: {
      completed: true,
      completedAt: new Date().toISOString(),
      ...details,
    },
  };

  setVendorRegistrationProgress({
    ...current,
    currentStep: step,
    steps,
  });
}

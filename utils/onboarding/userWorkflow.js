const STORAGE_KEY = "tag-registration-progress:user";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getUserRegistrationProgress() {
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

export function setUserRegistrationProgress(progress) {
  if (!canUseStorage()) {
    return;
  }

  const current = getUserRegistrationProgress() || {};
  const next = {
    ...current,
    ...progress,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function markUserRegistrationStepComplete(step, details = {}) {
  const current = getUserRegistrationProgress() || {};
  const steps = {
    ...(current.steps || {}),
    [step]: {
      completed: true,
      completedAt: new Date().toISOString(),
      ...details,
    },
  };

  setUserRegistrationProgress({
    ...current,
    currentStep: step,
    steps,
  });
}

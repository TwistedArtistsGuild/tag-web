import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readMessage(payload, fallback) {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === "string") {
    return payload;
  }

  return payload.message || payload.error || fallback;
}

export default function RegisterSlug({
  domain,
  domainLabel,
  apiBaseUrl,
  reserveEndpoint,
  updateEndpoint,
  checkEndpoint,
  nextRoute,
  sessionUser,
  initialTitle = "",
  progressApi,
  onReserved,
  extendPayload,
  children,
  titleFieldLabel = "Title",
  titlePlaceholder,
  showSlugField = true,
  slugFieldLabel = "Slug",
  slugPlaceholder = "lowercase-dashed-slug",
  slugDescription = "You can update the slug later, but each change requires another uniqueness check.",
}) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [email, setEmail] = useState(sessionUser?.email || "");
  const [entityId, setEntityId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugStatus, setSlugStatus] = useState("idle");

  const normalizedDomain = useMemo(() => String(domain || "").toLowerCase(), [domain]);

  useEffect(() => {
    const progress = progressApi?.getProgress?.();
    if (!progress) {
      return;
    }

    if (progress.title) {
      setTitle(progress.title);
    }

    if (progress.slug) {
      setSlug(progress.slug);
      if (progress.title) {
        setIsSlugManuallyEdited(toSlug(progress.title) !== progress.slug);
      }
    }

    if (progress.entityId) {
      setEntityId(progress.entityId);
    }

    if (!sessionUser?.email && progress.email) {
      setEmail(progress.email);
    }
  }, [progressApi, normalizedDomain, sessionUser?.email]);

  const canSubmit = useMemo(() => {
    if (!title || !slug || !SLUG_PATTERN.test(slug)) {
      return false;
    }

    if (normalizedDomain === "user" && !email.trim()) {
      return false;
    }

    return true;
  }, [email, normalizedDomain, slug, slugStatus, title]);

  const verifySlugAvailability = async () => {
    const trimmedSlug = slug.trim().toLowerCase();

    if (!SLUG_PATTERN.test(trimmedSlug)) {
      setSlugStatus("invalid");
      setFeedback({
        type: "error",
        message: "Slug format invalid. Use lowercase letters, numbers, and dashes only.",
      });
      return false;
    }

    setIsChecking(true);
    setFeedback({ type: "", message: "" });

    try {
      const url = typeof checkEndpoint === "function"
        ? checkEndpoint(trimmedSlug, entityId)
        : `${checkEndpoint}/${encodeURIComponent(trimmedSlug)}`;

      const response = await fetch(url);
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const isConflict = response.status === 409;
        const isBadRequest = response.status === 400;

        setSlugStatus(isConflict || isBadRequest ? "taken" : "error");
        setFeedback({
          type: "error",
          message: isConflict || isBadRequest
            ? readMessage(payload, "Slug is already in use.")
            : readMessage(payload, `Slug check failed (${response.status}). Please try again.`),
        });
        return false;
      }

      if (payload?.available === false) {
        setSlugStatus("taken");
        setFeedback({
          type: "error",
          message: readMessage(payload, "Slug is already in use."),
        });
        return false;
      }

      setSlugStatus("available");
      setFeedback({ type: "success", message: "Slug is available." });
      return true;
    } catch (error) {
      setSlugStatus("error");
      setFeedback({ type: "error", message: error.message || "Unable to verify slug right now." });
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckSlug = async () => {
    await verifySlugAvailability();
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    const isAvailable = slugStatus === "available" ? true : await verifySlugAvailability();
    if (!isAvailable) {
      setIsSubmitting(false);
      return;
    }

    const payload = {
      slug: slug.trim().toLowerCase(),
      title: title.trim(),
    };

    if (normalizedDomain === "user") {
      payload.email = email.trim();
    }

    let requestPayload = { ...payload };
    let progressPayload = {};

    if (typeof extendPayload === "function") {
      const extension = extendPayload({
        domain: normalizedDomain,
        entityId,
        payload,
      }) || {};

      if (extension.errorMessage) {
        setFeedback({
          type: "error",
          message: extension.errorMessage,
        });
        setIsSubmitting(false);
        return;
      }

      if (extension.payload && typeof extension.payload === "object") {
        requestPayload = {
          ...requestPayload,
          ...extension.payload,
        };
      }

      if (extension.progress && typeof extension.progress === "object") {
        progressPayload = extension.progress;
      } else if (extension.payload && typeof extension.payload === "object") {
        progressPayload = extension.payload;
      }
    }

    try {
      const isUpdate = Boolean(entityId);
      const requestUrl = isUpdate
        ? updateEndpoint(entityId)
        : reserveEndpoint;

      const requestMethod = isUpdate ? "PATCH" : "POST";

      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setFeedback({
          type: "error",
          message: readMessage(body, "Unable to reserve slug."),
        });
        return;
      }

      const resolvedId = body?.artistID || body?.ArtistID || body?.userID || body?.UserID || body?.vendorID || body?.VendorID || body?.venueID || body?.VenueID || entityId;

      if (!resolvedId) {
        setFeedback({
          type: "error",
          message: "Reservation succeeded but ID was missing from the API response.",
        });
        return;
      }

      setEntityId(resolvedId);

      progressApi?.setProgress?.({
        entityId: resolvedId,
        title: payload.title,
        slug: payload.slug,
        email: payload.email || email,
        ...progressPayload,
      });

      progressApi?.markStepComplete?.("slug-reserved", {
        entityId: resolvedId,
        slug: payload.slug,
      });

      const successMessage = entityId
        ? "Slug updated successfully. Continuing to step 2..."
        : "Slug reserved successfully. Continuing to step 2...";

      setFeedback({
        type: "success",
        message: successMessage,
      });

      // Mark workflow step complete if this is an artist domain
      if (normalizedDomain === "artist" && progressApi?.markWorkflowStep) {
        await progressApi.markWorkflowStep(resolvedId, "reserved_slug");
      }

      if (onReserved) {
        await onReserved({
          entityId: resolvedId,
          slug: payload.slug,
          title: payload.title,
          email: payload.email || email,
          ...progressPayload,
        });
      }

      if (nextRoute) {
        const nextUrl = typeof nextRoute === "function"
          ? nextRoute(resolvedId)
          : `${nextRoute}?id=${encodeURIComponent(String(resolvedId))}`;

        try {
          await router.push(nextUrl);
        } catch {
          window.location.assign(nextUrl);
        }
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to reserve slug.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 border border-base-300 shadow">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Step 1: Reserve {domainLabel} Slug</h2>
          <p className="text-sm text-base-content/70">
            Create the initial {domainLabel.toLowerCase()} row first so downstream forms and media uploads have a valid ID.
          </p>
        </div>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">{titleFieldLabel}</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (!isSlugManuallyEdited || !showSlugField) {
                setSlug(toSlug(nextTitle));
              }
              setSlugStatus("idle");
            }}
            placeholder={titlePlaceholder || `Enter ${domainLabel.toLowerCase()} title`}
          />
        </label>

        {showSlugField ? (
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">{slugFieldLabel}</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="input input-bordered w-full"
                value={slug}
                onChange={(event) => {
                  setSlug(toSlug(event.target.value));
                  setIsSlugManuallyEdited(true);
                  setSlugStatus("idle");
                }}
                placeholder={slugPlaceholder}
              />
              <button
                type="button"
                className="btn btn-outline whitespace-nowrap"
                onClick={handleCheckSlug}
                disabled={isChecking || isSubmitting}
              >
                {isChecking ? "Checking..." : "Check Uniqueness"}
              </button>
            </div>
            <div className="label">
              <span className="label-text-alt">{slugDescription}</span>
            </div>
          </label>
        ) : (
          <div className="rounded-box border border-base-300 bg-base-200/40 p-3 text-sm">
            <div className="font-semibold">Username slug preview</div>
            <div className="text-base-content/70">{slug || "(enter a username above)"}</div>
            <button
              type="button"
              className="btn btn-sm btn-outline mt-2"
              onClick={handleCheckSlug}
              disabled={isChecking || isSubmitting || !slug}
            >
              {isChecking ? "Checking..." : "Check Username"}
            </button>
          </div>
        )}

        {normalizedDomain === "user" && (
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
            />
          </label>
        )}

        {children}

        <div className="flex gap-2 flex-wrap">
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Saving..." : entityId ? "Update Slug + Continue" : "Reserve Slug + Continue"}
          </button>
          {entityId && <span className="badge badge-info">Reserved ID: {entityId}</span>}
        </div>

        {feedback.message && (
          <div className={`alert ${feedback.type === "error" ? "alert-error" : "alert-success"}`}>
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="text-xs text-base-content/60">
          API: {apiBaseUrl}
        </div>
      </div>
    </div>
  );
}

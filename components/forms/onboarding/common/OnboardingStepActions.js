import Link from "next/link"

export default function OnboardingStepActions({
  backHref,
  backLabel,
  continueLabel,
  onContinue,
  continueDisabled = false,
}) {
  return (
    <div className="flex gap-2 justify-between flex-wrap">
      <Link href={backHref} className="btn btn-sm btn-outline">{backLabel}</Link>
      <button
        type="button"
        className="btn btn-sm btn-primary"
        disabled={continueDisabled}
        onClick={onContinue}
      >
        {continueLabel}
      </button>
    </div>
  )
}

export default function OnboardingStepCard({ title, description, children }) {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">{title}</h2>
          {description ? <p className="text-sm text-base-content/70">{description}</p> : null}
        </div>

        {children}
      </div>
    </div>
  )
}

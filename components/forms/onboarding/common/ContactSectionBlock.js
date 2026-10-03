export default function ContactSectionBlock({ title, description, children, descriptionClassName = "text-sm" }) {
  return (
    <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
      <h3 className="font-semibold text-base-content mb-1">{title}</h3>
      {description ? <p className={`${descriptionClassName} text-base-content/70 mb-4`}>{description}</p> : null}
      {children}
    </div>
  )
}

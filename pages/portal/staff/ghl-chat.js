import CrmSocialChat from "@/components/ghl/CrmSocialChat"

export default function GHLChatPage() {
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                GoHighLevel Social Messaging
              </p>
              <h1 className="mt-2 text-3xl font-bold text-base-content md:text-4xl">
                TAG Company Chat Interface
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-base-content/70 md:text-base">
                This workspace is our company GoHighLevel inbox for conversations coming from connected social media and CRM messaging channels. Staff can review active threads and send outbound replies from one place.
              </p>
            </div>
            <a
              href="/portal/staff/ghl-index"
              className="inline-flex items-center justify-center rounded-md border border-base-300 bg-base-200 px-4 py-2 text-sm font-medium text-base-content transition hover:bg-base-300"
            >
              Back to CRM Index
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm md:p-4">
          <CrmSocialChat />
        </div>
      </div>
    </div>
  )
}
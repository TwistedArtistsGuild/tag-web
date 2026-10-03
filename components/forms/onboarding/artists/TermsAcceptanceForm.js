import Link from "next/link";

export default function TermsAcceptanceForm({
  tcAccepted,
  onAcceptanceChange,
  onContinue,
}) {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Terms &amp; Conditions</h2>
          <p className="text-sm text-base-content/70">By registering as an artist, you agree to our terms and conditions. Please read them carefully before proceeding.</p>
        </div>

        <div className="rounded-box border border-base-300 bg-base-200/40 p-4 max-h-64 overflow-y-auto text-sm space-y-2">
          <h3 className="font-semibold">Artist Registration Terms &amp; Conditions</h3>
          <p>Welcome to Twisted Artists Guild. By creating an artist profile, you agree to:</p>
          <ul className="list-disc list-inside space-y-1 text-base-content/80">
            <li>Provide accurate and truthful information about your art and business</li>
            <li>Comply with all applicable laws and regulations in your jurisdiction</li>
            <li>Not use our platform for illegal or harmful activities</li>
            <li>Respect the intellectual property rights of others and own all content you post</li>
            <li>Maintain the security of your account credentials</li>
            <li>Allow guild administrators access to private business information for bookkeeping and tax compliance</li>
            <li>Not harass, discriminate against, or abuse other members</li>
            <li>Pay any applicable fees or commissions as outlined in your artist agreement</li>
          </ul>
          <p className="pt-2 text-base-content/70">By proceeding, you acknowledge that you have read and agree to these terms.</p>
        </div>

        <label className="form-control">
          <div className="label cursor-pointer gap-3">
            <input
              type="checkbox"
              className="checkbox"
              checked={tcAccepted}
              onChange={(e) => onAcceptanceChange(e.target.checked)}
            />
            <span className="label-text">I accept the Terms &amp; Conditions</span>
          </div>
        </label>

        <div className="flex gap-2 justify-end flex-wrap">
          <Link href="/join" className="btn btn-sm btn-outline">Back to Join</Link>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={!tcAccepted}
            onClick={onContinue}
          >
            Accept and Continue to Slug
          </button>
        </div>
      </div>
    </div>
  );
}

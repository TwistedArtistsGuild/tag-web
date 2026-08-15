---
name: "🐛 Bug Report"
about: Report an unexpected error, unexpected calculation, or broken feature.
title: "[BUG] - "
labels: "bug, needs-triage"
assignees: ""
---

## 📌 Summary
Provide a clear, concise 1-2 sentence description of what is failing.

---

## 🔄 Steps to Reproduce
1. Go to `...` (e.g., Checkout Screen)
2. Perform action `...` (e.g., Click 'Pay Now')
3. Observe error `...`

---

## 🎯 Expected vs. Actual Behavior
* **Expected:** What should happen? (e.g., Stripe PaymentIntent succeeds and Modern Treasury logs ledger entry)
* **Actual:** What actually happens? (e.g., Webhook fails with a 500 error, order remains in 'Pending')

---

## 🛠️ Affected Area / Stack
Check all that apply:
- [ ] React Frontend (UI/Cart)
- [ ] .NET Core API / Webhooks
- [ ] PostgreSQL Database
- [ ] Integration: Stripe
- [ ] Integration: Shippo
- [ ] Integration: Modern Treasury
- [ ] Integration: Accounting (Zoho/Other)

---

## 📸 Screenshots / Logs (If Applicable)
> Paste error logs, stack traces, or UI screenshots here.

---

## 📋 Acceptance Criteria
- [ ] Bug is fixed and verified in local/dev environment.
- [ ] Unit/Integration tests pass.
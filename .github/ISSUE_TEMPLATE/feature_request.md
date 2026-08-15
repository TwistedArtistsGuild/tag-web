---
name: "✨ Feature / Enhancement"
about: Propose a new feature, API integration, or architectural improvement.
title: "[FEATURE] - "
labels: "enhancement, triage"
assignees: ""
---

## 💡 Feature Overview
What is the new capability or improvement being requested? Who is it for (Artist, Buyer, or Admin)?

---

## 🎯 Business Goal & Value
Why are we building this? (e.g., "Allow artists to track external Etsy income inside TAG to support our premium bookkeeping offering.")

---

## 📋 Requirements & User Story
**As a** [User / Artist / Admin],  
**I want to** [do something],  
**So that** [value/result achieved].

---

## ⚙️ Technical / Architectural Scope
List known technical components involved:
- [ ] **Frontend:** React UI components / state management
- [ ] **Backend:** .NET Core API / background worker / webhook
- [ ] **Database:** PostgreSQL schema update / EF Core migration
- [ ] **External APIs:** Stripe / Shippo / Modern Treasury / Zoho / Plaid

---

## ✅ Acceptance Criteria (Definition of Done)
*What needs to be true for this issue to be closed?*
- [ ] Requirement 1 (e.g., API endpoint accepts `POST /api/vendor/sync`)
- [ ] Requirement 2 (e.g., Database records saved with appropriate index)
- [ ] Requirement 3 (e.g., Frontend renders success toast message)
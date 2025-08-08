# 🎨 tag-web

[Wiki](https://github.com/TwistedArtistsGuild/tag-web/wiki) • [Project Board](https://github.com/users/TwistedArtistsGuild/projects/2)

The frontend for [TwistedArtistsGuild.com](https://twistedartistsguild.com) — a mission-driven platform empowering artists through accessible, ethical, and scalable tools. This Next.js application brings the guild’s user-facing experience to life, blending artistic freedom with cooperative infrastructure.

---

## 🔥 Introduction

Twisted Artists Guild is a digital cooperative for creators. The `tag-web` frontend is your portal to that world — enabling art discovery, event engagement, competition voting, and direct artist commerce. It’s fast, flexible, and built to reflect our human-first ethos.

---

## 🚀 Getting Started

1. **Clone this repo**
   ```bash
   git clone https://github.com/twistedartistsguild/tag-web.git
   cd tag-web
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start development server**
   ```bash
   npm run dev
   ```

### Dependencies
- Next.js, React, Tailwind CSS, daisyUI
- Azure SDKs: communication-email, identity, storage-blob
- Stripe, Mailgun, Nodemailer, PostgreSQL
- Rich text & gallery libraries: react-quill, react-slick, react-image-gallery
- Content sanitization: sanitize-html, dompurify

### API Reference
- Backend: [tag-api](https://github.com/TwistedArtistsGuild/tag-api)
- Env file: see /docs/env.md

---

## 🧪 Build and Test

To build for production:
```bash
npm run build
```
To lint and fix:
```bash
npm run lint
```
To run tests (WIP):
```bash
npm run test
```

**Testing includes:**
- Jest + React Testing Library
- Cypress setup in progress
- Target 80%+ coverage across major components

---

## 🤝 Contributing
We welcome contributions that align with TAG’s cooperative values.

- Fork the repo
- Create your feature branch: `git checkout -b feat/short-description`
- Commit using Conventional Commits
- Open a Pull Request with linked issue and description

### Branch Naming Convention
Use the [Conventional Commits](https://www.conventionalcommits.org/) style for all feature branches:

- Format: `<type>/<short-kebab-description>`
- Examples:
  - `feat/add-user-profile`
  - `fix/deployment-script`
  - `chore/update-docs`

This approach makes it easy to identify the purpose of a branch and works well with automation and changelogs. The PR author is always visible in GitHub, so including your username in the branch name is not necessary.

Before submitting, be sure to check:
- ESLint header block
- Accessibility markers (WCAG compliance)
- Usage of absolute imports (`@/components/...`)
- Commit message structure

Contributor guides can be found in `docs/CONTRIBUTING.md` and `docs/styleguide.md`

---

## 🔒 Branch Protection & PR Workflow

Branch protection is enforced for all key branches to ensure code quality, consistent deployments, and clear audit trails. All contributions must go through pull requests (PRs) targeting protected branches.

### Feature Branch Naming
Use the Conventional Commits style for all branches:
- Format: `<type>/<short-kebab-description>`
- Examples:
  - `feat/add-user-profile`
  - `fix/deployment-script`

### Pull Request Targets
- **Development Iteration Branch:** `dev`
  - Environment: Vercel → [vcdev.twistedartistsguild.com](https://vcdev.twistedartistsguild.com)
  - Trigger: PR merge into `dev`
- **Main Testing Branch:** `main`
  - Environment: Vercel → [vcstaging.twistedartistsguild.com](https://vcstaging.twistedartistsguild.com)
  - Trigger: PR merge into `main`
- **Azure Staging Branch:** `deploy`
  - Environment: Azure staging slot → [staging.twistedartistsguild.com](https://staging.twistedartistsguild.com)
  - Trigger: PR merge into `deploy`

Merges to these branches automatically kick off their respective pipelines. Final production swap is still manual.
→ [twistedartistsguild.com](https://twistedartistsguild.com)

### Protected Branches Summary

| Branch  | Environment                | Deploys To                        |
|---------|----------------------------|-----------------------------------|
| dev     | Vercel development slot    | vcdev.twistedartistsguild.com     |
| main    | Vercel staging slot        | vcstaging.twistedartistsguild.com |
| deploy  | Azure App Service staging  | staging.twistedartistsguild.com   |

### General PR Requirements
- Any branch may be pushed to dev for testing, then dev → main → deploy
- At least one approver's review before merge
- All CI checks (linting, tests, build) must pass
- Link any relevant issue or task number in the PR description
- Include screenshots or recordings for UI changes

### How Merges Result In Deployments
1. Contributor opens a PR from i.e. `feat/feature_description` into `dev`.
2. Once approved and merged, Vercel builds and publishes to vcdev.
3. After testing, open a PR from `dev` into `main`. Merge triggers Vercel build for vcstaging.
4. If staging looks good, PR from `main` into `deploy` merges and Azure pipeline deploys to staging.
5. Final manual slot swap in Azure moves staging to production on twistedartistsguild.com.

### Best Practices
- Rebase or merge the latest target branch before opening a PR
- Write clear commit messages with context
- Keep PRs small and focused on a single change
- Tag teammates for domain-specific reviews (UI, backend, infra)
- Update documentation pages if config or API contracts change

---

## 🧭 Philosophy & License
Our platform is built for artists, but we hope the approach will spread to other industries like wildflowers. We use GPL v3.0 to ensure anyone benefiting from our work here will similarly open source their work.

Open source • Low-profit • Community-first

---




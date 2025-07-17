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
- Backend: tag-web-api-dotnet
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
- Create your feature branch: `git checkout -b feat/my-feature-name`
- Commit using Conventional Commits
- Open a Pull Request with linked issue and description

Before submitting, be sure to check:
- ESLint header block
- Accessibility markers (WCAG compliance)
- Usage of absolute imports (`@/components/...`)
- Commit message structure

Contributor guides can be found in `/CONTRIBUTING.md` and `/docs/styleguide.md`

---

## 🧭 Philosophy & License
This platform is built for artists, not algorithms. We use GPL v3.0 to protect creators and encourage ethical transparency.

Open source • Low-profit • Human-first

---

## 📣 Related Projects
- tag-web-api-dotnet — backend API & governance engine
- tag-web/wiki — architecture & feature planning

---

Let me know if you want badges, links to your project board, or contributor info added!




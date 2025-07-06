orgRules:
  priority: P0
  rules:
    - id: org-language-discipline
      description: Only write code in the language(s) already present in the repo. No new languages.

    - id: org-lint-format
      description: Enforce ESLint and Prettier across all JS/TS repos; run auto-fix on save and in CI.

    - id: org-commits-versioning
      description: 
        - Use Conventional Commits (feat:, fix:, chore:, etc.). 
        - Follow SemVer MAJOR.MINOR.PATCH.
        - Generate annotated Git tags for each release. 
        - Copilot should suggest bump commits and tag commands in PR reviews.

    - id: org-security-first
      description: 
        - Validate inputs; use parameterized queries. 
        - Sanitize outputs. 
        - Remind of OWASP Top 10 vulnerabilities when relevant (XSS, SQLi, CSRF, etc.).
        - Implement proper error handling.

    - id: org-testing-suggestions
      description: Always propose relevant test cases alongside delivered functionality. Frameworks and thresholds are repo-specific.

    - id: org-file-creation
      description: Only create new files when explicitly requested or absolutely required (e.g. missing CI/pipeline config). Otherwise, modify existing files.

    - id: org-dependency-check
      description: On adding dependencies, remind to run `npm audit` or equivalent SCA scan.

    - id: org-naming-conventions
      description:
        - camelCase for variables and functions
        - PascalCase for classes, components, types
        - kebab-case for filenames

nextjsRules:
  priority: P1
  overrides: orgRules
  rules:
    - id: nj-framework-tooling
      description: Use Next.js with Tailwind CSS and daisyUI. JavaScript only (no TypeScript).

    - id: nj-components-hooks
      description: Build UIs with functional React components and hooks. Use absolute imports (e.g. `/components/Button`).

    - id: nj-accessibility
      description: Ensure WCAG compliance. Run axe/lighthouse audits in CI and report failures.

    - id: nj-performance
      description: For large datasets, scaffold cursor-based pagination or infinite scroll.

    - id: nj-testing
      description:
        - Frameworks: Jest + React Testing Library.
        - Target: ≥80% coverage.
        - Scaffold basic Cypress e2e tests.

    - id: nj-error-handling
      description: Snarky messages only live in chat; code comments and logs remain professional.

    - id: nj-ci-audit
      description: Remind to run `npm audit` on new packages.

# Frontend Style Guide

This style guide helps keep our codebase consistent, readable, and accessible.

## Naming Conventions
- **Files:** kebab-case (e.g., `my-component.js`)
- **Variables & functions:** camelCase
- **Components & types:** PascalCase

## Formatting
- Use Prettier for code formatting
- Run `npm run lint` and fix all errors before committing

## Components
- Use functional React components and hooks
- Use absolute imports (e.g., `@/components/Button`)
- Keep components focused and reusable

## Accessibility
- All UI must meet WCAG AA standards
- Use semantic HTML and ARIA attributes as needed
- Test with screen readers and keyboard navigation

## UI/UX
- Use Tailwind CSS and daisyUI for styling
- Follow the design system and component library
- Keep interfaces clean and user-friendly

## Comments & Docs
- Use JSDoc for complex functions/components
- Write clear, concise comments where necessary

## Testing
- Write tests for all new features (Jest + React Testing Library)
- Target ≥80% coverage

---

For more, see `CONTRIBUTING.md` and `env.md`. Questions? Ask in your PR or open an issue.

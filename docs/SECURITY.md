# 🛡 Security Policy

## 🚧 Project Status

This project is in **pre-alpha prototyping**. We're actively exploring architecture, workflows, and governance tools — but nothing here is production-ready yet. Security practices are evolving, and we make **no promises** at this stage beyond transparency and community collaboration.

## 👥 How to Report a Security Issue

If you find something sketchy, broken, or concerning:

- **Please open a GitHub Issue** on this repo and label it with `security`.
- Describe the issue, what files or features it affects, and how you found it.
- You’re welcome to submit a pull request with a fix or suggested mitigation.

We’re still learning — your help means the world. 🙏

## 🔐 Long-Term Intentions

As the project matures, we plan to:

- Implement responsible disclosure workflows
- Establish dedicated security branches and patch release tracking
- Create documentation for encryption, authentication, and permission models
- Support advisory publishing and API vulnerability scanning

For now: please be kind, be constructive, and help us build this the right way.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately by emailing a project maintainer or opening a security advisory on GitHub. Do **not** disclose security issues publicly until they have been reviewed and patched.

## Security Best Practices

- Never commit secrets, passwords, or API keys to the repository
- Use environment variables for all sensitive configuration
- Validate all user input and sanitize outputs
- Follow the [OWASP Top 10](https://owasp.org/www-project-top-ten/) for web security
- Keep dependencies up to date and run `npm audit` regularly

## Supported Versions

We support the latest major version of the codebase. Older versions may not receive security updates.

---

For more information, see [env.md](env.md) and [CONTRIBUTING.md](CONTRIBUTING.md).


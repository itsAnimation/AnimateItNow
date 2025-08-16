# 🔐 Security Policy

## Supported Versions

We currently support and maintain the following versions of this project:

| Version | Supported          |
|---------|--------------------|
| Latest  | ✅                 |
| Older   | ❌ (No longer supported — please upgrade) |

If you are using an older version, we recommend upgrading to the latest release for security and stability.

---

## Supported Tech Stack
AnimateItNow is a project using HTML, CSS, and JavaScript.  
As a frontend-focused project, security practices are still critical to prevent vulnerabilities such as XSS or unsafe DOM manipulation.

---

## Reporting a Vulnerability

If you discover a security vulnerability, we encourage you to report it **privately and responsibly** to help us maintain a secure project.

### 📧 Preferred Contact Method:
Please reach out via [LinkedIn](https://www.linkedin.com/in/anujshrivastava1/)  
Include the following details in your message:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact (if known)
- Any relevant screenshots, logs, or PoC (Proof of Concept)

> _Note: Do **not** publicly disclose the vulnerability until it has been investigated and resolved._

Alternatively, you may use GitHub’s built-in [Security Advisories](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) feature to report issues.

---

## Best Practices

To help keep the project secure, contributors should:
- Avoid unsafe JS methods that may create XSS attack vectors.
- Prefer secure DOM APIs (`textContent`, `createElement`, `appendChild`) for injecting dynamic content.
- Do not include untrusted external scripts or stylesheets.

---

## Scope

This project is intended for open-source use by contributors worldwide.  
Security remains a top priority, even though it is a frontend-focused project.  
Refer to [CONTRIBUTING.md](CONTRIBUTING.md) for secure contribution practices.  

---

## Response Timeline

We aim to respond to vulnerability reports within **72 hours** of receipt. Depending on the severity and complexity of the issue, we may take longer to provide a fix.

You will be notified:
- Upon receipt of your report
- When the investigation is complete
- Once a fix is implemented and released
- When public disclosure is appropriate

---

## Acknowledgements

We sincerely thank all contributors and researchers who help keep this project secure.

---

**Thank you for helping us improve the security of this project!**
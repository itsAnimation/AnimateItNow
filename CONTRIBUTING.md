## Contributing Guidelines

Thank you for considering contributing to this project! We're excited to collaborate with you. Please follow the steps below to get started:

---

## Getting Started

# Areas YOU can Contribute to:

- Add new components or animation.
- Enhance guides and documentation.
- Report or resolve bugs and issues.
- Improve the UI/UX.
- Optimize or Refactor the existing code.
- Any other meaningful change or addition.

# How to Contribute (Step-by-Step)

1. *Fork the repository*

Head to the Github repository and hit the *fork* button on the top-right corner.


2.*Clone your fork*:

Open your terminal and run the following command:

bash
git clone https://github.com/YOUR_USERNAME/AnimateItNow.git 



3. *Create a new branch*

bash
git checkout -b your-feature-name



4. *Make your changes*

Add new features, fix bugs, enhance the UI, just start with small issues if you are a beginner.


5. *Commit and push your changes*

bash
git add .

git commit -m "Add meaningful commit message"

git push origin your-feature-name



6. *Open a Pull Request(PR)*

Go to your forked repo on GitHub.
Click the “Compare & pull request” button.
Add a title and description.
Make sure the base repo and branch are correct.
Click “Create pull request”.



# After YOUR PR is Merged:

Once your PR is successfully merged, you will get points as per the GSSOC level labels:

- Level 1 : 3 Points.
- Level 2 : 5 Points (May vary).
- Level 3 : 10 Points.

These points will be added to your name on the GSSOC Contributor Leaderboard(On the offcial website).


# Code of Conduct

Please make sure to read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing. We expect all contributors to help maintain a welcoming and respectful environment for everyone.

Thank you for your interest in contributing! Let's build something amazing together.

Happy Coding 💡❤

### Template Packaging (.animpack) Guidelines

Use this when adding, exporting, or importing shareable templates.

- What is an .animpack: A ZIP-based bundle of a template, its assets, and metadata.
- Where it works: The gallery page (`templates.html`) via Import/Export toolbar.

#### Package structure

```text
template-package.animpack (ZIP)
├── manifest.json
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── images/
│   └── fonts/
└── dependencies.json
```

#### manifest.json (minimal schema)

```json
{
  "name": "Template Name",
  "version": "1.0.0",
  "author": "Author Name",
  "description": "Template description",
  "tags": ["animation", "button", "hover"],
  "dependencies": {
    "external": ["gsap", "animate.css"],
    "files": ["styles.css", "script.js"]
  },
  "assets": ["assets/logo.png", "assets/font.woff2"],
  "created": "2025-08-11T18:13:00Z",
  "preview": "preview.jpg"
}
```

- Keep package size under 50MB.
- Ensure all paths listed in `assets` exist in the ZIP.
- `dependencies.external` should list known libraries (e.g., `gsap`, `animate.css`). Versions optional.

#### Dev setup and files

- Core modules:
  - `template-manager.js`: UI + packager/importer logic
  - `package-validator.js`: ZIP and manifest validation
  - `dependency-resolver.js`: CDN loading for externals
  - `template-manager.css`: Dialogs, toolbar, and responsive styles
- Third-party:
  - JSZip via CDN: `https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js`
- `templates.html` includes these files; avoid duplicating includes.

#### Export flow (for contributors)

1. Go to `templates.html`.
2. Select templates using the checkbox on each card.
3. Click “Export Selected” (or “Export All”).
4. Choose compression options and download the `.animpack`.

#### Import flow (for contributors)

1. Click “Import” on `templates.html`.
2. Drag/select a `.animpack` file.
3. Review validation/preview and resolve conflicts.
4. Click Import; template is stored in IndexedDB and appears under “Imported Templates”.

#### Testing checklist for .animpack

- Invalid ZIP file: ensure user-friendly error is shown.
- Missing or invalid `manifest.json`.
- Corrupted or missing required files (e.g., `index.html`).
- Dependency failures (e.g., offline) show clear errors but allow non-strict install.
- Storage quota exceeded: import should fail gracefully with a message.
- Large packages: progress bars should update and UI remains responsive.
- Mobile: dialogs, buttons, and drag-drop are touch friendly and responsive.

Tips to simulate errors:
- Rename a `.zip` to `.animpack` with wrong contents.
- Remove `manifest.json` from a test ZIP.
- Block network (DevTools) to emulate CDN failures.
- Use Storage pane to fill quota, then re-import.

#### PR checklist for template packaging

- [ ] Manifest fields present and valid; assets exist and are referenced.
- [ ] Package under 50MB; only necessary assets included.
- [ ] Clear, actionable error messages.
- [ ] Import/export UI remains accessible and responsive on mobile.
- [ ] No duplicate `<link>/<script>` includes in `templates.html`.
- [ ] Code follows existing style and avoids breaking other pages.
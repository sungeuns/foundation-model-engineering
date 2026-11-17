# Reader feedback and causal diagrams — 2026-11-18

Baseline: `c42fb3b`. The preceding notebook release at `dee03dc` has now passed GitHub Pages deployment and 14 production checks; its earlier checkout delay is retained in the deployment history. The public repository still reports 25 stars and two forks. More than 1,000 stars and external distribution remain unachieved.

## Reader contribution path

The repository already has correction and learning-gap issue forms. A read-only review rejected a generic “try our lab” issue as duplicating those routes. It identified a concrete verification gap instead: local Linux/Jupyter has execution evidence, while hosted Colab and native Windows do not.

- Prepared one narrowly scoped compatibility issue with immutable notebook links, the canonical source hash, environment/result fields and clear completion criteria. It asks for reproducible reports, not stars or engagement. The attempted own-repository issue creation returned GitHub API **403, Resource not accessible by integration**. No issue was created and no alternate credential route was attempted. The exact unposted body is saved in `docs/outreach/notebook-compatibility-issue.md`.
- Corrected the shared footer's generic `/issues/new` link to select the existing `correction.yml` form and prefill its `page` field with the canonical URL. This preserves the lesson and language when a reader reports a problem. It does not submit an issue automatically. GitHub documents custom form-field query parameters in its [issue creation guidance](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query), checked 2026-11-18.
- Fixed CONTRIBUTING's verification command: built-site tests expect the GitHub Pages deployment base, so the documented validation build now matches CI. The ordinary root-path build remains available for local hosting.

These changes make reports more actionable. They do not establish increased reach, engagement or conversion. Authenticated issue-form rendering and submission were not tested; the public link's exact query and rendered site behavior are verified separately.

## Figure review

Mechanical screening followed by inspection found two remaining generated figures that contradicted nearby technical explanations: the multi-token-prediction comparison confused auxiliary prediction depth with backbone depth, and the SSD figure showed backward recurrence arrows and an unscoped constant decay. Scoped source-grounded replacements are recorded in the MTP and SSD companion reports. This is a targeted follow-up, not a new full-book review.

## Verification

- A fresh independent read-only source review checked the SSD arithmetic, both MTP architectures against their primary papers, English/Korean parity, feedback-prefill semantics and the contributor build command. It found a quiz head-numbering inconsistency, which was fixed and rechecked. No remaining actionable finding in that scope; this is not a full EGM protocol or a new whole-book certification.
- Canonical inventory and ledger checks: `npm run test:content`, **10/10 passed**, 107 lesson pairs. Only inspected 20.2 and 20.5 rows were rehashed.
- Deployment-base build on Node 24.19: **216 pages**. `node --test scripts/*.test.mjs`: **70/70 passed**. `git diff --check` passed.
- Inspected every built footer: **216/216** links select `correction.yml` and preserve the exact canonical page URL in `page`. See `growth-2026-11-18-feedback-links.json`. No authenticated issue submission was performed.
- Final built-site browser checks: **12/12 passed** across home, SSD and MTP pages, both languages and 390/1440 widths. Checked source removal, new figure structure/numbers, localized content, math/runtime errors, overflow, footer focus/query and keyboard behavior of the existing interactions, including accepted-prefix values 0–3. See `growth-2026-11-18-reader-feedback-browser.json`.
- Numerically verified the scalar SSD example and executed the existing PyTorch example against an independent chunk-reset recurrence, including finite gradients and a padded shape. Agent companion reports record exact scope and source hashes. Static diagram and changed page screenshots were visually inspected.

Existing production checks for the preceding release are in `growth-2026-11-18-lab-entry-production.json`. Publication of this follow-up is recorded after the workflow finishes.

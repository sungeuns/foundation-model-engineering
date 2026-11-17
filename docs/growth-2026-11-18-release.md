# Release evidence — 2026-11-18

Baseline: `143bbfe0ffb1c8e2b1fb3f838f6b1f2b617084c8` on main. Scope: eight revised English/Korean pairs, three calculated interactions, entry pages/README/contribution forms, localized RSS, and technical discovery fixes. The inventory remains 107 bilingual pairs, 216 HTML pages. No current benchmark scores, model architecture disclosures, prices, or releases were invented.

## Independent review

Applied the EGM review-loop's fresh-context read-only comprehension review at a scaled editorial scope. The persona and repository standards were read by reviewers. This is **not** a claim of the full five-phase EGM protocol or two clean rounds across the whole book.

- Editorial reviewer inspected README, featured lessons, both homepages, five bilingual lesson pairs, and related attention/cache/paging components. No Blocker or Major; three Nits corrected: active-mask formula, available paging actions, and the output-projection boundary in FLOPs accounting.
- Release reviewer inspected feed/date/layout changes, three bilingual figure replacements, and all outreach drafts. Found a Major: date-only RSS identities could miss same-day corrections. Fixed with full commit time and hash; focused follow-up review confirmed resolution.
- Reviewers did not execute tests or render pages. Runtime evidence below comes from the implementation and integration passes.

## Runtime evidence

- Node 24.19.0: `npm run test:content` **10/10 passed** after updating only the eight freshly inspected pair hashes. Canonical inventory checks compare slug, number, order, references, imports, and current evidence hashes.
- `SITE_BASE=/foundation-model-engineering/ npm run build`: **216 HTML pages**, successful. Both RSS endpoints are generated in addition to HTML.
- `node --test scripts/*.test.mjs`: **66/66 passed** after final code changes. Includes same-day feed identities/order, timezone/future/shallow/dirty Git metadata, exact attention calculations, exhaustive finite-pool pass@k checks, existing textbook contracts, canonical/local links, reciprocal language links, sitemap dates and rendered mathematics.
- Six EN/KO Python examples executed by the content implementation pass on Python 3.12 / PyTorch 2.15.0+cpu. Full/chunk/token cache outputs and causal invariants matched; judge order/missing-verdict examples passed. See the scoped content report for assumptions and limits.
- General integration browser pass: **40 page/viewport combinations**, zero page errors, missing hydration, math errors, or document overflow. Includes every changed chapter, pass@k's host page, both homepages, both languages, and widths 390/1440. Featured links and keyboard focus verified.
- Component/figure pass: **24 combinations**, including all attention query choices, both causal-mask states, temperature endpoints, KV selector extrema/zero capacity, pass@k boundaries/clamping, keyboard controls, and the three figure-replacement pairs. Scope and detailed results are in the visual report.
- Final home follow-up covers both languages at 390/1440 after the title change: one main-content H1, localized feed path, keyboard card entry, responsive menu/filter/Escape and no overflow or page errors. Screenshots inspected locally. An actual screenshot of the attention component is included in the README; values were not fabricated.
- `git diff --check`: clean. No unrelated initial working-tree changes existed; no external-account credentials or private analytics were added.

The sandbox prevented Node's synchronous Git subprocess in one test run (`EPERM`); the same tests passed in the normal approved execution environment. This is recorded as an environment limitation, not a passing sandbox run.

## Publication and remaining uncertainty

Push and GitHub Pages deployment are checked after this report is committed. The deployment workflow performs a fresh build from full committed Git history, then repeats the tests. Local Git-derived dates omit dirty manuscripts by design; the committed build and deployed feeds must include the final revisions. The handoff reports the actual commit and verified workflow result.

The starting star count is 25. No star-growth or indexing improvement is claimed at release time. Search Console exclusion reasons and private performance metrics were not accessible. No DEV, HN, Reddit or LinkedIn post was published in this pass. The three outreach files are explicit editorial drafts, not publication receipts.

See [growth actions and channel constraints](growth-2026-11-18.md), [content evidence](growth-2026-11-18-content.md), [visual evidence](growth-2026-11-18-visuals.md), and [SEO evidence](growth-2026-11-18-seo.md). The 1,000+ star goal remains an outcome to measure, not a completed task.

# Runnable entry points and readout teaching — 2026-11-18

Baseline: `ee5b7da`, following the verified content deployment at `7aaa75b`. The public repository still reports 25 stars and two forks at this inspection. The goal of more than 1,000 stars remains unachieved; these changes create useful entry points, not evidence of conversion growth.

## Why this work

The two existing CPU labs already contained independently useful exercises, but the decoder required a script download and local setup before a visitor could try it. Newly added lesson metadata reused a broad description, and all shared chapter links displayed the same book cover. The current source did not establish a new canonical, hreflang or crawler-blocking defect. This pass therefore improves the actual material readers can try and share instead of changing crawl settings speculatively.

## Implemented entry points

- Self-contained English and Korean decoder notebooks embed the unchanged canonical `public/labs/causal_lab.py`. They cover prediction, training, the attention ablation, causal invariance, checkpoint replay, an intentionally invalid mask, corruption of a checkpoint copy, and an exported result packet. No model, dataset, credential or API service is required. Python/PyTorch dependencies remain explicit.
- Added links near the beginning of lesson 7.5 and from both homepages and README. Readers can open the GitHub notebook through Colab or download it for local Jupyter. Colab launch guidance is based on the [official FAQ](https://research.google.com/colaboratory/faq.html). Actual hosted Colab execution has not been verified; local Jupyter execution is recorded separately. Google sign-in and runtime limits are disclosed.
- README also exposes the existing standard-library evaluation exercise, including a retention regression despite a target improvement. These are authored synthetic fixtures, not results from named models.
- Replaced generic descriptions for the learning-path, optimizer, decoder and evaluation lessons with their actual subject and exercise. Page-specific descriptions can help communicate relevance; Google may choose a different snippet. [Google snippet guidance](https://developers.google.com/search/docs/appearance/snippet).
- Added four localized 1200×630 SVG/PNG lab previews. Open Graph, Twitter and structured data use the same selected asset; other pages retain the book cover. These are original text/vector cards, not measured-result plots. See the discovery companion report and generation script.
- Corrected the decoder lesson's existing SFT-template cross-reference from Chapter 8 to section 9.1 in both languages.
- Prepared independently reviewed English/Korean standalone notebook articles in `docs/outreach/tiny-decoder-article.md` and `docs/outreach/tiny-decoder-article-ko.md`. They explain future-input invariance, the matched self-only ablation and checkpoint replay, and disclose AI assistance and the local execution scope. These are unsubmitted drafts.

## Visual and editorial follow-up

Lesson 19.2 replaces two misleading generated images with an explicit decoder-only readout pipeline and an attention-weight/value counterexample. Its interaction computes complete four-token distributions from authored states and a fixed output head. A stable argmax can coexist with a changing distribution; the UI does not imply these are measured layers or calibrated factual confidence. The revised pair also separates residual-state storage from full-vocabulary readout storage and includes an executed CPU PyTorch equivalent. The figure companion report records inspected images, sources, code and browser evidence.

## Independent review

A fresh-context read-only comprehension review inspected the entry copy, notebooks, social previews and layout integration. It found a material Windows portability issue: a text write could change LF source bytes to CRLF and invalidate the canonical-source hash after training. The loader now writes exact UTF-8 bytes and verifies the file bytes before import. The notebooks were regenerated and executed again. Native Windows execution is not claimed. An unresolved mathematical placeholder was also removed before publication.

The review also caught a scope error in the readout formula: some decoders apply a transformation such as a logit soft cap after the linear head. The lesson now identifies the diagram's linear-head assumption and requires the model's complete output path for a faithful real-model probe. The figure review found and fixed a mobile table overflow caused by inline mathematical markup in a redundant header.

The review is scoped editorial/comprehension work, not a claim of full EGM protocol convergence or a new complete manuscript audit. Notebook and figure implementation evidence appears in their companion reports.

## Verified integration

- Canonical inventory and editorial contracts: `npm run test:content`, 10 tests passed; 107 bilingual lesson pairs remain in canonical order. Only inspected 7.5 and 19.2 ledger hashes were updated in this pass.
- Deployment build: `SITE_BASE=/foundation-model-engineering/ npm run build`, 216 pages generated with Node 24.19.
- Repository suite: `node --test scripts/*.test.mjs`, 70 tests passed. This includes built canonical/hreflang links, local links and fragments, metadata/image parity, notebook/source equivalence, and independent numerical fixtures for the readout interaction.
- Existing CPU lab smoke suite: five tests passed. Both notebook languages executed all ten code cells with local Jupyter; the notebook companion report records the environment, values and artifact hashes. Hosted Colab and native Windows execution were not performed.
- Final built-site browser pass: 16 combinations of English/Korean, 390/1440-pixel widths, and home/decoder/evaluation/readout pages passed. Checked runtime errors, math rendering, page overflow, notebook links/downloads, social image responses, all six readout states, matrix disclosure and keyboard selection. Results: `docs/growth-2026-11-18-lab-entry-browser.json`.
- Visually inspected the notebook entry, readout controls and pipeline at desktop and mobile widths. Four original social previews and the separately rendered notebook pages were also inspected.
- `git diff --check` passed before commit.

Content commit `dee03dca16228c6a0256f54bb69b22f19bb92c35` was pushed to `main`. The [GitHub Pages run](https://github.com/sungeuns/foundation-model-engineering/actions/runs/44132482238) completed successfully after a checkout delay. The earlier in-progress observation is preserved in `docs/growth-2026-11-18-lab-entry-deployment.json`; no cause is asserted for the delay. Final production verification passed **14 checks**: eight English/Korean public pages, both notebook downloads, and all four new social PNGs. Downloaded notebook and image hashes match the source assets, and both live readout controls respond with the expected calculated values and keyboard interaction. Evidence: `docs/growth-2026-11-18-lab-entry-production.json`. Hosted Colab execution remains outside this verification.

## Remaining limits

Search Console performance and indexing exclusions remain inaccessible. No new DEV, HN, Reddit or other external promotional post was made. The previously attempted external resource-list issue remains unsubmitted after the recorded GitHub integration 403. No paid campaign, purchased stars or recurring automation was created.

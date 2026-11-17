# Focused discovery and lab previews — 2026-11-18

## Inspection scope

Read the current README, English homepage, featured lessons, learning routes, shared metadata layout, search descriptions, content-revision helper, robots note and prior SEO report. Inspected the two existing lab manuscripts and executable sources. This was a focused follow-up, not another 216-page crawl or an authenticated Search Console audit.

Public search returned the tiny-decoder and experimental-design lessons. Some results for other chapters and the repository retained older text. This is evidence that search snapshots can lag the deployed source; it does not establish Google's indexed-page count, current rankings, exclusion reasons, impressions or clicks. No new canonical, hreflang or robots defect was established from this inspection.

## Concrete opportunities

1. The four new-page descriptions at the beginning of `src/data/search-descriptions.js` repeated the same generic clause. The lab descriptions should name the actual experiment and its requirements: CPU/PyTorch, causal checks and checkpoint replay; standard-library Python, paired cluster uncertainty and decision gates. Root owns these metadata edits. Google's [snippet guidance](https://developers.google.com/search/docs/appearance/snippet) recommends page-specific descriptions, while explaining that Google may instead generate its own query-dependent snippet.
2. Every chapter previously used the same book-cover social image. The two labs now have distinct localized card assets that explain their concrete exercise. This is a sharing-usability improvement and a conversion hypothesis, not evidence of a ranking or star-growth effect. The [Open Graph protocol](https://ogp.me/) defines image and image-alt metadata for representing the shared object.
3. The existing lab download links require the reader to set up or open Python. Notebook launch links near the page introduction and on the README/homepage can make that first experiment easier to begin. The existing `paired_release.py` is a particularly small standard-library-only entrypoint. Google confirms that Colab can load notebooks from GitHub in its [official FAQ](https://research.google.com/colaboratory/faq.html). Notebook generation, execution, launch links and dependency wording belong to the integrating agents, not this asset-only change.

These primary guidance pages were checked on 2026-11-18. No external post, issue, account change or sitemap submission was made by this subtask.

## Implemented assets

- Four 1200 × 630 PNG cards and matching editable SVGs under `public/social/`: `tiny-decoder-{en,ko}` and `paired-evaluation-{en,ko}`.
- `src/data/social-cards.js` maps the two canonical English routes to localized `{ image, alt }` records. Paths start with `/social/`; the parent layout must apply the deployment base. Other lessons should retain the ordinary book cover.
- `scripts/generate-lab-social-cards.mjs` regenerates the vectors and rasters using installed `sharp` and local DejaVu/Noto CJK fonts. Run `node scripts/generate-lab-social-cards.mjs` after installing project dependencies. The committed PNGs do not need fonts at serving time.

The cards retain the existing cream/teal book palette but distinguish the lessons with separate questions and mechanics. Decoder labels describe causal masking, removing past context, and checkpoint replay; they do not imply deleting attention parameters. Evaluation labels preserve paired cases, cluster resampling, and the synthetic offline scope of Pass/Review/Block. Neither card contains invented scores, a model-performance chart, measured traffic, or a promise of production deployment readiness.

All artwork is authored SVG text and geometry, rasterized locally with sharp. No AI image generation, downloaded figure, model invocation or external-image licensing claim is involved.

## Verification and handoff

- Imported the mapping and checked all four referenced PNGs with sharp: PNG format, width 1200, height 630.
- Verified English alternative text contains no Korean prose. Both language cards describe the same experiments; translated decision labels retain the English lab meanings.
- Opened and visually inspected all four PNGs. Revised the decoder ablation label to explicitly remove past context, regenerated the cards, and inspected both changed PNGs again. Text fits inside the canvas and panels, Korean glyphs render, colors and spacing are readable, and no fabricated measurement is shown.
- `git diff --check` passed at scoped handoff. No layout, page, README, shared search-description, CI, dependency or existing test file was changed by this subtask. Root owns layout wiring, rendered metadata regression tests, final build and publication.

Inspected PNG SHA-256 values:

| Asset | SHA-256 |
|---|---|
| `tiny-decoder-en.png` | `8aa08725959d4f74a2278d5f2dbcb2edbc1d0aa1ed6f04af1700d605bedc35e5` |
| `tiny-decoder-ko.png` | `043d2a930a810bf0e187c31750ac236b131280152bba202448c3d0b172f70101` |
| `paired-evaluation-en.png` | `c20d422438f774047e870adc63e387847f7f37a58885539f7b531b9c979f119a` |
| `paired-evaluation-ko.png` | `a1fb53e8b35667d8a2f7d2039920057e5e97ee875a9cbd86a925329c85782d30` |

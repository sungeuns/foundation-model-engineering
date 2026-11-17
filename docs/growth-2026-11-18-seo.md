# Search discovery and returning-reader audit — 2026-11-18

As of 2026-11-18 (Asia/Seoul). This is a public-site and repository audit, not an authenticated Search Console analysis. The baseline predates this change. No ranking, indexing, click-through, or star-growth result is claimed.

## What the evidence shows

- The production sitemap returned HTTP 200 and contains all 216 canonical HTML URLs: two homepages and 107 English/Korean chapter pairs.
- A public HTTP pass checked all 216 URLs for status, self-canonical URL, description, absence of `noindex`, and `en`/`ko`/`x-default` language alternatives. All passed after one retry. The Korean encoder-decoder page initially returned HTTP 503 and then 200; a single transient response does not establish a persistent hosting or indexing defect.
- The first pass had 215 distinct titles and 215 distinct descriptions among its 215 successful responses. The generated-site test separately verifies unique descriptions across all 216 current HTML pages.
- `https://sungeuns.github.io/robots.txt` returned 404. The project-subdirectory robots file returned 200, but it is not the host-root robots file used by crawlers. A missing host-root robots file does **not** itself prohibit crawling. This repository's file cannot advertise its sitemap from the host root. Submit the sitemap through the verified Search Console property; no other repository was changed. Google's [robots.txt location rules](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt) and [sitemap submission guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) describe the distinction.
- The baseline already has page-specific descriptions, self-canonical links, reciprocal language alternatives, Open Graph images, Book/TechArticle and breadcrumb structured data, a complete sitemap, and Git-derived modification dates. Replacing those mechanisms would not explain why particular pages remain unindexed.

The public evidence is saved in [growth-2026-11-18-seo-live.json](growth-2026-11-18-seo-live.json), including the checked URL inventory and retry. A healthy public response establishes crawlability at the time of the request, not Google's indexing decision.

## Changes made

1. Added English and Korean RSS update feeds at `/feed.xml` and `/ko/feed.xml`, relative to the deployment base. Every page exposes an RSS autodiscovery link and a visible subscription link. Each feed contains up to 20 recently edited chapter manuscripts, with localized titles and summaries.
2. Feed entries come from committed MDX revisions. Each item uses the exact UTC commit timestamp and a chapter-URL-plus-commit-hash identifier, so separate same-day edits can produce distinct notices. Entries are sorted by timestamp before the 20-item limit; Git history order breaks same-second ties. A rebuild without new manuscript commits preserves identifiers. An entry is a manuscript-update notice, not a claim about original publication or complete factual revalidation. Unknown, future-dated, shallow-history, or locally dirty revisions are omitted. A future-dated current edit never falls back to an older revision identity. Component-only edits are outside this manuscript feed, and it retains only the latest revision of each of the 20 recent chapters; it is not a complete deployment or revision log.
3. Excluded repeated sidebar, previous/next navigation, and footer text from Google snippets with supported `div[data-nosnippet]` markup. The main chapter text remains eligible. This gives Google a cleaner pool of snippet text; it does not force a particular snippet or increase rankings. See Google's [snippet controls](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#data-nosnippet-attr).
4. Added visible, localized links to save the book with a GitHub star and suggest a correction. The existing GitHub icon alone did not explain those actions. The footer retains AI-assistance disclosure and now localizes it in Korean.
5. Fixed a timezone bug in sitemap/feed dates: Git previously supplied a committer-local calendar date while the helper compared it against UTC today. A current Korean commit could therefore be treated as future for up to nine hours. The helper now compares commit instants and derives a UTC calendar date. This may legitimately differ from the Korean homepage update date by one day.
6. Documented the subdirectory robots limitation in the file itself. No broad crawler blocks, artificial update dates, keyword lists, or unsupported structured-data claims were added.

Google's [AI-features guidance](https://developers.google.com/search/docs/appearance/ai-features) says its normal Search fundamentals apply and additional AI-specific files or special schema are not required. The strongest work here remains clear, source-backed explanations, accessible HTML, useful diagrams, reproducible examples, and descriptive links to the relevant section. RSS is a subscription feature, not a claimed GEO ranking factor.

## Search Console follow-through

The owner's actual Search Console reports are still needed to distinguish these cases. They should not be combined into one “unindexed pages” count.

| Report reason or symptom | Next check | Action justified by the result |
| --- | --- | --- |
| Alternate page with proper canonical / page with redirect | Compare the reported URL with the slash-terminated canonical URL in the sitemap | Keep intentional duplicates consolidated; do not request indexing for every variant |
| Duplicate, Google chose different canonical | Inspect Google's chosen canonical and the declared canonical for an EN/KO pair | Investigate wrong language links, duplicated content, or old URLs before changing tags |
| Discovered, currently not indexed | Inspect discovery source and last crawl for priority chapters | Confirm sitemap submission and link directly to useful chapters from the homepage and relevant external articles |
| Crawled, currently not indexed | Review the retrieved page, last crawl, and its distinct usefulness | Strengthen specific explanations and original examples; request a recheck for a few materially improved canonical pages |
| Server error or not found | Reproduce the specific URL and check a later response | Fix persistent route/hosting faults; do not infer an outage from the isolated retried 503 in this audit |
| Indexed but few clicks | Export query, page, country, device, impressions, clicks, and CTR | Rewrite titles/intros only where the query intent and page content support the change; compare equivalent time windows |

Use the sitemap URL `https://sungeuns.github.io/foundation-model-engineering/sitemap.xml`. Record its Search Console submission status and last read date. For the first measurement pass, inspect the homepages plus the attention explanation, KV-cache calculator, tiny-decoder lab, and evaluation-uncertainty lab. Retain a dated export, then compare a 28-day window after enough recrawling time. Avoid treating impressions, visits, and GitHub stars as interchangeable metrics.

## Verification

- `node scripts/content-dates.test.mjs`: 2/2 pass using isolated temporary Git repositories. Covers UTC date boundaries, commit identity, uncommitted edits, skewed clocks, future-dated latest content, and shallow history. The sitemap still consumes the same path-to-UTC-date map API.
- `node scripts/chapter-feed.test.mjs`: 5/5 pass; covers missing revisions, EN/KO isolation, exact timestamps, stable IDs, same-day GUID changes, same-second history order, sorting before the 20-item limit, XML escaping, and root/subpath deployment.
- Node 24.19.0, `ASTRO_TELEMETRY_DISABLED=1 SITE_BASE=/foundation-model-engineering/ npm run build -- --outDir node_modules/.cache/fme-seo-build`: successful, 216 HTML pages plus endpoints.
- `SEARCH_DIST_DIR=node_modules/.cache/fme-seo-build node scripts/search-metadata.test.mjs`: 5/5 pass across the generated inventory, including canonical/hreflang/social/feed metadata, unique descriptions, local links and fragments, sitemap dates, and rendered math.
- The shared layout was exercised in Chromium at widths 390 and 1440, in both languages: feed URLs returned 200, main text remained outside snippet exclusions, sidebar text remained inside them, mobile topic filtering/Escape worked, and there were no page errors or document overflow. Desktop/mobile footer screenshots were inspected. Results: [growth-2026-11-18-seo-browser.json](growth-2026-11-18-seo-browser.json).
- Both generated feeds parsed successfully as XML with 20 unique revision IDs each.
- `npm run test:content` was run during concurrent content editing: 9/10 passed; the expected remaining failure was the changed attention page's review-ledger hash. Final ledger refresh and the complete final test suite belong to the integrating content pass, not this SEO audit.
- `git diff --check`: clean at this scoped handoff.

The timestamp helper and commit-identity follow-up were unit-tested after the scoped build; the integrating final build must include those fixes. Fresh release review prompted the same-day identity and ordering correction described above. The final deployment must rebuild after committing so Git-derived modification dates and feed entries describe the committed manuscript state.

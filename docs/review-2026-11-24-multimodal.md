# November 24, 2026 multimodal source update

## Scope and inspection

The complete current English and Korean files for 11.2, 11.4, 11.6 and 20.7 were read on 2026-11-24. English changes were written first and reconciled into Korean. This is a bounded source update and continuity review, not a claim that every historical citation on these pages was independently reverified today.

The image-generation page is **11.4 `image-diffusion-models`**; 11.5 is the neighboring video-foundations page. Navigation and page inventory are unchanged. No shared component, dataset, code example, homepage or central review-ledger file was edited by this pass.

## Changes and evidence

| Pages | Change | Primary evidence checked 2026-11-24 |
|---|---|---|
| 11.2 EN/KO | GPT-Live-1.1 (November 19) and Qwen-Audio-3.1-Live (November 23), released/API-only; no public weights or undisclosed codec/training details inferred | [OpenAI changelog](https://developers.openai.com/api/docs/changelog), [GPT-Live-1.1 model](https://developers.openai.com/api/docs/models/gpt-live-1.1), [Qwen changelog](https://docs.qwencloud.com/changelog/models), [Qwen model](https://docs.qwencloud.com/models/qwen-audio-3-1-live) |
| 11.2 EN/KO | Voice interruption, standby, backend cancellation and stale-result suppression are separate contracts; versioned umbrella-color correction example and shared event timeline | [OpenAI session guide](https://developers.openai.com/api/docs/guides/live-conversations), [OpenAI delegation guide](https://developers.openai.com/api/docs/guides/live-delegation), [Qwen delegation guide](https://docs.qwencloud.com/developer-guides/speech/qwen-audio-live) |
| 11.4 EN/KO | Missing November 4 GPT-Image-2.6 Sunburst/Flare release; image generation/editing, separate complexity/quality controls, static SVG and animated GIF endpoint limits | [OpenAI changelog](https://developers.openai.com/api/docs/changelog), [Sunburst model](https://developers.openai.com/api/docs/models/gpt-image-2.6-sunburst), [Flare model](https://developers.openai.com/api/docs/models/gpt-image-2.6-flare), [image guide](https://developers.openai.com/api/docs/guides/image-generation) |
| 11.4 EN/KO | Corrected adjacent diffusion overclaims: discrete DDPM versus continuous formulations, terminal-noise schedule condition, surrogate loss, noisy-marginal score, lossy autoencoding, and absence of guaranteed mode coverage/prompt compliance | [DDPM](https://arxiv.org/abs/2006.11239), [latent diffusion](https://arxiv.org/abs/2112.10752); these replace unsupported generalizations rather than assigning architecture to a closed API |
| 11.6 EN/KO | November 5 Gemini Omni 1.2 Flash GA/API-only fixed-clip case; 3–15-second standard output, 3–10-second interpolation/individual extension, 30-second total extension limit | [Google changelog](https://aistudio.google.com/docs/changelog), [Gemini Omni model documentation](https://aistudio.google.com/docs/models/gemini-omni-flash) |
| 11.6 and 20.7 EN/KO | Genie 4 eligible consumer rollout November 18 and paid developer API November 19; 720p/24 fps with audio, 120-second session ceiling and provider-described strongest coherence during first 45–90 seconds | [Consumer release](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/genie-4-now-available-project-genie/), [developer release](https://blog.google/innovation-and-ai/technology/developers-tools/genie-4-in-gemini-api/), [API changelog](https://aistudio.google.com/docs/changelog), [API model documentation](https://aistudio.google.com/docs/models/genie-4) |
| 11.6 and 20.7 EN/KO | Disclosed Transformer/Gemini Omni Flash/Gemini reasoning basis, undisclosed parameter counts/full data mixture, known physical/spatial/persistence failures; serving availability separated from planning/AGI validation | [Genie 4 research model card](https://deepmind.google/models/model-cards/genie-4/) |
| 11.6 EN/KO | Disconnecting transport is not immediate server termination; explicitly complete a session and verify termination; timed camera/occlusion/control tests | [Genie integration guide](https://aistudio.google.com/docs/genie) |

The Genie 4 research card retains preview/planned-product language. The later dated API release and current API changelog establish developer availability; the chapter records this source distinction explicitly. Neither a 120-second serving limit nor the provider's 45–90-second coherence description is treated as a guaranteed accurate simulation horizon. No independent benchmark or model-performance ranking was invented.

The earlier October video comparison remains labeled a historical snapshot. The November updates do not silently redate all older product statements. Image-generation API outputs are explicitly separated from knowledge of an underlying diffusion architecture. Numeric prices are omitted from these cases.

## Verification

- Node v24.19.0 satisfies the repository's Node requirement.
- Read all eight files in full and reviewed the changed passages and bilingual continuity. The current-file hashes below identify that inspection.
- Scoped structural check passed: matching EN/KO reference URLs/anchors, quiz counts (11.2: six; 11.4: four; 11.6: five; 20.7: five), section counts and displayed formulas; sequential citations; valid frontmatter; local imports/assets/chapter links resolve; English pages contain no Korean prose.
- All fenced code blocks match their corresponding `HEAD` versions exactly. No code smoke test is claimed for this prose-only update.
- `git diff --check` passed for all eight pages.
- `node scripts/frontier-claims-parity.test.mjs` passed all four tests, including the historical comparison date boundary and EN/KO frontier-evidence sections.
- `npm run test:content` was run. The test-worker output reported failure without individual test detail. Running the same test file directly with `node scripts/content-contract.test.mjs` produced **9 pass / 1 fail**: only the current review-inventory hash test failed, beginning at `/chapter-4/various-llm-architectures`, while parallel edits and ledger reconciliation were still in progress. Inventory, navigation, page headings, frontmatter, quizzes/references, citations/imports and ledger coverage checks passed. The coordinating agent must reconcile inspected hashes and rerun the required command.
- The coordinating agent owns the full Astro build and final publication verification. No changed interactive component requires a new interaction exercise in this pass; existing components were not altered. This report does not claim a completed visual render or full build.

## Inspected file hashes

SHA-256 of complete UTF-8 file bytes after this pass:

| File | SHA-256 |
|---|---|
| `src/pages/chapter-11/audio-and-speech-integration.mdx` | `3c8de54d3316183f25505eea48298dc784a4b0a61b55390f944bbc0a60ffef91` |
| `src/pages/ko/chapter-11/audio-and-speech-integration.mdx` | `150f266fee7ca8b40ccdc495d9f7898048b2d7d54991e2d51bbd40978ff03629` |
| `src/pages/chapter-11/image-diffusion-models.mdx` | `5bb8bc33ff8adf86105e24018b03423e9f19e0d29739f64b843c0cbeadea05e8` |
| `src/pages/ko/chapter-11/image-diffusion-models.mdx` | `308de426fdbc7b1c845a4d63be36b83988abe2eb36026affba1dd101194816b7` |
| `src/pages/chapter-11/commercial-video-models.mdx` | `12216aad67ffc900bcfe437f20a7fcf9be618ccc5d617f698f4466ef15ff33cb` |
| `src/pages/ko/chapter-11/commercial-video-models.mdx` | `482a6137c8a368e2d9bab31367b349357ab6f294e86318a2aee303bc9c120f57` |
| `src/pages/chapter-20/path-to-agi-and-world-models.mdx` | `8183cc17179d853f3eeb28ec3a79304d0f964353738881a14598a24d9cb35450` |
| `src/pages/ko/chapter-20/path-to-agi-and-world-models.mdx` | `6d9ae7eb1e161417e7b1d05c8cba110761108178d73e9fbc5da2ed1694dc14e4` |

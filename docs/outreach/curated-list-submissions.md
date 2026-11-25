# Educational resource submissions

On November 25, 2026 (Korea time), Codex submitted two resources on the maintainer’s behalf. Both submissions identify Seongeun So as the author and disclose AI assistance. Use the existing threads for editorial follow-up.

| Collection | Resource submitted | Submission |
| --- | --- | --- |
| Korean LLM Study | The Korean CPU PyTorch lab on causal masking and checkpoint replay, suggested for the Korean resources section | [Issue #2](https://github.com/melocream/awesome-llm-study/issues/2) |
| Awesome Free AI Books | One author-sorted row in the NLP / LLMs table linking to the official book | [PR #13](https://github.com/MarcosSete/awesome-free-ai-books/pull/13) |

Both proposals were open at verification. Listing decisions belong to the respective maintainers.

## Python Trending Weekly

On November 25, 2026 (Korea time), Codex recommended the English CPU copying trace on behalf of the maintainer. The recommendation describes the fixed-seed experiment, links directly to the 13-token comparison and discloses the project's use of AI. The newsletter explicitly accepts author submissions through GitHub. The editor decides whether to publish a recommendation. [Submission #107](https://github.com/chinesehuazhou/python-weekly/issues/107) · [Editorial FAQ](https://weekly.pythoncat.top/en/subscribe/)

## One2N inference engineering reading list

On November 25, 2026 (Korea time), Codex submitted the KV cache capacity calculator for section 1.3. The proposal links to the nine-request example and its tests, states the assumptions, and identifies the book maintainer and AI assistance. Both of the reading list's local checks passed. The PR was open when verified. [Submission #30](https://github.com/one2nc/awesome-inference-engineering/pull/30)

## Kempner Institute Computing Handbook

On November 25, 2026 (Korea time), Codex opened a content discussion on behalf of Seongeun So about adding a CPU replay exercise to the handbook’s checkpoint section. The issue includes a runnable sampler example. In the accompanying training experiment, restoring the sampler reproduced the next batch after 80 updates, while reseeding it repeated the first batch. The issue was open when verified. [Content proposal #471](https://github.com/KempnerInstitute/kempner-computing-handbook/issues/471)

## DAIR.AI NLP Newsletter

On November 25, 2026 (Korea time), Codex submitted the textbook's [lexical and semantic retrieval exercise](https://sungeuns.github.io/foundation-model-engineering/chapter-14/lexical-to-semantic-search/#lexical-dense-example) through the editor's public Tutorial intake on Seongeun So's behalf. The proposal gives a query for which BM25 separates two support titles while their hand-built topic vectors tie, and discloses AI assistance. The form confirmed “Your response has been recorded.” Publication awaits an editorial decision. [Invitation](https://github.com/dair-ai/dair-ai.github.io/wiki/Guides#nlp-newsletter---request-for-submissions) · [Submission form](https://docs.google.com/forms/d/e/1FAIpQLSeeQCvDGcX11pEntWiRUOM0cgn_KA4QOQz-G3v1JjImJwDg4g/viewform)

## Jupyter nbviewer

On November 25, 2026 (Korea time), Codex nominated the [English decoder notebook](https://nbviewer.org/github/sungeuns/foundation-model-engineering/blob/b6a54ff80e80cbf10d68b15d4419bbae2269ef7e/public/labs/tiny-decoder-lab.ipynb) through the public featured-notebook form on Seongeun So's behalf. The pinned version rendered ten code cells in nbviewer and completed all ten in a single anonymous Binder session. The form confirmed “Your response has been recorded.” Homepage selection is pending. [Invitation](https://nbviewer.org/faq#how-do-you-choose-the-notebooks-featured-on-the-nbviewerorg-homepage) · [Submission form](https://docs.google.com/forms/d/e/1FAIpQLSd6AlVvC7KagENypGTcZCmSBWoEd-wy_eU5BtaYW6i6_K5xwg/viewform)

## The Online Books Page

On November 25, 2026 (Korea time), Codex suggested Seongeun So’s English edition for this catalogue hosted by the University of Pennsylvania. Searches of the curated and extended shelves found no entry for the title and author. The suggestion described the CPU decoder exercise, identified the book as independently published with AI assistance, and linked to its selection in Data For Science’s September 23 reading list. The form confirmed “Submission received” and placed the title in the editor’s pending pool. [Catalogue criteria](https://onlinebooks.library.upenn.edu/book-criteria.html) · [Suggestion process](https://onlinebooks.library.upenn.edu/suggest.html) · [Data Science Briefing #337](https://data4sci.com/newsletter/data-science-briefing-337)

## OERSI educational resource index

On November 25, 2026, the OERSI public search API returned the English and Korean textbook homepages for this repository. After commit `d4d4570` reached GitHub Pages, the maintainer's assistant submitted the repository URL once through the catalogue's official record updater. It returned HTTP 200 and `OK`. The repository now declares ten resources, including the length-bucketing lab in each language and both revised serving guides. The first public search following the update still returned the two book records. A successful refresh request does not establish that every declared resource is indexed. [Public catalogue](https://oersi.org/resources/?search=%22Foundation%20Model%20Engineering%22) · [OERSI update instructions](https://github.com/TIBHannover/oer-github-tutorial/blob/main/tutorial.md#immediate-update-in-oersi)

On November 25, all ten current records passed the GitHub importer but failed validation against OERSI’s full metadata schema. Sixteen links between the books and their materials had a single string in the relationship’s type field. After changing those fields to arrays, all ten transformed records passed the same schema, including format checks. The two homepages were the only records found by exact resource URL before this correction. [OERSI metadata schema at the tested revision](https://gitlab.com/oersi/oersi-schema/-/blob/21c8da6cde8a0de62c39b09284048e5371285f80/schemas/metadata/type.json)

After commit `ec58791` was deployed, the default-branch metadata served by GitHub matched the corrected file byte for byte. OERSI accepted one refresh. Its public search API then returned all ten exact resource URLs, up from two before the correction. The eight newly found entries cover both language editions of the decoder lab, the serving EPUB, the KV cache notebook and the length-bucketing lab. In the public catalogue, the Korean decoder result opened the Korean lesson, and both KV notebook cards linked to the notebook section of their respective editions. [Korean decoder in OERSI](https://oersi.org/resources/?search=%22%EC%9E%91%EC%9D%80%20%EB%94%94%EC%BD%94%EB%8D%94%EB%A5%BC%20%ED%95%99%EC%8A%B5%ED%95%98%EA%B3%A0%20%EA%B2%80%EC%A6%9D%ED%95%98%EA%B3%A0%20%EC%9E%AC%EA%B0%9C%ED%95%98%EA%B8%B0%22) · [English KV notebook in OERSI](https://oersi.org/resources/?search=%22Measure%20the%20memory%20used%20by%20a%20decoder%E2%80%99s%20KV%20cache%22)

The English and Korean self-attention worksheets subsequently brought the repository’s declarations to twelve. Each resource opens the corresponding worked example and identifies its two-page PDF as the downloadable format. The public search still returned ten records in the check preceding this change. [English worksheet](https://sungeuns.github.io/foundation-model-engineering/chapter-3/self-attention-mathematics/#attention-weight-example) · [Korean worksheet](https://sungeuns.github.io/foundation-model-engineering/ko/chapter-3/self-attention-mathematics/#attention-weight-example)

After the two PDFs were deployed at commit `bbdcde9`, the OERSI importer accepted one refresh and public search returned all twelve resource IDs. Each worksheet’s public search card and detail page opened the relevant edition, where the PDF download returned the correct file. [Korean worksheet in OERSI](https://oersi.org/resources/aHR0cHM6Ly9zdW5nZXVucy5naXRodWIuaW8vZm91bmRhdGlvbi1tb2RlbC1lbmdpbmVlcmluZy9rby9jaGFwdGVyLTMvc2VsZi1hdHRlbnRpb24tbWF0aGVtYXRpY3MvI2F0dGVudGlvbi13ZWlnaHQtZXhhbXBsZQ==)

The receipt experiment adds English and Korean student activities to the repository metadata. Each points to a standalone reading page and a ZIP with original model inputs, CPU code and measured answers. After deployment, the public OERSI index listed all fourteen resources. In a mobile browser, both new search results led to the corresponding article and the 177,216-byte ZIP. The downloaded SHA-256 was `2f9c72621654652257cc3664cc9e304e0bf6a2d8820f643a1ae7e491f2c2f644` in both editions. [English experiment](https://sungeuns.github.io/foundation-model-engineering/articles/receipt-grounding/) · [Korean experiment](https://sungeuns.github.io/foundation-model-engineering/ko/articles/receipt-grounding/)

## 学习周刊

On November 25, 2026, Codex recommended the length-bucketing CPU experiment to this Chinese-language operations newsletter through its article self-recommendation template. The submission identifies Seongeun So and the AI assistance, notes the English and Korean editions, and distinguishes measured KV tensor payload from process memory or latency. The submitted issue was open when checked. The newsletter's editor decides whether to include the article in an issue. [Submission #229](https://github.com/eryajf/learning-weekly/issues/229) · [Submission guide](https://github.com/eryajf/learning-weekly#readme)

## ML Systems and Whisper community posts

On November 25, 2026, the ML Systems forum listed the DDP case study on its own site. Readers can see the measured updates for two CPU processes, the link to the exact Python revision and the AI authorship disclosure. It appears in **Blog ideas**. Selection for the publication’s article series is pending. [Public forum copy](https://mlsystems.dev/forum/blog-ideas/53-when-a-pytorch-ddp-rank-has-no-valid-targets-what-should-the) · [Original discussion](https://github.com/orgs/MLSysDev/discussions/53)

Whisper’s **Show and tell** has a public example using the 11-second recording from Whisper’s upstream test suite. It includes the measured array lengths, decoding checks and a link to hear the timing error with two synthesized notes. [Whisper discussion #2915](https://github.com/openai/whisper/discussions/2915)

## RSSAmp

On November 25, 2026, RSSAmp accepted the book’s selected-articles feed. Its public listing showed three articles on looped KV caches, Whisper sample rates and length bucketing. Each article’s reader page opened and linked to the corresponding original. The directory reported the feed as active. [Reader listing](https://rssamp.com/foundation-model-engineering-selected-articles) · [Original feed](https://sungeuns.github.io/foundation-model-engineering/articles.xml)

On November 25, the directory subsequently picked up the fourth item, the receipt-grounding experiment. The reader entry linked to the original article. RSSAmp does not expose reader or referral counts on the listing. [Syndicated receipt experiment](https://rssamp.com/foundation-model-engineering-selected-articles/read?p=https%3A%2F%2Fsungeuns.github.io%2Ffoundation-model-engineering%2Farticles%2Freceipt-grounding%2F)

An isolated mobile browser was previously served an RSSAmp pass offer when opening the listing and reader URLs. For direct sharing, use the book’s free article URLs. The English feed keeps each item’s original GUID when its reader URL changes.

## Published Korean coverage and the old Hacker News link

On November 25, 2026, the BrainDetox article about the Korean edition linked to the Korean and English homepages, the GitHub repository and the original Show GN submission. All four links were present in the published HTML. [Korean coverage](https://braindetox.kr/posts/foundation_model_engineering_textbook_korean.html) · [Show GN](https://news.hada.io/topic?id=33697)

The author's April Hacker News submission links to `/founation-model-engineering/`, which returned HTTP 404. This path belongs to the separate GitHub Pages host repository. A draft PR adds a single redirect page there. [Original Hacker News submission](https://news.ycombinator.com/item?id=47850576) · [Host repository PR](https://github.com/sungeuns/sungeuns.github.com/pull/1)

## DevLog Korean RSS suggestion

On November 25, 2026, the DevLog directory listed 25 sources. The book was absent. Once the Korean article feed and its three original reading pages were live, Codex suggested the feed once through the feedback form linked on DevLog’s About page. The message identified the author and the AI assistant, linked the Korean feed and gave the length-bucketing article as a sample. The form displayed its thank-you confirmation. Inclusion in DevLog’s directory is an editorial decision. [DevLog’s collection policy](https://devlogs.co.kr/about) · [Directory](https://devlogs.co.kr/directory) · [Korean article feed](https://sungeuns.github.io/foundation-model-engineering/ko/articles.xml)

## Existing Reddit introduction

On November 25, 2026, the author's earlier r/learnmachinelearning post was still publicly readable. Both its link card and its in-text link opened the English edition. [Original Reddit post](https://www.reddit.com/r/learnmachinelearning/comments/1t79hjc/i_built_an_opensource_textbook_for_learning/).

## Roboflow Blog

On November 25, 2026, Codex submitted *What did a vision model read when the receipt had no total?* for editorial consideration through Roboflow’s public contributor form. The proposal identified Seongeun So as the maintainer, disclosed AI assistance and prior publication, and linked the full English article and its reproducible CPU experiment. The form confirmed receipt. An editorial decision is pending. [Roboflow’s contributor guidelines](https://roboflow.com/contribute) · [Submitted experiment](https://sungeuns.github.io/foundation-model-engineering/articles/receipt-grounding/)

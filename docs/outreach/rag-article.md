# Debug a RAG answer by finding where the evidence disappeared

Status: editorial draft, not submitted. This is an AI-assisted adaptation of the book's RAG failure lesson. The example is fictional; its counts are authored teaching data, not a production benchmark.

A support assistant answers that customers have thirty days to request a refund. The current policy says fourteen. Replacing the language model is one possible intervention, but first locate the policy in the request trace.

There are four useful checkpoints:

| Checkpoint | Question | What a failure suggests |
| --- | --- | --- |
| Candidate retrieval | Was the current policy retrieved at all? | Corpus freshness, chunking, filters, query matching, or recall |
| Reranking | Did it remain among the selected candidates? | Reranker behavior or candidate budget |
| Context packing | Was the decisive clause actually sent to the model? | Truncation, packing, duplicate suppression, or context budget |
| Answer generation | Did the answer follow that clause? | Instruction following, conflicting evidence, citation selection, or abstention policy |

Suppose the relevant evidence appears among retrieved candidates for 90 of 100 evaluated questions. After reranking, 72 retain it. After packing, only 60 contain it in the model's input. The generator cannot recover missing source text by being more obedient.

These are conditional stages. The reranking retention rate is 72/90, not a second end-to-end accuracy score. The packing retention rate is 60/72. The final input has the evidence in 60/100 cases. Keep that distinction visible in the dashboard.

A useful intervention changes one stage at a time. Inject the verified source chunk into the candidates, then repeat the downstream pipeline. Next place the decisive clause directly in the model's input. If the answer becomes correct only after the second intervention, retrieval alone was not the whole problem. These interventions are diagnostic; they are not production scores because they use information that the normal system may not have.

Record document version, chunk identifier, candidates, reranker scores, packed context, and answer citations. Check permissions before retrieval and when assembling context. A correct answer derived from an unauthorized document is still a failed system.

Avoid a universal rule such as “cosine similarity below 0.8 means no answer.” Scores depend on the embedding model, index, query distribution, and preprocessing. Calibrate the abstention rule on held-out examples with the actual cost of wrong answers and missed answers. Recheck after changing the pipeline.

For a deeper mechanism and operational checklist, see [RAG failure modes and operational design](https://sungeuns.github.io/foundation-model-engineering/chapter-14/rag-failure-modes-and-operational-design/). Primary background: [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401) and [Lost in the Middle](https://arxiv.org/abs/2307.03172).

The source book is an independent, AI-assisted open-source project maintained by Seongeun So.

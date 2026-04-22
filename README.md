# 📘 Foundation Model Engineering: From Theory to Production

This is an open-source learning resource, structured as a textbook, for readers who want to understand the engineering stack behind modern Foundation Models in a serious way. The primary audience is:

- **AI Engineers** building or evaluating LLM systems, inference stacks, RAG pipelines, and agentic workflows.
- **Research-Oriented Readers** who want a broad but technically grounded map of the field, from model fundamentals to current architecture and systems trends.

If you have ever wondered:
- *Why did the field evolve from RNNs to Transformers, MoE systems, long-context serving, and agentic architectures?*
- *How do modern models trade off memory, throughput, latency, quality, and alignment?*
- *What mathematical and systems ideas actually matter when moving from papers to practical AI systems?*

This resource is for you. It goes beyond surface-level summaries and API usage, combining rigorous conceptual explanations, concept-focused PyTorch implementations, and **interactive web-based visualizers** for difficult topics.

This book is **not** optimized as a beginner-friendly introduction for all software developers. It assumes that the reader is comfortable with technical abstraction and is willing to engage with systems, modeling trade-offs, and some mathematical detail.

> **Translation Notice**: The Korean version of this resource has been translated with the assistance of Gemini. As a result, some phrasing might feel unnatural. We actively welcome improvements and corrections! Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) guide to see how you can contribute to making this resource better.

> **A Living Document**: The field of AI and Foundation Models is evolving at a breakneck pace. While we strive to include the latest advancements and models (such as Llama, DeepSeek, Qwen, and Gemma), new breakthroughs happen every day. This project aims to be a living document, and we highly encourage contributions, updates, and corrections from the community to keep this resource current. Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) guide to see how you can help!

## 🌟 Key Features
- **End-to-End Scope**: Covers model history, architectures, scaling, post-training, inference, RAG, agents, safety, interpretability, and emerging directions.
- **Systems + Modeling Perspective**: Emphasizes why architectural ideas matter for training, serving, memory, throughput, and product design.
- **Practical Code Examples**: Includes concept-focused PyTorch implementations to ground abstract ideas.
- **Interactive Visualizations**: Uses web-based visualizers to make difficult mechanics more intuitive.
- **Living Document**: Includes recent topics and welcomes corrections, updates, and contributions as the field evolves.

## 🎯 Reader Fit

This book is a strong fit if you are:

- an AI engineer who wants deeper architectural and systems intuition beyond framework usage
- a researcher or advanced learner who wants a broad conceptual map of the foundation model landscape
- a developer moving into LLM infrastructure, retrieval, or agentic systems work

This book may feel steep if you are:

- looking for a first introduction to machine learning or deep learning
- primarily interested in prompt engineering or API integration without model/system depth
- expecting a purely production playbook with minimal theory

---

## Tech Stack
- **Framework:** Astro 6
- **Content:** MDX
- **Styling:** Vanilla CSS (Book-like theme)
- **Fonts:** Pretendard (Korean/English), Noto Sans CJK (Chinese/Japanese)

## Getting Started

To run this project locally, you need Node.js v22 or higher.

### Prerequisites

If you are using `nvm`, you can switch to Node 22:

```bash
source ~/.nvm/nvm.sh
nvm use 22
```

If you don't have Node 22 installed via nvm:

```bash
nvm install 22
```

### Installation

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

### Build

To build the static site:

```bash
npm run build
```

The output will be in the `dist/` directory.

To preview the production build locally, use:

```bash
npm run preview
```

If you use `serve`, run `serve dist` instead of `serve -s dist`. This project is a static multi-page Astro site, not a single-page app. The `-s` option forces all routes back to the root `index.html`, which breaks page navigation and locale switching.

## GitHub Pages

For local development and normal local builds, the site uses the root path `/`.

Repository:

`https://github.com/sungeuns/foundation-model-engineering`

For GitHub Pages repo hosting under:

`https://sungeuns.github.io/foundation-model-engineering/`

build with:

```bash
SITE_BASE=/foundation-model-engineering/ npm run build
```

That sets Astro's `base` only for the deployment build, so local `npm run dev` routing stays normal while GitHub Pages still gets the correct subpath links.

## ⚖️ License & Disclaimer

This project is licensed under the [MIT License](LICENSE).
For more information regarding the project's status as a personal, non-affiliated open-source resource, please see the [DISCLAIMER](DISCLAIMER.md) file.

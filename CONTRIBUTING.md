# Contribution guide

Help a reader understand a mechanism, reproduce an example, or catch a misleading claim. A small correction with evidence is useful; you do not need to write a new chapter.

We welcome contributions of all kinds, including:
- **Errata**: Fixing typos, broken links, or incorrect math/code.
- **Translations**: Improving natural Korean and preserving English/Korean technical parity.
- **New Content**: Proposing new sections or chapters on recent advancements.
- **Code Improvements**: Optimizing the PyTorch examples or adding new interactive visualizers.

## How to Contribute

### 1. Reporting Issues
Use the [correction or learning-gap forms](https://github.com/sungeuns/foundation-model-engineering/issues/new/choose). Include the page and a source, counterexample, or reproduction when available. Issues in English or Korean are welcome. Please omit credentials and private training or evaluation data.

### 2. Submitting Changes (Pull Requests)
1. **Fork** the repository and create your branch from `main`.
2. If you are adding new content, please discuss it in an issue first.
3. Use Node 22.12.0 or newer and install with `npm ci`. Make your changes, then run:
   ```bash
   npm run test:content
   SITE_BASE=/foundation-model-engineering/ npm run build
   node --test scripts/*.test.mjs
   git diff --check
   ```
   The rendered-site tests check GitHub Pages URLs, so this validation build needs the deployment base. Plain `npm run build` remains available for a site served at `/`.
4. Commit your changes with a descriptive commit message.
5. Push to your fork and submit a **Pull Request** (PR) against the `main` branch.

## Guidelines

### Content and Tone
- Write directly. Start with a concrete question or failure, explain the mechanism, and show what the reader can test.
- Use clear analogies and metaphors where appropriate to explain complex concepts.
- Ensure all content is factually accurate and references reliable sources (papers, technical reports).
- Read [AGENTS.md](AGENTS.md) for citation, benchmark, training-example, and review-evidence requirements. Date mutable claims and label undisclosed details rather than guessing.
- Edit English first, then the Korean peer. Keep formulas, examples, quizzes, limitations, and references equivalent. If you cannot verify the translation, say so in the PR.
- Changed chapter hashes invalidate the review ledger. Record a new inspection only after reading the current pair; otherwise mark that row `Mechanical only` with `—` hashes. A maintainer can complete the review before merging.

### Code Standards
- PyTorch code should be clean, well-commented, and conceptually correct for educational purposes.
- Use standard deep learning conventions (e.g., row vectors for matrix multiplication in code).
- Keep code snippets concise and focused on the specific mechanism being explained.
- Execute new runnable examples and record environment assumptions. Put a limitation block above simplified code. For changed interactions, check keyboard behavior, missing data, and desktop/mobile layouts in both languages.

### Language and Localization
- Technical terms can be kept in English or transliterated to the target language if it is standard practice in the AI community.
- For Korean translations, ensure natural phrasing and avoid overly literal translations that sound awkward in a technical context.

## License
By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).

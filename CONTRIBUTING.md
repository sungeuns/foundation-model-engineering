# Contribution guide

Thank you for your interest in contributing to this open-source textbook! This project aims to be a living document, providing up-to-date and deep engineering insights into Foundation Models.

We welcome contributions of all kinds, including:
- **Errata**: Fixing typos, broken links, or incorrect math/code.
- **Translations**: Translating content to other languages (we currently support English and Korean).
- **New Content**: Proposing new sections or chapters on recent advancements.
- **Code Improvements**: Optimizing the PyTorch examples or adding new interactive visualizers.

## How to Contribute

### 1. Reporting Issues
If you find a typo, a broken link, or a technical error, please open an **Issue** on GitHub. Describe the problem and provide the file path and line number if possible.

### 2. Submitting Changes (Pull Requests)
1. **Fork** the repository and create your branch from `main`.
2. If you are adding new content, please discuss it in an issue first.
3. Make your changes and ensure the project still builds successfully:
   ```bash
   npm run build
   ```
4. Commit your changes with a descriptive commit message.
5. Push to your fork and submit a **Pull Request** (PR) against the `main` branch.

## Guidelines

### Content and Tone
- Maintain a highly professional and expert tone, suitable for a textbook.
- Use clear analogies and metaphors where appropriate to explain complex concepts.
- Ensure all content is factually accurate and references reliable sources (papers, technical reports).

### Code Standards
- PyTorch code should be clean, well-commented, and conceptually correct for educational purposes.
- Use standard deep learning conventions (e.g., row vectors for matrix multiplication in code).
- Keep code snippets concise and focused on the specific mechanism being explained.

### Language and Localization
- Technical terms can be kept in English or transliterated to the target language if it is standard practice in the AI community.
- For Korean translations, ensure natural phrasing and avoid overly literal translations that sound awkward in a technical context.

## License
By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).

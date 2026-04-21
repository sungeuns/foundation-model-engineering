import React, { useState } from 'react';
import './SearchComparisonVisualizer.css';

interface Document {
  id: number;
  text: string;
  lang: string;
}

const sampleDocuments: Document[] = [
  { id: 1, text: "How to fix a punctured wheel?", lang: "en" },
  { id: 2, text: "자동차 바퀴 펑크 수리 방법 (How to fix a car wheel puncture)", lang: "ko" },
  { id: 3, text: "Product activation code: XJ-992-B.", lang: "en" },
  { id: 4, text: "General guide on web development and 404 errors.", lang: "en" },
  { id: 5, text: "Deep learning textbook by Goodfellow.", lang: "en" },
];

interface SearchResult {
  doc: Document;
  score: number;
}

export default function SearchComparisonVisualizer() {
  const [query, setQuery] = useState('');
  const [keywordResults, setKeywordResults] = useState<SearchResult[]>([]);
  const [semanticResults, setSemanticResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;

    setSearched(true);
    const lowerQuery = query.toLowerCase();

    // Simulate Keyword Search (BM25-like but simplified)
    const kwResults: SearchResult[] = sampleDocuments
      .map(doc => {
        const docLower = doc.text.toLowerCase();
        const words = lowerQuery.split(' ');
        let score = 0;
        words.forEach(word => {
          if (docLower.includes(word)) score += 1;
        });
        return { doc, score };
      })
      .filter(res => res.score > 0)
      .sort((a, b) => b.score - a.score);

    setKeywordResults(kwResults);

    // Simulate Semantic Search (Hardcoded for specific illustrative queries)
    let semResults: SearchResult[] = [];

    if (lowerQuery.includes('flat tire') || lowerQuery.includes('puncture')) {
      semResults = [
        { doc: sampleDocuments[0], score: 0.92 },
        { doc: sampleDocuments[1], score: 0.88 }, // Cross-lingual match!
      ];
    } else if (lowerQuery.includes('xj-992-b')) {
      semResults = [
        { doc: sampleDocuments[3], score: 0.35 }, // Confused with other text
        { doc: sampleDocuments[2], score: 0.20 }, // Low score for exact match in semantic space
      ];
    } else if (lowerQuery.includes('ai book') || lowerQuery.includes('deep learning')) {
      semResults = [
        { doc: sampleDocuments[4], score: 0.91 },
      ];
    } else {
      // Fallback random-ish scores for other queries to show it "tries"
      semResults = sampleDocuments
        .map(doc => ({ doc, score: Math.random() * 0.3 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);
    }

    setSemanticResults(semResults);
  };

  const presetQueries = [
    "flat tire",
    "XJ-992-B",
    "deep learning book"
  ];

  return (
    <div className="search-visualizer glass">
      <div className="search-header">
        <h3>Semantic vs. Keyword Search</h3>
        <p>Try the preset queries to see the difference in behavior.</p>
      </div>

      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter query or select a preset below..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      <div className="presets">
        {presetQueries.map(q => (
          <button key={q} onClick={() => { setQuery(q); handleSearch(); }} className="preset-btn">
            "{q}"
          </button>
        ))}
      </div>

      {searched && (
        <div className="results-container">
          <div className="results-column">
            <h4>Lexical (Keyword) Results</h4>
            {keywordResults.length > 0 ? (
              keywordResults.map(res => (
                <div key={res.doc.id} className="result-item">
                  <span className="doc-text">{res.doc.text}</span>
                  <span className="score">Matches: {res.score}</span>
                </div>
              ))
            ) : (
              <div className="no-results">No exact keyword matches found.</div>
            )}
          </div>

          <div className="results-column">
            <h4>Semantic (Embedding) Results</h4>
            {semanticResults.length > 0 ? (
              semanticResults.map(res => (
                <div key={res.doc.id} className="result-item semantic">
                  <span className="doc-text">{res.doc.text}</span>
                  <span className="score">Similarity: {res.score.toFixed(2)}</span>
                  {res.doc.lang === 'ko' && <span className="badge">Cross-Lingual</span>}
                </div>
              ))
            ) : (
              <div className="no-results">No semantic matches found.</div>
            )}
          </div>
        </div>
      )}

      <div className="explanation-box">
        <h5>💡 Observations</h5>
        <ul>
          <li>Search for <strong>"flat tire"</strong>: Keyword search fails (vocabulary mismatch), but Semantic search finds both English and Korean documents (cross-lingual).</li>
          <li>Search for <strong>"XJ-992-B"</strong>: Keyword search finds it perfectly. Semantic search gives low scores because it struggles with specific rare tokens like product codes.</li>
        </ul>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import './visualizers.css';

const NgramContaminationVisualizer: React.FC = () => {
  const [textA, setTextA] = useState("The quick brown fox jumps over the lazy dog");
  const [textB, setTextB] = useState("A quick brown fox leaps over a lazy dog");
  const [nSize, setNSize] = useState(3);

  const generateNgrams = (text: string, n: int) => {
    const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const ngrams = new Set<string>();
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.add(tokens.slice(i, i + n).join(" "));
    }
    return ngrams;
  };

  const { ngramsA, ngramsB, intersection, union, jaccard } = useMemo(() => {
    const setA = generateNgrams(textA, nSize);
    const setB = generateNgrams(textB, nSize);
    
    const intersectionSet = new Set([...setA].filter(x => setB.has(x)));
    const unionSet = new Set([...setA, ...setB]);
    
    const jaccardScore = unionSet.size === 0 ? 0 : intersectionSet.size / unionSet.size;

    return {
      ngramsA: Array.from(setA),
      ngramsB: Array.from(setB),
      intersection: Array.from(intersectionSet),
      union: Array.from(unionSet),
      jaccard: jaccardScore
    };
  }, [textA, textB, nSize]);

  return (
    <div className="ngram-visualizer-container">
      <h3 className="visualizer-title">Interactive N-Gram Overlap Analysis</h3>
      
      <div className="input-group">
        <label>Text A (Training Document):</label>
        <textarea 
          value={textA} 
          onChange={(e) => setTextA(e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="input-group">
        <label>Text B (Benchmark Question):</label>
        <textarea 
          value={textB} 
          onChange={(e) => setTextB(e.target.value)}
          rows={2}
        />
      </div>

      <div className="slider-group">
        <label>N-Gram Size (N = {nSize}):</label>
        <input 
          type="range" 
          min="1" 
          max="6" 
          value={nSize} 
          onChange={(e) => setNSize(parseInt(e.target.value))} 
        />
        <p className="helper-text">Adjust N to see how exact match sensitivity changes.</p>
      </div>

      <div className="stats-board">
        <div className="stat-box">
          <span className="stat-label">Jaccard Similarity</span>
          <span className="stat-value">{(jaccard * 100).toFixed(1)}%</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Intersection | Union</span>
          <span className="stat-value">{intersection.length} | {union.length}</span>
        </div>
      </div>

      <div className="ngrams-display">
        <div className="ngram-column">
          <h4>Text A N-Grams</h4>
          <ul>
            {ngramsA.length > 0 ? ngramsA.map((ngram, idx) => (
              <li key={idx} className={intersection.includes(ngram) ? 'highlight-match' : ''}>
                "{ngram}"
              </li>
            )) : <li className="empty-state">No n-grams (text too short)</li>}
          </ul>
        </div>
        
        <div className="ngram-column">
          <h4>Text B N-Grams</h4>
          <ul>
            {ngramsB.length > 0 ? ngramsB.map((ngram, idx) => (
              <li key={idx} className={intersection.includes(ngram) ? 'highlight-match' : ''}>
                "{ngram}"
              </li>
            )) : <li className="empty-state">No n-grams (text too short)</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NgramContaminationVisualizer;
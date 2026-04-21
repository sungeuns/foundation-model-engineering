import React, { useState, useMemo } from 'react';
import './visualizers.css';

const RRFVisualizer = () => {
  const [k, setK] = useState(60);

  const docs = [
    { id: 'System X Manual', denseRank: 4, sparseRank: 1 },
    { id: 'Guide to 404 Errors', denseRank: 1, sparseRank: 4 },
    { id: 'System X 404 Log', denseRank: 2, sparseRank: 2 },
  ];

  const fusedDocs = useMemo(() => {
    return docs.map(doc => {
      const denseScore = 1 / (k + doc.denseRank);
      const sparseScore = 1 / (k + doc.sparseRank);
      const totalScore = denseScore + sparseScore;
      return { ...doc, denseScore, sparseScore, totalScore };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [k]);

  const denseSorted = [...docs].sort((a, b) => a.denseRank - b.denseRank);
  const sparseSorted = [...docs].sort((a, b) => a.sparseRank - b.sparseRank);

  return (
    <div className="rrf-container">
      <div className="rrf-header">
        <h3>Reciprocal Rank Fusion (RRF) Demo</h3>
        <p><strong>Query:</strong> "Error 404 on legacy system X"</p>
        
        <div className="slider-container">
          <label>
            Constant k: <strong>{k}</strong>
          </label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={k} 
            onChange={(e) => setK(Number(e.target.value))} 
            className="rrf-slider"
          />
        </div>
        <p className="rrf-desc">
          RRF formula: Score = 1 / (k + rank_dense) + 1 / (k + rank_sparse)
          <br/>
          Adjust k to see how the fused ranking changes. Higher k favors balanced results.
        </p>
      </div>

      <div className="rrf-columns">
        <div className="rrf-column dense-col">
          <h4>Dense Rank (Meaning)</h4>
          {denseSorted.map(doc => (
            <div key={doc.id} className="rrf-card">
              <span className="rank-badge">#{doc.denseRank}</span>
              <span className="doc-title">{doc.id}</span>
            </div>
          ))}
        </div>

        <div className="rrf-column sparse-col">
          <h4>Sparse Rank (Keywords)</h4>
          {sparseSorted.map(doc => (
            <div key={doc.id} className="rrf-card">
              <span className="rank-badge">#{doc.sparseRank}</span>
              <span className="doc-title">{doc.id}</span>
            </div>
          ))}
        </div>

        <div className="rrf-column fused-col">
          <h4>Fused Result (RRF)</h4>
          {fusedDocs.map((doc, index) => (
            <div key={doc.id} className={`rrf-card highlight ${index === 0 ? 'winner' : ''}`}>
              <span className="rank-badge">#{index + 1}</span>
              <div className="fused-details">
                <span className="doc-title">{doc.id}</span>
                <span className="score">
                  1/({k}+{doc.denseRank}) + 1/({k}+{doc.sparseRank}) = {doc.totalScore.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="rrf-explanation">
        <h5>💡 Observation</h5>
        <p>
          At k=60, **System X 404 Log** wins because it ranks well in both (2nd place), even though it is not #1 in either. 
          If you lower k significantly (e.g., to k=1), top-ranked items dominate, and it becomes a tie or favors the specialists.
        </p>
      </div>
    </div>
  );
};

export default RRFVisualizer;
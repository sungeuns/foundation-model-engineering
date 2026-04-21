import React, { useState, useEffect } from 'react';
import './visualizers.css';

const SparsityVisualizer: React.FC = () => {
  const [method, setMethod] = useState<'none' | 'magnitude' | 'wanda' | 'semi-structured'>('none');
  
  // 4x8 Weight Matrix
  const initialWeights = [
    [ 0.1, -0.9,  0.2,  0.4, -0.1,  0.8, -0.3,  0.5],
    [-0.5,  0.2, -0.1, -0.8,  0.6, -0.2,  0.1, -0.4],
    [ 0.3, -0.4,  0.7, -0.2, -0.5,  0.3, -0.9,  0.1],
    [-0.2,  0.5, -0.3,  0.1,  0.4, -0.7,  0.2, -0.6]
  ];

  // Activation norms per input channel (Notice the massive outlier at index 1 and 6)
  const activationNorms = [1.0, 50.0, 1.2, 0.8, 1.1, 0.9, 40.0, 1.0];

  const [prunedMask, setPrunedMask] = useState<boolean[][]>(
    Array(4).fill(Array(8).fill(false))
  );

  useEffect(() => {
    const newMask = Array(4).fill(null).map(() => Array(8).fill(false));
    
    if (method === 'none') {
      setPrunedMask(newMask);
      return;
    }

    if (method === 'magnitude') {
      // Prune lowest 50% globally based on absolute weight
      const allWeights = initialWeights.flat().map(Math.abs);
      const threshold = [...allWeights].sort((a, b) => a - b)[Math.floor(allWeights.length / 2)];
      
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
          if (Math.abs(initialWeights[r][c]) < threshold) {
            newMask[r][c] = true;
          }
        }
      }
    } else if (method === 'wanda') {
      // Prune lowest 50% per row based on |W| * ||X||
      for (let r = 0; r < 4; r++) {
        const scores = initialWeights[r].map((w, c) => Math.abs(w) * activationNorms[c]);
        const threshold = [...scores].sort((a, b) => a - b)[Math.floor(scores.length / 2)];
        for (let c = 0; c < 8; c++) {
          if (scores[c] < threshold) {
            newMask[r][c] = true;
          }
        }
      }
    } else if (method === 'semi-structured') {
      // 2:4 sparsity based on Wanda scores
      for (let r = 0; r < 4; r++) {
        for (let block = 0; block < 2; block++) {
          const blockStart = block * 4;
          const scores = [];
          for (let i = 0; i < 4; i++) {
            const c = blockStart + i;
            scores.push({ index: c, score: Math.abs(initialWeights[r][c]) * activationNorms[c] });
          }
          // Sort ascending to find the 2 smallest
          scores.sort((a, b) => a.score - b.score);
          newMask[r][scores[0].index] = true;
          newMask[r][scores[1].index] = true;
        }
      }
    }
    
    setPrunedMask(newMask);
  }, [method]);

  return (
    <div className="sparsity-visualizer">
      <div className="controls">
        <button className={method === 'none' ? 'active' : ''} onClick={() => setMethod('none')}>Original (Dense)</button>
        <button className={method === 'magnitude' ? 'active' : ''} onClick={() => setMethod('magnitude')}>Magnitude (50%)</button>
        <button className={method === 'wanda' ? 'active' : ''} onClick={() => setMethod('wanda')}>Wanda (50%)</button>
        <button className={method === 'semi-structured' ? 'active' : ''} onClick={() => setMethod('semi-structured')}>2:4 Sparsity (Wanda)</button>
      </div>

      <div className="visualization-container">
        <div className="activations-panel">
          <h4>Activation Norms (||X||)</h4>
          <div className="activations-row">
            {activationNorms.map((norm, idx) => (
              <div key={`act-${idx}`} className={`activation-cell ${norm > 10 ? 'outlier' : ''}`}>
                {norm.toFixed(1)}
              </div>
            ))}
          </div>
        </div>

        <div className="weights-panel">
          <h4>Weight Matrix (W)</h4>
          <div className="matrix">
            {initialWeights.map((row, rIdx) => (
              <div key={`row-${rIdx}`} className="matrix-row">
                {row.map((val, cIdx) => (
                  <div 
                    key={`cell-${rIdx}-${cIdx}`} 
                    className={`matrix-cell ${prunedMask[rIdx][cIdx] ? 'pruned' : ''} ${activationNorms[cIdx] > 10 && !prunedMask[rIdx][cIdx] ? 'protected' : ''}`}
                  >
                    {prunedMask[rIdx][cIdx] ? '0.0' : val.toFixed(1)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="explanation-panel">
        {method === 'none' && <p><strong>Dense Matrix:</strong> Original weights. The top two activation channels (50.0, 40.0) represent massive outliers.</p>}
        {method === 'magnitude' && <p><strong>Magnitude Pruning:</strong> Zeros out the half with the smallest absolute weight values. Risks destroying core weights (e.g., -0.9 in the first row) that dictate the output when combined with massive activation outliers.</p>}
        {method === 'wanda' && <p><strong>Wanda (Row-wise Unstructured Sparsity):</strong> Scores based on the product of weight magnitude and activation norm. Weights in channels with outliers (red borders) are protected, preserving core logic pathways.</p>}
        {method === 'semi-structured' && <p><strong>2:4 Semi-structured Sparsity:</strong> Uses Wanda scores but divides weights into blocks of 4, zeroing exactly 2. This satisfies the hardware requirements of NVIDIA Sparse Tensor Cores.</p>}
      </div>
    </div>
  );
};

export default SparsityVisualizer;
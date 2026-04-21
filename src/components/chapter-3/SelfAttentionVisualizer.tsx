import React, { useState } from 'react';
import './visualizers.css';

export const SelfAttentionVisualizer = () => {
  const words = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
  const [selectedWord, setSelectedWord] = useState(0);

  // Hardcoded attention scores for demonstration
  // Each row is a query, each column is a key
  const attentionScores = [
    [0.5, 0.1, 0.1, 0.1, 0.1, 0.1], // The -> focuses on itself
    [0.1, 0.6, 0.2, 0.05, 0.05, 0.0], // cat -> focuses on itself and 'sat'
    [0.05, 0.3, 0.5, 0.1, 0.05, 0.0], // sat -> focuses on 'cat' and itself
    [0.0, 0.05, 0.15, 0.5, 0.2, 0.1], // on -> focuses on itself and 'the'
    [0.0, 0.0, 0.05, 0.2, 0.6, 0.15], // the -> focuses on 'mat'
    [0.0, 0.0, 0.0, 0.1, 0.3, 0.6]  // mat -> focuses on itself and 'the'
  ];

  return (
    <div className="sav-container">
      <h3 className="sav-title">Self-Attention Weight Visualizer</h3>
      <p className="sav-description">Click on a word to see its attention distribution (as a Query) across all words (as Keys).</p>
      
      <div className="sav-words">
        {words.map((word, idx) => (
          <button 
            key={idx}
            onClick={() => setSelectedWord(idx)}
            className={`sav-word ${selectedWord === idx ? 'sav-word-active' : ''}`}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="sav-display">
        <h4 className="sav-display-title">Attention from "<strong>{words[selectedWord]}</strong>":</h4>
        <div className="sav-grid">
          {words.map((word, idx) => {
            const score = attentionScores[selectedWord][idx];
            return (
              <div key={idx} className="sav-cell">
                <div className="sav-cell-word">{word}</div>
                <div className="sav-bar-container">
                  <div 
                    className="sav-bar" 
                    style={{ width: `${score * 100}%`, opacity: score + 0.2 }}
                  ></div>
                </div>
                <div className="sav-cell-score">{score.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sav-explanation">
        <p>
          Each bar represents the Softmax score: Softmax( Q_i K_j^T / sqrt(d_k) )
        </p>
        <p>
          Notice how nouns like "cat" and "mat" attend strongly to themselves and related verbs or determiners.
        </p>
      </div>
    </div>
  );
};

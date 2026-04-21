import React, { useState } from 'react';
import './visualizers.css';

const InductionHeadVisualizer: React.FC = () => {
    const tokens = ["<BOS>", "Harry", "Potter", "is", "a", "wizard.", "Harry", "Potter"];
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);

    // Generate simulated attention matrix for an induction head
    const getAttentionWeight = (row: number, col: number) => {
        if (col > row) return 0; // Causal masking
        
        // Induction head pattern: Attend to the token *after* the previous occurrence of the current token
        if (row === 6 && col === 2) return 0.85; // 'Harry' attends to 'Potter'
        if (row === 7 && col === 3) return 0.90; // 'Potter' attends to 'is'
        
        // Local attention fallback
        if (row === col) return 0.1;
        if (row === col + 1) return 0.05;
        
        return 0.01; // Background noise
    };

    const matrix = Array.from({ length: tokens.length }, (_, r) => 
        Array.from({ length: tokens.length }, (_, c) => getAttentionWeight(r, c))
    );

    return (
        <div className="induction-visualizer">
            <h4 className="visualizer-title">Induction Head Attention Matrix</h4>
            <div className="matrix-container">
                <div className="col-labels">
                    <div className="empty-corner"></div>
                    {tokens.map((token, i) => (
                        <div key={`col-${i}`} className={`col-label ${hoveredCol === i ? 'highlight' : ''}`}>
                            {token}
                        </div>
                    ))}
                </div>
                {tokens.map((rowToken, r) => (
                    <div key={`row-${r}`} className="matrix-row">
                        <div className={`row-label ${hoveredRow === r ? 'highlight' : ''}`}>
                            {rowToken}
                        </div>
                        {tokens.map((_, c) => {
                            const weight = matrix[r][c];
                            const isCausalMasked = c > r;
                            const isHighlighted = hoveredRow === r && hoveredCol === c;
                            const isInductionPattern = (r === 6 && c === 2) || (r === 7 && c === 3);
                            
                            return (
                                <div 
                                    key={`cell-${r}-${c}`}
                                    className={`matrix-cell ${isCausalMasked ? 'masked' : ''} ${isHighlighted ? 'active' : ''} ${isInductionPattern ? 'induction-hot' : ''}`}
                                    style={{ 
                                        backgroundColor: isCausalMasked ? '#f0f0f0' : `rgba(59, 130, 246, ${weight})`
                                    }}
                                    onMouseEnter={() => { setHoveredRow(r); setHoveredCol(c); }}
                                    onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}
                                >
                                    {!isCausalMasked && <span className="tooltip">{(weight * 100).toFixed(1)}%</span>}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="visualizer-caption">
                <p><strong>How to read:</strong> Rows are <em>Query</em> (current token), columns are <em>Key</em> (attended token).</p>
                <p>Notice how the second "Harry" (Row 6) strongly attends to the first "Potter" (Col 2). This is the induction mechanism predicting the next token.</p>
            </div>
        </div>
    );
};

export default InductionHeadVisualizer;
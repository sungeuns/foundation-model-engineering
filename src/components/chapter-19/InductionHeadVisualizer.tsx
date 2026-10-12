import React, { useState } from 'react';
import './visualizers.css';

const InductionHeadVisualizer: React.FC<{ lang?: 'en' | 'ko' }> = ({ lang = 'en' }) => {
    const ko = lang === 'ko';
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

    const matrix = Array.from({ length: tokens.length }, (_, r) => {
        const row = Array.from({ length: tokens.length }, (_, c) => getAttentionWeight(r, c));
        const total = row.reduce((sum, weight) => sum + weight, 0);
        return row.map(weight => weight / total);
    });

    return (
        <div className="induction-visualizer">
            <h4 className="visualizer-title">{ko ? '귀납 헤드의 attention 행렬' : 'Induction Head Attention Matrix'}</h4>
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
                                <button
                                    key={`cell-${r}-${c}`}
                                    type="button"
                                    aria-label={ko ? `Query ${r}: ${rowToken}, Key ${c}: ${tokens[c]}, ${isCausalMasked ? '인과 마스킹' : `${(weight * 100).toFixed(1)}%`}` : `Query ${r}: ${rowToken}, Key ${c}: ${tokens[c]}, ${isCausalMasked ? 'causally masked' : `${(weight * 100).toFixed(1)}%`}`}
                                    className={`matrix-cell ${isCausalMasked ? 'masked' : ''} ${isHighlighted ? 'active' : ''} ${isInductionPattern ? 'induction-hot' : ''}`}
                                    style={{ 
                                        backgroundColor: isCausalMasked ? '#f0f0f0' : `rgba(59, 130, 246, ${weight})`
                                    }}
                                    onMouseEnter={() => { setHoveredRow(r); setHoveredCol(c); }}
                                    onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}
                                    onFocus={() => { setHoveredRow(r); setHoveredCol(c); }}
                                    onBlur={() => { setHoveredRow(null); setHoveredCol(null); }}
                                    onClick={() => { setHoveredRow(r); setHoveredCol(c); }}
                                >
                                    {!isCausalMasked && <span className="tooltip">{(weight * 100).toFixed(1)}%</span>}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="visualizer-caption">
                <p>{ko ? '행은 Query(현재 토큰), 열은 Key(참조 토큰)입니다. 두 번째 Harry(행 6)는 첫 번째 Potter(열 2)를 강하게 참조합니다.' : 'Rows are Query (current token); columns are Key (attended token). The second Harry (row 6) strongly attends to the first Potter (column 2).'}</p>
                <p>{ko ? '생성 방식: 수작업으로 지정한 예시 값을 행별로 정규화했습니다. 각 행의 합은 100%이며 미래 토큰은 0%입니다. 실제 모델 측정값이 아닙니다. Tab으로 셀을 확인할 수 있습니다.' : 'Generation method: hand-specified illustrative weights, normalized per row. Each row sums to 100%; future tokens have 0%. These are not model measurements. Use Tab to inspect cells.'}</p>
                {hoveredRow !== null && hoveredCol !== null && <p role="status">{ko ? '선택' : 'Selection'}: Query {hoveredRow}, Key {hoveredCol} — {(matrix[hoveredRow][hoveredCol] * 100).toFixed(1)}%</p>}
            </div>
        </div>
    );
};

export default InductionHeadVisualizer;

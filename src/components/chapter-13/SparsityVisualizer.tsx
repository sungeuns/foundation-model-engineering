import React, { useState, useEffect } from 'react';
import './visualizers.css';

const SparsityVisualizer = ({lang="en"}:{lang?:"en"|"ko"}) => {
  const ko = lang === "ko";
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
      const ranked = initialWeights.flat().map((w, i) => ({i, score: Math.abs(w)})).sort((a,b)=>a.score-b.score || a.i-b.i);
      for (const {i} of ranked.slice(0,16)) newMask[Math.floor(i/8)][i%8]=true;
    } else if (method === 'wanda') {
      // Prune lowest 50% per row based on |W| * ||X||
      for (let r = 0; r < 4; r++) {
        const ranked = initialWeights[r].map((w,c)=>({c,score:Math.abs(w)*activationNorms[c]})).sort((a,b)=>a.score-b.score || a.c-b.c);
        for (const {c} of ranked.slice(0,4)) newMask[r][c]=true;
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
        <button className={method === 'none' ? 'active' : ''} aria-pressed={method === 'none'} onClick={() => setMethod('none')}>{ko ? "원본 (밀집)" : "Original (dense)"}</button>
        <button className={method === 'magnitude' ? 'active' : ''} aria-pressed={method === 'magnitude'} onClick={() => setMethod('magnitude')}>{ko ? "크기 기준 (50%)" : "Magnitude (50%)"}</button>
        <button className={method === 'wanda' ? 'active' : ''} aria-pressed={method === 'wanda'} onClick={() => setMethod('wanda')}>Wanda (50%)</button>
        <button className={method === 'semi-structured' ? 'active' : ''} aria-pressed={method === 'semi-structured'} onClick={() => setMethod('semi-structured')}>{ko ? "2:4 희소성 (Wanda)" : "2:4 sparsity (Wanda)"}</button>
      </div>

      <div className="visualization-container">
        <div className="activations-panel">
          <h4>{ko ? "입력 활성화 norm (||X||)" : "Activation norms (||X||)"}</h4>
          <div className="activations-row">
            {activationNorms.map((norm, idx) => (
              <div key={`act-${idx}`} className={`activation-cell ${norm > 10 ? 'outlier' : ''}`}>
                {norm.toFixed(1)}
              </div>
            ))}
          </div>
        </div>

        <div className="weights-panel">
          <h4>{ko ? "가중치 행렬 (W)" : "Weight matrix (W)"}</h4>
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
        <p>{ko ? "설명용 행렬에 선택 규칙을 실제 적용합니다. 같은 점수는 인덱스 순으로 처리해 정확히 절반을 제거합니다. 0으로 만드는 것만으로 커널 가속을 얻지는 않습니다." : "Selection rules are computed on an authored matrix. Ties are resolved by index to prune exactly half. Zeroing entries alone does not accelerate a dense kernel."}</p>
        <p>{method === 'magnitude' ? (ko ? "예: 두 번째 행의 0.1(활성화 norm 40)은 크기 기준으로 제거되지만 Wanda는 유지합니다. -0.9 같은 큰 값은 크기 기준에서도 유지됩니다." : "Example: row 2’s 0.1 in the channel with activation norm 40 is removed by magnitude pruning but retained by Wanda. A large value such as -0.9 is retained even by magnitude pruning.") : method === 'semi-structured' ? (ko ? "각 4개 블록에서 Wanda 점수 하위 2개를 제거합니다. 실제 가속에는 지원하는 패킹·커널·모양이 필요합니다." : "Remove the two lowest Wanda scores in each block of four. Acceleration needs compatible packing, kernels and shapes.") : (ko ? "Wanda 점수는 |W|와 입력 채널 norm의 곱입니다. 이 점수는 중요도의 근사이며 품질 보장이 아닙니다." : "Wanda scores multiply |W| by the input-channel norm. This is a sensitivity proxy, not a quality guarantee.")}</p>
      </div>
    </div>
  );
};

export default SparsityVisualizer;

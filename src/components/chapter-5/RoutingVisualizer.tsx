import React, { useState } from 'react';
import './visualizers.css';

export const RoutingVisualizer = () => {
  const [mode, setMode] = useState<'token-choice' | 'expert-choice'>('token-choice');
  
  // Conceptual data
  const tokens = ['The', 'quick', 'brown', 'fox', 'jumps'];
  const experts = ['Expert 1', 'Expert 2', 'Expert 3'];

  // Hardcoded routing results for demonstration
  const tokenChoiceMap: Record<string, number[]> = {
    'The': [0], 'quick': [0], 'brown': [0], 'fox': [1], 'jumps': [0]
  }; // Notice Expert 1 (index 0) is overloaded, Expert 3 is dead.
  
  const expertChoiceMap: Record<number, string[]> = {
    0: ['quick', 'brown'], // Capacity fixed at 2
    1: ['fox', 'jumps'],
    2: ['The', 'fox'] // 'fox' is processed twice, 'The' gets processed by E3
  };

  return (
    <div className="rv-container">
      <h3 className="rv-title">Routing Paradigm Simulator</h3>
      <p className="rv-description">Compare how tokens are assigned to experts in different paradigms.</p>
      
      <div className="rv-mode-group">
        <button 
          onClick={() => setMode('token-choice')}
          className={`rv-mode-button ${mode === 'token-choice' ? 'rv-mode-button-active-token' : 'rv-mode-button-inactive'}`}
        >
          Token-Choice (Top-1)
        </button>
        <button 
          onClick={() => setMode('expert-choice')}
          className={`rv-mode-button ${mode === 'expert-choice' ? 'rv-mode-button-active-expert' : 'rv-mode-button-inactive'}`}
        >
          Expert-Choice (ECR)
        </button>
      </div>

      <div className="rv-box">
        {/* Tokens Column */}
        <div className="rv-column">
          <h4 className="rv-column-title">Tokens</h4>
          {tokens.map((token) => {
            let isDropped = mode === 'expert-choice' && !Object.values(expertChoiceMap).flat().includes(token);
            return (
              <div key={token} className={`rv-token ${isDropped ? 'rv-token-dropped' : ''}`}>
                {token}
                {isDropped && <span className="rv-badge">Dropped</span>}
              </div>
            );
          })}
        </div>

        {/* Connections */}
        <div className="rv-connections">
          <div className="rv-arrow">
            {mode === 'token-choice' ? '→' : '←'}
          </div>
          <span className="rv-connection-text">
            {mode === 'token-choice' ? 'Tokens select Expert' : 'Experts pull Tokens'}
          </span>
          <span className="rv-connection-subtext">
            {mode === 'token-choice' ? 'Notice Expert 1 is bottlenecked (Load: 4), while Expert 3 is idle.' : 'Every expert has a fixed load of 2. Some tokens are dropped or processed twice.'}
          </span>
        </div>

        {/* Experts Column */}
        <div className="rv-column">
          <h4 className="rv-column-title">Experts</h4>
          {experts.map((expert, eIdx) => {
            let load = mode === 'token-choice' 
              ? Object.values(tokenChoiceMap).filter(arr => arr.includes(eIdx)).length
              : expertChoiceMap[eIdx].length;
              
            let isDead = load === 0;
            let isOverloaded = load > 2;

            return (
              <div key={expert} className={`rv-expert ${isDead ? 'rv-expert-dead' : isOverloaded ? 'rv-expert-overloaded' : ''}`}>
                <span className="font-semibold">{expert}</span>
                <span className={`rv-load-badge ${isOverloaded ? 'rv-load-badge-overloaded' : isDead ? 'rv-load-badge-dead' : 'rv-load-badge-normal'}`}>
                  Load: {load} tokens
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

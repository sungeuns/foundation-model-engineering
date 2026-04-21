import React, { useState, useEffect, useMemo } from 'react';

const EloConvergenceSimulator: React.FC = () => {
  const [trueWinRate, setTrueWinRate] = useState<number>(0.75);
  const [kFactor, setKFactor] = useState<number>(32);
  const [numMatches, setNumMatches] = useState<number>(200);
  const [simulationData, setSimulationData] = useState<{ match: number; elo: number }[]>([]);

  // Simulate Elo over time
  useEffect(() => {
    let currentElo = 1000;
    const opponentElo = 1000;
    const data = [{ match: 0, elo: currentElo }];

    for (let i = 1; i <= numMatches; i++) {
      // Expected probability of winning against a 1000 Elo opponent
      const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - currentElo) / 400));
      
      // Actual outcome based on true hidden win rate
      const actualScore = Math.random() < trueWinRate ? 1 : 0;
      
      // Update rule
      currentElo = currentElo + kFactor * (actualScore - expectedScore);
      data.push({ match: i, elo: currentElo });
    }
    setSimulationData(data);
  }, [trueWinRate, kFactor, numMatches]);

  // Calculate theoretical target Elo based on true win rate
  const targetElo = useMemo(() => {
    if (trueWinRate >= 0.99) return 1800;
    if (trueWinRate <= 0.01) return 200;
    return 1000 - 400 * Math.log10((1 - trueWinRate) / trueWinRate);
  }, [trueWinRate]);

  const minElo = Math.min(...simulationData.map(d => d.elo), targetElo - 50, 800);
  const maxElo = Math.max(...simulationData.map(d => d.elo), targetElo + 50, 1200);

  return (
    <div className="elo-simulator-container">
      <div className="elo-controls">
        <div className="control-group">
          <label>True Win Rate vs Baseline: {(trueWinRate * 100).toFixed(0)}%</label>
          <input 
            type="range" 
            min="0.1" 
            max="0.9" 
            step="0.05" 
            value={trueWinRate} 
            onChange={(e) => setTrueWinRate(parseFloat(e.target.value))}
          />
          <small>Hidden actual probability of winning.</small>
        </div>
        <div className="control-group">
          <label>K-Factor (Volatility): {kFactor}</label>
          <input 
            type="range" 
            min="4" 
            max="128" 
            step="4" 
            value={kFactor} 
            onChange={(e) => setKFactor(parseFloat(e.target.value))}
          />
          <small>Max rating change per match.</small>
        </div>
        <div className="control-group">
          <label>Matches Simulated: {numMatches}</label>
          <input 
            type="range" 
            min="50" 
            max="1000" 
            step="50" 
            value={numMatches} 
            onChange={(e) => setNumMatches(parseFloat(e.target.value))}
          />
          <small>Total pairwise battles.</small>
        </div>
      </div>

      <div className="elo-chart-wrapper">
        <svg viewBox={`0 0 800 300`} className="elo-chart">
          {/* Grid Lines */}
          {[0.25, 0.5, 0.75].map(ratio => {
            const y = 300 - (ratio * 300);
            const eloValue = minElo + ratio * (maxElo - minElo);
            return (
              <g key={ratio}>
                <line x1="0" y1={y} x2="800" y2={y} stroke="#e2e8f0" strokeDasharray="4" />
                <text x="5" y={y - 5} fill="#64748b" fontSize="12">{eloValue.toFixed(0)} Elo</text>
              </g>
            );
          })}

          {/* Target Target Line */}
          <line 
            x1="0" 
            y1={300 - ((targetElo - minElo) / (maxElo - minElo)) * 300} 
            x2="800" 
            y2={300 - ((targetElo - minElo) / (maxElo - minElo)) * 300} 
            stroke="#10b981" 
            strokeWidth="2"
            strokeDasharray="6"
          />
          <text 
            x="650" 
            y={300 - ((targetElo - minElo) / (maxElo - minElo)) * 300 - 10} 
            fill="#10b981" 
            fontSize="14"
            fontWeight="bold"
          >
            True Skill ({targetElo.toFixed(0)})
          </text>

          {/* Elo Path */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={simulationData.map((d, i) => {
              const x = (i / numMatches) * 800;
              const y = 300 - ((d.elo - minElo) / (maxElo - minElo)) * 300;
              return `${x},${y}`;
            }).join(' ')}
          />
        </svg>
      </div>
      <div className="elo-caption">
        <strong>Simulation Output:</strong> Watch how a high K-Factor causes extreme volatility, while a low K-Factor requires hundreds of matches to converge to the green "True Skill" line.
      </div>
    </div>
  );
};

export default EloConvergenceSimulator;
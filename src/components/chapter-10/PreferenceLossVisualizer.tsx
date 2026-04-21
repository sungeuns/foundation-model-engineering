import React, { useState } from 'react';
import './visualizers.css';

const PreferenceLossVisualizer = () => {
  const [beta, setBeta] = useState(0.1);

  // Generate data points for the graph
  const generateData = () => {
    const points = [];
    for (let m = -10; m <= 10; m += 0.5) {
      // DPO Loss: -log(sigmoid(beta * M))
      const sigmoid = 1 / (1 + Math.exp(-beta * m));
      const dpoLoss = -Math.log(sigmoid);

      // IPO Loss: (M - 1/(2*beta))^2
      // Scaled down visually to fit the same chart reasonably
      const ipoLoss = Math.pow(m - 1 / (2 * beta), 2) * 0.05;

      points.push({ m, dpoLoss, ipoLoss });
    }
    return points;
  };

  const data = generateData();

  // SVG dimensions
  const width = 600;
  const height = 300;
  const padding = 40;

  // Scales
  const xScale = (m) => padding + ((m + 10) / 20) * (width - 2 * padding);
  const yScale = (val) => height - padding - (val / 5) * (height - 2 * padding);

  // Path generators
  const dpoPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.m)} ${yScale(d.dpoLoss)}`)
    .join(' ');

  const ipoPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.m)} ${yScale(d.ipoLoss)}`)
    .join(' ');

  const optimalMargin = 1 / (2 * beta);

  return (
    <div className="loss-visualizer-container">
      <div className="loss-visualizer-header">
        <h3>DPO vs IPO Loss Landscape</h3>
        <p>Adjust $\beta$ to see how the optimal margin shifts.</p>
      </div>
      
      <div className="controls">
        <label>
          Beta ($\beta$): <strong>{beta.toFixed(2)}</strong>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.01"
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
          />
        </label>
        <div className="stats">
          Optimal IPO Margin ($M$): <strong>{optimalMargin.toFixed(2)}</strong>
        </div>
      </div>

      <div className="chart-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="loss-chart">
          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
          <line x1={width / 2} y1={padding} x2={width / 2} y2={height - padding} stroke="#ccc" strokeDasharray="4" />
          
          <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="12" fill="#666">
            Reward Margin (M = r_w - r_l)
          </text>
          
          <text x={10} y={height / 2} transform={`rotate(-90 15 ${height / 2})`} textAnchor="middle" fontSize="12" fill="#666">
            Loss Value
          </text>

          {/* Paths */}
          <path d={dpoPath} fill="none" stroke="#ef4444" strokeWidth="3" />
          <path d={ipoPath} fill="none" stroke="#3b82f6" strokeWidth="3" />

          {/* Optimal Point Marker for IPO */}
          {optimalMargin <= 10 && (
            <circle cx={xScale(optimalMargin)} cy={yScale(0)} r="5" fill="#3b82f6" />
          )}
          {optimalMargin <= 10 && (
            <text x={xScale(optimalMargin)} y={yScale(0) - 15} textAnchor="middle" fontSize="12" fill="#3b82f6" fontWeight="bold">
              Min Loss
            </text>
          )}

          {/* Legend */}
          <g transform={`translate(${width - 120}, ${padding})`}>
            <line x1="0" y1="0" x2="20" y2="0" stroke="#ef4444" strokeWidth="3" />
            <text x="25" y="4" fontSize="12" fill="#333">DPO Loss</text>
            <line x1="0" y1="20" x2="20" y2="20" stroke="#3b82f6" strokeWidth="3" />
            <text x="25" y="24" fontSize="12" fill="#333">IPO Loss</text>
          </g>
        </svg>
      </div>
      <div className="loss-visualizer-footer">
        <p>
          Notice how DPO continuously pushes the margin to infinity (loss keeps decreasing), 
          while IPO has a strict minimum at $1/(2\beta)$. If the model pushes the margin further, 
          IPO loss increases, preventing overconfidence.
        </p>
      </div>
    </div>
  );
};

export default PreferenceLossVisualizer;
import React, { useState, useEffect } from 'react';
import './visualizers.css';

const ChinchillaAllocator: React.FC = () => {
  const [computeZettaFlops, setComputeZettaFlops] = useState<number>(0.1);
  const [paramsBillion, setParamsBillion] = useState<number>(0);
  const [tokensBillion, setTokensBillion] = useState<number>(0);

  // C = 120 * N^2 -> N = sqrt(C / 120)
  // C is in ZettaFLOPs (1e21), N is in Billions (1e9), D is in Billions (1e9)
  // 1 ZettaFLOP = 1e21 FLOPs
  // C_flops = 6 * (N * 1e9) * (D * 1e9) = 6 * N * D * 1e18
  // Since D = 20 * N, C_flops = 120 * N^2 * 1e18
  // C_zetta = C_flops / 1e21 = (120 * N^2 * 1e18) / 1e21 = 0.12 * N^2
  // Therefore, N = sqrt(C_zetta / 0.12)

  useEffect(() => {
    const N = Math.sqrt(computeZettaFlops / 0.12);
    const D = 20 * N;
    setParamsBillion(N);
    setTokensBillion(D);
  }, [computeZettaFlops]);

  const handleComputeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComputeZettaFlops(parseFloat(e.target.value));
  };

  const handleParamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const N = parseFloat(e.target.value);
    const C = 0.12 * Math.pow(N, 2);
    setComputeZettaFlops(C);
  };

  return (
    <div className="chinchilla-container">
      <div className="chinchilla-header">
        <h3>Chinchilla Compute Allocator</h3>
        <p>Simulates the optimal ratio between Compute, Parameters, and Data (Tokens).</p>
      </div>

      <div className="chinchilla-controls">
        <div className="control-group">
          <label>
            Compute Budget: <strong>{computeZettaFlops.toFixed(3)} ZettaFLOPs</strong>
          </label>
          <input
            type="range"
            min="0.001"
            max="10"
            step="0.01"
            value={computeZettaFlops}
            onChange={handleComputeChange}
          />
        </div>

        <div className="control-group">
          <label>
            Optimal Parameters: <strong>{paramsBillion.toFixed(1)} Billion</strong>
          </label>
          <input
            type="range"
            min="0.1"
            max="300"
            step="0.1"
            value={paramsBillion}
            onChange={handleParamsChange}
          />
        </div>
      </div>

      <div className="chinchilla-results">
        <div className="result-card">
          <h4>Optimal Dataset Size (D)</h4>
          <div className="result-value">{tokensBillion.toFixed(1)} <span>Billion Tokens</span></div>
          <div className="result-subtitle">Applying the 20 tokens per parameter rule</div>
        </div>
        
        <div className="result-card highlight">
          <h4>Compute Efficiency (Ratio)</h4>
          <div className="result-value">1 : 20</div>
          <div className="result-subtitle">Parameters : Tokens</div>
        </div>
      </div>

      <div className="chinchilla-comparison">
        <h4>Historical Context (Compute Equivalents)</h4>
        <div className="bar-chart">
          <div className="bar-row">
            <span className="bar-label">Gopher (280B)</span>
            <div className="bar-track">
              <div className="bar-fill gopher" style={{ width: '100%' }}></div>
            </div>
            <span className="bar-value">~1.1 Tokens/Param (Undertrained)</span>
          </div>
          <div className="bar-row">
            <span className="bar-label">Chinchilla (70B)</span>
            <div className="bar-track">
              <div className="bar-fill chinchilla" style={{ width: '100%' }}></div>
            </div>
            <span className="bar-value">20 Tokens/Param (Optimal)</span>
          </div>
          <div className="bar-row">
            <span className="bar-label">Llama 3 (8B)</span>
            <div className="bar-track">
              <div className="bar-fill llama" style={{ width: '100%' }}></div>
            </div>
            <span className="bar-value">~1875 Tokens/Param (Over-trained)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChinchillaAllocator;
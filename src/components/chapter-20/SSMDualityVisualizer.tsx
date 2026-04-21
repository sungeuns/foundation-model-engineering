import React, { useState } from 'react';
import './visualizers.css';

export default function SSMDualityVisualizer() {
    const [mode, setMode] = useState<'mamba1' | 'mamba2'>('mamba1');

    return (
        <div className="ssm-duality-container">
            <div className="ssm-header">
                <h3>SSM Execution Duality</h3>
                <div className="ssm-toggle">
                    <button 
                        className={mode === 'mamba1' ? 'active' : ''} 
                        onClick={() => setMode('mamba1')}
                    >
                        Mamba-1 (Sequential Scan)
                    </button>
                    <button 
                        className={mode === 'mamba2' ? 'active' : ''} 
                        onClick={() => setMode('mamba2')}
                    >
                        Mamba-2 (Chunkwise MatMul)
                    </button>
                </div>
            </div>

            <div className="ssm-visualization">
                {mode === 'mamba1' ? (
                    <div className="mamba1-view">
                        <p className="desc">Tokens are processed sequentially. State $h_t$ must be computed before {"$h_{t+1}$"}. Hardware bottlenecked by memory bandwidth.</p>
                        <div className="sequence-chain">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="chain-node">
                                    <div className="token-box">Token {i}</div>
                                    <div className="arrow-down">↓</div>
                                    <div className="state-box">State $h_{i}$</div>
                                    {i < 4 && <div className="arrow-right">→</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mamba2-view">
                        <p className="desc">Tokens are grouped into chunks. Intra-chunk interactions are computed in parallel via Matrix Multiplication (Tensor Cores). Inter-chunk states are passed sequentially.</p>
                        <div className="chunk-container">
                            <div className="chunk-box">
                                <h4>Chunk 1 (Tokens 1-4)</h4>
                                <div className="matrix-grid">
                                    <div className="matrix-cell">MatMul</div>
                                    <div className="matrix-cell">Attention</div>
                                    <div className="matrix-cell">Mask</div>
                                    <div className="matrix-cell">V</div>
                                </div>
                                <div className="chunk-state">Final State {"$h_{chunk1}$"}</div>
                            </div>
                            <div className="arrow-right chunk-arrow">→</div>
                            <div className="chunk-box">
                                <h4>Chunk 2 (Tokens 5-8)</h4>
                                <div className="matrix-grid">
                                    <div className="matrix-cell">MatMul</div>
                                    <div className="matrix-cell">Attention</div>
                                    <div className="matrix-cell">Mask</div>
                                    <div className="matrix-cell">V</div>
                                </div>
                                <div className="chunk-state">Final State {"$h_{chunk2}$"}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
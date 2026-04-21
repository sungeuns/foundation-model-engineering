import React, { useState, useEffect } from 'react';
import './visualizers.css';

const CoTVisualizer: React.FC = () => {
    const [mode, setMode] = useState<'standard' | 'cot'>('standard');
    const [step, setStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const standardSteps = [
        { text: "", prob: 12 },
        { text: " 10", prob: 8 }
    ];

    const cotSteps = [
        { text: "", prob: 12 },
        { text: "\nJohn starts with 5 apples.", prob: 18 },
        { text: "\nHe eats 2, so 5 - 2 = 3.", prob: 45 },
        { text: "\nHe buys 5 more, so 3 + 5 = 8.", prob: 92 },
        { text: "\nTherefore, the answer is 8.", prob: 98 }
    ];

    const currentSteps = mode === 'standard' ? standardSteps : cotSteps;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && step < currentSteps.length - 1) {
            timer = setTimeout(() => {
                setStep(prev => prev + 1);
            }, 1500);
        } else if (step >= currentSteps.length - 1) {
            setIsRunning(false);
        }
        return () => clearTimeout(timer);
    }, [isRunning, step, currentSteps.length]);

    const handleRun = () => {
        setStep(0);
        setIsRunning(true);
    };

    const handleModeChange = (newMode: 'standard' | 'cot') => {
        setMode(newMode);
        setStep(0);
        setIsRunning(false);
    };

    const displayedText = currentSteps.slice(0, step + 1).map(s => s.text).join('');
    const currentProb = currentSteps[step].prob;

    return (
        <div className="cot-visualizer">
            <div className="cot-header">
                <button 
                    className={`cot-btn ${mode === 'standard' ? 'active' : ''}`}
                    onClick={() => handleModeChange('standard')}
                >
                    Standard Prompting
                </button>
                <button 
                    className={`cot-btn ${mode === 'cot' ? 'active' : ''}`}
                    onClick={() => handleModeChange('cot')}
                >
                    Chain of Thought
                </button>
            </div>
            
            <div className="cot-body">
                <div className="cot-prompt">
                    <strong>Prompt:</strong> If John has 5 apples and eats 2, then buys 5 more, how many does he have?
                    {mode === 'cot' && <span className="cot-trigger"> Let's think step by step.</span>}
                </div>
                
                <div className="cot-output-container">
                    <div className="cot-output">
                        <strong>Model Output:</strong>
                        <pre>{displayedText}<span className={isRunning ? 'cursor blink' : 'cursor'}>|</span></pre>
                    </div>
                    
                    <div className="cot-stats">
                        <div className="stat-title">Latent Probability of Correct Token ("8")</div>
                        <div className="prob-bar-container">
                            <div className="prob-bar" style={{ width: `${currentProb}%`, backgroundColor: currentProb > 80 ? '#4caf50' : currentProb > 40 ? '#ffeb3b' : '#f44336' }}></div>
                        </div>
                        <div className="prob-value">{currentProb}%</div>
                    </div>
                </div>
            </div>

            <div className="cot-footer">
                <button className="run-btn" onClick={handleRun} disabled={isRunning}>
                    {isRunning ? 'Generating...' : 'Run Generation'}
                </button>
            </div>
        </div>
    );
};

export default CoTVisualizer;
import React, { useState, useEffect, useRef } from 'react';

const DiffusionVisualizer: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    const maxSteps = 100;

    useEffect(() => {
        drawCanvas();
    }, [step]);

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate);
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, step, direction]);

    const animate = () => {
        if (direction === 'forward') {
            if (step < maxSteps) {
                setStep(s => s + 1);
            } else {
                setIsPlaying(false);
            }
        } else {
            if (step > 0) {
                setStep(s => s - 1);
            } else {
                setIsPlaying(false);
            }
        }
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // 1. Draw Base Image (Clear state at t=0)
        // We use a nice gradient and shapes to simulate a clear image
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#4f46e5'); // Indigo
        gradient.addColorStop(0.5, '#9333ea'); // Purple
        gradient.addColorStop(1, '#ec4899'); // Pink
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw a "cat" like shape or just some abstract shapes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fef08a'; // Yellow
        ctx.beginPath();
        ctx.arc(width / 2 - 20, height / 2 - 20, 10, 0, Math.PI * 2);
        ctx.arc(width / 2 + 20, height / 2 - 20, 10, 0, Math.PI * 2);
        ctx.fill();

        // 2. Apply Noise based on Step
        if (step > 0) {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            const noiseAmount = step / maxSteps;

            for (let i = 0; i < data.length; i += 4) {
                // Generate random noise
                const noiseR = (Math.random() - 0.5) * 255 * noiseAmount;
                const noiseG = (Math.random() - 0.5) * 255 * noiseAmount;
                const noiseB = (Math.random() - 0.5) * 255 * noiseAmount;

                // Blend original pixel with noise
                // As step increases, noise dominates
                data[i] = Math.min(255, Math.max(0, data[i] + noiseR));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noiseG));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noiseB));
            }
            ctx.putImageData(imageData, 0, 0);
        }
    };

    return (
        <div style={{
            background: '#1e1e2e',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            color: '#cdd6f4',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            maxWidth: '400px',
            margin: '20px auto'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#f5e0dc', marginBottom: '5px' }}>Diffusion Visualizer</h3>
                <p style={{ fontSize: '14px', color: '#a6adc8' }}>Step t: {step} / {maxSteps}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <canvas 
                    ref={canvasRef} 
                    width={256} 
                    height={256} 
                    style={{ 
                        borderRadius: '8px', 
                        border: '2px solid #45475a',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }} 
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <input 
                        type="range" 
                        min="0" 
                        max={maxSteps} 
                        value={step} 
                        onChange={(e) => {
                            setIsPlaying(false);
                            setStep(parseInt(e.target.value));
                        }}
                        style={{ width: '100%', accentColor: '#f5e0dc' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a6adc8' }}>
                        <span>Clear Image (x₀)</span>
                        <span>Pure Noise (x_T)</span>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button 
                        onClick={() => {
                            setDirection('forward');
                            setIsPlaying(true);
                        }}
                        disabled={isPlaying && direction === 'forward'}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: direction === 'forward' && isPlaying ? '#a6e3a1' : '#313244',
                            color: direction === 'forward' && isPlaying ? '#11111b' : '#cdd6f4',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                    >
                        Forward (Add Noise)
                    </button>
                    <button 
                        onClick={() => {
                            setDirection('reverse');
                            setIsPlaying(true);
                        }}
                        disabled={isPlaying && direction === 'reverse'}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: direction === 'reverse' && isPlaying ? '#f38ba8' : '#313244',
                            color: direction === 'reverse' && isPlaying ? '#11111b' : '#cdd6f4',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                    >
                        Reverse (Denoise)
                    </button>
                </div>

                <button 
                    onClick={() => setIsPlaying(false)}
                    style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #f38ba8',
                        background: 'transparent',
                        color: '#f38ba8',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Stop
                </button>
            </div>
        </div>
    );
};

export default DiffusionVisualizer;

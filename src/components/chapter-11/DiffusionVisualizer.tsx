import React, { useState, useEffect, useRef } from 'react';

const DiffusionVisualizer = ({ locale = 'en' }: { locale?: 'en' | 'ko' }) => {
    const ko = locale === 'ko';
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
            let noiseState = 12345;
            const noise = () => {
                noiseState = (Math.imul(noiseState, 1664525) + 1013904223) >>> 0;
                return noiseState / 4294967296 * 255;
            };

            for (let i = 0; i < data.length; i += 4) {
                // Fixed uniform pixel noise: a blend illustration, not a DDPM sampler.
                data[i] = data[i] * (1 - noiseAmount) + noise() * noiseAmount;
                data[i + 1] = data[i + 1] * (1 - noiseAmount) + noise() * noiseAmount;
                data[i + 2] = data[i + 2] * (1 - noiseAmount) + noise() * noiseAmount;
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
            <p>{ko ? '알려진 원본과 고정 균등 픽셀 잡음을 섞은 교육용 그림입니다. Gaussian 확산 스케줄이나 학습된 잡음 제거 모델을 실행하지 않습니다. 되감기는 생성이 아닙니다.' : 'Educational blend of a known clean image with fixed uniform pixel noise. No Gaussian diffusion schedule or learned denoiser runs here. Replaying is not generation.'}</p>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#f5e0dc', marginBottom: '5px' }}>{ko ? '고정 픽셀 잡음 실험' : 'Fixed pixel-noise illustration'}</h3>
                <p style={{ fontSize: '14px', color: '#a6adc8' }}>{ko ? '단계 t' : 'Step t'}: {step} / {maxSteps}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <canvas
                    ref={canvasRef}
                    width={256}
                    height={256}
                    role="img"
                    aria-label={ko ? `잡음 혼합 ${step}% 이미지` : `Image with ${step}% noise blending`}
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
                        aria-label={ko ? '잡음 혼합 단계' : 'Noise blending step'}
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
                        <span>{ko ? '원본 이미지 (x₀)' : 'Clean image (x₀)'}</span>
                        <span>{ko ? '픽셀 잡음 (x_T)' : 'Pixel noise (x_T)'}</span>
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
                        {ko ? '잡음으로 진행' : 'Blend toward noise'}
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
                        {ko ? '원본으로 되감기' : 'Replay toward clean'}
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
                    {ko ? '정지' : 'Stop'}
                </button>
            </div>
        </div>
    );
};

export default DiffusionVisualizer;

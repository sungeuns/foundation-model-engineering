import React, { useState, useEffect } from 'react';
import './visualizers.css';

const DDPBucketingTimeline = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string, string> = {"Gradient Bucketing & Overlap Visualization": "그래디언트 버킷과 통신 겹침", "Pause": "일시 정지", "Replay": "다시 재생", "Play": "재생", "Reset": "초기화", "GPU Compute (Backward Pass)": "GPU 연산 (역전파)", "Network (NCCL All-Reduce)": "네트워크 (NCCL All-Reduce)", "Layer 4 Grad": "4층 그래디언트", "Layer 3 Grad": "3층 그래디언트", "Layer 2 Grad": "2층 그래디언트", "Layer 1 Grad": "1층 그래디언트", "Bucket 1 (L4 + L3)": "버킷 1 (4층 + 3층)", "Bucket 2 (L2 + L1)": "버킷 2 (2층 + 1층)"};
  const t = (text: string) => lang === "ko" ? translations[text] ?? text : text;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // State calculations based on timeline progress (0 to 100)
  const computeL4 = progress > 5;
  const computeL3 = progress > 20;
  const computeL2 = progress > 45;
  const computeL1 = progress > 60;

  const bucket1Filled = progress > 25;
  const bucket1Syncing = progress > 25 && progress < 65;
  const bucket1Done = progress >= 65;

  const bucket2Filled = progress > 65;
  const bucket2Syncing = progress > 65 && progress < 95;
  const bucket2Done = progress >= 95;

  return (
    <div className="ddp-timeline-container">
      <div className="ddp-header">
        <h4>{t("Gradient Bucketing & Overlap Visualization")}</h4>
        <div className="ddp-controls">
          <button className="ddp-btn" onClick={handlePlayPause}>
            {isPlaying ? t("Pause") : progress >= 100 ? t("Replay") : t("Play")}
          </button>
          <button className="ddp-btn secondary" onClick={handleReset}>{t("Reset")}</button>
        </div>
      </div>

      <div className="ddp-visualization">
        {/* Compute Stream */}
        <div className="ddp-stream">
          <div className="ddp-stream-label">{t("GPU Compute (Backward Pass)")}</div>
          <div className="ddp-track">
            <div className={`ddp-block compute ${computeL4 ? 'active' : ''}`}>
              {t("Layer 4 Grad")}
            </div>
            <div className={`ddp-block compute ${computeL3 ? 'active' : ''}`}>
              {t("Layer 3 Grad")}
            </div>
            <div className={`ddp-block compute ${computeL2 ? 'active' : ''}`}>
              {t("Layer 2 Grad")}
            </div>
            <div className={`ddp-block compute ${computeL1 ? 'active' : ''}`}>
              {t("Layer 1 Grad")}
            </div>
            {/* Progress indicator line */}
            <div
              className="ddp-progress-line"
              style={{ left: `${Math.min(progress, 80)}%` }}
            />
          </div>
        </div>

        {/* Network Stream */}
        <div className="ddp-stream">
          <div className="ddp-stream-label">{t("Network (NCCL All-Reduce)")}</div>
          <div className="ddp-track network-track">
            <div className={`ddp-bucket ${bucket1Filled ? 'filled' : ''} ${bucket1Syncing ? 'syncing' : ''} ${bucket1Done ? 'done' : ''}`} style={{ left: '25%' }}>
              {t("Bucket 1 (L4 + L3)")}
              {bucket1Syncing && <div className="sync-spinner"></div>}
            </div>
            <div className={`ddp-bucket ${bucket2Filled ? 'filled' : ''} ${bucket2Syncing ? 'syncing' : ''} ${bucket2Done ? 'done' : ''}`} style={{ left: '65%' }}>
              {t("Bucket 2 (L2 + L1)")}
              {bucket2Syncing && <div className="sync-spinner"></div>}
            </div>
          </div>
        </div>
      </div>

      <div className="ddp-explanation">
        <p>
          {lang === 'ko' ? '설명용 시간표입니다. 버킷 1이 준비되면 통신을 시작하고, GPU는 다른 층의 역전파를 계속할 수 있습니다. 실제 겹침과 노출되는 통신 시간은 워크로드와 하드웨어에 달려 있습니다.' : 'Illustrative timeline. Once bucket 1 is ready, communication can overlap the backward computation of other layers. Actual overlap and exposed communication depend on the workload and hardware.'}
        </p>
      </div>
    </div>
  );
};

export default DDPBucketingTimeline;

import React, { useState } from 'react';
import './visualizers.css';

const SpatiotemporalAttentionVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string,string> = {"Spatiotemporal Attention Routing": "시공간 어텐션 연결", "Select or focus a patch to inspect its allowed attention connections.": "패치를 선택하면 해당 쿼리가 연결되는 위치가 표시됩니다.", "Factorized Spatial": "분리된 공간 어텐션", "Factorized Temporal": "분리된 시간 어텐션", "Full Spatiotemporal": "전체 시공간 어텐션"};
  const t = (s: string) => lang === "ko" ? (translations[s] ?? s) : s;

  const [attentionType, setAttentionType] = useState('full');
  const [hoveredToken, setHoveredToken] = useState<{ frame: number; patch: number } | null>({frame:0,patch:0});

  const frames = [0, 1, 2];
  const patches = Array.from({ length: 16 }, (_, i) => i); // 4x4 grid

  const isAttended = (frameIdx: number, patchIdx: number) => {
    if (!hoveredToken) return false;
    if (frameIdx === hoveredToken.frame && patchIdx === hoveredToken.patch) return true; // Self

    switch (attentionType) {
      case 'spatial':
        // Factorized Spatial: Attends only to patches within the same frame
        return frameIdx === hoveredToken.frame;
      case 'temporal':
        // Factorized Temporal: Attends only to the same spatial patch across different frames
        return patchIdx === hoveredToken.patch;
      case 'full':
        // Full Spatiotemporal: Attends to all patches in all frames
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="attention-visualizer-container">
      <div className="attention-header">
        <h3>{t("Spatiotemporal Attention Routing")}</h3>
        <p>{t("Select or focus a patch to inspect its allowed attention connections.")}</p>
        <div className="attention-controls">
          <button
            className={attentionType === 'spatial' ? 'active' : ''}
            onClick={() => setAttentionType('spatial')}
          >{t('Factorized Spatial')}</button>
          <button
            className={attentionType === 'temporal' ? 'active' : ''}
            onClick={() => setAttentionType('temporal')}
          >{t('Factorized Temporal')}</button>
          <button
            className={attentionType === 'full' ? 'active' : ''}
            onClick={() => setAttentionType('full')}
          >{t('Full Spatiotemporal')}</button>
        </div>
      </div>

      <div className="frames-container">
        {frames.map((frameIdx) => (
          <div key={`frame-${frameIdx}`} className="video-frame">
            <div className="frame-label">{lang === "ko" ? "프레임" : "Frame"} {frameIdx + 1}</div>
            <div className="patch-grid">
              {patches.map((patchIdx) => {
                const attended = isAttended(frameIdx, patchIdx);
                const isSelf = hoveredToken?.frame === frameIdx && hoveredToken?.patch === patchIdx;

                return (
                  <button
                    type="button" aria-label={`${lang === "ko" ? "프레임 / 패치" : "Frame / patch"} ${frameIdx + 1} / ${patchIdx + 1}`} aria-pressed={isSelf}
                    key={`patch-${frameIdx}-${patchIdx}`}
                    className={`patch ${attended ? 'attended' : ''} ${isSelf ? 'self' : ''}`}
                    onFocus={() => setHoveredToken({ frame: frameIdx, patch: patchIdx })}
                    onClick={() => setHoveredToken({ frame: frameIdx, patch: patchIdx })}

                  ></button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="attention-description">
        {attentionType === 'spatial' && <p>{lang === "ko" ? "이 층에서는 같은 프레임의 패치끼리 연결됩니다. 시간 층과 교차 배치하면 다른 프레임으로도 정보를 전달할 수 있습니다." : "This layer connects patches within a frame. Alternating it with temporal layers can propagate information across frames."}</p>}
        {attentionType === 'temporal' && <p>{lang === "ko" ? "이 층에서는 같은 공간 위치의 패치끼리 연결됩니다. 연결 위치 자체가 움직임 추적의 정확도를 뜻하지는 않습니다." : "This layer connects the same spatial location across frames. Connectivity alone does not measure motion-tracking accuracy."}</p>}
        {attentionType === 'full' && <p>{lang === "ko" ? "n개 전체 패치가 서로 연결되어 어텐션 코어의 연산량은 O(n²d)입니다. 이 그림은 마스크를 보여 주며, 학습된 가중치나 물리·3D 일관성을 보장하지 않습니다." : "All n patches connect; attention-core work is O(n²d). This shows the mask, not learned weights or a guarantee of physical or 3D consistency."}</p>}
      </div>
    </div>
  );
};

export default SpatiotemporalAttentionVisualizer;

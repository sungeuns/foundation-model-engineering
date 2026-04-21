import React, { useState } from 'react';
import './visualizers.css';

interface ScaleData {
  label: React.ReactNode;
  cap: string;
  arch: string;
  ability: string;
}

const scaleData: Record<string, Record<number, ScaleData>> = {
  en: {
    1: { label: <>10<sup>15</sup> (Low)</>, cap: "Word Association", arch: "Small LSTM", ability: "Can complete simple sentences like 'The sky is blue'." },
    2: { label: <>10<sup>18</sup></>, cap: "Grammar & Style", arch: "GPT-1 Style", ability: "Can write coherent paragraphs but lacks deep logic." },
    3: { label: <>10<sup>21</sup></>, cap: "Basic Reasoning", arch: "GPT-2 Style", ability: "Can solve simple math problems and follow basic instructions." },
    4: { label: <>10<sup>24</sup></>, cap: "Complex Synthesis", arch: "GPT-3 Style", ability: "Can write code, summarize long texts, and exhibit zero-shot learning." },
    5: { label: <>10<sup>27</sup> (Extreme)</>, cap: "Strategic Reasoning", arch: "Modern Foundation Model", ability: "Exhibits theory of mind, complex coding, and multi-step planning." }
  },
  ko: {
    1: { label: <>10<sup>15</sup> (낮음)</>, cap: "단어 연상", arch: "소형 LSTM", ability: "'하늘은 파랗다'와 같은 단순한 문장을 완성할 수 있습니다." },
    2: { label: <>10<sup>18</sup></>, cap: "문법 및 스타일", arch: "GPT-1 스타일", ability: "일관된 문단을 작성할 수 있지만 깊은 논리는 부족합니다." },
    3: { label: <>10<sup>21</sup></>, cap: "기본적 추론", arch: "GPT-2 스타일", ability: "단순한 수학 문제를 풀고 기본적인 지침을 따를 수 있습니다." },
    4: { label: <>10<sup>24</sup></>, cap: "복잡한 종합", arch: "GPT-3 스타일", ability: "코드를 작성하고, 긴 텍스트를 요약하며, 제로샷 학습을 보여줍니다." },
    5: { label: <>10<sup>27</sup> (극한)</>, cap: "전략적 추론", arch: "현대적 Foundation Model", ability: "마음 이론(Theory of Mind), 복잡한 코딩, 다단계 계획을 보여줍니다." }
  }
};

interface Props {
  lang?: 'en' | 'ko';
}

export const ScaleVisualizer = ({ lang = 'en' }: Props) => {
  const [compute, setCompute] = useState(1);

  const sentences = scaleData[lang] || scaleData['en'];
  const data = sentences[compute];

  const allLabels = {
    en: {
      title: "The Power of Scale",
      desc: "Adjust the available compute to see how model capabilities emerge.",
      control: "Compute Power (FLOPs):",
      cap_title: "Model Capability",
      arch_title: "Typical Architecture",
      emergent: "Emergent Abilities:"
    },
    ko: {
      title: "규모의 힘",
      desc: "사용 가능한 컴퓨팅 파워를 조절하여 모델의 능력이 어떻게 발현되는지 확인해보세요.",
      control: "컴퓨팅 파워 (FLOPs):",
      cap_title: "모델 능력",
      arch_title: "일반적인 아키텍처",
      emergent: "발현되는 능력:"
    }
  };

  const labels = allLabels[lang] || allLabels['en'];

  return (
    <div className="viz-container glassmorphism">
      <h3 className="viz-title">{labels.title}</h3>
      <p className="viz-description">{labels.desc}</p>
      
      <div className="viz-controls centered">
        <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{labels.control}</label>
        <input type="range" min="1" max="5" step="1" value={compute} onChange={(e) => setCompute(parseInt(e.target.value))} style={{ width: '60%' }} />
        <span className="viz-label">{data.label}</span>
      </div>

      <div className="viz-row">
        <div className="viz-stat">
          <div className="viz-stat-label">{labels.cap_title}</div>
          <div className="viz-stat-value">{data.cap}</div>
        </div>
        <div className="viz-stat">
          <div className="viz-stat-label">{labels.arch_title}</div>
          <div className="viz-stat-value">{data.arch}</div>
        </div>
      </div>

      <div className="viz-explanation centered">
        <div style={{ fontWeight: '700', color: '#4a5568', marginBottom: '0.5rem' }}>{labels.emergent}</div>
        <div style={{ color: '#1a202c', fontStyle: 'italic' }}>"{data.ability}"</div>
      </div>
    </div>
  );
};

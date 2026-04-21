import React, { useState } from 'react';
import './visualizers.css';

interface SentenceData {
  text: string;
  fe_analysis: { pos: string[]; neg: string[] };
  fe_score: number;
  fe_result: string;
  rl_pos: [number, number]; // Percentage position in plot (x, y)
  rl_result: string;
  explanation: string;
}

const data: Record<string, Record<string, SentenceData>> = {
  en: {
    positive: {
      text: "The movie was good.",
      fe_analysis: { pos: ['good'], neg: [] },
      fe_score: 1,
      fe_result: "Positive",
      rl_pos: [80, 80],
      rl_result: "Positive",
      explanation: "Simple positive sentence. Both methods easily identify the sentiment."
    },
    negation: {
      text: "The movie was not bad.",
      fe_analysis: { pos: [], neg: ['bad'] },
      fe_score: -1,
      fe_result: "Negative",
      rl_pos: [70, 60],
      rl_result: "Positive",
      explanation: "Contains 'bad' but negated by 'not'. Feature engineering (counting words) fails. Representation learning understands the context."
    },
    complex: {
      text: "I loved the acting but hated the plot.",
      fe_analysis: { pos: ['loved'], neg: ['hated'] },
      fe_score: 0,
      fe_result: "Neutral",
      rl_pos: [50, 30],
      rl_result: "Mixed",
      explanation: "Contrasting sentiments. Feature engineering just cancels them out. Representation learning can capture the complex structure."
    }
  },
  ko: {
    positive: {
      text: "영화가 정말 좋았어요.",
      fe_analysis: { pos: ['좋았어요'], neg: [] },
      fe_score: 1,
      fe_result: "긍정",
      rl_pos: [80, 80],
      rl_result: "긍정",
      explanation: "단순한 긍정 문장입니다. 두 방식 모두 감성을 쉽게 파악합니다."
    },
    negation: {
      text: "영화가 나쁘지 않았어요.",
      fe_analysis: { pos: [], neg: ['나쁘지'] },
      fe_score: -1,
      fe_result: "부정",
      rl_pos: [70, 60],
      rl_result: "긍정",
      explanation: "'나쁘지'라는 부정적 단어가 포함되어 있지만 '않았어요'로 부정되었습니다. 단어 빈도 기반(Feature Engineering)은 실패하지만, 표현 학습은 맥락을 이해합니다."
    },
    complex: {
      text: "연기는 좋았는데 스토리가 별로였어요.",
      fe_analysis: { pos: ['좋았는데'], neg: ['별로였어요'] },
      fe_score: 0,
      fe_result: "중립",
      rl_pos: [50, 30],
      rl_result: "복합",
      explanation: "대조적인 감성이 공존합니다. 단순 합산은 중립으로 나오지만, 표현 학습은 복합적인 구조를 파악할 수 있습니다."
    }
  }
};

interface Props {
  lang?: 'en' | 'ko';
}

export const NlpRepresentationVisualizer = ({ lang = 'en' }: Props) => {
  const [selected, setSelected] = useState<string>('positive');

  const sentences = data[lang] || data['en'];
  const current = sentences[selected];

  const allLabels = {
    en: {
      title: "Feature Engineering vs Representation Learning in NLP",
      desc: "See how different paradigms handle context and sentiment.",
      select: "Select a Sentence:",
      fe_title: "Feature Engineering (Lexicon Based)",
      rl_title: "Representation Learning (Latent Space)",
      counts: "Word Counts:",
      pos_words: "Positive Words:",
      neg_words: "Negative Words:",
      rule: "Rule: Sum scores (+1 for pos, -1 for neg)",
      score: "Score:",
      classification: "Classification:",
      semantic: "Semantic Mapping:",
      pos_region: "Positive Region",
      neg_region: "Negative Region",
      insight: "Insight:"
    },
    ko: {
      title: "NLP에서의 Feature Engineering vs 표현 학습",
      desc: "서로 다른 패러다임이 맥락과 감성을 어떻게 다루는지 확인해보세요.",
      select: "문장 선택:",
      fe_title: "Feature Engineering (어휘 사전 기반)",
      rl_title: "표현 학습 (잠재 공간 매핑)",
      counts: "단어 카운트:",
      pos_words: "긍정 단어:",
      neg_words: "부정 단어:",
      rule: "규칙: 점수 합산 (긍정 +1, 부정 -1)",
      score: "점수:",
      classification: "분류 결과:",
      semantic: "의미론적 매핑:",
      pos_region: "긍정 영역",
      neg_region: "부정 영역",
      insight: "분석:"
    }
  };

  const labels = allLabels[lang] || allLabels['en'];

  return (
    <div className="viz-container glassmorphism">
      <h3 className="viz-title">{labels.title}</h3>
      <p className="viz-description">{labels.desc}</p>
      
      <div className="viz-controls centered">
        <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{labels.select}</label>
        <div className="viz-btn-group">
          {Object.keys(sentences).map((key) => (
            <button 
              key={key} 
              onClick={() => setSelected(key)}
              className={`viz-btn ${selected === key ? 'active' : ''}`}
            >
              "{sentences[key].text}"
            </button>
          ))}
        </div>
      </div>

      <div className="viz-row">
        {/* Feature Engineering */}
        <div className="viz-stat">
          <div className="viz-stat-label">{labels.fe_title}</div>
          <div className="viz-box-content">
            <div className="viz-sub-label">{labels.counts}</div>
            <div style={{ fontSize: '0.9rem', textAlign: 'left' }}>
              <div>{labels.pos_words} {current.fe_analysis.pos.join(', ') || 'None'}</div>
              <div>{labels.neg_words} {current.fe_analysis.neg.join(', ') || 'None'}</div>
            </div>
            <div className="viz-sub-label">{labels.rule}</div>
            <div className="viz-score-display">
              {labels.score} {current.fe_score}
            </div>
            <div className={`viz-status-badge ${current.fe_result === 'Positive' || current.fe_result === '긍정' ? 'success' : current.fe_result === 'Negative' || current.fe_result === '부정' ? 'danger' : 'warning'}`}>
              {labels.classification} {current.fe_result}
            </div>
          </div>
        </div>

        {/* Representation Learning */}
        <div className="viz-stat">
          <div className="viz-stat-label">{labels.rl_title}</div>
          <div className="viz-box-content">
            <div className="viz-sub-label">{labels.semantic}</div>
            <div className="viz-plot">
              <div className="viz-region-pos" style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '0 0.5rem 0.5rem 0' }}>
                <span style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.8rem', color: '#27ae60', fontWeight: 'bold' }}>{labels.pos_region}</span>
              </div>
              <div className="viz-region-neg" style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'rgba(231, 76, 60, 0.1)', borderRadius: '0.5rem 0 0 0.5rem' }}>
                <span style={{ position: 'absolute', top: 10, left: 10, fontSize: '0.8rem', color: '#c0392b', fontWeight: 'bold' }}>{labels.neg_region}</span>
              </div>
              <div 
                className="viz-dot" 
                style={{ 
                  left: `${current.rl_pos[0]}%`, 
                  top: `${100 - current.rl_pos[1]}%`, // Invert for standard cartesian
                  backgroundColor: '#8e44ad',
                  boxShadow: '0 0 10px #8e44ad',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              ></div>
            </div>
            <div className={`viz-status-badge success`}>
              {labels.classification} {current.rl_result}
            </div>
          </div>
        </div>
      </div>

      <div className="viz-explanation centered">
        <p><strong>{labels.insight}</strong> {current.explanation}</p>
      </div>
    </div>
  );
};

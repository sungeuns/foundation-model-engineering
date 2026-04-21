import React, { useState } from 'react';
import './visualizers.css';

const CRAGVisualizer: React.FC<{ lang?: string }> = ({ lang = 'en' }) => {
  const [step, setStep] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<string | null>(null);

  const reset = () => {
    setStep(0);
    setEvaluation(null);
  };

  const simulateEvaluation = () => {
    setStep(1);
    setTimeout(() => {
      const outcomes = ['Correct', 'Ambiguous', 'Incorrect'];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setEvaluation(randomOutcome);
      setStep(2);
    }, 1000);
  };

  const t = {
    ko: {
      title: "CRAG (Corrective RAG) 오케스트레이션 시뮬레이터",
      desc: "검색된 문서에 대한 평가자(Evaluator)의 판단에 따라 오케스트레이션 흐름이 어떻게 달라지는지 시뮬레이션합니다.",
      step1: "1. Retriever (문서 검색)",
      step2: "2. CRAG Evaluator (평가 진행 중...)",
      result: "평가 결과",
      action_refine: "행동: 지식 정제",
      desc_refine: "Decompose-then-Recompose 적용. 노이즈를 제거하고 핵심 문장만 추출합니다.",
      action_search: "행동: 보완적 검색",
      desc_search: "기존 문서 유지 + 부족한 정보를 채우기 위해 대규모 Web Search를 추가로 실행합니다.",
      action_replace: "행동: 전면 교체",
      desc_replace: "검색된 문서를 완전히 폐기하고, 새로운 Web Search 결과로 대체합니다.",
      step3: "3. Generator (최종 답변 생성)",
      start: "평가 시뮬레이션 시작",
      reset: "초기화 및 다시 실행"
    },
    en: {
      title: "CRAG (Corrective RAG) Orchestration Simulator",
      desc: "Simulates how the orchestration flow changes based on the Evaluator's judgment of the retrieved documents.",
      step1: "1. Retriever (Document Search)",
      step2: "2. CRAG Evaluator (Evaluation in progress...)",
      result: "Evaluation Result",
      action_refine: "Action: Knowledge Refinement",
      desc_refine: "Apply Decompose-then-Recompose. Remove noise and extract only key sentences.",
      action_search: "Action: Supplementary Search",
      desc_search: "Retain existing documents + execute large-scale Web Search to fill missing information.",
      action_replace: "Action: Full Replacement",
      desc_replace: "Completely discard retrieved documents and replace with new Web Search results.",
      step3: "3. Generator (Final Answer Generation)",
      start: "Start Evaluation Simulation",
      reset: "Reset and Rerun"
    }
  };

  const i18n = lang === 'ko' ? t.ko : t.en;

  return (
    <div className="crag-container">
      <h3 className="crag-title">{i18n.title}</h3>
      <p className="crag-desc">{i18n.desc}</p>
      
      <div className="crag-flow">
        <div className={`crag-node ${step >= 0 ? 'active' : ''}`}>
          {i18n.step1}
        </div>
        <div className="crag-arrow">↓</div>
        <div className={`crag-node evaluator ${step >= 1 ? 'active' : ''}`}>
          {i18n.step2}
        </div>
        
        {step >= 2 && evaluation && (
          <>
            <div className="crag-arrow">↓</div>
            <div className={`crag-evaluation-result ${evaluation.toLowerCase()}`}>
              {i18n.result}: {evaluation}
            </div>
            <div className="crag-branches">
              {evaluation === 'Correct' && (
                <div className="crag-branch correct">
                  <h4>{i18n.action_refine}</h4>
                  <p>{i18n.desc_refine}</p>
                </div>
              )}
              {evaluation === 'Ambiguous' && (
                <div className="crag-branch ambiguous">
                  <h4>{i18n.action_search}</h4>
                  <p>{i18n.desc_search}</p>
                </div>
              )}
              {evaluation === 'Incorrect' && (
                <div className="crag-branch incorrect">
                  <h4>{i18n.action_replace}</h4>
                  <p>{i18n.desc_replace}</p>
                </div>
              )}
            </div>
            <div className="crag-arrow">↓</div>
            <div className="crag-node generator active">
              {i18n.step3}
            </div>
          </>
        )}
      </div>

      <div className="crag-controls">
        {step === 0 ? (
          <button className="crag-btn" onClick={simulateEvaluation}>{i18n.start}</button>
        ) : (
          <button className="crag-btn" onClick={reset}>{i18n.reset}</button>
        )}
      </div>
    </div>
  );
};

export default CRAGVisualizer;
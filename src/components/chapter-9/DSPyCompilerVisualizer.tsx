import React, { useState, useEffect, useRef } from 'react';
import './visualizers.css';

const DSPyCompilerVisualizer = ({ lang = 'en' }: { lang?: 'en' | 'ko' }) => {
  const ko = lang === 'ko';
  const label = (en: string, korean: string) => ko ? korean : en;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const [step, setStep] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);

  const steps = [
    { label: label("1. Declarative Signature", "1. 입력·출력 정의"), desc: label("Define inputs and outputs programmatically.", "프로그램으로 입력·출력 조건을 정의합니다.") },
    { label: label("2. Prompt Optimization", "2. 프롬프트 최적화"), desc: label("Search instructions and demonstrations under a fixed metric and budget.", "고정 metric·예산으로 지시와 예시를 탐색합니다.") },
    { label: label("3. Selected Prompt", "3. 선택한 프롬프트"), desc: label("Evaluate the selected candidate on a sealed holdout before release.", "출시 전에 선택한 후보를 봉인 holdout으로 평가합니다.") }
  ];

  const handleCompile = () => {
    setIsCompiling(true);
    setStep(1);
    timer.current = setTimeout(() => {
      setStep(2);
      setIsCompiling(false);
    }, 2500);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setStep(0);
    setIsCompiling(false);
  };

  return (
    <div className="dspy-visualizer-container">
      <div className="dspy-header">
        <h3>{label("DSPy Prompt Compiler Simulation", "DSPy 프롬프트 컴파일 모의 실험")}</h3>
        <p>{label("Illustrative stages with synthetic scores; no model calls or optimization run here.", "가상 점수로 단계를 설명합니다. 실제 모델 호출이나 최적화를 실행하지 않습니다.")}</p>
      </div>

      <div className="dspy-progress-bar">
        {steps.map((s, idx) => (
          <div key={idx} className={`dspy-step ${step >= idx ? 'active' : ''} ${step === idx && isCompiling ? 'pulsing' : ''}`}>
            <div className="dspy-step-number">{idx + 1}</div>
            <div className="dspy-step-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dspy-content-area">
        {step === 0 && (
          <div className="dspy-code-block">
            <pre>
              <code>
{ko ? `class MultiHopQA(dspy.Signature):
    """검색한 근거로 복합 질문에 답합니다."""
    context = dspy.InputField(desc="검색한 사실 근거")
    question = dspy.InputField()
    reasoning = dspy.OutputField(desc="풀이 과정")
    answer = dspy.OutputField(desc="짧은 사실 답변")` : `class MultiHopQA(dspy.Signature):
    """Answer complex questions by leveraging retrieved context."""
    context = dspy.InputField(desc="Retrieved factual snippets")
    question = dspy.InputField()
    reasoning = dspy.OutputField(desc="Step-by-step logical deduction")
    answer = dspy.OutputField(desc="Short factual answer")`}
              </code>
            </pre>
            <button className="dspy-btn primary" type="button" onClick={handleCompile}>{label("Simulate prompt search", "프롬프트 탐색 보기")}</button>
          </div>
        )}

        {step === 1 && (
          <div className="dspy-compiling-state">
            <div className="spinner"></div>
            <p role="status"><strong>{label("Simulated candidate search…", "후보 탐색 모의 실험 중…")}</strong></p>
            <ul className="dspy-logs">
              <li>{label("Bootstrapping demonstration candidates…", "예시 후보 만들기…")}</li>
              <li>{label("Evaluating instruction candidates…", "지시 후보 평가하기…")}</li>
              <li>{label("Candidate 1: 68.5% (synthetic exact match)", "후보 1: 68.5% (가상 exact match)")}</li>
              <li>{label("Candidate 2: 74.2% (synthetic exact match)", "후보 2: 74.2% (가상 exact match)")}</li>
              <li>{label("Candidate 7: 89.1% — best observed development score", "후보 7: 89.1% — 관측한 개발 점수 중 최고")}</li>
            </ul>
            <button type="button" className="dspy-btn secondary" onClick={reset}>{label("Cancel simulation", "모의 실험 취소")}</button>
          </div>
        )}

        {step === 2 && (
          <div className="dspy-code-block final-prompt">
            <pre>
              <code>
{ko ? JSON.stringify({ instruction: "검색 근거를 읽고 확인 가능한 답을 제시하세요.", demos: [{ context: "에펠탑은 파리에 있고 파리는 프랑스의 수도입니다.", question: "에펠탑은 어느 나라에 있나요?", answer: "프랑스" }], signature_prefix: "Context: {context}\nQuestion: {question}\nAnswer:" }, null, 2) : `{
  "instruction": "You are an expert logical reasoner. Answer complex questions by leveraging retrieved context. Read the context carefully, formulate a step-by-step logical deduction, and then provide a short factual answer.",
  "demos": [
    {
      "context": "[1] The Eiffel Tower is located in Paris. [2] Paris is the capital of France.",
      "question": "What country is the Eiffel Tower in?",
      "reasoning": "The context states the Eiffel Tower is in Paris (1). It also states Paris is the capital of France (2). Therefore, the Eiffel Tower is in France.",
      "answer": "France"
    },
    {
      "context": "[1] Apollo 11 landed in 1969. [2] Neil Armstrong was the first to step out.",
      "question": "Who was the first person to step on the moon and when did it happen?",
      "reasoning": "Context [2] identifies Neil Armstrong as the first to step out. Context [1] gives the year of the Apollo 11 landing as 1969. Connecting these, Neil Armstrong stepped on the moon in 1969.",
      "answer": "Neil Armstrong, 1969"
    }
  ],
  "signature_prefix": "Now, answer the following:\\nContext: {context}\\nQuestion: {question}\\nReasoning:"
}`}
              </code>
            </pre>
            <button className="dspy-btn secondary" type="button" onClick={reset}>{label("Reset simulation", "모의 실험 초기화")}</button>
          </div>
        )}
      </div>
      <div className="dspy-footer-desc">
        {steps[step].desc}
      </div>
    </div>
  );
};

export default DSPyCompilerVisualizer;
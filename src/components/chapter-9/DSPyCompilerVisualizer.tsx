import React, { useState, useEffect } from 'react';
import './visualizers.css';

const DSPyCompilerVisualizer = () => {
  const [step, setStep] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);

  const steps = [
    { label: "1. Declarative Signature", desc: "Define inputs and outputs programmatically." },
    { label: "2. Teleprompter (Optimization)", desc: "LLM bootstraps examples and scores variations." },
    { label: "3. Compiled Prompt", desc: "The final, optimized few-shot prompt ready for inference." }
  ];

  const handleCompile = () => {
    setIsCompiling(true);
    setStep(1);
    setTimeout(() => {
      setStep(2);
      setIsCompiling(false);
    }, 2500);
  };

  const reset = () => {
    setStep(0);
    setIsCompiling(false);
  };

  return (
    <div className="dspy-visualizer-container">
      <div className="dspy-header">
        <h3>DSPy Prompt Compiler Simulation</h3>
        <p>Watch how a simple Python class expands into a production-grade prompt.</p>
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
{`class MultiHopQA(dspy.Signature):
    """Answer complex questions by leveraging retrieved context."""
    context = dspy.InputField(desc="Retrieved factual snippets")
    question = dspy.InputField()
    reasoning = dspy.OutputField(desc="Step-by-step logical deduction")
    answer = dspy.OutputField(desc="Short factual answer")`}
              </code>
            </pre>
            <button className="dspy-btn primary" onClick={handleCompile}>Run teleprompter.compile()</button>
          </div>
        )}

        {step === 1 && (
          <div className="dspy-compiling-state">
            <div className="spinner"></div>
            <p><strong>MIPROv2 Optimizer Running...</strong></p>
            <ul className="dspy-logs">
              <li>&gt; Bootstrapping few-shot examples from trainset...</li>
              <li>&gt; Evaluating instruction prompt candidates...</li>
              <li>&gt; Candidate 1 Score: 68.5% (Exact Match)</li>
              <li>&gt; Candidate 2 Score: 74.2% (Exact Match)</li>
              <li>&gt; Candidate 7 Score: 89.1% (Exact Match) - <em>Optimal found</em></li>
            </ul>
          </div>
        )}

        {step === 2 && (
          <div className="dspy-code-block final-prompt">
            <pre>
              <code>
{`{
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
            <button className="dspy-btn secondary" onClick={reset}>Reset Simulation</button>
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
import React, { useState } from 'react';
import './visualizers.css';

const critiqueData = [
  {
    level: 0,
    title: "Level 0: Original AI Generation",
    content: "Theorem 4.2: The multi-dimensional manifold of the proposed quantum encryption scheme resolves to a stable state under continuous perturbation, given the boundary condition ∂M = 0. Proof: Let X be a topological space...",
    humanState: "Cognitive Overload",
    confidence: 15,
    color: "#f8d7da",
    description: "The human evaluator cannot verify the output. The mathematics span multiple advanced domains, exceeding the evaluator's working memory and expertise."
  },
  {
    level: 1,
    title: "Level 1: 1st-Order AI Critique",
    content: "Critique of Level 0: The proof contains a subtle flaw in paragraph 3. The assumption that the boundary condition ∂M = 0 implies stability ignores the non-Abelian nature of the perturbation field. The manifold would actually collapse under gauge transformation.",
    humanState: "Partial Comprehension",
    confidence: 45,
    color: "#fff3cd",
    description: "The human cannot verify the original proof, but can understand the specific objection raised by the critique. However, the human is unsure if the critique itself is accurate."
  },
  {
    level: 2,
    title: "Level 2: 2nd-Order AI Critique (Meta-Critique)",
    content: "Critique of Level 1: The 1st-order critique is incorrect. It fails to account for Lemma 2.1 in the original generation, which explicitly applies a Wilson loop to neutralize the non-Abelian gauge transformation. Therefore, the manifold does not collapse.",
    humanState: "Logical Tracking",
    confidence: 75,
    color: "#d1ecf1",
    description: "The human verifies the logical link: Lemma 2.1 does indeed neutralize the transformation. The human is now evaluating the debate between AI instances rather than generating the proof."
  },
  {
    level: 3,
    title: "Level 3: 3rd-Order AI Critique (Resolution)",
    content: "Critique of Level 2: The meta-critique is logically sound and correctly cites Lemma 2.1. No further contradictions found in the application of the Wilson loop. The original generation holds.",
    humanState: "Confident Verification",
    confidence: 95,
    color: "#d4edda",
    description: "The human easily verifies this final summarizing step. By climbing the tractability ladder, the human has successfully overseen a superhuman generation."
  }
];

export default function RecursiveCritiqueVisualizer() {
  const [currentLevel, setCurrentLevel] = useState(0);

  return (
    <div className="rsc-container">
      <div className="rsc-header">
        <h3>Recursive Self-Critiquing (RSC) Tractability Ladder</h3>
        <p>Advance the critique level to see how human verification confidence increases.</p>
      </div>
      
      <div className="rsc-controls">
        <button 
          onClick={() => setCurrentLevel(Math.max(0, currentLevel - 1))}
          disabled={currentLevel === 0}
          className="rsc-btn"
        >
          &larr; Lower Order
        </button>
        <span className="rsc-level-indicator">Current Level: {currentLevel}</span>
        <button 
          onClick={() => setCurrentLevel(Math.min(critiqueData.length - 1, currentLevel + 1))}
          disabled={currentLevel === critiqueData.length - 1}
          className="rsc-btn"
        >
          Higher Order &rarr;
        </button>
      </div>

      <div className="rsc-content-area">
        {critiqueData.slice(0, currentLevel + 1).map((data, index) => (
          <div 
            key={index} 
            className={`rsc-card ${index === currentLevel ? 'active' : 'historical'}`}
            style={{ borderLeftColor: data.color }}
          >
            <h4>{data.title}</h4>
            <p className="rsc-code-like">{data.content}</p>
          </div>
        ))}
      </div>

      <div className="rsc-human-status" style={{ backgroundColor: critiqueData[currentLevel].color }}>
        <div className="rsc-status-header">
          <strong>Human Evaluator Status:</strong> {critiqueData[currentLevel].humanState}
        </div>
        <div className="rsc-progress-bar-container">
          <div 
            className="rsc-progress-bar" 
            style={{ width: `${critiqueData[currentLevel].confidence}%` }}
          >
            Confidence: {critiqueData[currentLevel].confidence}%
          </div>
        </div>
        <p className="rsc-description">{critiqueData[currentLevel].description}</p>
      </div>
    </div>
  );
}
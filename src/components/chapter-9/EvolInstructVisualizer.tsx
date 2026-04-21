import React, { useState } from 'react';
import './visualizers.css';

const EvolInstructVisualizer: React.FC = () => {
  const [level, setLevel] = useState(0);

  const evolutions = [
    {
      level: 0,
      title: "Base Instruction",
      prompt: "Write a sorting algorithm.",
      explanation: "A simple, generic request. The model will likely output a standard Bubble Sort or Quick Sort in Python without much thought."
    },
    {
      level: 1,
      title: "In-depth: Add Constraints",
      prompt: "Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key.",
      explanation: "We've added a specific data structure constraint. The model must now handle dicts and key extraction."
    },
    {
      level: 2,
      title: "In-depth: Deepen Logic",
      prompt: "Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling cases where the key might be missing gracefully.",
      explanation: "Edge case handling is introduced. The logic requires try-except blocks or dictionary get() methods."
    },
    {
      level: 3,
      title: "In-depth: Multi-step Reasoning",
      prompt: "Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling missing keys gracefully. Additionally, analyze its time complexity and compare it with an alternative approach.",
      explanation: "The prompt now requires both coding and theoretical reasoning. The model must explain 'why' it chose the algorithm."
    },
    {
      level: 4,
      title: "In-depth: Complex Ticket",
      prompt: "Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling missing keys gracefully. Analyze its time complexity, compare it with an alternative approach, write unit tests using pytest, and add type hints.",
      explanation: "A full software engineering ticket. The model must demonstrate coding, theoretical analysis, testing, and modern language features."
    }
  ];

  return (
    <div className="visualizer-container">
      <div className="visualizer-header">
        <h3>Evol-Instruct Progression</h3>
        <p>Click "Evolve" to mutate the prompt into a more complex instruction.</p>
      </div>
      
      <div className="evolution-tracker">
        {evolutions.map((evol, index) => (
          <div 
            key={index} 
            className={`tracker-step ${index <= level ? 'active' : ''} ${index === level ? 'current' : ''}`}
            onClick={() => setLevel(index)}
          >
            Level {index}
          </div>
        ))}
      </div>

      <div className="prompt-display">
        <h4>{evolutions[level].title}</h4>
        <div className="prompt-box">
          <code>{evolutions[level].prompt}</code>
        </div>
        <div className="explanation-box">
          <p><strong>Analysis:</strong> {evolutions[level].explanation}</p>
        </div>
      </div>

      <div className="controls">
        <button 
          onClick={() => setLevel(Math.max(0, level - 1))} 
          disabled={level === 0}
          className="btn-secondary"
        >
          Previous
        </button>
        <button 
          onClick={() => setLevel(Math.min(evolutions.length - 1, level + 1))} 
          disabled={level === evolutions.length - 1}
          className="btn-primary"
        >
          Evolve Prompt
        </button>
      </div>
    </div>
  );
};

export default EvolInstructVisualizer;
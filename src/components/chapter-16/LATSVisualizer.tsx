import React, { useState } from 'react';
import './visualizers.css';

interface NodeData {
  id: string;
  state: string;
  qValue: number;
  visits: number;
  children: NodeData[];
}

const LATSVisualizer: React.FC = () => {
  const [tree, setTree] = useState<NodeData>({
    id: 'root',
    state: 'Task: Debug DB Error',
    qValue: 0.5,
    visits: 1,
    children: []
  });
  
  const [iteration, setIteration] = useState(0);

  const simulateStep = () => {
    setTree(prevTree => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      
      // Simple simulation: expand root if no children, else expand best child
      if (newTree.children.length === 0) {
        newTree.children.push({
          id: 'child1',
          state: 'Action: search_logs()',
          qValue: 0.8,
          visits: 1,
          children: []
        });
        newTree.children.push({
          id: 'child2',
          state: 'Action: restart_db()',
          qValue: 0.2,
          visits: 1,
          children: []
        });
        newTree.visits += 2;
        newTree.qValue = 0.6; // Backpropagated average
      } else if (newTree.children[0].children.length === 0) {
        // Expand the most promising branch (child1)
        newTree.children[0].children.push({
          id: 'child1_1',
          state: 'Action: grep "error" logs',
          qValue: 0.9,
          visits: 1,
          children: []
        });
        newTree.children[0].visits += 1;
        newTree.children[0].qValue = 0.85;
        newTree.visits += 1;
        newTree.qValue = 0.7; 
      } else {
        // Backpropagate a failure on child2 to show UCT shifting
        newTree.children[1].visits += 1;
        newTree.children[1].qValue = 0.1;
        newTree.visits += 1;
      }
      
      return newTree;
    });
    setIteration(prev => prev + 1);
  };

  const resetTree = () => {
    setTree({
      id: 'root',
      state: 'Task: Debug DB Error',
      qValue: 0.5,
      visits: 1,
      children: []
    });
    setIteration(0);
  };

  const renderNode = (node: NodeData) => {
    // Calculate color intensity based on Q-Value
    const isHighValue = node.qValue >= 0.7;
    const isLowValue = node.qValue <= 0.3;
    let nodeClass = 'lats-node';
    if (isHighValue && node.id !== 'root') nodeClass += ' lats-node-high';
    if (isLowValue && node.id !== 'root') nodeClass += ' lats-node-low';

    return (
      <div key={node.id} className="lats-node-container">
        <div className={nodeClass}>
          <div className="lats-node-state">{node.state}</div>
          <div className="lats-node-stats">
            <span>Q: {node.qValue.toFixed(2)}</span>
            <span>N: {node.visits}</span>
          </div>
        </div>
        {node.children.length > 0 && (
          <div className="lats-children-container">
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lats-visualizer-wrapper">
      <div className="lats-header">
        <h4>LATS (Language Agent Tree Search) Simulation</h4>
        <div className="lats-controls">
          <button onClick={simulateStep} disabled={iteration >= 3} className="lats-btn lats-btn-primary">
            Simulate Iteration {iteration + 1}
          </button>
          <button onClick={resetTree} className="lats-btn lats-btn-secondary">
            Reset
          </button>
        </div>
        <p className="lats-description">
          Observe how nodes expand and Q-values backpropagate. High Q-value paths (Green) are exploited, while low Q-value paths (Red) are abandoned.
        </p>
      </div>
      <div className="lats-tree-area">
        {renderNode(tree)}
      </div>
    </div>
  );
};

export default LATSVisualizer;
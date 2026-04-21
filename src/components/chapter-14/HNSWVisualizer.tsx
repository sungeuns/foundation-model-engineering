import React, { useState, useEffect, useRef } from 'react';
import './visualizers.css';

interface Node {
  id: number;
  x: number;
  y: number;
  layer: number;
}

interface Point {
  x: number;
  y: number;
}

const HNSWVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [query, setQuery] = useState<Point | null>(null);
  const [path, setPath] = useState<{node: Node, layer: number}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize nodes
  useEffect(() => {
    const newNodes: Node[] = [];
    const width = 600;
    const height = 400;
    
    // Generate 50 L0 nodes
    for (let i = 0; i < 50; i++) {
      newNodes.push({
        id: i,
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        layer: 0
      });
    }
    
    // Promote 10 to L1
    for (let i = 0; i < 10; i++) {
      newNodes[i].layer = 1;
    }
    
    // Promote 1 to L2 (Entry point)
    newNodes[0].layer = 2;
    
    setNodes(newNodes);
  }, []);

  const distance = (p1: Point, p2: Point) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isSearching || nodes.length === 0) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setQuery({ x, y });
    startSearch({ x, y }, nodes);
  };

  const startSearch = async (q: Point, allNodes: Node[]) => {
    setIsSearching(true);
    let currentPath: {node: Node, layer: number}[] = [];
    
    // Start at Entry Point (L2)
    let currNode = allNodes.find(n => n.layer === 2)!;
    
    // Traverse layers downwards
    for (let l = 2; l >= 0; l--) {
      currentPath.push({ node: currNode, layer: l });
      setPath([...currentPath]);
      await new Promise(r => setTimeout(r, 600));
      
      let changed = true;
      while (changed) {
        changed = false;
        const layerNodes = allNodes.filter(n => n.layer >= l);
        
        // Find closest in current layer (simulating greedy search among neighbors)
        let bestDist = distance(currNode, q);
        let bestNode = currNode;
        
        for (const candidate of layerNodes) {
          const d = distance(candidate, q);
          if (d < bestDist) {
            bestDist = d;
            bestNode = candidate;
            changed = true;
          }
        }
        
        if (changed) {
          currNode = bestNode;
          currentPath.push({ node: currNode, layer: l });
          setPath([...currentPath]);
          await new Promise(r => setTimeout(r, 600));
        }
      }
    }
    
    setIsSearching(false);
  };

  const renderEdges = (layer: number, color: string, opacity: number) => {
    const layerNodes = nodes.filter(n => n.layer >= layer);
    const edges = [];
    
    // Simple mock: connect to 2 nearest neighbors in the same layer
    for (let i = 0; i < layerNodes.length; i++) {
      const n1 = layerNodes[i];
      let nearest = [...layerNodes]
        .filter(n => n.id !== n1.id)
        .sort((a, b) => distance(n1, a) - distance(n1, b))
        .slice(0, layer === 0 ? 2 : layer === 1 ? 3 : 0);
        
      for (const n2 of nearest) {
        edges.push(
          <line 
            key={`e-${layer}-${n1.id}-${n2.id}`}
            x1={n1.x} y1={n1.y} 
            x2={n2.x} y2={n2.y} 
            stroke={color} 
            strokeWidth={layer === 2 ? 3 : layer === 1 ? 2 : 1}
            opacity={opacity}
          />
        );
      }
    }
    return edges;
  };

  return (
    <div className="hnsw-container">
      <div className="hnsw-header">
        <h4>HNSW Routing Simulator</h4>
        <p>Click on an empty space on the graph to create a query (red dot). <i>The search process is visualized as it drops from the upper layer (L2) to the lower layer (L0).</i></p>
      </div>
      
      <svg ref={svgRef} className="hnsw-canvas" onClick={handleCanvasClick} width={600} height={400}>
        {/* Layer 0 Edges */}
        {renderEdges(0, "#e2e8f0", 0.6)}
        {/* Layer 1 Edges */}
        {renderEdges(1, "#94a3b8", 0.8)}
        {/* Layer 2 Edges (none, only 1 node) */}
        
        {/* Render Nodes */}
        {nodes.map(n => (
          <circle 
            key={n.id} 
            cx={n.x} 
            cy={n.y} 
            r={n.layer === 2 ? 8 : n.layer === 1 ? 6 : 4} 
            fill={n.layer === 2 ? "#1e293b" : n.layer === 1 ? "#64748b" : "#cbd5e1"}
            className="hnsw-node"
          />
        ))}

        {/* Render Path */}
        {path.map((step, idx) => {
          if (idx === 0) return null;
          const prev = path[idx - 1];
          const isDrop = prev.node.id === step.node.id && prev.layer !== step.layer;
          
          if (isDrop) {
            return (
              <circle 
                key={`drop-${idx}`} 
                cx={step.node.x} cy={step.node.y} 
                r={12} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4"
                className="hnsw-drop-anim"
              />
            );
          }
          
          return (
            <line 
              key={`path-${idx}`}
              x1={prev.node.x} y1={prev.node.y}
              x2={step.node.x} y2={step.node.y}
              stroke="#ef4444" strokeWidth="3"
              className="hnsw-path-line"
            />
          );
        })}

        {/* Query Point */}
        {query && (
          <circle cx={query.x} cy={query.y} r={6} fill="#ef4444" className="hnsw-query" />
        )}
        
        {/* Current Position Marker */}
        {path.length > 0 && (
          <circle 
            cx={path[path.length - 1].node.x} 
            cy={path[path.length - 1].node.y} 
            r={10} fill="none" stroke="#ef4444" strokeWidth="3"
          />
        )}
      </svg>
      
      <div className="hnsw-legend">
        <div className="legend-item"><span className="dot l2"></span> Layer 2 (Entry)</div>
        <div className="legend-item"><span className="dot l1"></span> Layer 1</div>
        <div className="legend-item"><span className="dot l0"></span> Layer 0</div>
        <div className="legend-item"><span className="dot query"></span> Query / Path</div>
      </div>
    </div>
  );
};

export default HNSWVisualizer;
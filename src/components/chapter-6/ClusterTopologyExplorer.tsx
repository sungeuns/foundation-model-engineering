import React, { useState } from 'react';
import './visualizers.css';

const topologies = [
  {
    id: 'nvlink',
    name: 'NVLink Rack-Scale',
    description: 'A Scale-Up architecture where all GPUs within a single rack are fully connected (All-to-All) via a copper backplane with 130 TB/s bandwidth.',
    nodes: Array.from({ length: 8 }).map((_, i) => `GPU ${i + 1}`),
    connectionType: 'all-to-all',
  },
  {
    id: 'fattree',
    name: 'Fat-Tree Ethernet (RoCEv2)',
    description: 'A Scale-Out architecture for connecting tens of thousands of GPUs. Minimizes network bottlenecks through a Spine-Leaf hierarchical structure.',
    nodes: ['Spine 1', 'Spine 2', 'Leaf 1', 'Leaf 2', 'Leaf 3', 'Leaf 4'],
    connectionType: 'hierarchical',
  },
  {
    id: 'tpu',
    name: 'TPU 3D Torus + OCS',
    description: 'Google\'s proprietary 3D grid network. Physically tilts MEMS mirrors in Optical Circuit Switches (OCS) to dynamically reconfigure network topology upon chip failure.',
    nodes: Array.from({ length: 9 }).map((_, i) => `TPU ${i + 1}`),
    connectionType: 'grid-3d',
  }
];

export default function ClusterTopologyExplorer() {
  const [activeTab, setActiveTab] = useState(topologies[0].id);
  const activeData = topologies.find(t => t.id === activeTab);

  return (
    <div className="topology-explorer">
      <div className="tabs">
        {topologies.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
      
      <div className="topology-content">
        <p className="topology-desc">{activeData?.description}</p>
        
        <div className={`visualization-area ${activeData?.connectionType}`}>
          {activeData?.id === 'nvlink' && (
            <div className="nvlink-container">
              <div className="nvlink-switch">NVLink Switch (NVSwitch)</div>
              <div className="gpu-grid">
                {activeData.nodes.map(node => (
                  <div key={node} className="node gpu-node">{node}</div>
                ))}
              </div>
            </div>
          )}
          
          {activeData?.id === 'fattree' && (
            <div className="fattree-container">
              <div className="layer spine-layer">
                <div className="node switch-node">Spine Switch 1</div>
                <div className="node switch-node">Spine Switch 2</div>
              </div>
              <div className="lines-container fattree-lines"></div>
              <div className="layer leaf-layer">
                <div className="node switch-node">Leaf 1</div>
                <div className="node switch-node">Leaf 2</div>
                <div className="node switch-node">Leaf 3</div>
                <div className="node switch-node">Leaf 4</div>
              </div>
              <div className="layer compute-layer">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="node gpu-node mini">Node {i+1}</div>
                ))}
              </div>
            </div>
          )}

          {activeData?.id === 'tpu' && (
            <div className="tpu-container">
              <div className="ocs-switch">Optical Circuit Switch (MEMS Mirrors)</div>
              <div className="tpu-grid">
                {activeData.nodes.map((node, i) => (
                  <div key={node} className="node tpu-node">
                    {node}
                    {i === 4 && <span className="fail-badge">Simulate Failure</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
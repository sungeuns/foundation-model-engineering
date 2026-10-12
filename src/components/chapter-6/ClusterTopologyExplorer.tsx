import React, { useState } from 'react';
import './visualizers.css';

const topologies = [
  {
    id: 'nvlink',
    name: 'NVLink Rack-Scale',
    description: 'A switched scale-up fabric. Aggregate bandwidth is not the bandwidth available to each device pair; distributed devices and ranks remain.',
    nameKo: 'NVLink rack 단위 연결',
    descriptionKo: 'switch 기반 scale-up fabric입니다. 집계 대역폭은 각 device 쌍의 대역폭이 아니며 여러 device와 rank가 남습니다.',
    nodes: Array.from({ length: 8 }).map((_, i) => `GPU ${i + 1}`),
    connectionType: 'all-to-all',
  },
  {
    id: 'fattree',
    name: 'Fat-Tree Ethernet (RoCEv2)',
    description: 'A schematic spine–leaf scale-out network. Collective traffic, oversubscription, congestion, and placement determine achieved throughput.',
    nameKo: 'Fat-tree Ethernet (RoCEv2)',
    descriptionKo: 'spine–leaf scale-out network의 개념도입니다. collective 트래픽·oversubscription·혼잡·배치가 실제 처리량을 결정합니다.',
    nodes: ['Spine 1', 'Spine 2', 'Leaf 1', 'Leaf 2', 'Leaf 3', 'Leaf 4'],
    connectionType: 'hierarchical',
  },
  {
    id: 'tpu',
    name: 'TPU 3D Torus + OCS',
    description: 'A planar sketch of a torus-style topology and an optical circuit-switching concept. Reconfiguration does not replace failed compute or restore job state.',
    nameKo: 'TPU torus·광 circuit switch',
    descriptionKo: 'torus형 topology와 광 circuit switching 개념의 평면 그림입니다. 재구성이 실패한 compute를 대체하거나 job 상태를 복원하지는 않습니다.',
    nodes: Array.from({ length: 9 }).map((_, i) => `TPU ${i + 1}`),
    connectionType: 'grid-3d',
  }
];

export default function ClusterTopologyExplorer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [activeTab, setActiveTab] = useState(topologies[0].id);
  const activeData = topologies.find(t => t.id === activeTab);

  return (
    <div className="topology-explorer">
      <div className="tabs">
        {topologies.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            type="button"
            aria-pressed={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
          >
            {ko ? t.nameKo : t.name}
          </button>
        ))}
      </div>
      
      <div className="topology-content">
        <p className="topology-desc">{ko ? activeData?.descriptionKo : activeData?.description}</p>
        
        <div className={`visualization-area ${activeData?.connectionType}`}>
          {activeData?.id === 'nvlink' && (
            <div className="nvlink-container">
              <div className="nvlink-switch">{ko ? 'NVLink switch (NVSwitch)' : 'NVLink Switch (NVSwitch)'}</div>
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
                <div className="node switch-node">{ko ? 'Spine switch 1' : 'Spine switch 1'}</div>
                <div className="node switch-node">{ko ? 'Spine switch 2' : 'Spine switch 2'}</div>
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
                  <div key={i} className="node gpu-node mini">{ko ? '노드' : 'Node'} {i+1}</div>
                ))}
              </div>
            </div>
          )}

          {activeData?.id === 'tpu' && (
            <div className="tpu-container">
              <div className="ocs-switch">{ko ? '광 circuit switch (MEMS mirror)' : 'Optical circuit switch (MEMS mirrors)'}</div>
              <div className="tpu-grid">
                {activeData.nodes.map((node, i) => (
                  <div key={node} className="node tpu-node">
                    {node}
                    {i === 4 && <span className="fail-badge">{ko ? '사용 불가 chip 예시' : 'Example unavailable chip'}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="topology-desc">{ko ? 'node 수와 평면 배치는 설명용입니다. 실제 배선·제품 규모·장애 복구를 시뮬레이션하지 않습니다.' : 'Node counts and planar layouts are schematic; this does not simulate physical wiring, product scale, or fault recovery.'} {' '}
        <a href="https://www.nvidia.com/en-us/data-center/gb200-nvl72/">NVLink</a> · <a href="https://engineering.fb.com/2024/03/12/data-center-engineering/building-metas-genai-infrastructure/">Meta</a> · <a href="https://docs.cloud.google.com/tpu/docs/v5p">TPU</a> · {ko ? '2026-10-13 기준' : 'as of 2026-10-13'}
      </p>
    </div>
  );
}
import React, { useState } from 'react';
import './visualizers.css';

const BLOCK_SIZE = 4;
const TOTAL_PHYSICAL_BLOCKS = 12;

interface RequestState {
  id: string;
  color: string;
  tokens: number;
  blockTable: (number | null)[];
  isActive: boolean;
}

const PagedAttentionVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string,string> = {"PagedAttention Memory Allocator": "PagedAttention 메모리 할당", "Reset": "초기화", "Logical View (Requests)": "논리적 뷰 (요청)", "+ Generate Token": "+ 토큰 생성", "Free Memory": "메모리 해제", "Block Table:": "블록 테이블:", "Freed": "해제됨", "Physical VRAM (Blocks)": "물리 VRAM (블록)", "Free": "비어 있음", "Out of Memory! No free physical blocks.": "사용 가능한 물리 블록이 없습니다."};
  const t = (s: string) => lang === "ko" ? (translations[s] ?? s) : s;
  const [message, setMessage] = useState("");

  const [requests, setRequests] = useState<RequestState[]>([
    { id: 'Req A', color: '#3b82f6', tokens: 5, blockTable: [0, 2], isActive: true },
    { id: 'Req B', color: '#10b981', tokens: 2, blockTable: [1], isActive: true },
  ]);

  const [physicalBlocks, setPhysicalBlocks] = useState<(string | null)[]>([
    'Req A', 'Req B', 'Req A', null, null, null, null, null, null, null, null, null
  ]);

  const generateToken = (reqIndex: number) => {
    setMessage("");
    const newRequests = [...requests];
    const req = { ...newRequests[reqIndex] };

    if (!req.isActive) return;

    req.tokens += 1;

    // Check if we need a new block
    const requiredBlocks = Math.ceil(req.tokens / BLOCK_SIZE);
    if (requiredBlocks > req.blockTable.length) {
      // Find free physical block
      const freeIdx = physicalBlocks.findIndex(b => b === null);
      if (freeIdx === -1) {
        setMessage(t("Out of Memory! No free physical blocks."));
        return;
      }

      const newPhysical = [...physicalBlocks];
      newPhysical[freeIdx] = req.id;
      setPhysicalBlocks(newPhysical);

      req.blockTable = [...req.blockTable, freeIdx];
    }

    newRequests[reqIndex] = req;
    setRequests(newRequests);
  };

  const freeRequest = (reqIndex: number) => {
    setMessage("");
    const newRequests = [...requests];
    const req = { ...newRequests[reqIndex] };
    req.isActive = false;

    const newPhysical = [...physicalBlocks];
    req.blockTable.forEach(blockIdx => {
      if (blockIdx !== null) newPhysical[blockIdx] = null;
    });

    req.blockTable = [];
    req.tokens = 0;

    setPhysicalBlocks(newPhysical);
    newRequests[reqIndex] = req;
    setRequests(newRequests);
  };

  const resetSimulation = () => {
    setMessage("");
    setRequests([
      { id: 'Req A', color: '#3b82f6', tokens: 5, blockTable: [0, 2], isActive: true },
      { id: 'Req B', color: '#10b981', tokens: 2, blockTable: [1], isActive: true },
    ]);
    setPhysicalBlocks([
      'Req A', 'Req B', 'Req A', null, null, null, null, null, null, null, null, null
    ]);
  };

  return (
    <div className="paged-attention-wrapper">
      <div className="pa-header">
        <h4 style={{ margin: 0 }}>{t("PagedAttention Memory Allocator")}</h4>
        <button onClick={resetSimulation} className="pa-btn pa-btn-reset">{t("Reset")}</button>
      </div>

      <p role="status">{message}</p><div className="pa-dashboard">
        <div className="pa-logical-view">
          <h5>{t("Logical View (Requests)")}</h5>
          {requests.map((req, i) => (
            <div key={req.id} className="pa-request-card" style={{ borderLeftColor: req.color }}>
              <div className="pa-req-header">
                <strong>{req.id}</strong>
                <span>({req.tokens} {lang === "ko" ? "토큰" : "tokens"})</span>
              </div>
              <div className="pa-req-actions">
                <button
                  onClick={() => generateToken(i)}
                  disabled={!req.isActive}
                  className="pa-btn pa-btn-gen"
                >{t('+ Generate Token')}</button>
                <button
                  onClick={() => freeRequest(i)}
                  disabled={!req.isActive}
                  className="pa-btn pa-btn-free"
                >{t('Free Memory')}</button>
              </div>
              <div className="pa-block-table">
                <span className="pa-table-label">{t("Block Table:")}</span>
                {req.blockTable.length > 0 ? req.blockTable.map((pIdx, j) => (
                  <span key={j} className="pa-table-entry" style={{ backgroundColor: req.color }}>
                    L{j} → P{pIdx}
                  </span>
                )) : <span className="pa-table-empty">{t("Freed")}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="pa-physical-view">
          <h5>{t("Physical VRAM (Blocks)")}</h5>
          <div className="pa-grid">
            {physicalBlocks.map((owner, idx) => {
              const req = requests.find(r => r.id === owner);
              const color = req ? req.color : '#e5e7eb';
              const isOccupied = owner !== null;

              // Calculate how full the block is if it's the last block of the request
              let fillPercentage = 0;
              if (isOccupied && req) {
                const logicalBlockIdx = req.blockTable.indexOf(idx);
                const isLastBlock = logicalBlockIdx === req.blockTable.length - 1;
                const tokensInBlock = isLastBlock ? (req.tokens % BLOCK_SIZE || BLOCK_SIZE) : BLOCK_SIZE;
                fillPercentage = (tokensInBlock / BLOCK_SIZE) * 100;
              }

              return (
                <div key={idx} className="pa-physical-block">
                  <div className="pa-block-header">P{idx}</div>
                  <div className="pa-block-body" style={{ backgroundColor: isOccupied ? '#f3f4f6' : '#ffffff' }}>
                    {isOccupied ? (
                      <div
                        className="pa-block-fill"
                        style={{ backgroundColor: color, height: `${fillPercentage}%` }}
                      >
                        <span className="pa-block-label">{owner}</span>
                      </div>
                    ) : (
                      <span className="pa-block-free">{t("Free")}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="pa-caption">
        {lang === "ko" ? `블록당 ${BLOCK_SIZE}토큰인 단순 할당 예제입니다. 요청 해제로 생긴 빈 블록을 재사용할 수 있습니다. 실제 커널·접두사 공유·동시성은 모델링하지 않습니다.` : `A simplified allocator with ${BLOCK_SIZE} tokens per block. Freed blocks can be reused. Kernels, prefix sharing, and concurrency are not modeled.`}
      </div>
    </div>
  );
};

export default PagedAttentionVisualizer;

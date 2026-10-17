import React, { useEffect, useMemo, useState } from 'react';
import './visualizers.css';
import snapshot from '../../data/commercial-model-snapshot.json';

type Locale = 'en' | 'ko';
type CompanyKey =
  | 'All'
  | 'OpenAI'
  | 'Google'
  | 'Anthropic'
  | 'Kimi'
  | 'DeepSeek'
  | 'Alibaba'
  | 'MiniMax'
  | 'Mistral'
  | 'xAI'
  | 'Z AI'
  | 'Cohere'
  | 'Reflection'
  | 'Meta'
  | 'NVIDIA'
  | 'StepFun';
type MetricKey = 'aaIndex' | 'contextK';
type AxisMode = 'timeline' | 'price' | 'context' | 'taskCost';
type ReleaseStatus = 'released' | 'preview' | 'announced' | 'restricted';

type ModelSnapshot = {
  id: string;
  company: Exclude<CompanyKey, 'All'>;
  model: string;
  release: string;
  access: string;
  accessKo: string;
  specification?: string;
  aaIndex?: number;
  inputPrice?: number;
  outputPrice?: number;
  contextK?: number;
  releaseStatus?: ReleaseStatus;
  note: string;
  noteKo: string;
  noteSource?: string;
  source: string;
  evaluation?: string;
  benchmarkCost?: number;
  setting: string;
};

const MODEL_SNAPSHOTS = snapshot.models as ModelSnapshot[];

const metricLabels: Record<Locale, Record<MetricKey, string>> = {
  en: {
    aaIndex: 'AA Index',
    contextK: 'Context window',
  },
  ko: {
    aaIndex: 'AA 지능 지수',
    contextK: '문맥 길이',
  },
};

const labels = {
  en: {
    title: 'Commercial Model Benchmark Map',
    subtitle:
      'Choose a benchmark, then change the x-axis to see whether the same model still looks strong by milestone date, token cost, or context budget. These are published system profiles, not equal-effort measurements.',
    benchmark: 'Benchmark',
    controlAria: 'Benchmark plot controls',
    noPoints: 'No verified points for this filter, axis, and metric.',
    selectModel: 'Select model',
    axisMode: 'X-axis',
    company: 'Company',
    all: 'All companies',
    timeline: 'Release milestone',
    price: 'Token price',
    speed: 'Output speed',
    context: 'Context limit',
    yAxis: 'Benchmark score',
    noScore: 'not reported',
    selected: 'Selected model',
    releaseTimeline: 'Release timeline',
    releaseTimelineHelp:
      'Selected releases and announcements in August–October 2026. Read changes in reasoning, agents, long-context handling, and cost efficiency alongside each source and its evaluation conditions.',
    blendedPrice: 'blended $/1M',
    outputSpeed: 'tok/s',
    detailContext: 'context',
    priceAxis: 'Lower is cheaper',
    source:
      'Snapshot as of 2026-10-18. Scores use AA Intelligence Index v4.3.2 with the effort/fallback configuration shown. Configurations without a numeric effort are marked not reported; no equal-effort ranking is implied. Costs are observed AA workload costs, not token-price estimates. Local checkpoints require their own evaluations. Speed is omitted. A missing score means not reported under the mapped methodology, not zero. Promotional or long-context prices may have thresholds and expiry dates.',
  },
  ko: {
    title: '상용 모델 비교 지도',
    subtitle:
      '지표와 x축을 바꿔 보세요. 공개 이정표·단가·평가 비용·문맥을 탐색합니다. 동일 추론 예산의 실험이 아니라 공개된 시스템 프로필입니다.',
    benchmark: '지표',
    controlAria: '모델 비교 그래프 설정',
    noPoints: '이 필터·축·지표에 필요한 값을 확인한 모델이 없습니다.',
    selectModel: '모델 선택',
    axisMode: 'X축',
    company: '회사',
    all: '전체 회사',
    timeline: '공개 이정표',
    price: '토큰 단가',
    speed: '출력 속도',
    context: '문맥 한도',
    yAxis: '지표 값',
    noScore: '미공개',
    selected: '선택한 모델',
    releaseTimeline: '공개 일정',
    releaseTimelineHelp:
      '2026년 8~10월의 주요 공개·발표 사례입니다. 추론, 에이전트, 장문 처리와 비용 효율의 변화는 각 사례의 출처와 평가 조건을 함께 읽어야 합니다.',
    blendedPrice: '혼합 가격 $/1M',
    outputSpeed: 'tok/s',
    detailContext: '문맥 길이',
    priceAxis: '왼쪽일수록 저렴',
    source:
      '2026-10-18 기준입니다. 점수는 표시된 추론·fallback 조건의 AA v4.3.2 시스템 프로필입니다. 세부 추론 강도가 없으면 미공개로 표시하며 동일 예산의 순위를 뜻하지 않습니다. 비용은 AA 과업의 관측값입니다. 로컬 체크포인트는 별도 평가가 필요하며 속도는 표시하지 않습니다. 값이 없다는 것은 0점이 아니라 해당 methodology에서 미공개라는 뜻입니다. 프로모션 가격과 장문 입력 가격에는 만료일이나 별도 임계값이 있을 수 있습니다.',
  },
};


const releaseStatusLabels: Record<Locale, Record<ReleaseStatus, string>> = {
  en: { released: 'released', preview: 'preview', announced: 'weights/report announced', restricted: 'restricted' },
  ko: { released: '공개 완료', preview: '프리뷰', announced: '가중치/리포트 공개 예정', restricted: '제한 공개' },
};

const companyOptions: CompanyKey[] = ['All', 'OpenAI', 'Google', 'Anthropic', 'DeepSeek', 'Z AI', 'Mistral', 'Reflection', 'Meta', 'NVIDIA', 'StepFun'];

const metricOptions: MetricKey[] = ['aaIndex', 'contextK'];

const axisLabels: Record<Locale, Record<AxisMode, string>> = {
  en: {
    timeline: 'Release milestone',
    price: 'Blended price, $/1M tokens',
    context: 'Context window, K tokens',
    taskCost: 'AA evaluation cost, $/task',
  },
  ko: {
    timeline: '공개 이정표',
    price: '혼합 가격, $/1M tokens',
    context: '문맥 길이, K tokens',
    taskCost: 'AA 평가 비용, $/과업',
  },
};

const chart = { width: 760, height: 420, left: 72, right: 30, top: 32, bottom: 64 };

function blendedPrice(row: ModelSnapshot) {
  if (typeof row.inputPrice !== 'number' || typeof row.outputPrice !== 'number') return undefined;
  return (row.inputPrice * 3 + row.outputPrice) / 4;
}

function xValue(row: ModelSnapshot, axisMode: AxisMode) {
  if (axisMode === 'timeline') return Date.parse(row.release) / 86_400_000;
  if (axisMode === 'price') return blendedPrice(row);
  if (axisMode === 'taskCost') return row.benchmarkCost;
  return row.contextK;
}

function yValue(row: ModelSnapshot, metric: MetricKey) {
  return row[metric];
}

function niceRange(values: number[], padRatio = 0.08, constantPad?: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    const pad = constantPad ?? (Math.abs(min) * padRatio || 1);
    return [min - pad, max + pad] as const;
  }
  const pad = (max - min) * padRatio;
  return [min - pad, max + pad] as const;
}

function formatX(value: number, axisMode: AxisMode) {
  if (axisMode === 'timeline') return new Date(value * 86_400_000).toISOString().slice(0, 10);
  if (axisMode === 'price' || axisMode === 'taskCost') return `$${value.toFixed(2)}`;
  return formatContext(value, 'not reported');
}

function formatMetric(value: number | undefined, metric: MetricKey, missing: string) {
  if (typeof value !== 'number') return missing;
  if (metric === 'aaIndex') return value.toFixed(0);
  if (metric === 'contextK') return formatContext(value, missing);
  return missing;
}

function formatContext(value: number | undefined, missing: string) {
  if (typeof value !== 'number') return missing;
  if (value >= 1000) {
    const millions = value / 1000;
    return `${millions.toFixed(Number.isInteger(millions) ? 0 : 2)}M`;
  }
  return `${value}K`;
}

function companyClass(company: string) {
  return company.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function CommercialModelBenchmarkExplorer({ locale = 'en' }: { locale?: Locale }) {
  const [metric, setMetric] = useState<MetricKey>('aaIndex');
  const [axisMode, setAxisMode] = useState<AxisMode>('taskCost');
  const [company, setCompany] = useState<CompanyKey>('All');
  const [selectedId, setSelectedId] = useState('gpt-61-sol');
  const text = labels[locale];

  const plottedRows = useMemo(() => {
    return MODEL_SNAPSHOTS.filter((row) => company === 'All' || row.company === company)
      .map((row) => ({ row, x: xValue(row, axisMode), y: yValue(row, metric) }))
      .filter((point): point is { row: ModelSnapshot; x: number; y: number } => {
        return typeof point.x === 'number' && typeof point.y === 'number';
      });
  }, [axisMode, company, metric]);

  const selected = MODEL_SNAPSHOTS.find((row) => row.id === selectedId) ?? MODEL_SNAPSHOTS[0];
  const xValues = plottedRows.length > 0 ? plottedRows.map((point) => point.x) : [0, 1];
  const yValues = plottedRows.length > 0 ? plottedRows.map((point) => point.y) : [0, 1];
  const [rawXMin, xMax] = niceRange(xValues, 0.08, axisMode === 'timeline' ? 1 : undefined);
  const xMin = axisMode === 'timeline' ? rawXMin : Math.max(0, rawXMin);
  const [rawYMin, yMax] = niceRange(yValues);
  const yMin = Math.max(0, rawYMin);
  const innerWidth = chart.width - chart.left - chart.right;
  const innerHeight = chart.height - chart.top - chart.bottom;

  const sx = (value: number) => chart.left + ((value - xMin) / (xMax - xMin)) * innerWidth;
  const sy = (value: number) => chart.top + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;

  const visibleRows = plottedRows.map((point) => point.row)
    .sort((a, b) => a.model.localeCompare(b.model));
  const timelineRows = [...MODEL_SNAPSHOTS]
    .filter((row) => company === 'All' || row.company === company)
    .sort((a, b) => Date.parse(a.release) - Date.parse(b.release));

  useEffect(() => {
    const eligible = plottedRows.length ? plottedRows.map((point) => point.row) : timelineRows;
    setSelectedId((current) => eligible.some((row) => row.id === current) ? current : eligible[0]?.id ?? current);
  }, [axisMode, company, metric]);

  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => xMin + (xMax - xMin) * ratio);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => yMin + (yMax - yMin) * ratio);

  const handleCompanyChange = (nextCompany: CompanyKey) => {
    setCompany(nextCompany);
    if (nextCompany === 'All' || selected.company === nextCompany) return;
    const latest = MODEL_SNAPSHOTS
      .filter((row) => row.company === nextCompany)
      .sort((a, b) => Date.parse(b.release) - Date.parse(a.release))[0];
    if (latest) setSelectedId(latest.id);
  };

  return (
    <section className="commercial-benchmark-explorer">
      <div className="commercial-benchmark-header">
        <div>
          <h3>{text.title}</h3>
          <p>{locale === 'ko' ? '2026-10-18 기준 · AA v4.3.2' : 'as of 2026-10-18 · AA v4.3.2'}</p>
          <p>{text.subtitle}</p>
        </div>
        <div className="commercial-benchmark-controls" aria-label={text.controlAria}>
          <label>
            <span>{text.benchmark}</span>
            <select value={metric} onChange={(event) => setMetric(event.target.value as MetricKey)}>
              {metricOptions.map((option) => (
                <option key={option} value={option}>
                  {metricLabels[locale][option]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{text.axisMode}</span>
            <select value={axisMode} onChange={(event) => setAxisMode(event.target.value as AxisMode)}>
              <option value="timeline">{text.timeline}</option>
              <option value="price">{text.price}</option>
              <option value="context">{text.context}</option>
              <option value="taskCost">{locale === 'ko' ? 'AA 평가 비용' : 'AA evaluation cost'}</option>
            </select>
          </label>
          <label>
            <span>{text.company}</span>
            <select value={company} onChange={(event) => handleCompanyChange(event.target.value as CompanyKey)}>
              {companyOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? text.all : option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="commercial-plot-layout">
        <div className="commercial-plot-panel">
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="commercial-scatter" role="img">
            <title>{locale === 'ko' ? `${metricLabels[locale][metric]} · ${axisLabels[locale][axisMode]}` : `${metricLabels[locale][metric]} by ${axisLabels[locale][axisMode]}`}</title>
            <rect
              x={chart.left}
              y={chart.top}
              width={innerWidth}
              height={innerHeight}
              rx="8"
              className="plot-surface"
            />

            {plottedRows.length === 0 && (
              <text x={chart.left + innerWidth / 2} y={chart.top + innerHeight / 2} textAnchor="middle" className="plot-empty">
                {text.noPoints}
              </text>
            )}

            {yTicks.map((tick) => (
              <g key={`y-${tick}`}>
                <line x1={chart.left} x2={chart.width - chart.right} y1={sy(tick)} y2={sy(tick)} className="plot-grid" />
                <text x={chart.left - 12} y={sy(tick) + 4} textAnchor="end" className="plot-tick">
                  {metric === 'contextK' ? formatContext(tick, text.noScore) : tick.toFixed(0)}
                </text>
              </g>
            ))}

            {xTicks.map((tick) => (
              <g key={`x-${tick}`}>
                <line x1={sx(tick)} x2={sx(tick)} y1={chart.top} y2={chart.top + innerHeight} className="plot-grid-soft" />
                <text x={sx(tick)} y={chart.height - 30} textAnchor="middle" className="plot-tick">
                  {formatX(tick, axisMode)}
                </text>
              </g>
            ))}

            <line x1={chart.left} x2={chart.width - chart.right} y1={chart.top + innerHeight} y2={chart.top + innerHeight} className="plot-axis" />
            <line x1={chart.left} x2={chart.left} y1={chart.top} y2={chart.top + innerHeight} className="plot-axis" />

            <text x={chart.left + innerWidth / 2} y={chart.height - 6} textAnchor="middle" className="plot-axis-label">
              {axisLabels[locale][axisMode]} {axisMode === 'price' ? `(${text.priceAxis})` : ''}
            </text>
            <text x="18" y={chart.top + innerHeight / 2} textAnchor="middle" className="plot-axis-label vertical-label">
              {metricLabels[locale][metric]}
            </text>

            {plottedRows.map((point) => {
              const isSelected = point.row.id === selected.id;
              return (
                <g
                  key={point.row.id}
                  className={`plot-point-group ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedId(point.row.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedId(point.row.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${text.selectModel}: ${point.row.model}`}
                >
                  <title>{`${point.row.model}: ${formatMetric(point.y, metric, text.noScore)}`}</title>
                  <circle
                    cx={sx(point.x)}
                    cy={sy(point.y)}
                    r={isSelected ? 8 : 6}
                    className={`plot-dot company-${companyClass(point.row.company)}`}
                  />
                  {isSelected && (
                    <text x={sx(point.x) > chart.width / 2 ? sx(point.x) - 10 : sx(point.x) + 10} textAnchor={sx(point.x) > chart.width / 2 ? 'end' : 'start'} y={sy(point.y) - 8} className="plot-label">
                      {point.row.model}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="commercial-detail-panel">
          <span className={`provider-chip provider-${companyClass(selected.company)}`}>{selected.company}</span>
          <h4>{selected.model}</h4>
          <p className="commercial-detail-meta">
            {selected.release} · AA v4.3.2 · {selected.setting === 'not reported' ? text.noScore : selected.setting === 'reasoning; effort not reported' && locale === 'ko' ? '추론 모드·강도 미공개' : selected.setting}
            {selected.releaseStatus ? ` · ${releaseStatusLabels[locale][selected.releaseStatus]}` : ''}
          </p>
          <p className="commercial-note">{locale === 'ko' ? selected.accessKo : selected.access}</p>
          <div className="commercial-detail-grid">
            <div>
              <span>{metricLabels[locale][metric]}</span>
              <strong>{formatMetric(selected[metric], metric, text.noScore)}</strong>
            </div>
            <div>
              <span>{text.blendedPrice}</span>
              <strong>{typeof blendedPrice(selected) === 'number' ? `$${blendedPrice(selected)?.toFixed(2)}` : text.noScore}</strong>
            </div>
            <div>
              <span>{locale === 'ko' ? 'AA 평가 비용 ($/과업)' : 'AA evaluation cost ($/task)'}</span>
              <strong>{typeof selected.benchmarkCost === 'number' ? `$${selected.benchmarkCost.toFixed(2)}` : text.noScore}</strong>
            </div>
            <div>
              <span>{text.detailContext}</span>
              <strong>{formatContext(selected.contextK, text.noScore)}</strong>
            </div>
          </div>
          <p className="commercial-source-note">
            <a href={selected.source}>{locale === 'ko' ? '공식 출처' : 'Primary source'}</a>
            {selected.specification && <> · <a href={selected.specification}>{locale === 'ko' ? '모델·API 규격' : 'Model/API specification'}</a></>}
            {selected.evaluation && <> · <a href={selected.evaluation}>{locale === 'ko' ? '평가 조건·출처' : 'Evaluation source'}</a></>}
            {selected.noteSource && <> · <a href={selected.noteSource}>{locale === 'ko' ? '단가 변경 출처' : 'Pricing update'}</a></>}
            {locale === 'ko' ? ' · 2026-10-18 기준' : ' · as of 2026-10-18'}
          </p>
          <p className="commercial-note">{locale === 'ko' ? selected.noteKo : selected.note}</p>
          {!plottedRows.some((point) => point.row.id === selected.id) && <p className="commercial-note">{locale === 'ko' ? '선택한 모델은 이 축·지표에 필요한 값이 없어 그래프에서 제외됩니다.' : 'The selected model lacks a value required by this axis or metric and is omitted from the plot.'}</p>}
        </aside>
      </div>

      <p>{locale === 'ko' ? '현재 그래프의 모델 선택 목록 (이름순)' : 'Select a profile in the current plot (alphabetical)'}</p>
      <div className="commercial-ranking-strip">
        {visibleRows.map((row) => (
          <button key={row.id} type="button" onClick={() => setSelectedId(row.id)} aria-pressed={row.id === selected.id}>
            <strong>{row.model}</strong>
            <em>{formatMetric(row[metric], metric, text.noScore)}</em>
          </button>
        ))}
      </div>

      <div className="commercial-release-timeline">
        <div className="commercial-timeline-heading">
          <h4>{text.releaseTimeline}</h4>
          <p>{text.releaseTimelineHelp}</p>
        </div>
        <div className="commercial-timeline-track" aria-label={text.releaseTimeline}>
          {timelineRows.map((row) => (
            <button
              key={row.id}
              type="button"
              className={`commercial-timeline-item ${row.id === selected.id ? 'is-selected' : ''}`}
              onClick={() => setSelectedId(row.id)}
              aria-pressed={row.id === selected.id}
            >
              <span>{row.release}</span>
              <strong>{row.model}</strong>
              <em>{row.setting === 'not reported' ? text.noScore : row.setting === 'reasoning; effort not reported' && locale === 'ko' ? '추론 모드·강도 미공개' : row.setting}</em>
            </button>
          ))}
        </div>
      </div>

      <p className="commercial-source-note">{text.source}</p>
    </section>
  );
}

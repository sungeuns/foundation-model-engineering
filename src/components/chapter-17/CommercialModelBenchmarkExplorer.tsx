import React, { useEffect, useMemo, useState } from 'react';
import './visualizers.css';
import snapshot from '../../data/commercial-model-snapshot.json';

type Locale = 'en' | 'ko';
type MetricKey = 'aaIndex' | 'contextK';
type AxisMode = 'timeline' | 'price' | 'context' | 'taskCost' | 'taskTime';
type ReleaseStatus = 'released' | 'preview' | 'announced' | 'restricted';

type ModelSnapshot = {
  id: string;
  company: string;
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
  benchmarkMinutes?: number;
  setting: string;
  evaluationProfile?: string;
  evaluationMethodology?: string;
  verifiedAt: string;
  evaluationVerifiedAt?: string;
};

const MODEL_SNAPSHOTS = snapshot.models as ModelSnapshot[];
const milestoneDates = MODEL_SNAPSHOTS.map(row => row.release).sort();
const milestoneRange = (locale: Locale) => {
  const formatter = new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
  return `${formatter.format(new Date(milestoneDates[0]))}–${formatter.format(new Date(milestoneDates[milestoneDates.length - 1]))}`;
};

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
      'Compare the time and cost of an Artificial Analysis (AA) task at each model’s published reasoning setting. Select a point to see its source and conditions.',
    dates: `Provider snapshot as of ${snapshot.asOf} · AA evaluations as of ${snapshot.evaluationAsOf}`,
    staticHint: 'The chart shows the AA Index against cost per task. Enable JavaScript to change the chart or select another model.',
    benchmark: 'Benchmark',
    controlAria: 'Benchmark plot controls',
    noPoints: 'No verified points for this filter, axis, and metric.',
    selectModel: 'Select model',
    axisMode: 'X-axis',
    company: 'Company',
    all: 'All companies',
    timeline: 'Release milestone',
    price: 'Token price',
    taskCost: 'AA cost per task',
    taskTime: 'AA time per task',
    context: 'Context limit',
    yAxis: 'Benchmark score',
    noScore: 'not reported',
    selected: 'Selected model',
    releaseTimeline: 'Release timeline',
    releaseTimelineHelp:
      `Selected releases and announcements in ${milestoneRange('en')}. Read changes in reasoning, agents, long-context handling, and cost efficiency alongside each source and its evaluation conditions.`,
    blendedPrice: '3:1 input/output mix, $/1M tokens',
    minutes: 'min',
    detailContext: 'context',
    priceAxis: 'Lower is cheaper',
    source:
      'AA estimates minutes per task from output token counts and endpoint speeds, weighted by evaluation. Measure end-to-end latency on your own requests. AA estimates cost from benchmark token usage, prices and cache-hit assumptions. For Argon and Carbon, AA uses different rates from the provider’s introductory offer. Points require a reported value on both axes.',
  },
  ko: {
    title: '상용 모델 비교 지도',
    subtitle:
      '각 모델의 공개된 추론 설정에서 Artificial Analysis(AA) 과업 하나에 걸린 시간과 비용을 비교해 보세요. 점을 선택하면 해당 평가의 출처와 조건을 볼 수 있습니다.',
    dates: `제공사 정보 기준일 ${snapshot.asOf} · AA 평가 기준일 ${snapshot.evaluationAsOf}`,
    staticHint: '현재 그래프에는 과업당 비용과 AA 지능 지수가 표시됩니다. 축을 바꾸거나 다른 모델을 선택하려면 자바스크립트를 켜세요.',
    benchmark: '지표',
    controlAria: '모델 비교 그래프 설정',
    noPoints: '이 필터·축·지표에 필요한 값을 확인한 모델이 없습니다.',
    selectModel: '모델 선택',
    axisMode: 'X축',
    company: '회사',
    all: '전체 회사',
    timeline: '공개 이정표',
    price: '토큰 단가',
    taskCost: 'AA 과업당 비용',
    taskTime: 'AA 과업당 시간',
    context: '문맥 한도',
    yAxis: '지표 값',
    noScore: '미공개',
    selected: '선택한 모델',
    releaseTimeline: '공개 일정',
    releaseTimelineHelp:
      `${milestoneRange('ko')}의 주요 공개·발표 사례입니다. 추론, 에이전트, 장문 처리와 비용 효율의 변화는 각 사례의 출처와 평가 조건을 함께 읽어야 합니다.`,
    blendedPrice: '입력·출력 3:1 혼합 단가($/100만 토큰)',
    minutes: '분',
    detailContext: '문맥 길이',
    priceAxis: '왼쪽일수록 저렴',
    source:
      'AA는 하위 평가별 출력 토큰 수와 엔드포인트 출력 속도로 과업당 추론 시간을 추정하고, 평가별 비중을 반영합니다. 서비스의 요청 처리 시간은 실제 입력과 추론 설정에서 따로 재야 합니다. AA는 평가에 쓴 토큰 수와 단가, 캐시 적중률 가정으로 과업 비용을 추정합니다. Argon과 Carbon의 경우 AA가 적용한 단가와 제공사의 출시 할인가가 다릅니다. 두 축의 값을 모두 확인한 모델만 점으로 표시합니다.',
  },
};


const releaseStatusLabels: Record<Locale, Record<ReleaseStatus, string>> = {
  en: { released: 'released', preview: 'preview', announced: 'weights/report announced', restricted: 'restricted' },
  ko: { released: '공개 완료', preview: '프리뷰', announced: '가중치/리포트 공개 예정', restricted: '제한 공개' },
};

const companyOptions = ['All', ...Array.from(new Set(MODEL_SNAPSHOTS.map(row => row.company))).sort()];

const metricOptions: MetricKey[] = ['aaIndex', 'contextK'];

const axisLabels: Record<Locale, Record<AxisMode, string>> = {
  en: {
    timeline: 'Release milestone',
    price: 'Blended price, $/1M tokens',
    context: 'Context window, tokens',
    taskCost: 'AA evaluation cost, $/task',
    taskTime: 'AA inference time, minutes per task',
  },
  ko: {
    timeline: '공개 이정표',
    price: '토큰 100만 개당 혼합 단가($)',
    context: '문맥 길이(토큰 수)',
    taskCost: 'AA 평가 비용, $/과업',
    taskTime: 'AA 과업당 추론 시간(분)',
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
  if (axisMode === 'taskTime') return row.benchmarkMinutes;
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
  if (axisMode === 'taskTime') return String(Number(value.toFixed(2)));
  return formatContext(value, 'not reported', true);
}

function formatMetric(value: number | undefined, metric: MetricKey, missing: string) {
  if (typeof value !== 'number') return missing;
  if (metric === 'aaIndex') return value.toFixed(0);
  if (metric === 'contextK') return formatContext(value, missing);
  return missing;
}

function formatContext(value: number | undefined, missing: string, compact = false) {
  if (typeof value !== 'number') return missing;
  if (value >= 1000) {
    const millions = value / 1000;
    return `${Number(millions.toFixed(compact ? 2 : 6))}M`;
  }
  return `${Number(value.toFixed(compact ? 2 : 3))}K`;
}

function companyClass(company: string) {
  return company.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function formatSetting(setting: string, locale: Locale) {
  if (setting === 'not reported') return labels[locale].noScore;
  if (locale === 'ko' && setting === 'reasoning; effort not reported') return '추론 모드·강도 미공개';
  if (locale === 'ko' && setting === 'max with fallback') return 'max·기본 fallback';
  return setting;
}

export default function CommercialModelBenchmarkExplorer({ locale = 'en' }: { locale?: Locale }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [metric, setMetric] = useState<MetricKey>('aaIndex');
  const [axisMode, setAxisMode] = useState<AxisMode>('taskCost');
  const [company, setCompany] = useState('All');
  const [selectedId, setSelectedId] = useState('gpt-62-sol');
  const text = labels[locale];

  const plottedRows = useMemo(() => {
    return MODEL_SNAPSHOTS.filter((row) => company === 'All' || row.company === company)
      .map((row) => ({ row, x: xValue(row, axisMode), y: yValue(row, metric) }))
      .filter((point): point is { row: ModelSnapshot; x: number; y: number } => {
        return typeof point.x === 'number' && Number.isFinite(point.x) && typeof point.y === 'number' && Number.isFinite(point.y);
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

  const tickFractions = plottedRows.length ? [0, 0.25, 0.5, 0.75, 1] : [];
  const xTicks = tickFractions.map((ratio) => xMin + (xMax - xMin) * ratio);
  const yTicks = tickFractions.map((ratio) => yMin + (yMax - yMin) * ratio);

  const handleCompanyChange = (nextCompany: string) => {
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
          <p>{text.dates} · {snapshot.methodology}</p>
          <p>{text.subtitle}</p>
          <noscript><p>{text.staticHint}</p></noscript>
        </div>
        <div className="commercial-benchmark-controls" aria-label={text.controlAria}>
          <label>
            <span>{text.benchmark}</span>
            <select disabled={!ready} value={metric} onChange={(event) => setMetric(event.target.value as MetricKey)}>
              {metricOptions.map((option) => (
                <option key={option} value={option}>
                  {metricLabels[locale][option]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{text.axisMode}</span>
            <select disabled={!ready} value={axisMode} onChange={(event) => setAxisMode(event.target.value as AxisMode)}>
              <option value="timeline">{text.timeline}</option>
              <option value="price">{text.price}</option>
              <option value="context">{text.context}</option>
              <option value="taskCost">{text.taskCost}</option>
              <option value="taskTime">{text.taskTime}</option>
            </select>
          </label>
          <label>
            <span>{text.company}</span>
            <select disabled={!ready} value={company} onChange={(event) => handleCompanyChange(event.target.value)}>
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
        <div className="commercial-plot-panel" role="region" aria-label={locale === 'ko' ? '모델 비교 그래프: 가로 스크롤 가능' : 'Model comparison chart: horizontally scrollable'} tabIndex={0}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="commercial-scatter" role={ready ? 'group' : 'img'}>
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
                  {metric === 'contextK' ? formatContext(tick, text.noScore, true) : tick.toFixed(0)}
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
                  role={ready ? 'button' : undefined}
                  tabIndex={ready ? 0 : undefined}
                  aria-pressed={ready ? isSelected : undefined}
                  aria-label={ready ? `${text.selectModel}: ${point.row.model}` : undefined}
                >
                  <title>{`${point.row.model} · ${axisLabels[locale][axisMode]}: ${formatX(point.x, axisMode)} · ${metricLabels[locale][metric]}: ${formatMetric(point.y, metric, text.noScore)}`}</title>
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
            {selected.release}
            {selected.evaluationMethodology && <> · {selected.evaluationMethodology} · {formatSetting(selected.setting, locale)}</>}
            {selected.releaseStatus ? ` · ${releaseStatusLabels[locale][selected.releaseStatus]}` : ''}
          </p>
          {!selected.evaluationMethodology && <p className="commercial-note">{locale === 'ko' ? '이 항목에 대응하는 AA 평가값을 확인하지 못했습니다.' : 'No matched AA evaluation is verified for this entry.'}</p>}
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
              <span>{text.taskTime}</span>
              <strong>{typeof selected.benchmarkMinutes === 'number' ? `${selected.benchmarkMinutes}${locale === 'ko' ? '' : ' '}${text.minutes}` : text.noScore}</strong>
            </div>
            <div>
              <span>{text.detailContext}</span>
              <strong>{formatContext(selected.contextK, text.noScore)}</strong>
            </div>
          </div>
          <p className="commercial-source-note">
            <a href={`#model-${selected.id}`}>{locale === 'ko' ? `${selected.model} 프로필 고유 링크` : `Permalink to ${selected.model}`}</a>
            {' · '}
            <a href={selected.source}>{locale === 'ko' ? '공식 출처' : 'Primary source'}</a>
            {selected.specification && <> · <a href={selected.specification}>{locale === 'ko' ? '모델·API 규격' : 'Model/API specification'}</a></>}
            {selected.evaluation && <> · <a href={selected.evaluation}>{locale === 'ko' ? '평가 조건·출처' : 'Evaluation source'}</a></>}
            {selected.noteSource && <> · <a href={selected.noteSource}>{locale === 'ko' ? '추가 출처' : 'Additional source'}</a></>}
            {locale === 'ko' ? ` · 공식 정보 확인 ${selected.verifiedAt}` : ` · primary information checked ${selected.verifiedAt}`}
            {selected.evaluationVerifiedAt && (locale === 'ko' ? ` · AA 확인 ${selected.evaluationVerifiedAt}` : ` · AA checked ${selected.evaluationVerifiedAt}`)}
          </p>
          <p className="commercial-note">{locale === 'ko' ? selected.noteKo : selected.note}</p>
          {!plottedRows.some((point) => point.row.id === selected.id) && <p className="commercial-note">{locale === 'ko' ? '선택한 모델은 이 축·지표에 필요한 값이 없어 그래프에서 제외됩니다.' : 'The selected model lacks a value required by this axis or metric and is omitted from the plot.'}</p>}
        </aside>
      </div>

      <p>{locale === 'ko' ? '현재 그래프의 모델 선택 목록 (이름순)' : 'Select a profile in the current plot (alphabetical)'}</p>
      <div className="commercial-ranking-strip">
        {visibleRows.map((row) => (
          <button key={row.id} type="button" disabled={!ready} onClick={() => setSelectedId(row.id)} aria-pressed={row.id === selected.id}>
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
              disabled={!ready}
              className={`commercial-timeline-item ${row.id === selected.id ? 'is-selected' : ''}`}
              onClick={() => setSelectedId(row.id)}
              aria-pressed={row.id === selected.id}
            >
              <span>{row.release}</span>
              <strong>{row.model}</strong>
              <em>{row.evaluationMethodology ? formatSetting(row.setting, locale) : (locale === 'ko' ? 'AA 평가 미확인' : 'AA evaluation not verified')}</em>
            </button>
          ))}
        </div>
      </div>

      <p className="commercial-source-note">{text.source}</p>
    </section>
  );
}

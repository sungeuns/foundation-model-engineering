import React, { useMemo, useState } from 'react';
import './visualizers.css';

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
  | 'Mistral';
type MetricKey =
  | 'aaIndex'
  | 'valsIndex'
  | 'sweBench'
  | 'terminalBench'
  | 'gpqa'
  | 'hle'
  | 'outputSpeed';
type AxisMode = 'timeline' | 'price' | 'speed' | 'context';

type ModelSnapshot = {
  id: string;
  company: Exclude<CompanyKey, 'All'>;
  model: string;
  release: string;
  releaseMonth: number;
  family: string;
  access: string;
  aaIndex?: number;
  valsIndex?: number;
  sweBench?: number;
  terminalBench?: number;
  gpqa?: number;
  hle?: number;
  inputPrice?: number;
  outputPrice?: number;
  outputSpeed?: number;
  contextK?: number;
  note: string;
};

const MODEL_SNAPSHOTS: ModelSnapshot[] = [
  {
    id: 'gpt-4',
    company: 'OpenAI',
    model: 'GPT-4',
    release: '2023-03',
    releaseMonth: 2023.17,
    family: 'general frontier model',
    access: 'API / ChatGPT',
    contextK: 32,
    note: 'The historical anchor for this page: strong exams and coding, but before today’s agentic benchmark regime.',
  },
  {
    id: 'gemini-15-pro',
    company: 'Google',
    model: 'Gemini 1.5 Pro',
    release: '2024-02',
    releaseMonth: 2024.08,
    family: 'long-context multimodal',
    access: 'AI Studio / Vertex AI',
    contextK: 1000,
    note: 'Moved the public frontier toward long-context multimodal work, with a 1M-token preview and MoE efficiency story.',
  },
  {
    id: 'mistral-large',
    company: 'Mistral',
    model: 'Mistral Large',
    release: '2024-02',
    releaseMonth: 2024.08,
    family: 'API flagship',
    access: 'La Plateforme / Azure',
    contextK: 32,
    note: 'A European commercial flagship focused on multilingual reasoning and enterprise API deployment.',
  },
  {
    id: 'claude-3-opus',
    company: 'Anthropic',
    model: 'Claude 3 Opus',
    release: '2024-03',
    releaseMonth: 2024.17,
    family: 'general frontier model',
    access: 'API / Claude',
    inputPrice: 15,
    outputPrice: 75,
    contextK: 200,
    note: 'Made the Opus/Sonnet/Haiku product ladder explicit: frontier quality, mid-tier balance, and fast low-cost serving.',
  },
  {
    id: 'gpt-4o',
    company: 'OpenAI',
    model: 'GPT-4o',
    release: '2024-05',
    releaseMonth: 2024.33,
    family: 'omni multimodal',
    access: 'API / ChatGPT',
    inputPrice: 5,
    outputPrice: 15,
    contextK: 128,
    note: 'Shifted attention from pure text scores to real-time voice, vision, lower latency, and cheaper GPT-4-level capability.',
  },
  {
    id: 'claude-35-sonnet',
    company: 'Anthropic',
    model: 'Claude 3.5 Sonnet',
    release: '2024-06',
    releaseMonth: 2024.42,
    family: 'efficient frontier',
    access: 'API / Claude / cloud partners',
    inputPrice: 3,
    outputPrice: 15,
    contextK: 200,
    note: 'A clear example of capability moving down-market: stronger than Claude 3 Opus on many tasks at Sonnet-class price and speed.',
  },
  {
    id: 'mistral-large-2',
    company: 'Mistral',
    model: 'Mistral Large 2',
    release: '2024-07',
    releaseMonth: 2024.5,
    family: 'open-weight enterprise',
    access: 'API / open-weight',
    contextK: 128,
    note: 'Pushed the open-weight enterprise lane with better code, math, multilingual support, and function calling.',
  },
  {
    id: 'o1-preview',
    company: 'OpenAI',
    model: 'o1-preview',
    release: '2024-09',
    releaseMonth: 2024.67,
    family: 'reasoning model',
    access: 'ChatGPT / API preview',
    contextK: 128,
    note: 'Made inference-time reasoning budget a product feature: harder science, math, and code tasks improved by thinking longer.',
  },
  {
    id: 'qwen-25',
    company: 'Alibaba',
    model: 'Qwen 2.5',
    release: '2024-09',
    releaseMonth: 2024.67,
    family: 'open model family',
    access: 'open-weight ecosystem',
    contextK: 128,
    note: 'Marked the scale of Alibaba’s open model strategy: many sizes and modalities aimed at broad developer adoption.',
  },
  {
    id: 'claude-35-sonnet-computer',
    company: 'Anthropic',
    model: 'Claude 3.5 Sonnet Computer Use',
    release: '2024-10',
    releaseMonth: 2024.75,
    family: 'computer-use agent',
    access: 'API beta',
    inputPrice: 3,
    outputPrice: 15,
    contextK: 200,
    note: 'A major step from answering to acting: the model could inspect screens, move a cursor, click, and type through the API.',
  },
  {
    id: 'deepseek-v3',
    company: 'DeepSeek',
    model: 'DeepSeek-V3',
    release: '2024-12',
    releaseMonth: 2024.92,
    family: 'efficient MoE model',
    access: 'API / open-weight ecosystem',
    contextK: 128,
    note: 'Changed the cost discussion with a 671B-parameter MoE model, 37B active parameters per token, and aggressive training efficiency.',
  },
  {
    id: 'deepseek-r1',
    company: 'DeepSeek',
    model: 'DeepSeek-R1',
    release: '2025-01',
    releaseMonth: 2025.0,
    family: 'open reasoning model',
    access: 'API / open-weight ecosystem',
    contextK: 128,
    note: 'Showed that open reasoning models trained with large-scale RL could challenge closed reasoning systems on math and code.',
  },
  {
    id: 'qwen3',
    company: 'Alibaba',
    model: 'Qwen3-235B-A22B',
    release: '2025-04',
    releaseMonth: 2025.25,
    family: 'hybrid reasoning MoE',
    access: 'open-weight ecosystem',
    contextK: 128,
    note: 'Introduced hybrid thinking and non-thinking modes, making reasoning budget a controllable open-model feature.',
  },
  {
    id: 'minimax-m1',
    company: 'MiniMax',
    model: 'MiniMax-M1',
    release: '2025-06',
    releaseMonth: 2025.42,
    family: 'hybrid-attention reasoning',
    access: 'open-weight ecosystem',
    inputPrice: 0.4,
    outputPrice: 2.2,
    contextK: 1000,
    note: 'Made long-context reasoning cheaper with hybrid attention, a 1M-token context window, and open weights.',
  },
  {
    id: 'kimi-k2',
    company: 'Kimi',
    model: 'Kimi K2',
    release: '2025-07',
    releaseMonth: 2025.5,
    family: 'open agentic MoE',
    access: 'API / open-weight ecosystem',
    inputPrice: 0.95,
    outputPrice: 4,
    contextK: 128,
    note: 'A trillion-parameter open MoE focused on coding, reasoning, and autonomous tool-use workflows.',
  },
  {
    id: 'gemini-25-pro',
    company: 'Google',
    model: 'Gemini 2.5 Pro',
    release: '2025-06',
    releaseMonth: 2025.42,
    family: 'multimodal reasoning',
    access: 'Gemini API / Vertex AI',
    aaIndex: 35,
    gpqa: 86.4,
    hle: 21.6,
    inputPrice: 1.25,
    outputPrice: 10,
    outputSpeed: 126.9,
    contextK: 1000,
    note: 'A good example of a model that was fast and long-context before it became the top aggregate scorer.',
  },
  {
    id: 'gemini-3-pro',
    company: 'Google',
    model: 'Gemini 3 Pro',
    release: '2025-11',
    releaseMonth: 2025.83,
    family: 'multimodal reasoning',
    access: 'Gemini API / Vertex AI',
    aaIndex: 48,
    gpqa: 91.9,
    hle: 37.5,
    inputPrice: 2,
    outputPrice: 12,
    outputSpeed: 131.5,
    contextK: 1000,
    note: 'A large step up in reasoning while preserving Google’s strong speed and multimodal profile.',
  },
  {
    id: 'gemini-31-pro',
    company: 'Google',
    model: 'Gemini 3.1 Pro',
    release: '2026-02',
    releaseMonth: 2026.08,
    family: 'multimodal reasoning',
    access: 'Gemini API / Vertex AI',
    aaIndex: 57,
    valsIndex: 69.4,
    sweBench: 78.8,
    terminalBench: 67.4,
    gpqa: 94.3,
    hle: 44.4,
    inputPrice: 2,
    outputPrice: 12,
    outputSpeed: 125.6,
    contextK: 1000,
    note: 'Shows why plotting speed and price matters: near-frontier aggregate score with unusually high output speed.',
  },
  {
    id: 'gpt-53-codex',
    company: 'OpenAI',
    model: 'GPT-5.3 Codex',
    release: '2026-02',
    releaseMonth: 2026.08,
    family: 'coding agent',
    access: 'Codex / API',
    aaIndex: 54,
    sweBench: 56.8,
    terminalBench: 64.0,
    inputPrice: 1.75,
    outputPrice: 14,
    outputSpeed: 78.7,
    contextK: 400,
    note: 'A specialized coding-agent step; useful for seeing how task-specific models can outrank general models on workflow evals.',
  },
  {
    id: 'gpt-54',
    company: 'OpenAI',
    model: 'GPT-5.4',
    release: '2026-03',
    releaseMonth: 2026.17,
    family: 'frontier agent',
    access: 'API / ChatGPT / Codex',
    aaIndex: 57,
    sweBench: 67.4,
    inputPrice: 2.5,
    outputPrice: 15,
    outputSpeed: 82.8,
    contextK: 1000,
    note: 'A general-purpose follow-up that keeps high speed while broadening beyond coding-only behavior.',
  },
  {
    id: 'gpt-55',
    company: 'OpenAI',
    model: 'GPT-5.5',
    release: '2026-04',
    releaseMonth: 2026.33,
    family: 'frontier agent',
    access: 'API / ChatGPT',
    aaIndex: 60,
    valsIndex: 68.8,
    sweBench: 82.6,
    inputPrice: 5,
    outputPrice: 30,
    outputSpeed: 63.1,
    contextK: 922,
    note: 'Highest AA Index in this snapshot, but its cost point makes the efficiency view more nuanced than the headline score.',
  },
  {
    id: 'claude-sonnet-46',
    company: 'Anthropic',
    model: 'Claude Sonnet 4.6',
    release: '2026-02',
    releaseMonth: 2026.08,
    family: 'efficient frontier',
    access: 'API / Claude',
    aaIndex: 52,
    valsIndex: 67.7,
    inputPrice: 3.75,
    outputPrice: 15,
    outputSpeed: 51.4,
    contextK: 1000,
    note: 'A Sonnet-class example of the “frontier capability moving down-market” pattern.',
  },
  {
    id: 'claude-opus-47',
    company: 'Anthropic',
    model: 'Claude Opus 4.7',
    release: '2026-04',
    releaseMonth: 2026.33,
    family: 'frontier agent',
    access: 'API / Claude / cloud partners',
    aaIndex: 57,
    valsIndex: 71.5,
    sweBench: 82.0,
    terminalBench: 68.5,
    inputPrice: 6.25,
    outputPrice: 25,
    outputSpeed: 43.5,
    contextK: 1000,
    note: 'Often strong on professional-work suites, but slower and more expensive than many similarly capable alternatives.',
  },
  {
    id: 'claude-mythos',
    company: 'Anthropic',
    model: 'Claude Mythos Preview',
    release: '2026-04',
    releaseMonth: 2026.33,
    family: 'gated cyber / agent',
    access: 'controlled research preview',
    contextK: 1000,
    note: 'Included as a deployment lesson, not as a public leaderboard point: capability may be identity-gated when risk is high.',
  },
  {
    id: 'kimi-k2-thinking',
    company: 'Kimi',
    model: 'Kimi K2 Thinking',
    release: '2026-04',
    releaseMonth: 2026.33,
    family: 'open-weight challenger',
    access: 'API / open-weight ecosystem',
    aaIndex: 54,
    inputPrice: 0.95,
    outputPrice: 4,
    outputSpeed: 31.3,
    contextK: 256,
    note: 'A strong challenger that looks much better on price-performance than on speed-performance.',
  },
  {
    id: 'deepseek-v4-pro',
    company: 'DeepSeek',
    model: 'DeepSeek V4 Pro',
    release: '2026-04',
    releaseMonth: 2026.33,
    family: 'open-weight reasoning',
    access: 'API / open-weight ecosystem',
    aaIndex: 52,
    inputPrice: 1.74,
    outputPrice: 3.48,
    outputSpeed: 33.8,
    contextK: 1000,
    note: 'A useful counterpoint to closed frontier models: high aggregate capability with much lower token pricing.',
  },
  {
    id: 'qwen3-max-thinking',
    company: 'Alibaba',
    model: 'Qwen3 Max Thinking',
    release: '2026-01',
    releaseMonth: 2026.0,
    family: 'reasoning model',
    access: 'API',
    aaIndex: 40,
    inputPrice: 1.2,
    outputPrice: 6,
    outputSpeed: 35.9,
    contextK: 256,
    note: 'Shows the breadth of Chinese frontier competition beyond one or two labs.',
  },
  {
    id: 'minimax-m27',
    company: 'MiniMax',
    model: 'MiniMax-M2.7',
    release: '2026-03',
    releaseMonth: 2026.17,
    family: 'open-weight challenger',
    access: 'API / open-weight ecosystem',
    aaIndex: 50,
    inputPrice: 0.3,
    outputPrice: 1.2,
    outputSpeed: 45.4,
    contextK: 205,
    note: 'A strong price-performance point: not the top raw score, but very competitive once token cost is plotted.',
  },
  {
    id: 'mistral-large-3',
    company: 'Mistral',
    model: 'Mistral Large 3',
    release: '2025-12',
    releaseMonth: 2025.92,
    family: 'open-weight enterprise',
    access: 'API / open-weight',
    aaIndex: 23,
    inputPrice: 0.5,
    outputPrice: 1.5,
    outputSpeed: 45.4,
    contextK: 256,
    note: 'Not a top raw scorer here, but relevant when customization, sovereignty, and open deployment matter.',
  },
];

const metricLabels: Record<MetricKey, string> = {
  aaIndex: 'AA Index',
  valsIndex: 'Vals Index',
  sweBench: 'SWE-Bench',
  terminalBench: 'Terminal-Bench',
  gpqa: 'GPQA Diamond',
  hle: 'Humanity’s Last Exam',
  outputSpeed: 'Output speed',
};

const labels = {
  en: {
    title: 'Commercial Model Benchmark Map',
    subtitle:
      'Choose a benchmark, then change the x-axis to see whether the same model still looks strong by time, token cost, speed, or context budget.',
    benchmark: 'Benchmark',
    axisMode: 'X-axis',
    company: 'Company',
    all: 'All companies',
    timeline: 'release date',
    price: 'token price',
    speed: 'output speed',
    context: 'context window',
    yAxis: 'Benchmark score',
    noScore: 'not reported',
    selected: 'Selected model',
    releaseTimeline: 'Release timeline',
    releaseTimelineHelp:
      'Major public model releases from early 2024 onward. The pattern to watch is not one winner, but the shrinking gap between releases and the repeated shift from static QA to reasoning, agents, long context, and cost efficiency.',
    blendedPrice: 'blended $/1M',
    outputSpeed: 'tok/s',
    detailContext: 'context',
    priceAxis: 'Lower is cheaper',
    source:
      'Snapshot as of May 8, 2026. Values combine cited lab cards/release notes with Artificial Analysis and Vals AI public benchmark pages.',
  },
  ko: {
    title: '상업용 모델 Benchmark Map',
    subtitle:
      'Benchmark를 고른 뒤 x축을 바꿔 보세요. 같은 모델도 시간, token cost, 속도, context budget 기준에서는 전혀 다르게 보입니다.',
    benchmark: 'Benchmark',
    axisMode: 'X축',
    company: '회사',
    all: '전체 회사',
    timeline: 'release date',
    price: 'token price',
    speed: 'output speed',
    context: 'context window',
    yAxis: 'Benchmark score',
    noScore: '미공개',
    selected: '선택한 모델',
    releaseTimeline: 'Release timeline',
    releaseTimelineHelp:
      '2024년 초부터 공개된 주요 모델 release입니다. 한 모델의 승패보다 release 간격이 짧아지고, static QA에서 reasoning, agent, long context, cost efficiency로 개선축이 반복 이동하는 흐름을 보세요.',
    blendedPrice: 'blended $/1M',
    outputSpeed: 'tok/s',
    detailContext: 'context',
    priceAxis: '왼쪽일수록 저렴',
    source:
      '2026년 5월 8일 기준 snapshot입니다. 값은 본문에 인용한 lab card/release note와 Artificial Analysis, Vals AI public benchmark page를 함께 정리했습니다.',
  },
};

const companyOptions: CompanyKey[] = [
  'All',
  'OpenAI',
  'Google',
  'Anthropic',
  'Kimi',
  'DeepSeek',
  'Alibaba',
  'MiniMax',
  'Mistral',
];

const metricOptions: MetricKey[] = [
  'aaIndex',
  'valsIndex',
  'sweBench',
  'terminalBench',
  'gpqa',
  'hle',
  'outputSpeed',
];

const axisLabels: Record<AxisMode, string> = {
  timeline: 'Release date',
  price: 'Blended price, $/1M tokens',
  speed: 'Output tokens/sec',
  context: 'Context window, K tokens',
};

const chart = { width: 760, height: 420, left: 72, right: 30, top: 32, bottom: 64 };

function blendedPrice(row: ModelSnapshot) {
  if (typeof row.inputPrice !== 'number' || typeof row.outputPrice !== 'number') return undefined;
  return (row.inputPrice * 3 + row.outputPrice) / 4;
}

function xValue(row: ModelSnapshot, axisMode: AxisMode) {
  if (axisMode === 'timeline') return row.releaseMonth;
  if (axisMode === 'price') return blendedPrice(row);
  if (axisMode === 'speed') return row.outputSpeed;
  return row.contextK;
}

function yValue(row: ModelSnapshot, metric: MetricKey) {
  return row[metric];
}

function niceRange(values: number[], padRatio = 0.08) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [min - 1, max + 1] as const;
  const pad = (max - min) * padRatio;
  return [min - pad, max + pad] as const;
}

function formatX(value: number, axisMode: AxisMode) {
  if (axisMode === 'timeline') {
    const year = Math.floor(value);
    const month = Math.max(1, Math.min(12, Math.round((value - year) * 12) + 1));
    return `${year}-${String(month).padStart(2, '0')}`;
  }
  if (axisMode === 'price') return `$${value.toFixed(value < 2 ? 2 : 1)}`;
  if (axisMode === 'speed') return `${value.toFixed(0)}`;
  return value >= 1000 ? '1M' : `${value.toFixed(0)}K`;
}

function formatMetric(value: number | undefined, metric: MetricKey, missing: string) {
  if (typeof value !== 'number') return missing;
  if (metric === 'aaIndex') return value.toFixed(0);
  if (metric === 'outputSpeed') return `${value.toFixed(0)} tok/s`;
  return `${value.toFixed(1)}%`;
}

function companyClass(company: string) {
  return company.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function CommercialModelBenchmarkExplorer({ locale = 'en' }: { locale?: Locale }) {
  const [metric, setMetric] = useState<MetricKey>('aaIndex');
  const [axisMode, setAxisMode] = useState<AxisMode>('timeline');
  const [company, setCompany] = useState<CompanyKey>('All');
  const [selectedId, setSelectedId] = useState('gpt-55');
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
  const [xMin, xMax] = niceRange(xValues);
  const [yMin, yMax] = niceRange(yValues);
  const innerWidth = chart.width - chart.left - chart.right;
  const innerHeight = chart.height - chart.top - chart.bottom;

  const sx = (value: number) => chart.left + ((value - xMin) / (xMax - xMin)) * innerWidth;
  const sy = (value: number) => chart.top + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;

  const bestRows = [...MODEL_SNAPSHOTS]
    .filter((row) => typeof row[metric] === 'number')
    .sort((a, b) => (b[metric] as number) - (a[metric] as number))
    .slice(0, 5);
  const timelineRows = [...MODEL_SNAPSHOTS]
    .filter((row) => company === 'All' || row.company === company)
    .sort((a, b) => a.releaseMonth - b.releaseMonth);

  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => xMin + (xMax - xMin) * ratio);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => yMin + (yMax - yMin) * ratio);

  return (
    <section className="commercial-benchmark-explorer">
      <div className="commercial-benchmark-header">
        <div>
          <h3>{text.title}</h3>
          <p>{text.subtitle}</p>
        </div>
        <div className="commercial-benchmark-controls" aria-label="Benchmark plot controls">
          <label>
            <span>{text.benchmark}</span>
            <select value={metric} onChange={(event) => setMetric(event.target.value as MetricKey)}>
              {metricOptions.map((option) => (
                <option key={option} value={option}>
                  {metricLabels[option]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{text.axisMode}</span>
            <select value={axisMode} onChange={(event) => setAxisMode(event.target.value as AxisMode)}>
              <option value="timeline">{text.timeline}</option>
              <option value="price">{text.price}</option>
              <option value="speed">{text.speed}</option>
              <option value="context">{text.context}</option>
            </select>
          </label>
          <label>
            <span>{text.company}</span>
            <select value={company} onChange={(event) => setCompany(event.target.value as CompanyKey)}>
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
            <title>{`${metricLabels[metric]} by ${axisLabels[axisMode]}`}</title>
            <rect
              x={chart.left}
              y={chart.top}
              width={innerWidth}
              height={innerHeight}
              rx="8"
              className="plot-surface"
            />

            {yTicks.map((tick) => (
              <g key={`y-${tick}`}>
                <line x1={chart.left} x2={chart.width - chart.right} y1={sy(tick)} y2={sy(tick)} className="plot-grid" />
                <text x={chart.left - 12} y={sy(tick) + 4} textAnchor="end" className="plot-tick">
                  {metric === 'aaIndex' || metric === 'outputSpeed' ? tick.toFixed(0) : `${tick.toFixed(0)}%`}
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
              {axisLabels[axisMode]} {axisMode === 'price' ? `(${text.priceAxis})` : ''}
            </text>
            <text x="18" y={chart.top + innerHeight / 2} textAnchor="middle" className="plot-axis-label vertical-label">
              {metricLabels[metric]}
            </text>

            {plottedRows.map((point) => {
              const isSelected = point.row.id === selected.id;
              return (
                <g
                  key={point.row.id}
                  className={`plot-point-group ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedId(point.row.id)}
                >
                  <circle
                    cx={sx(point.x)}
                    cy={sy(point.y)}
                    r={isSelected ? 8 : 6}
                    className={`plot-dot company-${companyClass(point.row.company)}`}
                  />
                  <text x={sx(point.x) + 10} y={sy(point.y) - 8} className="plot-label">
                    {point.row.model}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="commercial-detail-panel">
          <span className={`provider-chip provider-${companyClass(selected.company)}`}>{selected.company}</span>
          <h4>{selected.model}</h4>
          <p className="commercial-detail-meta">
            {selected.release} · {selected.family} · {selected.access}
          </p>
          <div className="commercial-detail-grid">
            <div>
              <span>{metricLabels[metric]}</span>
              <strong>{formatMetric(selected[metric], metric, text.noScore)}</strong>
            </div>
            <div>
              <span>{text.blendedPrice}</span>
              <strong>{typeof blendedPrice(selected) === 'number' ? `$${blendedPrice(selected)?.toFixed(2)}` : text.noScore}</strong>
            </div>
            <div>
              <span>{text.outputSpeed}</span>
              <strong>{typeof selected.outputSpeed === 'number' ? selected.outputSpeed.toFixed(1) : text.noScore}</strong>
            </div>
            <div>
              <span>{text.detailContext}</span>
              <strong>{typeof selected.contextK === 'number' ? (selected.contextK >= 1000 ? '1M' : `${selected.contextK}K`) : text.noScore}</strong>
            </div>
          </div>
          <p className="commercial-note">{selected.note}</p>
        </aside>
      </div>

      <div className="commercial-ranking-strip">
        {bestRows.map((row, index) => (
          <button key={row.id} type="button" onClick={() => setSelectedId(row.id)}>
            <span>{index + 1}</span>
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
        <div className="commercial-timeline-track" aria-label="Commercial model release timeline">
          {timelineRows.map((row) => (
            <button
              key={row.id}
              type="button"
              className={`commercial-timeline-item ${row.id === selected.id ? 'is-selected' : ''}`}
              onClick={() => setSelectedId(row.id)}
            >
              <span>{row.release}</span>
              <strong>{row.model}</strong>
              <em>{row.family}</em>
            </button>
          ))}
        </div>
      </div>

      <p className="commercial-source-note">{text.source}</p>
    </section>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
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
  | 'Mistral'
  | 'xAI'
  | 'Z AI'
  | 'Cohere'
  | 'Reflection';
type MetricKey =
  | 'aaIndex'
  | 'valsIndex'
  | 'sweBench'
  | 'terminalBench'
  | 'gpqa'
  | 'hle'
  | 'outputSpeed'
  | 'contextK';
type AxisMode = 'timeline' | 'price' | 'speed' | 'context' | 'taskCost';
type ReleaseStatus = 'released' | 'preview' | 'announced' | 'restricted';

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
  releaseStatus?: ReleaseStatus;
  note: string;
  noteKo: string;
  noteSource?: string;
  source: string;
  evaluation?: string;
  benchmarkCost?: number;
  setting: string;
};

const MODEL_SNAPSHOTS: ModelSnapshot[] = [
  {
    "id": "gpt-61-sol",
    "company": "OpenAI",
    "model": "GPT-6.1 Sol",
    "release": "2026-09-29",
    "setting": "max",
    "aaIndex": 52,
    "benchmarkCost": 0.72,
    "inputPrice": 2,
    "outputPrice": 10,
    "contextK": 1050,
    "source": "https://developers.openai.com/api/docs/models/gpt-6.1-sol",
    "evaluation": "https://artificialanalysis.ai/models/gpt-6-1-sol",
    "note": "Tool calling uses Responses; reasoning none is unsupported. Context, output limit, and reasoning budget are separate contracts.",
    "releaseMonth": 2026.7433789954339,
    "family": "AA v4.3.2 · max",
    "access": "hosted access",
    "noteKo": "도구 호출에는 Responses를 사용하며 reasoning none은 지원하지 않습니다. 문맥 길이·최대 출력·추론 예산은 각각 별도 조건입니다."
  },
  {
    "id": "gpt-6-sol",
    "company": "OpenAI",
    "model": "GPT-6 Sol",
    "release": "2026-09-22",
    "setting": "not reported",
    "inputPrice": 2,
    "outputPrice": 10,
    "contextK": 1050,
    "source": "https://developers.openai.com/api/docs/models/gpt-6-sol",
    "note": "Retained as a release and API-contract reference; no compatible score is copied from GPT-6.1 Sol.",
    "releaseMonth": 2026.7242009132422,
    "family": "AA v4.3.2 · not reported",
    "access": "hosted access",
    "noteKo": "출시 이력과 API 조건을 확인하는 기준점입니다. GPT-6.1 Sol 점수를 대신 넣지 않았습니다."
  },
  {
    "id": "gpt-6-luna",
    "company": "OpenAI",
    "model": "GPT-6 Luna",
    "release": "2026-09-22",
    "setting": "max",
    "aaIndex": 38,
    "benchmarkCost": 0.07,
    "inputPrice": 0.1,
    "outputPrice": 0.5,
    "contextK": 1050,
    "source": "https://developers.openai.com/api/docs/models/gpt-6-luna",
    "evaluation": "https://artificialanalysis.ai/models/gpt-6-luna",
    "note": "Token price is only part of task cost: generated reasoning, retries, and tools also matter.",
    "releaseMonth": 2026.7242009132422,
    "family": "AA v4.3.2 · max",
    "access": "hosted access",
    "noteKo": "토큰 단가 외에도 추론 출력량·재시도·도구 사용이 과업 비용을 결정합니다."
  },
  {
    "id": "gpt-6-astra",
    "company": "OpenAI",
    "model": "GPT-6 Astra",
    "release": "2026-09-03",
    "setting": "max",
    "aaIndex": 53,
    "benchmarkCost": 3.26,
    "contextK": 1050,
    "source": "https://developers.openai.com/api/docs/models/gpt-6-astra",
    "evaluation": "https://artificialanalysis.ai/models/gpt-6-astra",
    "note": "Compare the evaluated effort configuration, rather than treating all Astra runs as one operating point.",
    "releaseMonth": 2026.6721461187215,
    "family": "AA v4.3.2 · max",
    "access": "hosted access",
    "noteKo": "Astra라는 이름만 비교하지 말고 평가에 사용한 추론 강도와 예산을 함께 확인해야 합니다."
  },
  {
    "id": "claude-opus-55",
    "company": "Anthropic",
    "model": "Claude Opus 5.5",
    "release": "2026-09-22",
    "setting": "max with fallback",
    "aaIndex": 58,
    "benchmarkCost": 5.98,
    "inputPrice": 4,
    "outputPrice": 20,
    "contextK": 1000,
    "source": "https://www.anthropic.com/claude-opus-5-5",
    "evaluation": "https://artificialanalysis.ai/models/claude-opus-5-5",
    "note": "AA evaluates the default fallback system. This is a model-plus-serving-policy result.",
    "releaseMonth": 2026.7242009132422,
    "family": "AA v4.3.2 · max with fallback",
    "access": "hosted access",
    "noteKo": "AA 평가는 기본 fallback을 포함한 시스템입니다. 가중치만의 성능으로 해석할 수 없습니다."
  },
  {
    "id": "claude-sonnet-55",
    "company": "Anthropic",
    "model": "Claude Sonnet 5.5",
    "release": "2026-09-28",
    "setting": "max with fallback",
    "aaIndex": 56,
    "benchmarkCost": 5.46,
    "inputPrice": 2,
    "outputPrice": 10,
    "contextK": 1000,
    "source": "https://www.anthropic.com/claude-sonnet-5-5",
    "evaluation": "https://artificialanalysis.ai/models/claude-sonnet-5-5",
    "noteSource": "https://www.anthropic.com/claude-haiku-5-5",
    "note": "Cache-read pricing changed on October 7. The displayed 3:1 proxy excludes cache reads, writes, and reasoning length.",
    "releaseMonth": 2026.7406392694065,
    "family": "AA v4.3.2 · max with fallback",
    "access": "hosted access",
    "noteKo": "10월 7일 캐시 읽기 가격이 변경됐습니다. 표시된 3:1 단가에는 캐시 읽기·쓰기와 추론 출력량이 반영되지 않습니다."
  },
  {
    "id": "claude-haiku-55",
    "company": "Anthropic",
    "model": "Claude Haiku 5.5",
    "release": "2026-10-07",
    "setting": "max",
    "aaIndex": 43,
    "benchmarkCost": 0.21,
    "contextK": 1000,
    "source": "https://www.anthropic.com/claude-haiku-5-5",
    "evaluation": "https://artificialanalysis.ai/models/claude-haiku-5-5",
    "note": "Haiku now exposes adjustable effort. The provider lists prices from $0.10/$0.50; no universal tier price is assumed here.",
    "releaseMonth": 2026.7664383561644,
    "family": "AA v4.3.2 · max",
    "access": "hosted access",
    "noteKo": "Haiku도 추론 강도를 조절할 수 있습니다. 제공사는 입력/출력 $0.10/$0.50부터라고 안내하므로 모든 설정에 같은 단가를 가정하지 않습니다."
  },
  {
    "id": "gemini-4-argon",
    "company": "Google",
    "model": "Gemini 4 Argon",
    "release": "2026-09-30",
    "setting": "high",
    "aaIndex": 53,
    "benchmarkCost": 1.99,
    "releaseStatus": "restricted",
    "source": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
    "evaluation": "https://artificialanalysis.ai/models/gemini-4-argon",
    "note": "Initially restricted to trusted cyber defenders. The announced 1M output limit is not an input-context measurement; launch prices are prospective.",
    "releaseMonth": 2026.7461187214612,
    "family": "AA v4.3.2 · high",
    "access": "hosted access",
    "noteKo": "초기 접근은 신뢰받는 사이버 방어 파트너로 제한됩니다. 발표된 1M 출력 한도는 입력 문맥 측정값이 아니며, 출시 단가도 예정 조건입니다."
  },
  {
    "id": "deepseek-v41-flash",
    "company": "DeepSeek",
    "model": "DeepSeek V4.1 Flash",
    "release": "2026-09-10",
    "setting": "max",
    "aaIndex": 39,
    "benchmarkCost": 0.27,
    "contextK": 1000,
    "releaseStatus": "released",
    "source": "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash",
    "evaluation": "https://artificialanalysis.ai/models/deepseek-v4-1-flash",
    "note": "Released/open-weight. The Causal Encoder-Decoder has different active-parameter costs for prefill and decode; older V4 API aliases may route here.",
    "releaseMonth": 2026.6913242009134,
    "family": "AA v4.3.2 · max",
    "access": "open weights / API",
    "noteKo": "가중치 공개 완료. Causal Encoder-Decoder는 prefill과 decode의 활성 파라미터 비용이 다르며, 이전 V4 API 별칭도 이 모델로 연결될 수 있습니다."
  },
  {
    "id": "glm-53",
    "company": "Z AI",
    "model": "GLM-5.3",
    "release": "2026-08-14",
    "setting": "max",
    "aaIndex": 45,
    "benchmarkCost": 2.01,
    "contextK": 1000,
    "releaseStatus": "released",
    "source": "https://huggingface.co/zai-org/GLM-5.3",
    "evaluation": "https://artificialanalysis.ai/models/glm-5-3",
    "note": "Released/open-weight. Text-only inputs and always-on reasoning require explicit migration checks.",
    "releaseMonth": 2026.6189497716894,
    "family": "AA v4.3.2 · max",
    "access": "open weights / API",
    "noteKo": "가중치 공개 완료. 텍스트 입력만 지원하며 추론이 항상 켜져 있어 전환 시 API 조건을 확인해야 합니다."
  },
  {
    "id": "mistral-large-4",
    "company": "Mistral",
    "model": "Mistral Large 4",
    "release": "2026-10-06",
    "setting": "preview configuration",
    "aaIndex": 38,
    "benchmarkCost": 1.13,
    "inputPrice": 1.36,
    "outputPrice": 4.18,
    "releaseStatus": "preview",
    "source": "https://mistral.ai/news/mistral-large-4/",
    "evaluation": "https://artificialanalysis.ai/models/mistral-large-4",
    "note": "Preview/API-only. Weights are planned for later in October; parameter counts in the launch post remain provider claims.",
    "releaseMonth": 2026.763698630137,
    "family": "AA v4.3.2 · preview configuration",
    "access": "hosted access",
    "noteKo": "API 프리뷰 공개. 가중치는 10월 중 추후 공개 예정이며, 발표문의 파라미터 수는 제공사 주장입니다."
  },
  {
    "id": "beam",
    "company": "Reflection",
    "model": "Beam",
    "release": "2026-10-05",
    "setting": "not reported",
    "releaseStatus": "announced",
    "source": "https://reflection.ai/blog/introducing-beam",
    "note": "Announced/planned: early-access signup, with weights and technical artifacts promised later in October. No compatible AA result was verified.",
    "releaseMonth": 2026.7609589041097,
    "family": "AA v4.3.2 · not reported",
    "access": "hosted access",
    "noteKo": "발표·공개 예정 상태입니다. 사전 접근 신청을 받으며 가중치와 기술 자료는 10월 중 추후 공개 예정입니다. 호환되는 AA 결과는 확인되지 않았습니다."
  }
];

const metricLabels: Record<Locale, Record<MetricKey, string>> = {
  en: {
    aaIndex: 'AA Index',
    valsIndex: 'Vals Index',
    sweBench: 'SWE-Bench',
    terminalBench: 'Terminal-Bench',
    gpqa: 'GPQA Diamond',
    hle: 'Humanity’s Last Exam',
    outputSpeed: 'Output speed',
    contextK: 'Context window',
  },
  ko: {
    aaIndex: 'AA 지능 지수',
    valsIndex: 'Vals 지수',
    sweBench: 'SWE-Bench',
    terminalBench: 'Terminal-Bench',
    gpqa: 'GPQA Diamond',
    hle: 'Humanity’s Last Exam',
    outputSpeed: '출력 속도',
    contextK: '문맥 길이',
  },
};

const labels = {
  en: {
    title: 'Commercial Model Benchmark Map',
    subtitle:
      'Choose a benchmark, then change the x-axis to see whether the same model still looks strong by time, token cost, speed, or context budget.',
    benchmark: 'Benchmark',
    controlAria: 'Benchmark plot controls',
    noPoints: 'No verified points for this filter, axis, and metric.',
    selectModel: 'Select model',
    axisMode: 'X-axis',
    company: 'Company',
    all: 'All companies',
    timeline: 'Release date',
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
      'Snapshot as of 2026-10-13. Scores use AA Intelligence Index v4.3.2 with the effort/fallback configuration shown. Costs are benchmark workload observations, not equal-compute comparisons; speed is omitted where pages disagree. A missing score means not reported under the mapped methodology, not zero. Promotional or long-context prices may have thresholds and expiry dates.',
  },
  ko: {
    title: '상용 모델 비교 지도',
    subtitle:
      '지표와 x축을 바꿔 보세요. 같은 모델도 공개 시점, 토큰 단가, 평가 비용, 문맥 한도에 따라 다르게 보입니다.',
    benchmark: '지표',
    controlAria: '모델 비교 그래프 설정',
    noPoints: '이 필터·축·지표에 필요한 값을 확인한 모델이 없습니다.',
    selectModel: '모델 선택',
    axisMode: 'X축',
    company: '회사',
    all: '전체 회사',
    timeline: '공개 시점',
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
      '2026-10-13 기준 snapshot입니다. 점수는 표시된 추론 강도·fallback 조건의 AA 지능 지수 v4.3.2입니다. 평가 비용은 해당 과업의 관측값이며 동일 연산량 비교가 아닙니다. 출처 간 속도가 달라 속도 값은 넣지 않았습니다. 값이 없다는 것은 0점이 아니라 해당 methodology에서 미공개라는 뜻입니다. 프로모션 가격과 장문 입력 가격에는 만료일이나 별도 임계값이 있을 수 있습니다.',
  },
};


const releaseStatusLabels: Record<Locale, Record<ReleaseStatus, string>> = {
  en: { released: 'released', preview: 'preview', announced: 'weights/report announced', restricted: 'restricted' },
  ko: { released: '공개 완료', preview: '프리뷰', announced: '가중치/리포트 공개 예정', restricted: '제한 공개' },
};

const companyOptions: CompanyKey[] = ['All', 'OpenAI', 'Google', 'Anthropic', 'DeepSeek', 'Z AI', 'Mistral', 'Reflection'];

const metricOptions: MetricKey[] = ['aaIndex', 'contextK'];

const axisLabels: Record<Locale, Record<AxisMode, string>> = {
  en: {
    timeline: 'Release date',
    price: 'Blended price, $/1M tokens',
    speed: 'Output tokens/sec',
    context: 'Context window, K tokens',
    taskCost: 'AA evaluation cost, $/task',
  },
  ko: {
    timeline: '공개 시점',
    price: '혼합 가격, $/1M tokens',
    speed: '초당 출력 token',
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
  if (axisMode === 'timeline') return new Date(value * 86_400_000).toISOString().slice(0, 10);
  if (axisMode === 'price' || axisMode === 'taskCost') return `$${value.toFixed(2)}`;
  if (axisMode === 'speed') return `${value.toFixed(0)}`;
  return formatContext(value, 'not reported');
}

function formatMetric(value: number | undefined, metric: MetricKey, missing: string) {
  if (typeof value !== 'number') return missing;
  if (metric === 'aaIndex') return value.toFixed(0);
  if (metric === 'contextK') return formatContext(value, missing);
  if (metric === 'outputSpeed') return `${value.toFixed(0)} tok/s`;
  return `${value.toFixed(1)}%`;
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
  const [rawXMin, xMax] = niceRange(xValues);
  const xMin = axisMode === 'timeline' ? rawXMin : Math.max(0, rawXMin);
  const [rawYMin, yMax] = niceRange(yValues);
  const yMin = Math.max(0, rawYMin);
  const innerWidth = chart.width - chart.left - chart.right;
  const innerHeight = chart.height - chart.top - chart.bottom;

  const sx = (value: number) => chart.left + ((value - xMin) / (xMax - xMin)) * innerWidth;
  const sy = (value: number) => chart.top + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;

  const bestRows = plottedRows.map((point) => point.row)
    .sort((a, b) => (b[metric] as number) - (a[metric] as number))
    .slice(0, 5);
  const timelineRows = [...MODEL_SNAPSHOTS]
    .filter((row) => company === 'All' || row.company === company)
    .sort((a, b) => a.releaseMonth - b.releaseMonth);

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
      .sort((a, b) => b.releaseMonth - a.releaseMonth)[0];
    if (latest) setSelectedId(latest.id);
  };

  return (
    <section className="commercial-benchmark-explorer">
      <div className="commercial-benchmark-header">
        <div>
          <h3>{text.title}</h3>
          <p>{locale === 'ko' ? '2026-10-13 기준 · AA v4.3.2' : 'as of 2026-10-13 · AA v4.3.2'}</p>
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
              <option value="speed">{text.speed}</option>
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
            <title>{`${metricLabels[locale][metric]} by ${axisLabels[locale][axisMode]}`}</title>
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
            {selected.release} · AA v4.3.2 · {selected.setting === 'not reported' ? text.noScore : selected.setting}
            {selected.releaseStatus ? ` · ${releaseStatusLabels[locale][selected.releaseStatus]}` : ''}
          </p>
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
            {selected.evaluation && <> · <a href={selected.evaluation}>{locale === 'ko' ? '평가 조건·출처' : 'Evaluation source'}</a></>}
            {selected.noteSource && <> · <a href={selected.noteSource}>{locale === 'ko' ? '단가 변경 출처' : 'Pricing update'}</a></>}
            {locale === 'ko' ? ' · 2026-10-13 기준' : ' · as of 2026-10-13'}
          </p>
          <p className="commercial-note">{locale === 'ko' ? selected.noteKo : selected.note}</p>
          {!plottedRows.some((point) => point.row.id === selected.id) && <p className="commercial-note">{locale === 'ko' ? '선택한 모델은 이 축·지표에 필요한 값이 없어 그래프에서 제외됩니다.' : 'The selected model lacks a value required by this axis or metric and is omitted from the plot.'}</p>}
        </aside>
      </div>

      <div className="commercial-ranking-strip">
        {bestRows.map((row, index) => (
          <button key={row.id} type="button" onClick={() => setSelectedId(row.id)} aria-pressed={row.id === selected.id}>
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
              <em>{row.setting === 'not reported' ? text.noScore : row.setting}</em>
            </button>
          ))}
        </div>
      </div>

      <p className="commercial-source-note">{text.source}</p>
    </section>
  );
}

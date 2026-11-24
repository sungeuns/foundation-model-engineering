import React, { useEffect, useId, useRef, useState } from 'react';
import './paired-release-lab.css';

type Scenario = 'gain' | 'uncertain' | 'regression' | 'missing';
type Status = 'idle' | 'loading' | 'running' | 'done' | 'cancelled' | 'error';
type Decision = 'Pass' | 'Review' | 'Block';
type Slice = { clusters: number; delta: number; lower_95_one_sided: number; upper_95_one_sided: number };
type CompletePacket = {
  decision: Decision;
  quality: Record<'target' | 'retention', Slice>;
  thresholds: Record<'target' | 'retention', number>;
  safety: { independent_trials: number; failures: number; upper_risk_95: number; maximum_risk: number };
  bootstrap_seed: number;
  bootstrap_repetitions: number;
};
type Packet = CompletePacket | { decision: 'Review'; reason: string };
const scenarios: Scenario[] = ['gain', 'uncertain', 'regression', 'missing'];
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

function validPacket(value: unknown): value is Packet {
  if (!record(value) || !['Pass', 'Review', 'Block'].includes(String(value.decision))) return false;
  if (value.decision === 'Review' && typeof value.reason === 'string' && !('quality' in value)) return true;
  if (!record(value.quality) || !record(value.thresholds) || !record(value.safety)) return false;
  for (const name of ['target', 'retention']) {
    const slice = value.quality[name];
    if (!record(slice) || !['clusters', 'delta', 'lower_95_one_sided', 'upper_95_one_sided'].every(key => finite(slice[key]))) return false;
    if (!finite(value.thresholds[name])) return false;
  }
  return ['independent_trials', 'failures', 'upper_risk_95', 'maximum_risk'].every(key => finite((value.safety as Record<string, unknown>)[key]))
    && finite(value.bootstrap_seed) && finite(value.bootstrap_repetitions);
}

export default function PairedReleaseLab({ lang = 'en', workerUrl }: { lang?: 'en' | 'ko'; workerUrl: string }) {
  const ko = lang === 'ko';
  const id = useId();
  const [hydrated, setHydrated] = useState(false);
  const [scenario, setScenario] = useState<Scenario>('gain');
  const [status, setStatus] = useState<Status>('idle');
  const [packet, setPacket] = useState<Packet | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const generation = useRef(0);
  const busy = status === 'loading' || status === 'running';
  const scriptUrl = `${workerUrl.slice(0, workerUrl.lastIndexOf('/') + 1)}paired_release.py`;
  const decisionLabel = (decision: Decision) => ko ? ({ Pass: '통과', Review: '재검토', Block: '차단' }[decision]) : decision;
  const points = (value: number) => `${(value * 100).toFixed(3).replace(/\.?0+$/, '')} ${ko ? '%p' : 'pp'}`;
  const percent = (value: number) => `${(value * 100).toFixed(3).replace(/\.?0+$/, '')}%`;
  const scenarioLabels = ko
    ? { gain: '목표 과제 개선', uncertain: '개선 근거 부족', regression: '기존 능력 하락', missing: '대응 결과 누락' }
    : { gain: 'Target improvement', uncertain: 'Uncertain improvement', regression: 'Retention regression', missing: 'Missing paired outcome' };

  useEffect(() => {
    setHydrated(true);
    return () => {
      generation.current += 1;
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  function stopWorker() {
    generation.current += 1;
    workerRef.current?.terminate();
    workerRef.current = null;
  }

  function run() {
    if (!hydrated || busy) return;
    setPacket(null);
    setStatus('loading');
    const currentGeneration = ++generation.current;
    try {
      // No Worker or Python runtime is requested before the reader presses Run.
      const worker = workerRef.current ?? new Worker(workerUrl, { type: 'module' });
      workerRef.current = worker;
      const current = () => generation.current === currentGeneration && workerRef.current === worker;
      const fail = () => {
        if (!current()) return;
        stopWorker();
        setPacket(null);
        setStatus('error');
      };
      worker.onerror = fail;
      worker.onmessageerror = fail;
      worker.onmessage = ({ data }: MessageEvent<unknown>) => {
        if (!current()) return;
        if (!record(data)) return fail();
        if (data.type === 'running') setStatus('running');
        else if (data.type === 'result' && validPacket(data.packet)) {
          generation.current += 1;
          setPacket(data.packet);
          setStatus('done');
        } else fail();
      };
      worker.postMessage({ scenario });
    } catch {
      stopWorker();
      setPacket(null);
      setStatus('error');
    }
  }

  const statusText = !hydrated
    ? (ko ? '브라우저 실행을 준비 중입니다. 아래 Python 파일로도 실행할 수 있습니다.' : 'Preparing browser controls. You can also run the Python file below.')
    : status === 'loading'
      ? (ko ? 'Python 실행 환경을 불러오는 중입니다. 첫 실행에는 시간이 걸릴 수 있습니다.' : 'Loading Python. The first run may take a little longer.')
      : status === 'running'
        ? (ko ? '원본 Python 실습을 계산 중입니다.' : 'Running the original Python lab.')
        : status === 'error'
          ? (ko ? '실행하지 못했습니다. 연결을 확인하고 다시 실행하거나 아래 Python 파일을 이용하세요.' : 'The run failed. Check your connection and retry, or use the Python file below.')
          : status === 'cancelled'
            ? (ko ? '취소했습니다. 다시 실행할 수 있습니다.' : 'Cancelled. You can run again.')
            : status === 'done' && packet
              ? (ko ? `계산 완료: ${decisionLabel(packet.decision)}. 아래에서 판단 근거를 확인하세요.` : `Complete: ${decisionLabel(packet.decision)}. Inspect the evidence below.`)
              : (ko ? '시나리오를 고르고 실행하세요.' : 'Choose a scenario, then run the experiment.');

  return <section id="release-lab" className="paired-release-lab" data-release-state={hydrated ? status : 'hydrating'} aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{ko ? '브라우저에서 배포 판단 실습하기' : 'Run a release decision in your browser'}</h3>
    <p>{ko ? '시나리오를 고르고 실행을 누르면 jsDelivr에서 Python 실행 환경을 내려받습니다. 실습은 이 탭에서 계산되며 로그인이나 설치가 필요 없습니다.' : 'Choose a scenario and press Run to download Python from jsDelivr. The experiment runs in this tab without an account or installation.'}</p>
    <div className="paired-release-controls">
      <label htmlFor={`${id}-scenario`}>{ko ? '합성 시나리오' : 'Synthetic scenario'}
        <select id={`${id}-scenario`} data-release-scenario value={scenario} disabled={!hydrated || busy} onChange={event => {
          generation.current += 1;
          setScenario(event.target.value as Scenario);
          setPacket(null);
          setStatus('idle');
        }}>{scenarios.map(name => <option key={name} value={name}>{scenarioLabels[name]} ({name})</option>)}</select>
      </label>
      <div className="paired-release-actions">
        <button type="button" data-release-action="run" disabled={!hydrated || busy} onClick={run}>{status === 'error' ? (ko ? '다시 실행' : 'Retry') : (ko ? '실행' : 'Run')}</button>
        {busy && <button type="button" data-release-action="cancel" onClick={() => {
          stopWorker(); setPacket(null); setStatus('cancelled');
        }}>{ko ? '취소' : 'Cancel'}</button>}
      </div>
    </div>
    <p className="paired-release-status" data-release-status role="status" aria-live="polite" aria-atomic="true">{statusText}</p>
    <noscript><p>{ko ? '브라우저 실행에는 JavaScript가 필요합니다. 아래 Python 파일을 내려받아 로컬에서 실행하세요.' : 'Browser execution needs JavaScript. Download the Python file below to run locally.'}</p></noscript>

    {packet && <div className="paired-release-result" data-release-result>
      <h4>{scenarioLabels[scenario]}: <span className={`paired-release-decision paired-release-${packet.decision.toLowerCase()}`}>{decisionLabel(packet.decision)}</span></h4>
      {'quality' in packet ? <>
        <div className="paired-release-slices">{(['target', 'retention'] as const).map(name => {
          const slice = packet.quality[name], threshold = packet.thresholds[name];
          const gate = slice.upper_95_one_sided < threshold ? 'Block' : slice.lower_95_one_sided > threshold ? 'Pass' : 'Review';
          return <section className="paired-release-slice" data-release-slice={name} key={name} aria-labelledby={`${id}-${name}`}>
            <h5 id={`${id}-${name}`}>{name === 'target' ? (ko ? '목표 과제' : 'Target quality') : (ko ? '기존 능력 보존' : 'Capability retention')} · {decisionLabel(gate)}</h5>
            <dl>
              <div data-release-metric="delta"><dt>{ko ? '후보 − 기준 모델' : 'Candidate − champion'}</dt><dd>{points(slice.delta)}</dd></div>
              <div data-release-metric="lower"><dt>{ko ? '단측 95% 하한' : '95% one-sided lower bound'}</dt><dd>{points(slice.lower_95_one_sided)}</dd></div>
              <div data-release-metric="upper"><dt>{ko ? '단측 95% 상한' : '95% one-sided upper bound'}</dt><dd>{points(slice.upper_95_one_sided)}</dd></div>
              <div data-release-metric="threshold"><dt>{ko ? '사전에 정한 기준' : 'Predeclared threshold'}</dt><dd>{points(threshold)}</dd></div>
              <div data-release-metric="clusters"><dt>{ko ? '독립 집단 수' : 'Independent clusters'}</dt><dd>{slice.clusters}</dd></div>
            </dl>
            <p>{gate === 'Pass'
              ? (ko ? '하한이 기준보다 높아 이 항목을 통과합니다.' : 'The lower bound exceeds the threshold, so this gate passes.')
              : gate === 'Block'
                ? (ko ? '상한도 기준보다 낮아 이 항목이 전체 판단을 차단합니다.' : 'Even the upper bound is below the threshold, so this gate blocks the decision.')
                : (ko ? '구간이 기준에 걸쳐 있어 통과도 차단도 확정하지 못합니다.' : 'The bounds straddle or touch the threshold, so this gate remains unresolved.')}</p>
          </section>;
        })}</div>
        <p className="paired-release-note">{ko ? '변화량과 기준의 단위는 %p입니다. 두 단측 95% 경계를 함께 보면 중앙 90% 구간입니다.' : 'Changes and thresholds use percentage points (pp). The two one-sided 95% bounds together form a central 90% interval.'}</p>
        <section className="paired-release-safety" aria-labelledby={`${id}-safety`}>
          <h5 id={`${id}-safety`}>{ko ? '별도의 합성 안전 표본' : 'Separate synthetic safety sample'}</h5>
          <p>{ko
            ? `독립 시행 ${packet.safety.independent_trials.toLocaleString('ko-KR')}회, 실패 ${packet.safety.failures}회. 실패율의 단측 95% 상한은 ${percent(packet.safety.upper_risk_95)}이며 허용 기준은 ${percent(packet.safety.maximum_risk)}입니다.`
            : `${packet.safety.independent_trials.toLocaleString('en-US')} independent trials, ${packet.safety.failures} failures. The one-sided 95% upper failure-rate bound is ${percent(packet.safety.upper_risk_95)}, against a limit of ${percent(packet.safety.maximum_risk)}.`}</p>
          <p>{ko ? '관측된 실패가 없다고 실제 위험이 0인 것은 아닙니다.' : 'Zero observed failures do not establish zero population risk.'}</p>
        </section>
        <p className="paired-release-note">{ko ? `집단 bootstrap ${packet.bootstrap_repetitions.toLocaleString('ko-KR')}회 · seed ${packet.bootstrap_seed}.` : `${packet.bootstrap_repetitions.toLocaleString('en-US')} cluster-bootstrap replicates · seed ${packet.bootstrap_seed}.`}</p>
      </> : <p>{packet.reason.startsWith('Missing/invalid paired outcome')
        ? (ko ? '후보 모델의 대응 결과가 하나 누락됐습니다. 관측하지 않은 값을 0으로 바꾸거나 제외하지 않고 재검토로 돌립니다. 누락을 해결하기 전에는 배포를 판단할 수 없습니다.' : 'One candidate outcome is missing. The lab returns Review without substituting zero or dropping the unobserved pair. Resolve the missing evidence before judging release readiness.')
        : (ko ? '평가 근거 검증을 통과하지 못했습니다. 원본 JSON의 이유를 확인하고 데이터를 수정한 뒤 다시 판단하세요.' : 'The evidence did not pass validation. Inspect the reason in the original JSON and resolve it before making a decision.')}</p>}
      <details data-release-packet className="paired-release-packet"><summary>{ko ? '원본 JSON 결과 보기' : 'Inspect the original JSON packet'}</summary><pre data-release-json tabIndex={0} aria-label={ko ? 'Python 실습이 반환한 JSON 결과' : 'JSON returned by the Python lab'}>{JSON.stringify(packet, null, 2)}</pre></details>
    </div>}

    <p className="paired-release-note">{ko ? '2026-11-25 버전의 합성 평가 자료를 사용합니다. 통과는 이 실습에서 정한 기준을 만족했다는 뜻입니다.' : 'This exercise uses synthetic cases from the 2026-11-25 source snapshot. Pass applies to the offline criteria shown here.'}</p>
    <div className="paired-release-fallback"><a href={scriptUrl} download="paired_release.py">{ko ? 'Python 실습 내려받기' : 'Download the Python lab'}</a><span>{ko ? 'Python 3.10 이상 · 추가 패키지 없음' : 'Python 3.10+ · no extra packages'}</span><code>python paired_release.py --scenario {scenario}</code></div>
  </section>;
}

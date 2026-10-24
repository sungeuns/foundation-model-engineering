import React, { useState } from 'react';
import './visualizers.css';

export default function SemanticEntropyVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [mode, setMode] = useState<'correct' | 'wrong' | 'diverse'>('correct');
  const [step, setStep] = useState(0);
  const samples = mode === 'correct' ? (ko ? ['파리.', '프랑스의 수도는 파리입니다.', '수도는 파리입니다.'] : ['Paris.', 'The capital of France is Paris.', 'Its capital is Paris.'])
    : mode === 'wrong' ? (ko ? ['리옹.', '프랑스의 수도는 리옹입니다.', '수도는 리옹입니다.'] : ['Lyon.', 'The capital of France is Lyon.', 'Its capital is Lyon.'])
      : (ko ? ['리옹.', '마르세유.', '보르도.'] : ['Lyon.', 'Marseille.', 'Bordeaux.']);
  const entropy = mode === 'diverse' ? Math.log(3) : 0;
  return <section className="semantic-entropy-container">
    <h3>{ko ? '의미 다양성과 사실성은 다릅니다' : 'Semantic diversity and truth are different'}</h3>
    <div className="controls">{(['correct', 'wrong', 'diverse'] as const).map((value, i) => <button type="button" key={value} aria-pressed={mode === value} className={mode === value ? 'active' : ''} onClick={() => {setMode(value);setStep(0);}}>{(ko ? ['일관되고 맞음', '일관되지만 틀림', '서로 다른 의미'] : ['Consistent and correct', 'Consistent but wrong', 'Diverse meanings'])[i]}</button>)}</div>
    <p><strong>{ko ? '질문: ' : 'Question: '}</strong>{ko ? '프랑스의 수도는 어디인가요?' : 'What is the capital of France?'}</p>
    <div className="step-controls">{(ko ? ['1. 응답 보기', '2. 의미 군집 보기', '3. 엔트로피 계산'] : ['1. Show samples', '2. Show meaning clusters', '3. Calculate entropy']).map((label, i) => <button type="button" key={i} disabled={step !== i} onClick={() => setStep(i + 1)}>{label}</button>)}</div>
    {step >= 1 && <div className="samples-grid">{samples.map((sample, i) => <div key={i} className="sample-card"><strong>{ko ? '표본' : 'Sample'} {i + 1}</strong><p>{sample}</p>{step >= 2 && <span>{ko ? '의미 군집' : 'Meaning cluster'}: {mode === 'diverse' ? String.fromCharCode(65 + i) : 'A'}</span>}</div>)}</div>}
    {step >= 3 && <div className="result-box" aria-live="polite"><strong>{ko ? '빈도 기반 의미 엔트로피' : 'Frequency-based semantic entropy'}: {entropy.toFixed(3)} {ko ? 'nat' : 'nats'}</strong><p>{mode === 'wrong'
      ? (ko ? '세 응답이 모두 틀려도 엔트로피는 0입니다. 반복되는 오개념은 일관성만으로 검출되지 않습니다.' : 'All three answers are wrong, yet entropy is zero. Consistency alone misses a repeated misconception.')
      : mode === 'correct' ? (ko ? '같은 뜻을 세 번 말해 엔트로피가 0입니다. 여기서 정답임은 외부 지식으로 확인한 것이며 엔트로피가 입증한 것이 아닙니다.' : 'Three paraphrases give zero entropy. External knowledge establishes correctness here; entropy does not.')
        : (ko ? '세 군집의 비율이 각각 1/3이므로 엔트로피는 ln(3)입니다. 불일치는 검토 신호이며 그 자체로 정답을 정하지 않습니다.' : 'Three equally frequent clusters give ln(3). Disagreement is a review signal, not an answer key.')}</p></div>}
    <p>{ko ? '직접 만든 고정 응답과 수동 군집의 교육용 예제입니다. 실제 NLI·모델 샘플링을 실행하지 않습니다. 빈도 기반 추정량은 서열 확률을 사용하는 추정량과 다릅니다.' : 'Authored fixed responses and manual clusters for teaching; no NLI model or sampling runs here. The frequency estimator differs from estimators using sequence probabilities.'}</p>
  </section>;
}

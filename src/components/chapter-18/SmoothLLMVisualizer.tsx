import React, { useMemo, useState } from 'react';
import './visualizers.css';

type InputType = 'ordinary' | 'suffix';
type Props = { lang?: 'en' | 'ko' };

const copy = {
  en: {
    title: 'Perturbation sampling explainer',
    caveat: 'This does not call a model or classify safety. It only shows the randomized input transformation used by a smoothing defense.',
    inputType: 'Input form',
    ordinary: 'Ordinary instruction',
    suffix: 'Instruction with synthetic suffix',
    rate: 'Character replacement rate',
    sampleTitle: 'Five deterministic example perturbations',
    changed: 'characters changed',
    untouched: 'synthetic suffix untouched',
    altered: 'synthetic suffix altered',
    summary: 'A real defense must run the target model on each sample, classify outputs, aggregate them, and measure both attack success and benign utility.',
  },
  ko: {
    title: 'Perturbation sampling 설명기',
    caveat: 'Model을 호출하거나 safety를 판정하지 않습니다. Smoothing defense가 사용하는 randomized input transformation만 보여줍니다.',
    inputType: 'Input 형태',
    ordinary: '일반 instruction',
    suffix: 'Synthetic suffix 포함',
    rate: '문자 교체 비율',
    sampleTitle: '결정적인 예시 perturbation 5개',
    changed: '문자 변경',
    untouched: 'synthetic suffix 유지',
    altered: 'synthetic suffix 변경',
    summary: '실제 defense는 각 sample에 target model을 실행하고 output을 분류·집계한 뒤 attack success와 benign utility를 모두 측정해야 합니다.',
  },
};

const ordinaryPrompt = 'Summarize the attached project notes.';
const suffixPrompt = 'Summarize the attached project notes. + [qxz!v7%tkn]';
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function deterministicUnit(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function perturb(text: string, rate: number, sample: number) {
  let changed = 0;
  const output = [...text].map((character, index) => {
    if (character === ' ' || deterministicUnit(sample * 1009 + index) >= rate / 100) {
      return character;
    }
    const candidate = alphabet[Math.floor(deterministicUnit(sample * 2027 + index) * alphabet.length)];
    changed += 1;
    return candidate === character
      ? alphabet[(alphabet.indexOf(candidate) + 1) % alphabet.length]
      : candidate;
  }).join('');
  return { output, changed };
}

const SmoothLLMVisualizer: React.FC<Props> = ({ lang = 'en' }) => {
  const [inputType, setInputType] = useState<InputType>('suffix');
  const [rate, setRate] = useState(10);
  const t = copy[lang];
  const original = inputType === 'ordinary' ? ordinaryPrompt : suffixPrompt;
  const samples = useMemo(
    () => Array.from({ length: 5 }, (_, index) => perturb(original, rate, index + 1)),
    [original, rate],
  );

  return (
    <div className="smooth-llm-container">
      <h4>{t.title}</h4>
      <p>{t.caveat}</p>
      <div className="controls">
        <label htmlFor="smooth-input">
          {t.inputType}
          <select id="smooth-input" value={inputType}
            onChange={(event) => setInputType(event.target.value as InputType)}>
            <option value="ordinary">{t.ordinary}</option>
            <option value="suffix">{t.suffix}</option>
          </select>
        </label>
        <label htmlFor="smooth-rate">
          {t.rate}: {rate}%
          <input id="smooth-rate" type="range" min="0" max="50" value={rate}
            onChange={(event) => setRate(Number(event.target.value))} />
        </label>
      </div>

      <div className="results-panel">
        <h4>{t.sampleTitle}</h4>
        {samples.map((sample, index) => {
          const suffixUntouched = inputType === 'suffix' && sample.output.endsWith('[qxz!v7%tkn]');
          return (
            <div key={index} className="sample-row neutral-bg">
              <div className="text-col"><code>{sample.output}</code></div>
              <div className="pred-col">
                <strong>{sample.changed} {t.changed}</strong>
                {inputType === 'suffix' && <span>{suffixUntouched ? t.untouched : t.altered}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="summary-box">{t.summary}</div>
    </div>
  );
};

export default SmoothLLMVisualizer;

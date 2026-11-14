import React, { useState } from 'react';
import './visualizers.css';

const EvolInstructVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string,string> = {"Base Instruction": "기본 지시", "Write a sorting algorithm.": "정렬 알고리즘을 작성하세요.", "An underspecified request. Its answer depends on the model and decoding settings.": "구체적인 제약이 없는 요청입니다. 어떤 답이 나오는지는 모델과 생성 설정에 따라 다릅니다.", "In-depth: Add Constraints": "심화: 제약 추가", "Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key.": "특정 키를 기준으로 딕셔너리 목록을 정렬하는 Python 알고리즘을 작성하세요.", "We've added a specific data structure constraint. The model must now handle dicts and key extraction.": "자료구조 제약을 추가했습니다. 딕셔너리와 키 추출을 처리해야 합니다.", "In-depth: Deepen Logic": "심화: 논리 확장", "Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling cases where the key might be missing gracefully.": "특정 키로 딕셔너리 목록을 정렬하되 키가 없는 경우도 처리하는 Python 알고리즘을 작성하세요.", "Edge case handling is introduced. The logic requires try-except blocks or dictionary get() methods.": "경계 조건을 추가했습니다. 누락된 키를 처리할 정책을 정해야 합니다.", "In-depth: Multi-step Reasoning": "심화: 여러 단계의 추론", "Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling missing keys gracefully. Additionally, analyze its time complexity and compare it with an alternative approach.": "키 누락을 처리하며 딕셔너리 목록을 정렬하는 Python 알고리즘을 작성하세요. 시간 복잡도를 분석하고 다른 접근법과 비교하세요.", "The prompt now requires both coding and theoretical reasoning. The model must explain 'why' it chose the algorithm.": "코딩과 이론적 분석을 함께 요구합니다. 알고리즘을 선택한 이유도 설명해야 합니다.", "In-depth: Complex Ticket": "심화: 복합 작업", "Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling missing keys gracefully. Analyze its time complexity, compare it with an alternative approach, write unit tests using pytest, and add type hints.": "키 누락을 처리하며 딕셔너리 목록을 정렬하세요. 시간 복잡도와 대안을 비교하고 pytest 테스트와 타입 힌트도 작성하세요.", "A full software engineering ticket. The model must demonstrate coding, theoretical analysis, testing, and modern language features.": "구현·분석·테스트·타입 표기를 함께 요구합니다. 지시가 길어진다고 학습 데이터의 품질이 자동으로 좋아지지는 않습니다.", "Evol-Instruct Progression": "Evol-Instruct 지시 확장", "Authored examples of instruction evolution; no generation or answer verification runs here.": "미리 작성한 지시 확장 예제입니다. 실제 생성이나 정답 검증은 실행하지 않습니다.", "Analysis:": "해설:", "Previous": "이전", "Evolve Prompt": "지시 확장"};
  const t = (s: string) => lang === "ko" ? (translations[s] ?? s) : s;

  const [level, setLevel] = useState(0);

  const evolutions = [
    {
      level: 0,
      title: t("Base Instruction"),
      prompt: t("Write a sorting algorithm."),
      explanation: t("An underspecified request. Its answer depends on the model and decoding settings.")
    },
    {
      level: 1,
      title: t("In-depth: Add Constraints"),
      prompt: t("Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key."),
      explanation: t("We've added a specific data structure constraint. The model must now handle dicts and key extraction.")
    },
    {
      level: 2,
      title: t("In-depth: Deepen Logic"),
      prompt: t("Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling cases where the key might be missing gracefully."),
      explanation: t("Edge case handling is introduced. The logic requires try-except blocks or dictionary get() methods.")
    },
    {
      level: 3,
      title: t("In-depth: Multi-step Reasoning"),
      prompt: t("Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling missing keys gracefully. Additionally, analyze its time complexity and compare it with an alternative approach."),
      explanation: t("The prompt now requires both coding and theoretical reasoning. The model must explain 'why' it chose the algorithm.")
    },
    {
      level: 4,
      title: t("In-depth: Complex Ticket"),
      prompt: t("Write a sorting algorithm in Python that sorts a list of dictionaries based on a specific key, handling missing keys gracefully. Analyze its time complexity, compare it with an alternative approach, write unit tests using pytest, and add type hints."),
      explanation: t("A full software engineering ticket. The model must demonstrate coding, theoretical analysis, testing, and modern language features.")
    }
  ];

  return (
    <div className="visualizer-container">
      <div className="visualizer-header">
        <h3>{t("Evol-Instruct Progression")}</h3>
        <p>{t("Authored examples of instruction evolution; no generation or answer verification runs here.")}</p>
      </div>

      <div className="evolution-tracker">
        {evolutions.map((evol, index) => (
          <button type="button" aria-pressed={index === level}
            key={index}
            className={`tracker-step ${index <= level ? 'active' : ''} ${index === level ? 'current' : ''}`}
            onClick={() => setLevel(index)}
          >
            {lang === "ko" ? "단계" : "Level"} {index}
          </button>
        ))}
      </div>

      <div className="prompt-display">
        <h4>{evolutions[level].title}</h4>
        <div className="prompt-box">
          <code>{evolutions[level].prompt}</code>
        </div>
        <div className="explanation-box">
          <p><strong>{t("Analysis:")}</strong> {evolutions[level].explanation}</p>
        </div>
      </div>

      <div className="controls">
        <button
          onClick={() => setLevel(Math.max(0, level - 1))}
          disabled={level === 0}
          className="btn-secondary"
        >{t('Previous')}</button>
        <button
          onClick={() => setLevel(Math.min(evolutions.length - 1, level + 1))}
          disabled={level === evolutions.length - 1}
          className="btn-primary"
        >{t('Evolve Prompt')}</button>
      </div>
    </div>
  );
};

export default EvolInstructVisualizer;

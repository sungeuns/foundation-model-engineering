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
  | 'Mistral'
  | 'xAI'
  | 'Z AI'
  | 'Cohere';
type MetricKey =
  | 'aaIndex'
  | 'valsIndex'
  | 'sweBench'
  | 'terminalBench'
  | 'gpqa'
  | 'hle'
  | 'outputSpeed';
type AxisMode = 'timeline' | 'price' | 'speed' | 'context';
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
    id: 'gpt-5',
    company: 'OpenAI',
    model: 'GPT-5',
    release: '2025-08',
    releaseMonth: 2025.58,
    family: 'unified reasoning system',
    access: 'API / ChatGPT',
    aaIndex: 45,
    sweBench: 74.9,
    inputPrice: 1.25,
    outputPrice: 10,
    outputSpeed: 87.1,
    contextK: 400,
    note: 'The base GPT-5 system introduced routing between fast responses and deeper reasoning, making “model” and “product system” harder to separate.',
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
    id: 'gemini-35-flash',
    company: 'Google',
    model: 'Gemini 3.5 Flash',
    release: '2026-05',
    releaseMonth: 2026.42,
    family: 'fast multimodal agent',
    access: 'Gemini App / Gemini API / Vertex AI',
    aaIndex: 55,
    sweBench: 55.1,
    terminalBench: 76.2,
    hle: 40.2,
    inputPrice: 1.5,
    outputPrice: 9,
    outputSpeed: 280,
    contextK: 1000,
    note: 'A Flash-line release aimed at agentic coding, long-horizon workflows, and multimodal work: lower-latency positioning with 1M input context and 64K output.',
  },
  {
    id: 'gemini-36-flash',
    company: 'Google',
    model: 'Gemini 3.6 Flash',
    release: '2026-07',
    releaseMonth: 2026.5,
    family: 'token-efficient multimodal agent',
    access: 'Gemini App / Gemini API / Vertex AI',
    sweBench: 58.7,
    terminalBench: 78.0,
    inputPrice: 1.5,
    outputPrice: 7.5,
    contextK: 1000,
    releaseStatus: 'released',
    note: 'An efficiency-focused update to 3.5 Flash: Google reports 17% fewer output tokens on the AA Index, fewer tool loops, stronger coding and computer use, and a lower output-token price.',
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
    id: 'gpt-56-sol',
    company: 'OpenAI',
    model: 'GPT-5.6 Sol',
    release: '2026-07',
    releaseMonth: 2026.5,
    family: 'flagship frontier agent',
    access: 'API / ChatGPT / Codex',
    aaIndex: 58.9,
    sweBench: 64.6,
    terminalBench: 88.8,
    gpqa: 94.6,
    inputPrice: 5,
    outputPrice: 30,
    contextK: 1050,
    releaseStatus: 'released',
    note: 'The flagship GPT-5.6 tier adds max reasoning and multi-agent ultra mode. Public results emphasize long-running coding, computer use, science, and cyber work, with a 1.05M-token context window.',
  },
  {
    id: 'gpt-56-terra',
    company: 'OpenAI',
    model: 'GPT-5.6 Terra',
    release: '2026-07',
    releaseMonth: 2026.5,
    family: 'balanced frontier agent',
    access: 'API / Work / Codex',
    aaIndex: 55,
    sweBench: 63.4,
    terminalBench: 87.4,
    gpqa: 92.9,
    inputPrice: 2.5,
    outputPrice: 15,
    contextK: 1050,
    releaseStatus: 'released',
    note: 'The balanced GPT-5.6 tier is positioned around GPT-5.5-class quality at half the token price, while retaining the same 1.05M context and 128K maximum output.',
  },
  {
    id: 'gpt-56-luna',
    company: 'OpenAI',
    model: 'GPT-5.6 Luna',
    release: '2026-07',
    releaseMonth: 2026.5,
    family: 'fast cost-efficient agent',
    access: 'API / Work / Codex',
    aaIndex: 51.2,
    sweBench: 62.7,
    terminalBench: 84.7,
    gpqa: 92.3,
    inputPrice: 1,
    outputPrice: 6,
    contextK: 1050,
    releaseStatus: 'released',
    note: 'The fastest and lowest-cost GPT-5.6 tier illustrates capability compression: lower aggregate quality than Sol, but strong agentic scores at one-fifth of Sol’s input and output prices.',
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
    id: 'claude-fable-5',
    company: 'Anthropic',
    model: 'Claude Fable 5',
    release: '2026-06',
    releaseMonth: 2026.42,
    family: 'safeguarded Mythos-class agent',
    access: 'API / Claude / cloud partners',
    aaIndex: 59.9,
    sweBench: 80.0,
    terminalBench: 83.1,
    inputPrice: 10,
    outputPrice: 50,
    contextK: 1000,
    releaseStatus: 'released',
    note: 'Fable exposes Mythos-class capability through broad safety classifiers and automatic fallback. The deployed product can therefore be a routed system, not always a pure Fable response.',
  },
  {
    id: 'claude-opus-5',
    company: 'Anthropic',
    model: 'Claude Opus 5',
    release: '2026-07',
    releaseMonth: 2026.5,
    family: 'everyday frontier agent',
    access: 'API / Claude / cloud partners',
    inputPrice: 5,
    outputPrice: 25,
    contextK: 1000,
    releaseStatus: 'released',
    note: 'Near-Fable capability at half Fable’s token price, with effort controls, 1M context, stronger self-verification, and less restrictive safeguards for everyday coding and knowledge work.',
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
    id: 'qwen37-max',
    company: 'Alibaba',
    model: 'Qwen3.7-Max',
    release: '2026-05',
    releaseMonth: 2026.42,
    family: 'proprietary agent foundation',
    access: 'Alibaba Cloud Model Studio (announced)',
    aaIndex: 57,
    sweBench: 60.6,
    terminalBench: 69.7,
    gpqa: 92.4,
    inputPrice: 2.5,
    outputPrice: 7.5,
    outputSpeed: 210.5,
    contextK: 1000,
    note: 'A proprietary Qwen release for agent scaffolds, office automation, coding, and long-horizon execution, with published examples above 1,000 tool calls.',
  },
  {
    id: 'qwen38-max-preview',
    company: 'Alibaba',
    model: 'Qwen3.8-Max-Preview',
    release: '2026-07',
    releaseMonth: 2026.5,
    family: '2.4T agent-model preview',
    access: 'Token Plan / Qoder / QoderWork',
    releaseStatus: 'preview',
    note: 'Alibaba has disclosed a 2.4T-parameter preview and says open weights are coming. No model card, weight files, or detailed training recipe was public as of July 26, so it is not yet an open-weight release.',
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
    id: 'kimi-k26',
    company: 'Kimi',
    model: 'Kimi K2.6',
    release: '2026-04',
    releaseMonth: 2026.33,
    family: 'open-weight agentic MoE',
    access: 'API / open-weight ecosystem',
    aaIndex: 54,
    inputPrice: 0.95,
    outputPrice: 4,
    outputSpeed: 96.3,
    contextK: 256,
    note: 'A newer open-weight Kimi point with strong agentic and multimodal positioning: 1T total parameters, 32B active, and 256K context.',
  },
  {
    id: 'kimi-k3',
    company: 'Kimi',
    model: 'Kimi K3',
    release: '2026-07',
    releaseMonth: 2026.5,
    family: '2.8T multimodal sparse MoE',
    access: 'Kimi / Kimi Code / API',
    inputPrice: 3,
    outputPrice: 15,
    contextK: 1000,
    releaseStatus: 'announced',
    note: 'K3 is live as a hosted model; Moonshot says full weights and the technical report will arrive July 27. The launch discloses KDA, Attention Residuals, and 16-of-896 expert routing, but not the full data recipe.',
  },
  {
    id: 'deepseek-v4-flash',
    company: 'DeepSeek',
    model: 'DeepSeek V4 Flash',
    release: '2026-04',
    releaseMonth: 2026.33,
    family: 'low-cost open-weight reasoning',
    access: 'API / open-weight ecosystem',
    aaIndex: 47,
    inputPrice: 0.14,
    outputPrice: 0.28,
    outputSpeed: 97,
    contextK: 1000,
    note: 'The efficiency sibling of DeepSeek V4 Pro: lower raw score, but an unusually aggressive price point with 1M context.',
  },
  {
    id: 'grok-43',
    company: 'xAI',
    model: 'Grok 4.3',
    release: '2026-04',
    releaseMonth: 2026.33,
    family: 'cost-efficient proprietary reasoning',
    access: 'xAI API / Grok',
    aaIndex: 53,
    inputPrice: 1.25,
    outputPrice: 2.5,
    outputSpeed: 209,
    contextK: 1000,
    note: 'A cost-efficiency pressure point: not the top raw intelligence score, but strong speed, 1M context, and low output-token pricing.',
  },
  {
    id: 'glm-47',
    company: 'Z AI',
    model: 'GLM-4.7',
    release: '2025-12',
    releaseMonth: 2025.92,
    family: 'open-weight coding agent',
    access: 'Z.AI API / open-weight ecosystem',
    aaIndex: 42,
    sweBench: 73.8,
    terminalBench: 41.0,
    hle: 42.8,
    inputPrice: 0.6,
    outputPrice: 2.2,
    outputSpeed: 99.9,
    contextK: 200,
    note: 'A Z.ai coding-oriented open model with stronger multi-step execution, frontend generation, and tool-use positioning.',
  },
  {
    id: 'glm-52',
    company: 'Z AI',
    model: 'GLM-5.2',
    release: '2026-06',
    releaseMonth: 2026.42,
    family: 'open-weight long-horizon MoE',
    access: 'Z.AI API / MIT open weights',
    sweBench: 62.1,
    terminalBench: 81.0,
    contextK: 1000,
    releaseStatus: 'released',
    note: 'An open 753B MoE with 1M context. IndexShare reuses one sparse-attention indexer across four layers, and its post-training pipeline targets compacted long-horizon agent trajectories.',
  },
  {
    id: 'command-a-plus',
    company: 'Cohere',
    model: 'Command A+',
    release: '2026-05',
    releaseMonth: 2026.42,
    family: 'enterprise open-weight',
    access: 'Cohere API / open weights',
    aaIndex: 37,
    gpqa: 76,
    hle: 11,
    outputSpeed: 208.7,
    contextK: 192,
    note: 'A sovereign-AI and enterprise deployment point: lower frontier score, but open weights, strong speed, and conservative hallucination behavior.',
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

const metricLabels: Record<Locale, Record<MetricKey, string>> = {
  en: {
    aaIndex: 'AA Index',
    valsIndex: 'Vals Index',
    sweBench: 'SWE-Bench',
    terminalBench: 'Terminal-Bench',
    gpqa: 'GPQA Diamond',
    hle: 'Humanity’s Last Exam',
    outputSpeed: 'Output speed',
  },
  ko: {
    aaIndex: 'AA 지능 지수',
    valsIndex: 'Vals 지수',
    sweBench: 'SWE-Bench',
    terminalBench: 'Terminal-Bench',
    gpqa: 'GPQA Diamond',
    hle: 'Humanity’s Last Exam',
    outputSpeed: '출력 속도',
  },
};

const labels = {
  en: {
    title: 'Commercial Model Benchmark Map',
    subtitle:
      'Choose a benchmark, then change the x-axis to see whether the same model still looks strong by time, token cost, speed, or context budget.',
    benchmark: 'Benchmark',
    controlAria: 'Benchmark plot controls',
    noPoints: 'No model in this filter reports the selected metric.',
    selectModel: 'Select model',
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
      'Snapshot as of July 26, 2026. Values combine cited lab cards/release notes with Artificial Analysis and Vals AI public benchmark pages. A missing score means not reported under the mapped methodology, not zero.',
  },
  ko: {
    title: '상업용 모델 Benchmark Map',
    subtitle:
      'Benchmark를 고른 뒤 x축을 바꿔 보세요. 같은 모델도 시간, token cost, 속도, context budget 기준에서는 전혀 다르게 보입니다.',
    benchmark: 'Benchmark',
    controlAria: 'Benchmark 그래프 설정',
    noPoints: '이 필터에서 선택한 metric을 공개한 모델이 없습니다.',
    selectModel: '모델 선택',
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
      '2026년 7월 26일 기준 snapshot입니다. 값은 본문에 인용한 lab card/release note와 Artificial Analysis, Vals AI public benchmark page를 함께 정리했습니다. 값이 없다는 것은 0점이 아니라 해당 methodology에서 미공개라는 뜻입니다.',
  },
};

const notesKo: Partial<Record<string, string>> = {
  'gpt-4': '오늘날의 agent benchmark 체계가 자리 잡기 전, 시험·coding 성능을 대표했던 역사적 기준점입니다.',
  'gemini-15-pro': '1M-token preview와 MoE 효율을 앞세워 long-context multimodal work를 전면으로 끌어올렸습니다.',
  'mistral-large': '다국어 reasoning과 enterprise API deployment를 겨냥한 유럽계 commercial flagship입니다.',
  'claude-3-opus': '최고 품질 Opus, 균형형 Sonnet, 저비용 Haiku라는 product ladder를 명확히 만든 모델입니다.',
  'gpt-4o': '텍스트 점수만이 아니라 실시간 음성·vision·latency·비용으로 경쟁축을 넓혔습니다.',
  'claude-35-sonnet': '상위 capability가 더 저렴한 tier로 내려오는 capability compression을 보여 준 사례입니다.',
  'mistral-large-2': 'code, math, multilingual support, function calling을 개선하며 open-weight enterprise 영역을 확장했습니다.',
  'o1-preview': '더 오래 생각할수록 어려운 수학·과학·code 문제가 개선되는 inference-time reasoning을 제품 기능으로 만들었습니다.',
  'gpt-5': '빠른 응답과 깊은 reasoning을 routing하는 unified system으로, 모델과 제품 시스템의 경계를 흐렸습니다.',
  'qwen-25': '여러 크기와 modality를 공개해 Alibaba의 광범위한 open-model 전략을 보여 준 모델군입니다.',
  'claude-35-sonnet-computer': '화면을 읽고 cursor, click, typing을 수행하면서 답변 모델에서 행동 모델로 넘어간 전환점입니다.',
  'deepseek-v3': '671B 중 token당 37B만 활성화하는 MoE와 높은 학습 효율로 비용 논의를 바꿨습니다.',
  'deepseek-r1': '대규모 RL로 학습한 open reasoning model이 폐쇄형 시스템과 경쟁할 수 있음을 보여 줬습니다.',
  qwen3: 'thinking/non-thinking mode를 함께 제공해 reasoning budget을 제어 가능한 open-model 기능으로 만들었습니다.',
  'minimax-m1': 'hybrid attention, 1M context, open weights를 결합해 long-context reasoning 비용을 낮췄습니다.',
  'kimi-k2': 'coding, reasoning, autonomous tool use에 초점을 둔 trillion-parameter open MoE입니다.',
  'gemini-25-pro': '장문·고속 특성이 aggregate score 1위와 별개인 축임을 보여 주는 사례입니다.',
  'gemini-3-pro': 'Google의 빠른 multimodal profile을 유지하면서 reasoning 성능을 크게 끌어올렸습니다.',
  'gemini-31-pro': 'frontier에 가까운 aggregate score와 높은 출력 속도를 함께 보여 주므로 price/speed 축 비교가 중요합니다.',
  'gemini-35-flash': '1M input, 64K output을 지원하며 Flash tier를 agentic coding과 long-horizon workflow로 확장했습니다.',
  'gemini-36-flash': '3.5 대비 output token 17% 감소, 더 적은 tool loop, coding·computer use 개선, 더 낮은 output price를 내세운 효율 업데이트입니다.',
  'gpt-53-codex': '특화 coding agent가 일반 모델보다 workflow eval에서 앞설 수 있음을 보여 줍니다.',
  'gpt-54': 'coding 전용 특화를 넘어 general-purpose agent 성능을 넓힌 후속 모델입니다.',
  'gpt-55': '당시 높은 AA Index를 기록했지만, cost 축에서는 headline score와 다른 결론이 나옵니다.',
  'gpt-56-sol': 'max reasoning과 multi-agent ultra를 추가한 flagship으로, long-running coding·computer use·science·cyber work를 전면에 둡니다.',
  'gpt-56-terra': 'GPT-5.5급 품질을 절반 가격에 제공하는 균형형 tier이며 Sol과 같은 1.05M context, 128K output을 지원합니다.',
  'gpt-56-luna': 'Sol보다 aggregate 품질은 낮지만 input/output 가격이 1/5인 capability compression 사례입니다.',
  'claude-sonnet-46': 'frontier capability가 더 저렴한 Sonnet tier로 내려오는 흐름을 보여 줍니다.',
  'claude-opus-47': 'professional-work suite에 강하지만 비슷한 모델보다 느리고 비싼 trade-off가 있습니다.',
  'claude-mythos': '공개 leaderboard 점이 아니라 위험이 높은 capability가 identity-gated될 수 있음을 보여 주는 deployment 사례입니다.',
  'claude-fable-5': 'Mythos-class capability에 넓은 safety classifier와 fallback을 결합했습니다. 실제 제품 응답이 항상 순수 Fable은 아닐 수 있습니다.',
  'claude-opus-5': 'Fable 절반 가격에 가까운 capability, effort control, 1M context, 강화된 self-verification을 제공합니다.',
  'kimi-k2-thinking': 'raw score보다 price-performance에서 더 강하게 보이고 speed-performance에서는 불리한 challenger입니다.',
  'deepseek-v4-pro': '높은 aggregate capability를 훨씬 낮은 token price에 제공하는 open-weight 대안입니다.',
  'qwen3-max-thinking': '중국 frontier 경쟁이 한두 연구소에 국한되지 않음을 보여 줍니다.',
  'qwen37-max': 'coding, office automation, multi-agent orchestration, 장기 실행을 위한 proprietary agent foundation입니다.',
  'qwen38-max-preview': '2.4T preview와 향후 open weights만 공개됐습니다. 7월 26일 현재 model card·weights·상세 학습 recipe가 없어 아직 open-weight release는 아닙니다.',
  'minimax-m27': 'raw score 1위는 아니지만 token cost를 함께 그리면 강한 price-performance 지점입니다.',
  'kimi-k26': '1T total, 32B active, 256K context를 갖춘 multimodal agentic open-weight 모델입니다.',
  'kimi-k3': 'hosted model은 공개됐지만 full weights와 technical report는 7월 27일 예정입니다. KDA, AttnRes, 16-of-896 routing까지 공개됐고 data recipe는 아직 없습니다.',
  'deepseek-v4-flash': '낮은 raw score 대신 1M context와 공격적인 가격을 택한 V4 Pro의 효율형 sibling입니다.',
  'grok-43': '1M context, 빠른 출력, 낮은 output price로 cost-efficiency를 압박하는 proprietary 모델입니다.',
  'glm-47': 'multi-step execution, frontend generation, tool use를 강화한 Z.ai의 open coding model입니다.',
  'glm-52': '1M context를 지원하는 753B open MoE입니다. IndexShare와 compacted long-horizon trajectory 학습이 핵심 개선점입니다.',
  'command-a-plus': '최고 raw score보다 sovereign AI, enterprise deployment, open weights, 빠른 serving에 초점을 둡니다.',
  'mistral-large-3': '최고 점수는 아니지만 customization, sovereignty, open deployment가 중요할 때 유효합니다.',
};

const releaseStatusLabels: Record<Locale, Record<ReleaseStatus, string>> = {
  en: { released: 'released', preview: 'preview', announced: 'weights/report announced', restricted: 'restricted' },
  ko: { released: '공개 완료', preview: '프리뷰', announced: '가중치/리포트 공개 예정', restricted: '제한 공개' },
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
  'xAI',
  'Z AI',
  'Cohere',
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

const axisLabels: Record<Locale, Record<AxisMode, string>> = {
  en: {
    timeline: 'Release date',
    price: 'Blended price, $/1M tokens',
    speed: 'Output tokens/sec',
    context: 'Context window, K tokens',
  },
  ko: {
    timeline: '공개 시점',
    price: '혼합 가격, $/1M tokens',
    speed: '초당 출력 token',
    context: 'Context window, K tokens',
  },
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
  if (metric === 'aaIndex') return value.toFixed(1);
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
  const [axisMode, setAxisMode] = useState<AxisMode>('timeline');
  const [company, setCompany] = useState<CompanyKey>('All');
  const [selectedId, setSelectedId] = useState('gpt-56-sol');
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
    .filter((row) => (company === 'All' || row.company === company) && typeof row[metric] === 'number')
    .sort((a, b) => (b[metric] as number) - (a[metric] as number))
    .slice(0, 5);
  const timelineRows = [...MODEL_SNAPSHOTS]
    .filter((row) => company === 'All' || row.company === company)
    .sort((a, b) => a.releaseMonth - b.releaseMonth);

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
                    <text x={sx(point.x) + 10} y={sy(point.y) - 8} className="plot-label">
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
            {selected.release} · {selected.family} · {selected.access}
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
              <span>{text.outputSpeed}</span>
              <strong>{typeof selected.outputSpeed === 'number' ? selected.outputSpeed.toFixed(1) : text.noScore}</strong>
            </div>
            <div>
              <span>{text.detailContext}</span>
              <strong>{formatContext(selected.contextK, text.noScore)}</strong>
            </div>
          </div>
          <p className="commercial-note">{locale === 'ko' ? notesKo[selected.id] ?? selected.note : selected.note}</p>
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
        <div className="commercial-timeline-track" aria-label="Commercial model release timeline">
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
              <em>{row.family}</em>
            </button>
          ))}
        </div>
      </div>

      <p className="commercial-source-note">{text.source}</p>
    </section>
  );
}

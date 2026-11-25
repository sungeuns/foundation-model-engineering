import { labDatasets } from './lab-datasets.js';

const localized = (en, ko) => ({ en, ko });
const file = (kind, path, preview = undefined) => ({ kind, path, preview });
const task = (chapter, anchor, en, ko, files) => ({
  id: anchor, chapter, anchor, title: localized(en, ko), files,
});

export const labFileLabels = {
  python: localized('Python', 'Python'),
  worksheet: localized('Worksheet and answers (PDF)', '활동지와 풀이 (PDF)'),
  workbook: localized('Spreadsheet (XLSX)', '엑셀 계산표 (XLSX)'),
  notebook: localized('Jupyter notebook', '주피터 노트북'),
  workedNotebook: localized('Download notebook with results', '실행 결과가 담긴 노트북 내려받기'),
  bundle: localized('Python and images (ZIP)', 'Python 코드와 이미지 (ZIP)'),
  csv: localized('Measurements (CSV)', '측정값 (CSV)'),
  record: localized('Recorded run (JSON)', '실행 기록 (JSON)'),
};

const cacheChapter = '/chapter-12/kv-cache-management';
const bucketing = labDatasets['kv-batch-bucketing'];
const retrieval = labDatasets['multilingual-retrieval'];

export const teachingLabGroups = [
  {
    id: 'attention-masks',
    title: localized('Which tokens can the model see?', '모델은 어떤 토큰을 볼 수 있을까?'),
    tasks: [
      task('/chapter-3/self-attention-mathematics', 'attention-weight-example',
        'Calculate attention weights by hand, then change a future token.',
        '어텐션 가중치를 손으로 계산하고 미래 토큰 하나를 바꿔 보세요.', [
          file('worksheet', localized('/labs/attention-worksheet-en.pdf', '/labs/attention-worksheet-ko.pdf')),
          file('python', '/labs/self_attention.py'),
        ]),
      task('/chapter-4/encoder-decoder', 'cross-attention-example',
        'Change a masked source value and check what reaches the decoder.',
        '마스킹한 원문의 값을 바꾸고 디코더 출력에 영향을 주는지 확인하세요.',
        [file('python', '/labs/cross_attention.py')]),
      task('/chapter-4/hybrid-prefix-lm', 'prefix-mask-test',
        'Change the fifth token and test whether the fourth position can see it.',
        '다섯 번째 토큰을 바꾸고 네 번째 위치가 그 변화를 읽는지 시험하세요.',
        [file('python', '/labs/prefix_mask.py')]),
    ],
  },
  {
    id: 'training-updates',
    title: localized('What changes during a training step?', '학습 과정에서 무엇이 달라질까?'),
    tasks: [
      task('/chapter-5/expert-parallelism', 'expert-dispatch-lab',
        'Track six tokens to their assigned experts and back across two CPU ranks.',
        'CPU 랭크 두 개에서 토큰 여섯 개가 담당 전문가를 거쳐 원래 자리로 돌아오는 경로를 추적하세요.',
        [file('python', '/labs/expert_dispatch.py')]),
      task('/chapter-7/data-parallelism', 'dp-ddp-gradient-trace',
        'Check a gathered loss with CPU autograd and compare a two-rank DDP update.',
        'CPU 자동 미분으로 모은 손실의 그래디언트를 검산하고 두 랭크의 DDP 갱신과 비교하세요.',
        [file('python', '/scripts/verify-dp-ddp-gradients.py')]),
      task('/chapter-7/zero-redundancy-optimizer', 'zero-shard-ownership',
        'Trace gradient shards and updated weights across four CPU ranks.',
        'CPU 랭크 네 개에서 그래디언트 조각과 갱신된 가중치가 어디로 가는지 추적하세요.',
        [file('python', '/labs/zero_shards.py')]),
      task('/chapter-7/tiny-decoder-lab', 'local-decoder-setup',
        'Train a tiny decoder, hide its earlier tokens, and resume from a checkpoint.',
        '작은 디코더를 학습하고 앞선 토큰을 가려 본 뒤 체크포인트에서 학습을 재개하세요.', [
          file('notebook', localized('/labs/tiny-decoder-lab.ipynb', '/labs/tiny-decoder-lab-ko.ipynb')),
          file('workedNotebook', localized('/labs/2026-11/tiny-decoder-worked-en.ipynb', '/labs/2026-11/tiny-decoder-worked-ko.ipynb'), {
            cell: 'compare-results',
            title: localized('Compare test losses with and without earlier tokens', '앞선 토큰을 볼 때와 가릴 때의 테스트 손실 비교'),
          }),
          file('python', '/labs/causal_lab.py'),
        ]),
      task('/chapter-8/continued-pretraining-and-domain-adaptation', 'token-mixture-example',
        'Count how domain-token exposure changes on a second pass through 80 work orders.',
        '작업 지시서 80건을 두 번 읽을 때 도메인 토큰의 누적 노출량을 계산하세요.',
        [file('python', '/labs/token_exposure.py')]),
    ],
  },
  {
    id: 'cache-memory',
    title: localized('How much cache does a batch need?', '배치 하나에 캐시가 얼마나 필요할까?'),
    tasks: [
      task(cacheChapter, 'mixed-request-budget',
        'Fit requests of different lengths into a fixed KV memory budget.',
        '길이가 다른 요청들을 정해진 KV 메모리 안에 배치하세요.',
        [file('workbook', localized('/labs/kv-queue-en.xlsx', '/labs/kv-queue-ko.xlsx'))]),
      task(cacheChapter, 'kv-payload-notebook',
        'Measure a real decoder’s KV cache by counting its key and value tensor bytes.',
        '실제 디코더의 키·값 텐서가 차지하는 바이트 수로 KV 캐시 용량을 재 보세요.', [
          file('notebook', localized('/labs/kv-cache-payload-en.ipynb', '/labs/kv-cache-payload-ko.ipynb')),
          file('workedNotebook', localized('/labs/2026-11/kv-cache-payload-worked-en.ipynb', '/labs/2026-11/kv-cache-payload-worked-ko.ipynb'), {
            cell: '83af943d',
            title: localized('See the cache grow over four decoding steps', '디코딩 네 단계에서 늘어나는 KV 캐시 용량 보기'),
          }),
        ]),
      task(cacheChapter, 'kv-batch-padding',
        'Measure the padding cost of batching a 3-token prompt with an 11-token prompt.',
        '3토큰 프롬프트와 11토큰 프롬프트를 한 배치로 묶을 때 패딩 비용을 측정하세요.',
        [file('python', '/labs/kv_batch_padding.py'), file('record', '/labs/2026-11/kv-batch-padding-cpu.json')]),
      task(bucketing.chapter, bucketing.anchor,
        'Reorder six prompts and compare total padding with peak KV payload.',
        '프롬프트 여섯 개의 순서를 바꾸고 전체 패딩과 최대 KV 용량을 비교하세요.',
        [file('python', bucketing.script), file('csv', '/labs/2026-11/kv-batch-bucketing.csv')]),
      task('/chapter-12/paged-attention-vllm', 'paged-kv-addresses',
        'Follow one decode query through a block table to the five values it reads.',
        '디코딩 쿼리 하나가 블록 테이블을 거쳐 읽는 값 다섯 개를 추적하세요.',
        [file('python', '/labs/paged_attention.py')]),
    ],
  },
  {
    id: 'evidence',
    title: localized('Does the evidence support the answer?', '주어진 근거로 답할 수 있을까?'),
    tasks: [
      task(retrieval.chapter, 'multilingual-retrieval-check',
        'Compare BM25 and multilingual E5 when a Korean query searches English manuals.',
        '한국어 질문으로 영어 안내문을 찾을 때 BM25와 다국어 E5의 검색 결과를 비교하세요.',
        [file('python', retrieval.script), file('csv', '/labs/2026-11/multilingual-retrieval.csv')]),
      task('/chapter-11/vision-language-bridges', 'receipt-grounding',
        'Change or erase a receipt total and record what SmolVLM reads.',
        '영수증의 합계를 바꾸거나 지우고 SmolVLM이 읽은 값을 확인하세요.',
        [file('bundle', '/labs/2026-11/receipt-grounding.zip')]),
      task('/chapter-11/audio-and-speech-integration', 'whisper-sample-rate',
        'Compare Whisper transcripts when 44.1 kHz audio is resampled or mislabeled as 16 kHz.',
        '44.1 kHz 녹음을 16 kHz로 변환했을 때와 주파수 표기만 바꿨을 때의 Whisper 전사 결과를 비교하세요.',
        [file('python', '/labs/whisper_sample_rate.py'), file('record', '/labs/2026-11/whisper-sample-rate.json')]),
    ],
  },
  {
    id: 'release-decisions',
    title: localized('What would change a release decision?', '어떤 결과가 나오면 배포 결정을 바꿀까?'),
    tasks: [
      task('/chapter-17/experimental-design-and-uncertainty', 'release-lab',
        'Compare paired synthetic evaluations with the same gain and different retention outcomes.',
        '목표 점수 상승폭은 같지만 기존 능력 유지 결과는 다른 두 합성 평가를 비교하세요.',
        [file('python', '/labs/paired_release.py')]),
      task('/chapter-17/commercial-model-benchmarks', 'background-completion-cost',
        'Price uncached requests at the long-context threshold and compare completion windows.',
        '긴 문맥 요금 경계에서 캐시 없는 요청의 비용을 구하고 완료 시간 조건별 견적을 비교하세요.',
        [file('python', '/labs/request_cost.py')]),
    ],
  },
];

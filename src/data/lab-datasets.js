// Each entry describes a measured table contained in the linked chapter and JSON record.
export const labDatasets = {
  'kv-batch-bucketing': {
    chapter: '/chapter-12/length-bucketing-lab',
    anchor: 'prefill-measurements',
    script: '/labs/kv_batch_bucketing.py',
    variables: ['prompt length (tokens)', 'padding positions', 'key tensor bytes', 'value tensor bytes', 'greedy next-token ID'],
    languages: ['en'],
    en: {
      name: 'SmolLM2-135M prefill measurements for six dense batches',
      description: 'Six English prompts were paired in arrival order and in length order. Each CSV row records one batch, the two input lengths, padding positions, key and value tensor bytes, and the two greedy next-token IDs. The JSON includes individual prompts, standalone results, the model revision and the CPU environment.',
    },
    ko: {
      name: 'SmolLM2-135M의 밀집 배치 6개에서 측정한 프리필 결과',
      description: '영어 프롬프트 6개를 도착 순서와 길이순으로 각각 둘씩 묶었습니다. CSV 한 행에는 배치 하나의 두 입력 길이, 패딩 수, 키·값 텐서의 바이트 수, 두 입력의 다음 토큰 ID가 담겨 있습니다. JSON에는 프롬프트 원문, 단독 실행 결과, 모델 리비전과 CPU 환경도 있습니다.',
    },
  },
  'multilingual-retrieval': {
    chapter: '/chapter-14/lexical-to-semantic-search',
    anchor: 'retrieval-measurements',
    script: '/labs/multilingual_retrieval.py',
    variables: ['BM25 score', 'cosine similarity', 'E5 passage rank'],
    languages: ['en', 'ko'],
    en: {
      name: 'BM25 and multilingual E5 scores for 32 query–passage pairs',
      description: 'Four fictional support cases were queried in English and Korean against four English passages. Each CSV row contains one query, one passage, its expected passage ID, BM25 score, E5 cosine score and E5 rank. An empty expected ID means none of the passages answers the query. The JSON also records the tokenizer and encoder revision and the exact-code filter results.',
    },
    ko: {
      name: '질의·문단 32쌍의 BM25 점수와 다국어 E5 점수',
      description: '가상의 고객 문의 네 가지를 영어와 한국어로 작성하고 영어 안내문 네 개를 검색했습니다. CSV 한 행에는 질의 하나와 문단 하나, 정답 문단 ID, BM25 점수, E5 코사인 점수와 순위가 담겨 있습니다. 정답 ID가 비어 있으면 해당 질의에 답하는 문단이 없다는 뜻입니다. JSON에는 토크나이저와 인코더 리비전, 제품 번호로 거른 결과도 있습니다.',
    },
  },
};

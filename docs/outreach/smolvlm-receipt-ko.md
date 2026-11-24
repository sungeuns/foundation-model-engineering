# SmolVLM은 영수증 금액을 읽었다. 합계 줄을 지우자 무엇을 답했을까?

영수증 맨 아래에 `Total 31.50`이 적혀 있습니다. 모델이 `31.50`이라고 답하면 금액 추출은 성공입니다. 그런데 나중에 해당 금액이 영수증 어디에서 나왔는지 확인하려면, 근거로 제시할 줄도 필요합니다. 이를 따로 검사해 보았습니다.

512 × 384픽셀 영수증을 세 장 만들었습니다. A와 B는 합계 줄의 숫자만 다르고, 세 번째 영수증은 그 줄을 지웠습니다. 품목 옆에는 수량만 있어서 가격을 더해 합계를 복원할 수도 없습니다. SmolVLM-256M-Instruct에 이미지를 한 장씩 입력하고 매번 같은 질문을 보냈습니다.

> Read the printed Total line. Copy that line exactly. If the Total line is missing, answer MISSING.

| 입력 | 기대한 응답 | 실제 응답 (JSON 문자열) |
| --- | --- | --- |
| 영수증 A | `Total 31.50` | `" 31.50"` |
| 영수증 B | `Total 42.00` | `" 42.00"` |
| 합계 줄을 지운 영수증 | `MISSING` | `" 1"` |

따옴표 바로 뒤의 공백 한 칸도 모델의 출력입니다. 공백을 지우고 금액만 비교하면 A와 B는 둘 다 맞습니다. 줄 전체를 비교하면 두 답 모두 `Total`이 빠졌습니다. 합계 줄을 지운 세 번째 장에서도 모델은 숫자를 냈습니다. 이 세 장만으로 일반 영수증의 인식률을 추정할 수는 없지만, 금액·근거 줄·누락 시 응답을 따로 채점해야 어떤 동작이 실패했는지 알 수 있습니다.

재현에는 모델 리비전 `d039ab0d4b9311b617e8ffec1d06c8464364aeb3`의 기본 이미지 전처리와 채팅 템플릿을 썼습니다. 모델 입력은 RGB 픽셀과 질문뿐입니다. Linux CPU에서 PyTorch 2.15.0, Transformers 5.24.1, Pillow 13.0.0을 사용해 float32로 실행했고, 매 단계 가장 확률이 높은 토큰을 골랐습니다. 독립된 두 실행에서 생성 토큰 ID까지 같았습니다. [고정한 모델 카드](https://huggingface.co/HuggingFaceTB/SmolVLM-256M-Instruct/blob/d039ab0d4b9311b617e8ffec1d06c8464364aeb3/README.md) · [실제 출력과 토큰 ID](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/receipt-grounding-cpu.json)

직접 실행하려면 ZIP을 풀고 Python 3.12 환경에서 스크립트 첫머리의 설치 명령을 실행한 뒤, 같은 폴더에서 `python receipt_grounding.py .`을 실행하세요. PNG 세 장, 코드, 비교용 출력이 들어 있습니다. 첫 실행에는 모델 가중치 약 513 MB를 내려받습니다. [실습 ZIP 다운로드](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/receipt-grounding.zip)

제가 관리하는 공개 교재 《파운데이션 모델 엔지니어링》 11.1절에 이 실험을 실었습니다. 실험 코드 작성과 실행, 이 글 작성에는 Codex를 사용했습니다. [한국어 실습 원문](https://sungeuns.github.io/foundation-model-engineering/ko/chapter-11/vision-language-bridges/#receipt-grounding)

/** Generate the self-contained EN/KO notebooks from the authoritative lab.
 * Run: node scripts/causal-notebooks.mjs [--check]
 * Only Node built-ins are required. Execution outputs are deliberately absent.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(ROOT, 'public/labs/causal_lab.py'), 'utf8');
const sha256 = createHash('sha256').update(source).digest('hex');
if (source.includes("'''")) throw new Error('Choose a new lossless source delimiter before generating notebooks.');

function cell(type, id, content, metadata = {}) {
  return {
    cell_type: type, id, metadata,
    source: (content.trimEnd() + '\n').split(/(?<=\n)/),
    ...(type === 'code' ? { execution_count: null, outputs: [] } : {}),
  };
}
const md = (id, en, ko, lang) => cell('markdown', id, lang === 'ko' ? ko : en);
const code = (id, content, metadata) => cell('code', id, content, metadata);

export function notebook(lang) {
  const book = 'https://sungeuns.github.io/foundation-model-engineering/' + (lang === 'ko' ? 'ko/' : '') + 'chapter-7/tiny-decoder-lab/';
  return {
    cells: [
      md('start', `# Train a tiny decoder. Then try to invalidate the result.

Can a model copy a repeating pattern? Train it on CPU, remove access to earlier symbols, and replay training from a checkpoint. Then deliberately break the causal mask and corrupt a **copy** of the checkpoint to see the checks fail.

1. Write your predictions in the next cell.
2. Use **Run all** with a Python kernel that has PyTorch installed.
3. Compare the measured results with your predictions.

No API key, GPU, model weights, or external dataset is needed. This notebook contains its complete lab source; execution makes no network requests. It is a synthetic teaching experiment, not evidence of natural-language model quality.

[Full explanation and resource contract](${book}) · [Source repository](https://github.com/sungeuns/foundation-model-engineering)`,
`# 작은 디코더를 학습하고, 결과가 잘못될 조건을 찾아보세요

모델이 반복 패턴을 복사할 수 있을까요? CPU에서 학습한 뒤 이전 기호를 보지 못하게 바꾸고, 체크포인트부터 학습을 재개해 봅니다. 이어서 인과 마스크를 일부러 없애고 체크포인트의 **사본** 을 손상시켜 검사가 실패하는지도 확인합니다.

1. 다음 셀에 예상 결과를 적으세요.
2. PyTorch가 설치된 Python 커널에서 **모두 실행(Run all)** 을 선택하세요.
3. 실제 결과를 예상과 비교하세요.

API 키, GPU, 모델 가중치, 외부 데이터셋이 필요하지 않습니다. 실습 소스가 노트북에 모두 포함되며 실행 중 네트워크 요청을 보내지 않습니다. 합성 과제를 쓰는 교육용 실험으로, 자연어 모델의 품질을 입증하지는 않습니다.

[전체 설명과 자원 조건](${book}) · [소스 저장소](https://github.com/sungeuns/foundation-model-engineering)`, lang),
      code('predictions', `# Replace the empty strings with your predictions before running the experiment.
predictions = {
    "earlier_logits_change_when_future_tokens_change": "",
    "self_only_attention_helps_or_hurts": "",
    "resumed_training_matches_uninterrupted_training": "",
}
seed, steps = 7, 160
`),
      md('setup', `## Setup and scope

Use Python 3.12+ and a Jupyter kernel with PyTorch. If the import below fails, install PyTorch **in that kernel's environment** using its [official installer](https://pytorch.org/get-started/locally/). This notebook does not install or upgrade packages automatically. Verified on 2026-11-18 with Python 3.12 and PyTorch 2.15.0+cpu; other compatible runtimes may run it, but identical trajectories across versions or hardware are not promised.

The fixed recipe is one layer, width 32, two attention heads, FP32 CPU, batch 16, and AdamW (learning-rate scale 0.003, betas 0.9/0.95, epsilon 1e-8, decay 0.01, gradient clipping 1.0). It uses a ten-update warmup multiplied by a cosine envelope; the source contains the exact schedule. The first four symbols are the prompt; each sequence has 13 supervised continuation targets. Rotations of a motif remain in one group before the 128/16/16 train/validation/test split.

Parameters, gradients and Adam moments occupy about 158.8 KiB; that excludes activations, temporary buffers, runtime, checkpoints and evaluation. A 1 GiB free-memory allowance is a planning estimate, not a measured peak. There is no sharding, mixed precision, chat template, padding, remote recovery or distributed execution. Preserve the original recipe for the first run; choosing settings after inspecting test results requires a new held-out set for a new generalization claim.`,
`## 준비와 실습 범위

Python 3.12 이상과 PyTorch가 설치된 Jupyter 커널을 사용하세요. 아래 import가 실패하면 [공식 설치 안내](https://pytorch.org/get-started/locally/)에 따라 **해당 커널의 환경** 에 PyTorch를 설치하세요. 이 노트북은 패키지를 자동으로 설치하거나 갱신하지 않습니다. 2026-11-18에 Python 3.12, PyTorch 2.15.0+cpu에서 검증했습니다. 다른 호환 환경에서도 실행할 수 있지만 버전·하드웨어를 바꿨을 때 수치 경로가 같다고 보장하지는 않습니다.

고정 레시피는 한 층, 폭 32, 어텐션 헤드 두 개, FP32 CPU, 배치 16, AdamW입니다. 학습률 스케일은 0.003, betas는 0.9/0.95, epsilon은 1e-8, 감쇠는 0.01, 기울기 클리핑은 1.0입니다. 열 번의 갱신 동안 적용하는 warmup 계수와 cosine 계수를 곱하며 정확한 식은 소스에 있습니다. 처음 네 기호가 프롬프트이고 이어지는 13개 기호에 손실을 줍니다. 순환 이동한 패턴을 같은 집단으로 묶은 뒤 train/validation/test를 128/16/16개 집단으로 나눕니다.

매개변수·기울기·Adam moment를 합하면 약 158.8 KiB이며 활성화, 임시 버퍼, 런타임, 체크포인트와 평가는 별도입니다. 여유 메모리 1 GiB는 계획치이며 측정한 최대 사용량이 아닙니다. 샤딩, 혼합 정밀도, chat template, 패딩, 원격 복구와 분산 실행은 없습니다. 처음에는 원래 레시피로 실행하세요. Test 결과를 보고 설정을 고른 뒤 새 일반화 주장을 하려면 새로운 보류셋이 필요합니다.`, lang),
      code('environment', `import hashlib
import importlib.util
import json
import math
from pathlib import Path
import sys
import tempfile
import time
from zipfile import ZIP_DEFLATED, ZipFile

if sys.version_info < (3, 12):
    raise RuntimeError("Use a Python 3.12+ kernel for this teaching lab.")
import torch

print({"python": sys.version.split()[0], "torch": str(torch.__version__), "device": "cpu"})
`),
      md('source-note', `## The complete source travels with the notebook

The following cell is generated from the book's unchanged <code>public/labs/causal_lab.py</code>. It defines a source string, not a second implementation. Expand it to inspect the model, mask, loss and recovery protocol. The next cell verifies its SHA-256 before importing it. Every run uses a fresh directory beside the notebook; previous results are not overwritten.`,
`## 실습 소스가 노트북에 함께 들어 있습니다

다음 셀은 책의 <code>public/labs/causal_lab.py</code>를 그대로 포함하도록 생성됩니다. 별도 구현이 아니라 원본 소스 문자열입니다. 셀을 펼쳐 모델, 마스크, 손실과 복구 절차를 확인할 수 있습니다. 다음 셀에서 SHA-256을 대조한 뒤 불러옵니다. 실행할 때마다 노트북 옆에 새 폴더를 만들며 이전 결과를 덮어쓰지 않습니다.`, lang),
      code('embedded-source', `SOURCE = r'''${source}'''
`, { jupyter: { source_hidden: true }, fme_role: 'canonical_source' }),
      code('load-source', `EXPECTED_SOURCE_SHA256 = "${sha256}"
assert hashlib.sha256(SOURCE.encode("utf-8")).hexdigest() == EXPECTED_SOURCE_SHA256
run_root = Path(tempfile.mkdtemp(prefix="fme-tiny-decoder-", dir=Path.cwd()))
output = run_root / "outputs"
output.mkdir()
source_path = output / "causal_lab.py"
source_path.write_bytes(SOURCE.encode("utf-8"))
assert hashlib.sha256(source_path.read_bytes()).hexdigest() == EXPECTED_SOURCE_SHA256
spec = importlib.util.spec_from_file_location("fme_causal_lab", source_path)
lab = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lab)
print({"source_sha256": EXPECTED_SOURCE_SHA256, "output_directory": str(output)})
`),
      md('run-note', `## Run the original experiment

This trains the causal model, saves and restores a midpoint checkpoint, replays its remaining updates, and trains the self-only attention ablation. The CPU implementation checks causal invariance and exact replay and aborts on nonfinite loss/gradients or failed checks. It records token-normalized loss, gradient norms, learning rate, batch IDs and throughput. No validated hardware FLOP model is supplied, so MFU remains missing rather than zero.`,
`## 원래 실험 실행하기

인과 모델을 학습하고 중간 체크포인트를 저장·복원한 뒤 남은 갱신을 재실행합니다. 자기 위치만 보는 어텐션 모델도 학습합니다. CPU 구현은 인과성 불변 조건과 정확한 재개를 검사하며, 손실·기울기가 비유한값이거나 검사가 실패하면 중단합니다. 토큰 정규화 손실, 기울기 norm, 학습률, 배치 ID와 처리량을 기록합니다. 검증된 하드웨어 FLOP 모델이 없으므로 MFU는 0으로 채우지 않고 미보고 값으로 남깁니다.`, lang),
      code('run-experiment', `started = time.perf_counter()
result = lab.run(output, steps=steps, seed=seed)
notebook_run_seconds = time.perf_counter() - started
print({"full_experiment_seconds": round(notebook_run_seconds, 3),
       "parameters": result["parameters"], "supervised_training_tokens": steps * 16 * 13})
`),
      md('gates-note', `## First ask whether the result is valid

A low loss is not enough. These gates concern this CPU run and source snapshot. They do not prove distributed fault tolerance or cross-version determinism. The full-experiment timing above includes the ablation and evaluations; the original lab's separately named training-and-replay timing excludes them.`,
`## 먼저 유효한 결과인지 확인하기

낮은 손실만으로는 충분하지 않습니다. 아래 검사는 이 CPU 실행과 소스 버전에 대한 것이며 분산 장애 복구나 버전 간 결정성을 입증하지 않습니다. 위의 전체 실험 시간에는 ablation과 평가가 들어갑니다. 원본 실습이 따로 기록한 학습·재실행 시간에는 이 두 작업이 빠져 있습니다.`, lang),
      code('validity-gates', `assert result["causal_invariance"] is True
assert result["exact_resume"] is True
assert result["nonfinite_count"] == 0
assert result["config"]["code_hash"] == EXPECTED_SOURCE_SHA256
print({key: result[key] for key in ("causal_invariance", "exact_resume", "nonfinite_count", "mfu")})
`),
      md('compare-note', `## What did access to earlier symbols buy?

The self-only ablation keeps parameter count, initialization, sampling and update budget fixed. Compare its test loss with the causal model's test loss; the intervention changes available context, not model size. A uniform predictor over the 16 valid symbols has loss ln(16) ≈ 2.773 nats per target.

Teacher-forced loss supplies correct preceding symbols. Greedy generation feeds predictions back into the model, so one early error can affect later tokens. Whole-sequence accuracy asks a stricter question than token accuracy. These are observations on the synthetic held-out groups, not LLM benchmark scores.`,
`## 앞 기호를 볼 수 있는 것이 얼마나 도움이 됐나요?

자기 위치만 보는 모델은 매개변수 수, 초기화, 샘플링과 갱신 예산이 같습니다. 이 모델의 test 손실을 인과 모델과 비교하세요. 모델 크기가 아니라 이용할 수 있는 문맥을 바꾼 실험입니다. 유효 기호 16개에 균등 확률을 주는 기준선의 손실은 target당 ln(16) ≈ 2.773 nats입니다.

Teacher-forced 손실을 구할 때는 앞의 정답 기호를 제공합니다. Greedy 생성에서는 모델의 예측을 다시 입력하므로 초반 오류가 다음 토큰에도 영향을 줄 수 있습니다. 전체 시퀀스 정답률은 토큰 정답률보다 엄격한 기준입니다. 합성 보류 집단에서 얻은 관측값이며 LLM 벤치마크 점수가 아닙니다.`, lang),
      code('compare-results', `measurements = {key: result[key] for key in (
    "initial_validation_nats", "validation_nats", "test_nats", "self_only_test_nats",
    "greedy_test_token_accuracy", "greedy_test_sequence_accuracy")}
measurements["uniform_valid_symbol_nats"] = math.log(16)
print(json.dumps(measurements, indent=2))
print(json.dumps(result["example"], indent=2))
trace = json.loads((output / "trace.json").read_text())
for index in (0, len(trace) // 2, len(trace) - 1):
    print({key: trace[index][key] for key in ("step", "loss_nats_per_target", "lr", "gradient_norm_before_clip")})
`),
      md('break-mask-note', `## Break one assumption: let attention see the future

This separate, untrained diagnostic model has the causal mask removed. Change only input positions 8 onward and measure the change in logits at earlier positions. A nonzero change exposes future leakage. It is not a new trained comparison or a better copying model; the original model and saved results remain intact.`,
`## 가정 하나를 깨기: 미래를 보게 만들기

별도의 미학습 진단 모델에서 인과 마스크를 없앱니다. 입력의 위치 8 이후만 바꾼 뒤 그보다 앞선 logit의 변화를 측정합니다. 변화가 0이 아니면 미래 정보가 새어 들어간 것입니다. 새 학습 결과나 더 좋은 복사 모델을 얻은 것이 아니며 원래 모델과 저장 결과는 유지됩니다.`, lang),
      code('break-mask', `diagnostic, _, _ = lab.setup(seed)
diagnostic.eval()
diagnostic.mask.zero_()
data, manifest = lab.corpus()
before = data["train"][:2, :-1].clone()
after = before.clone()
after[:, 8:] = 1
with torch.no_grad():
    leak_delta = float((diagnostic(before)[:, :8] - diagnostic(after)[:, :8]).abs().max())
assert leak_delta > 1e-6, "The diagnostic did not expose leakage; inspect the intervention."
print({"unmasked_earlier_logit_max_change": leak_delta})
`),
      md('break-checkpoint-note', `## Break a checkpoint copy

The saved checkpoint contains model and optimizer state, global step and token count, torch/sampler RNG state, data cursor, schedule and configuration/manifest hashes. Its SHA-256 completion marker detects accidental corruption in this exercise. It does not authenticate an untrusted download. Only load the checkpoint just created by this notebook. Keep the intact packet as the known-good recovery point.`,
`## 체크포인트 사본 손상시키기

저장된 체크포인트에는 모델·옵티마이저 상태, 전역 step·토큰 수, torch·sampler RNG, 데이터 커서, 스케줄, 설정·manifest 해시가 있습니다. SHA-256 완료 표식으로 이번 실습의 우발적 손상을 탐지합니다. 신뢰할 수 없는 다운로드의 출처를 인증하는 기능은 아닙니다. 이 노트북에서 방금 만든 체크포인트만 읽고, 온전한 결과 묶음을 정상 복구 지점으로 보존하세요.`, lang),
      code('break-checkpoint', `broken_dir = run_root / "intentional-corruption"
broken_dir.mkdir(exist_ok=True)
broken = broken_dir / "checkpoint.pt"
broken.write_bytes((output / "checkpoint.pt").read_bytes() + b"deliberate-corruption")
broken.with_suffix(".sha256").write_text((output / "checkpoint.sha256").read_text())
try:
    lab.load_checkpoint(broken, result["config"], manifest)
except ValueError as error:
    corruption_rejected = True
    print({"corruption_rejected": True, "reason": str(error)})
else:
    raise AssertionError("A corrupt checkpoint was accepted.")
# Confirm that the untouched original still restores.
lab.load_checkpoint(output / "checkpoint.pt", result["config"], manifest)
`),
      md('packet-note', `## Keep evidence, then change one thing

The ZIP contains the exact source, immutable synthetic manifest, checkpoint/marker, training trace and result packet. The deliberately corrupted copy is excluded. Keep it with your predictions; change one setting at a time in a **new** run. Three seeds can reveal sensitivity but do not establish a precise confidence interval. Do not release a modified lab artifact if invariance, integrity or replay checks fail, or if its held-out behavior is unexplained.

The ZIP path is printed below. In a hosted notebook, use the file browser to download it before the runtime is discarded. There are no embedded credentials or downloaded datasets.`,
`## 근거를 보존한 뒤 하나씩 바꾸기

ZIP에는 실행한 원본 소스, 불변 합성 manifest, 체크포인트와 표식, 학습 trace, 결과가 들어갑니다. 일부러 손상시킨 사본은 제외합니다. 예상 결과와 함께 보존하고 **새 실행** 에서 설정을 하나씩 바꾸세요. Seed 세 개로 민감도를 볼 수는 있지만 정밀한 신뢰구간을 얻었다고 주장할 수는 없습니다. 불변 조건·무결성·재개 검사가 실패하거나 보류 결과를 설명할 수 없다면 변경한 실습 산출물을 배포하지 마세요.

아래에 ZIP 경로가 표시됩니다. 호스팅된 노트북에서는 런타임이 사라지기 전에 파일 탐색기로 내려받으세요. 인증 정보나 내려받은 데이터셋은 포함되지 않습니다.`, lang),
      code('save-packet', `evidence = {"predictions": predictions, "full_experiment_seconds": notebook_run_seconds,
            "unmasked_earlier_logit_max_change": leak_delta, "corruption_rejected": corruption_rejected}
(output / "notebook-observations.json").write_text(json.dumps(evidence, indent=2))
archive = run_root / "result-packet.zip"
with ZipFile(archive, "w", compression=ZIP_DEFLATED) as packet:
    for name in ("causal_lab.py", "manifest.json", "checkpoint.pt", "checkpoint.sha256",
                 "trace.json", "result.json", "notebook-observations.json"):
        packet.write(output / name, arcname=f"outputs/{name}")
print({"download_packet": str(archive)})
`),
      md('questions', `## Check your explanation

1. Why does removing the mask invalidate a gain on next-token prediction?
2. Why does exact replay need sampler state as well as model weights?
3. Why can token accuracy look high while several full sequences are wrong?

<details><summary>Compare your answers</summary>
Future inputs reveal information unavailable at generation time. The sampler state preserves the next training batches; model weights alone do not preserve optimizer moments, the schedule or RNG state. Whole-sequence accuracy counts a sequence as wrong after even one incorrect token, and free-running errors can propagate.
</details>

## References

- [The complete bilingual lesson](${book}) — derivation, masks, resource accounting and extension questions.
- [PyTorch reproducibility](https://docs.pytorch.org/docs/2.15/notes/randomness.html) — limits across releases, platforms and devices; checked 2026-11-18.
- [PyTorch serialization](https://docs.pytorch.org/docs/2.15/notes/serialization.html) — state dictionaries and loading semantics; checked 2026-11-18.`,
`## 설명할 수 있는지 확인하기

1. 마스크를 없애서 next-token 점수가 좋아졌더라도 유효한 개선이 아닌 이유는 무엇인가요?
2. 정확한 재개에는 가중치뿐 아니라 sampler 상태도 필요한 이유가 무엇인가요?
3. 토큰 정답률이 높아도 여러 시퀀스가 틀릴 수 있는 이유는 무엇인가요?

<details><summary>답을 비교해 보세요</summary>
미래 입력은 생성 시점에 알 수 없는 정보를 제공합니다. Sampler 상태는 다음 학습 배치를 보존합니다. 가중치만으로는 옵티마이저 moment, 스케줄과 RNG까지 복구되지 않습니다. 전체 시퀀스 정답률은 토큰 하나라도 틀리면 해당 시퀀스를 오답으로 세며, 자유 생성에서는 오류가 전파될 수도 있습니다.
</details>

## References

- [전체 교재 설명](${book}) — 유도, 마스크, 자원 계산과 확장 질문.
- [PyTorch 재현성 문서](https://docs.pytorch.org/docs/2.15/notes/randomness.html) — 버전·플랫폼·장치 사이의 한계. 2026-11-18 확인.
- [PyTorch 직렬화 문서](https://docs.pytorch.org/docs/2.15/notes/serialization.html) — 상태 사전과 불러오기 규칙. 2026-11-18 확인.`, lang),
    ],
    metadata: {
      kernelspec: { display_name: 'Python 3 (ipykernel)', language: 'python', name: 'python3' },
      language_info: { name: 'python', version: '3.12' },
      fme: { locale: lang, source_path: 'public/labs/causal_lab.py', source_sha256: sha256, verified_environment_date: '2026-11-18' },
    },
    nbformat: 4, nbformat_minor: 5,
  };
}

export const filenames = ['tiny-decoder-lab.ipynb', 'tiny-decoder-lab-ko.ipynb'];
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  for (const [index, name] of filenames.entries()) {
    const target = path.join(ROOT, 'public/labs', name);
    const rendered = JSON.stringify(notebook(index ? 'ko' : 'en'), null, 2) + '\n';
    if (check) {
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== rendered) {
        throw new Error(`${name} is stale. Run node scripts/causal-notebooks.mjs and execute both notebooks.`);
      }
    } else fs.writeFileSync(target, rendered);
  }
  console.log(check ? 'Both notebooks match the canonical lab and bilingual template.' : 'Generated both self-contained causal-lab notebooks.');
}

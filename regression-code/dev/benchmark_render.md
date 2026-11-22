# 전체/viewport 및 산출물 재사용 2×2 비교

`regression-code/`에서 `npm.cmd run bench:render`를 실행한다.
기존 브라우저 검사와 같이 Playwright 및 Chrome이 필요하다.
프로젝트 제품 의존성에는 Playwright를 추가하지 않았다.
이미 설치된 Playwright 모듈과 브라우저를 사용할 경우 다음 환경 변수를 지정한다.

```powershell
$env:PLAYWRIGHT_MODULE = '설치된 playwright 패키지 절대 경로'
$env:BROWSER_PATH = 'Chrome 실행 파일 절대 경로'
npm.cmd run bench:render
# 최소 실행 검증 (발표용 전체 표는 아님)
npm.cmd run bench:render -- --smoke
```

실행기는 임시 포트의 로컬 Vite 서버와 headless Chrome을 시작하고 종료 시 닫는다.
기본 결과 위치는 `.agents/tmp/render-benchmark-<UTC 실행시각>/`이다.
선택적으로 `npm.cmd run bench:render -- 출력폴더`를 지정할 수 있다.
같은 출력 폴더를 지정하면 기존 결과를 덮어쓴다.

## 비교표

| 파일 | 비교 |
| --- | --- |
| viewport-comparison.csv | 동일 산출물의 전체 폭 그리기 vs viewport 그리기, 시작/중간 위치 |
| factorial-comparison.csv | 편집부터 렌더 호출 반환까지 네 조건의 계산·그리기·전체 시간 |
| combined-comparison.csv | 두 기능 모두 없음 vs 모두 있음 |
| results.json | 원시 표본, P95, 환경/소스 해시, bitmap 크기, 픽셀 차이, 검증 결과 |

네 조건은 `neither`, `reuse-only`, `viewport-only`, `both`다.
**부분 갱신은 앞선 Node 표와 같이 산출물 재사용을 의미한다.**
모든 조건에서 `renderCanvasScore`로 모든 layer를 다시 그린다.
제품의 별도 `renderCanvasScorePartial`에 의한 layer 선택 재그리기는 제외하여
두 요인의 영향을 분리한다. 따라서 `both`를 실제 앱 전체 편집 경로의 시간으로 설명하지 않는다.
기존 버전을 복원한 비교도 아니다.

## 측정 범위와 조건

- 합성 악보는 Node 도구와 같은 `benchmark_edit_fixture.ts`를 사용한다.
- 100/500/1,000열, 세 트랙, gliss/tuplet/hold/vibrato/tremolo 패턴.
- zoom 1, DPR 1, viewport 폭 1,008px, overscan 252px(제품의 폭 25% 정책).
- 별도 renderer 비교는 악보 시작/중간 위치, 네 조건 비교는 시작 위치에서 실행한다.
- 4회 워밍업 후 조건별 32회 측정한다. 순서를 회전하여 각 조건이 각 순서에 같은 횟수 등장한다.
- 최초 로드·분석·bitmap 할당은 측정 밖이다. 동일 원본에서 매번 실제 편집을 수행한다.
- GC 강제 실행·이상치 제거를 하지 않는다. 중앙값과 nearest-rank P95를 기록한다.
- 조건별 2D canvas는 화면에 부착하지 않으며 renderer API를 직접 호출한다. DOM UI·합성·물리 화면 표시·audio·Undo 이력은 제외한다.
- 제품 renderer와 profiler 코드는 변경하지 않는다. 새 외부 코드·제품 의존성은 없다.

`renderSubmitMs`는 Canvas API 호출이 반환될 때까지의 동기 시간이다.
`pipelineSubmitMs`는 편집·인덱스·산출물 생성부터 렌더 호출 반환까지 **직접 측정한** 시간이다.
표의 전체 시간은 단계별 중앙값을 더해서 만들지 않는다.
Canvas 실행은 브라우저 backend에 따라 지연될 수 있으므로 화면 완성 지연으로 해석하지 않는다.

각 표본 뒤 모든 layer에서 1픽셀을 읽어 대기 작업이 다음 표본으로 넘어가는 영향을 줄인다.
그 비용은 `readbackMs`, 이를 포함한 시간은 `pipelineWithReadbackMs`에 따로 기록한다.
읽기 비용 및 브라우저의 Canvas backend 선택 영향을 포함하므로 이것도 실제 사용자 반응속도는 아니다.
`willReadFrequently: false`를 명시하며 별도 검증 canvas에서만 전체 화면 픽셀을 읽는다.
JSON의 읽기 포함 결과를 함께 확인하여 draw 명령 제출만의 감소를 전체 그리기 감소로 확대하지 않는다.

## 전체 폭 비교의 한계

9,000열을 기존 전체 폭 renderer로 그리면 bitmap 폭 제한에 따른 해상도 축소가 개입한다.
또한 브라우저별 bitmap 크기 제한이 있어 공정한 동일 화질 비교가 어려워진다.
이번 도구는 stage 폭 30,000px·높이 1,080px 이하를 요구하며 실제 transform이 1인지 검사한다.
1,000열은 21,000×1,033px이다. 더 긴 악보에서 임의 배율 축소나 tile renderer를 추가하지 않는다.
따라서 9,000열 Node 표와 이번 브라우저 표를 합산하거나 동일 조건의 전후 수치처럼 다루면 안 된다.

## 결과 검증

- 전체/재사용의 파싱·분석·renderInput 내용과 배열 순서를 비교한다. Map 순서만 정규화한다.
- 반복 뒤 원본과 기존 산출물의 불변성 및 최종 산출물 동일성을 확인한다.
- 전체/viewport의 동일 화면 영역을 layer 순서대로 합성해 픽셀 차이를 비교한다.
- 전체 폭에서 세로 grid는 base에, viewport에서는 marker에 그려져 교차점의 합성 순서가 다르다.
  큰/작은 bitmap의 래스터 처리에서도 미세한 차이가 발생할 수 있다.
  첫 검증에서 1,000열은 변경 픽셀 5.46%였지만 채널 평균 차이는 0.056/255였고,
  채널 차이가 8을 넘는 픽셀은 0.052%였다. 저장된 양쪽 PNG를 직접 확인했으며
  표시 누락은 관찰하지 못했다. 원인이 모두 grid 순서 차이라고 단정하지 않는다.
  이후 허용 기준은 채널 차이 8 초과 픽셀 0.1% 이하, 채널 평균 차이 0.1 이하,
  최대 채널 차이 64 이하로 정했다. 모든 변경 비율·평균·최댓값은 원시 기록에 남긴다.
  이는 화면의 근사 비교이며 픽셀 완전 일치나 모든 시각 결함 부재를 보장하지 않는다.
- 해상도 축소·빈 full canvas·예상하지 않은 fallback·무변경·산출물 불일치·픽셀 차이 초과는 실패 처리한다.
- 검증이 실패한 실행은 비교표를 저장하지 않는다.

측정값은 headless Chrome의 제한된 합성 입력 실험이다. 발표 표에는 CPU·브라우저 버전·
입력 규모·반복 횟수·측정 범위를 명시하고, 시연 노트북에서 재실행하여 환경 차이를 확인한다.

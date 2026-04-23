# 회귀 코드 작업공간

이 저장소는 오타마톤/현악기용 악보 편집기 프로젝트의 작업공간이다. 현재 목표는 Google Sheets + Apps Script 기반의 `이세계 코드`를 참고 구현체로 두고, TypeScript + HTML + CSS 기반 웹 앱 `회귀 코드`로 재구성하는 것이다.

## 디렉터리 구성

- `docs/`
  - 현재 설계 및 구현 기준 문서 보관 영역
  - 우선 참조: `HARNESS.md`, `1.0-development-spec.md`, `1.5-note-cell-parser-spec.md`, `1.6-global-cell-parser-spec.md`, `1.7-analyzer-event-list-spec.md`, `1.8-parser-analyzer-pipeline-spec.md`
- `regression-code/`
  - TypeScript 기반 신구현 작업 디렉터리
- `0. 이세계 코드 (legacy)`
  - 기존 Google Sheets / Apps Script 구현체
  - 알고리즘과 기능 흐름 참고용 구버전

## 현재 문서 운용 원칙

- `docs/HARNESS.md`를 문서 허브로 사용한다.
- 설계 판단이 충돌하면 `회귀 코드` 문서를 `이세계 코드`보다 우선한다.
- 문서 본문은 필요 시에만 수정하고, 구현 작업은 가능한 한 `regression-code/`에서 진행한다.

## 현재 문서 체계

- `1.1-project-plan.md`
- `1.2-master-spec.md`

위 두 문서는 현재 separate reference 문서로 유지한다.
기존 transitional document였던 옛 `1.6`은 `docs/` 기준에서 제외되었고, parser 문서 번호는 `1.5`, `1.6`으로 정리하였다.

## 현재 설계 변경 메모

- `cent_num`은 정수가 아니라 실수로 취급한다.
- 허용 범위는 `-100` 이상 `100` 이하로 확장한다.
- 소수점 이하 최대 2자리까지 허용한다.
- cell `rawText` 길이 제한은 `100`이다.
- JSON 파일 크기 제한은 `8MB`이다.

이 변경은 파서/분석기 구현과 문서 재편 시 함께 반영할 예정이며, 아직 일부 참조 문서에는 이전 범위 표기가 남아 있을 수 있다.

## GitHub 공개 기준 정리

다음 항목은 저장소에서 제외한다.

- DOCX 임시 추출물 (`.tmp_docx_*`)
- 압축 중간 산출물 (`.tmp_docx_*.zip`)
- 로컬 작업용 워크스페이스 파일
- 대용량 로컬 동영상 자산 (`*.mp4`)
- `node_modules`, `dist` 등 빌드 산출물

## 다음 작업 후보

- `regression-code/`를 GitHub Pages 배포 가능한 프런트엔드 프로젝트 구조로 확장
- parser / analyzer 타입 초안을 실제 구현 골격으로 연결
- `docs/` 기준 문서 링크와 참조 우선순위 유지

/**
 * 일반 note cell edit 입력을 parser가 읽을 수 있는 rawText 조각으로 합성한다.
 * defaultText와 후속 modifier 조합은 이 모듈에 모은다.
 */

const DEFAULT_TEXT_ESCAPE_CHARS = new Set(["\\", "/", "@", "|", "(", ")", "-", "~"]);

/**
 * 일반 note cell의 Default 영역 입력 상태.
 * - 인수 : 없음
 * - 반환값 : defaultText와 후속 modifier 조합에 사용할 입력 상태
 */
export type DefaultNoteEditInput = {
  customText: string;
};

/**
 * defaultText 입력창 표시 문자열을 note rawText에 저장 가능한 escaped 문자열로 바꾼다.
 * - 인수 : text : 사용자가 입력창에서 보는 표시 문자열
 * - 반환값 : parser가 defaultText로 복원할 수 있는 escaped rawText
 */
export function escapeDefaultTextForNoteRawText(text: string): string {
  let escapedText = "";

  // defaultText 전체를 순회하며 parser 예약문자만 backslash escape로 저장한다.
  for (const char of text) {
    escapedText += DEFAULT_TEXT_ESCAPE_CHARS.has(char) ? `\\${char}` : char;
  }

  return escapedText;
}

/**
 * Default 입력창 값이 삭제 명령으로 취급될 수 있는지 확인한다.
 * - 인수 : text : 사용자가 입력창에서 보는 표시 문자열
 * - 반환값 : 비어 있거나 공백뿐이면 true
 */
export function isEmptyDefaultText(text: string): boolean {
  return text.trim().length === 0;
}

/**
 * 일반 note cell의 Default 입력 상태를 최종 rawText로 합성한다.
 * - 인수 : input : Default 영역 입력 상태
 * - 반환값 : parser가 note cell로 읽을 수 있는 rawText
 */
export function composeDefaultNoteRawText(input: DefaultNoteEditInput): string {
  // 1차 구현은 CUSTOM text만 defaultText로 사용하고 modifier 조합은 후속 단계에서 추가한다.
  return escapeDefaultTextForNoteRawText(input.customText);
}

// src/libs/utils/normalizeDate.ts

/**
 * 점(.) 구분자 yyyy.mm.dd 형식을 하이픈 yyyy-mm-dd 형식으로 변경한다.
 * 그 외 포맷은 별도 처리 없이 트림된 문자열을 그대로 반환한다.
 */
export function normalizeDate(dateStr: string): string {
  const trimmed = dateStr.trim();
  const dotFormat  = /^\d{4}\.\d{1,2}\.\d{1,2}$/;
  const dashFormat = /^\d{4}-\d{1,2}-\d{1,2}$/;
  if (dotFormat.test(trimmed)) {
    const [y, m, d] = trimmed.split('.');
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  if (dashFormat.test(trimmed)) {
    const [y, m, d] = trimmed.split('-');
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  return trimmed;
}
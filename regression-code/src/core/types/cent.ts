export const MIN_CENT_VALUE = -100;
export const MAX_CENT_VALUE = 100;

export type CentValue = number;

export function isCentValueInRange(value: number): value is CentValue {
  return Number.isFinite(value) && value >= MIN_CENT_VALUE && value <= MAX_CENT_VALUE;
}

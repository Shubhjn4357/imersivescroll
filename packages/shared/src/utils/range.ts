import { round } from './round';

export function range(end: number): number[];
export function range(start: number, end: number, step?: number): number[];
export function range(startOrEnd: number, end?: number, step = 1): number[] {
  const start = end === undefined ? 0 : startOrEnd;
  const exclusiveEnd = end === undefined ? startOrEnd : end;
  const resolvedStep =
    end !== undefined && step === 1 && exclusiveEnd < start ? -1 : step;

  if (!Number.isFinite(start) || !Number.isFinite(exclusiveEnd)) {
    throw new RangeError('range() requires finite numeric bounds.');
  }

  if (!Number.isFinite(resolvedStep) || resolvedStep === 0) {
    throw new RangeError('range() requires a non-zero finite step.');
  }

  const values: number[] = [];

  if (resolvedStep > 0) {
    for (
      let currentValue = start;
      currentValue < exclusiveEnd;
      currentValue += resolvedStep
    ) {
      values.push(round(currentValue, 12));
    }

    return values;
  }

  for (
    let currentValue = start;
    currentValue > exclusiveEnd;
    currentValue += resolvedStep
  ) {
    values.push(round(currentValue, 12));
  }

  return values;
}

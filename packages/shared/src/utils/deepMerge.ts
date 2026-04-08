import type { DeepPartial } from '../types/utility';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function deepMerge<TValue>(base: TValue, override: DeepPartial<TValue> | undefined): TValue {
  if (!override) {
    return structuredClone(base);
  }

  if (!isRecord(base) || !isRecord(override)) {
    return override as TValue;
  }

  const output: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const current = output[key];

    if (Array.isArray(value)) {
      output[key] = [...value];
      continue;
    }

    if (isRecord(current) && isRecord(value)) {
      output[key] = deepMerge(current, value);
      continue;
    }

    output[key] = value;
  }

  return output as TValue;
}

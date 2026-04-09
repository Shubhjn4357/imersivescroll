import type { DeepPartial } from '../types/utility';
import { isObject } from './isObject';

export function deepMerge<TValue>(
  base: TValue,
  override: DeepPartial<TValue> | undefined
): TValue {
  if (!override) {
    return structuredClone(base);
  }

  if (!isObject(base) || !isObject(override)) {
    return override as TValue;
  }

  const output: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const current = output[key];

    if (Array.isArray(value)) {
      output[key] = [...value];
      continue;
    }

    if (isObject(current) && isObject(value)) {
      output[key] = deepMerge(current, value);
      continue;
    }

    output[key] = value;
  }

  return output as TValue;
}

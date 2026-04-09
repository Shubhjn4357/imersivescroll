import { toError } from './toError';

export interface SafeJsonParseOptions<TValue> {
  fallback?: TValue;
  reviver?: (this: unknown, key: string, value: unknown) => unknown;
}

export interface SafeJsonParseSuccess<TValue> {
  ok: true;
  data: TValue;
  error: null;
}

export interface SafeJsonParseFailure<TValue> {
  ok: false;
  data: TValue | undefined;
  error: Error;
}

export type SafeJsonParseResult<TValue> =
  | SafeJsonParseSuccess<TValue>
  | SafeJsonParseFailure<TValue>;

export function safeJsonParse<TValue = unknown>(
  input: string,
  options: SafeJsonParseOptions<TValue> = {}
): SafeJsonParseResult<TValue> {
  const { fallback, reviver } = options;

  try {
    return {
      ok: true,
      data: JSON.parse(input, reviver) as TValue,
      error: null
    };
  } catch (error) {
    return {
      ok: false,
      data: fallback,
      error: toError(error)
    };
  }
}

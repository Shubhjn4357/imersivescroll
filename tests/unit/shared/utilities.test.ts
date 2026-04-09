import { describe, expect, it, vi } from 'vitest';
import {
  debounce,
  rafThrottle,
  range,
  round,
  safeJsonParse
} from '@immersive-scroll/shared';

describe('shared utilities', () => {
  it('parses JSON safely and preserves the fallback on failure', () => {
    expect(safeJsonParse<{ ok: boolean }>('{"ok":true}')).toEqual({
      ok: true,
      data: { ok: true },
      error: null
    });

    const failedResult = safeJsonParse('not-json', {
      fallback: { ok: false }
    });

    expect(failedResult.ok).toBe(false);
    expect(failedResult.data).toEqual({ ok: false });
    expect(failedResult.error).toBeInstanceOf(Error);
  });

  it('builds numeric ranges and rounds with precision', () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
    expect(range(5, 1)).toEqual([5, 4, 3, 2]);
    expect(range(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75]);
    expect(round(1.005, 2)).toBe(1.01);
  });

  it('debounces and raf-throttles callbacks', () => {
    vi.useFakeTimers();

    const debouncedSpy = vi.fn();
    const throttledSpy = vi.fn();
    const debounced = debounce(debouncedSpy, 25);
    const throttled = rafThrottle(throttledSpy);

    debounced('first');
    debounced('second');
    expect(debounced.pending()).toBe(true);

    throttled('alpha');
    throttled('beta');
    expect(throttled.pending()).toBe(true);

    vi.advanceTimersByTime(15);
    expect(debouncedSpy).not.toHaveBeenCalled();
    expect(throttledSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(throttledSpy).toHaveBeenCalledTimes(1);
    expect(throttledSpy).toHaveBeenCalledWith('beta');

    vi.advanceTimersByTime(9);
    expect(debouncedSpy).toHaveBeenCalledTimes(1);
    expect(debouncedSpy).toHaveBeenCalledWith('second');

    vi.useRealTimers();
  });
});

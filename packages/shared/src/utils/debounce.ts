export interface DebouncedFunction<
  TCallback extends (...args: unknown[]) => void
> {
  (...args: Parameters<TCallback>): void;
  cancel(): void;
  flush(): void;
  pending(): boolean;
}

export function debounce<TCallback extends (...args: unknown[]) => void>(
  callback: TCallback,
  delay = 0
): DebouncedFunction<TCallback> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<TCallback> | null = null;

  const invoke = () => {
    timeoutId = null;

    if (!lastArgs) {
      return;
    }

    const nextArgs = lastArgs;
    lastArgs = null;
    callback(...nextArgs);
  };

  const debounced = ((...args: Parameters<TCallback>) => {
    lastArgs = args;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(invoke, delay);
  }) as DebouncedFunction<TCallback>;

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = null;
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timeoutId === null) {
      return;
    }

    clearTimeout(timeoutId);
    invoke();
  };

  debounced.pending = () => timeoutId !== null;

  return debounced;
}

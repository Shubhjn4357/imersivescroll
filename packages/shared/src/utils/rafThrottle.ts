type FrameHandle = number | ReturnType<typeof setTimeout>;

export interface RafThrottledFunction<
  TCallback extends (...args: unknown[]) => void
> {
  (...args: Parameters<TCallback>): void;
  cancel(): void;
  flush(): void;
  pending(): boolean;
}

function requestFrame(callback: FrameRequestCallback): FrameHandle {
  if (typeof globalThis.requestAnimationFrame === 'function') {
    return globalThis.requestAnimationFrame(callback);
  }

  return setTimeout(() => callback(Date.now()), 16);
}

function cancelFrame(handle: FrameHandle): void {
  if (typeof globalThis.cancelAnimationFrame === 'function') {
    globalThis.cancelAnimationFrame(handle as number);
    return;
  }

  clearTimeout(handle as ReturnType<typeof setTimeout>);
}

export function rafThrottle<TCallback extends (...args: unknown[]) => void>(
  callback: TCallback
): RafThrottledFunction<TCallback> {
  let frameHandle: FrameHandle | null = null;
  let lastArgs: Parameters<TCallback> | null = null;

  const invoke = () => {
    frameHandle = null;

    if (!lastArgs) {
      return;
    }

    const nextArgs = lastArgs;
    lastArgs = null;
    callback(...nextArgs);
  };

  const throttled = ((...args: Parameters<TCallback>) => {
    lastArgs = args;

    if (frameHandle !== null) {
      return;
    }

    frameHandle = requestFrame(() => {
      invoke();
    });
  }) as RafThrottledFunction<TCallback>;

  throttled.cancel = () => {
    if (frameHandle !== null) {
      cancelFrame(frameHandle);
    }

    frameHandle = null;
    lastArgs = null;
  };

  throttled.flush = () => {
    if (frameHandle !== null) {
      cancelFrame(frameHandle);
    }

    invoke();
  };

  throttled.pending = () => frameHandle !== null;

  return throttled;
}

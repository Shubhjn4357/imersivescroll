export class AssertionError extends Error {
  constructor(message = 'Assertion failed') {
    super(message);
    this.name = 'AssertionError';
  }
}

export function assert(
  condition: unknown,
  message = 'Assertion failed'
): asserts condition {
  if (!condition) {
    throw new AssertionError(message);
  }
}

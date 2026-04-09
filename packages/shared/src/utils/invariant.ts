export class InvariantError extends Error {
  constructor(message = 'Invariant violation') {
    super(message);
    this.name = 'InvariantError';
  }
}

export function invariant(
  condition: unknown,
  message = 'Invariant violation'
): asserts condition {
  if (!condition) {
    throw new InvariantError(message);
  }
}

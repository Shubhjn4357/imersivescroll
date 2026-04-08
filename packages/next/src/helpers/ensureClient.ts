export function ensureClient(): void {
  if (typeof window === 'undefined') {
    throw new Error('Immersive scroll Next adapter must run on the client.');
  }
}

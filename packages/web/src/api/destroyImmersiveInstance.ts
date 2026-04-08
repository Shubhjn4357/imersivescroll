export function destroyImmersiveInstance(instance: { destroy(): void }) {
  instance.destroy();
}

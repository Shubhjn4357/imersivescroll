import { createImmersiveInstance } from '../api/createImmersiveInstance';

export class ImmersiveScrollElement extends HTMLElement {
  private instance: ReturnType<typeof createImmersiveInstance> | null = null;

  connectedCallback() {
    this.instance = createImmersiveInstance({
      container: this,
      framesPath: this.getAttribute('frames-path'),
      manifestPath: this.getAttribute('manifest-path'),
      video: this.getAttribute('video')
    });
  }

  disconnectedCallback() {
    this.instance?.destroy();
    this.instance = null;
  }
}

import { ImmersiveScrollElement } from './ImmersiveScrollElement';

export function registerImmersiveCustomElement(tagName = 'immersive-scroll') {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ImmersiveScrollElement);
  }
}

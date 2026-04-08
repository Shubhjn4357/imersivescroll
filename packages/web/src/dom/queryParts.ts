export function queryParts(container: HTMLElement) {
  return {
    canvas: container.querySelector('canvas'),
    overlay: container.querySelector('div')
  };
}

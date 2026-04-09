export function createContainerStructure(container: HTMLElement) {
  const viewport = document.createElement('div');
  const canvas = document.createElement('canvas');
  const overlay = document.createElement('div');
  const content = document.createElement('div');

  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  viewport.style.position = 'sticky';
  viewport.style.top = '0';
  viewport.style.minHeight = '100vh';
  viewport.style.overflow = 'hidden';
  viewport.style.isolation = 'isolate';

  overlay.style.position = 'absolute';
  overlay.style.inset = '0';
  overlay.style.zIndex = '1';

  content.style.position = 'relative';
  content.style.zIndex = '2';

  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  viewport.appendChild(canvas);
  viewport.appendChild(overlay);
  container.appendChild(viewport);
  container.appendChild(content);

  return { viewport, canvas, overlay, content };
}

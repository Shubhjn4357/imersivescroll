import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { ImmersiveScroll } from 'immersive-scroll';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('ImmersiveScroll', () => {
  it('exports a component', () => {
    expect(typeof ImmersiveScroll).toBe('function');
  });

  it('pins a full-screen viewport by default while keeping content above it', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({
        clearRect: vi.fn(),
        drawImage: vi.fn(),
        fillRect: vi.fn(),
        restore: vi.fn(),
        save: vi.fn(),
        setTransform: vi.fn()
      } as unknown as CanvasRenderingContext2D);
    const requestAnimationFrameSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 1);
    const cancelAnimationFrameSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => undefined);

    await act(async () => {
      root.render(
        <ImmersiveScroll>
          <section>Story content</section>
        </ImmersiveScroll>
      );
    });

    const viewport = container.querySelector<HTMLElement>(
      '[data-immersive-viewport="true"]'
    );
    const content = container.querySelector<HTMLElement>(
      '[data-immersive-content="true"]'
    );

    expect(viewport?.style.position).toBe('fixed');
    expect(viewport?.style.inset).toBe('0');
    expect(viewport?.style.zIndex).toBe('0');
    expect(content?.style.position).toBe('relative');
    expect(content?.style.zIndex).toBe('1');

    await act(async () => {
      root.unmount();
    });

    cancelAnimationFrameSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
    getContextSpy.mockRestore();
    container.remove();
  });
});

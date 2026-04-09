import { afterEach, describe, expect, it } from 'vitest';
import {
  resolveProgressFromScrollY,
  resolveScrollYFromProgress
} from '../../../packages/react/src/utils/scrollMetrics';

function mockViewport(viewportHeight: number, documentHeight: number) {
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: viewportHeight
  });
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 0
  });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: documentHeight
  });
}

describe('scrollMetrics', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 768
    });
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 0
    });
  });

  it('uses the document range when the scene has no internal scroll span', () => {
    mockViewport(1000, 2800);

    const container = document.createElement('div');
    container.getBoundingClientRect = () =>
      ({
        top: 0,
        height: 1000
      }) as DOMRect;

    expect(resolveProgressFromScrollY(900, container)).toBeCloseTo(0.5);
    expect(resolveScrollYFromProgress(0.5, container)).toBeCloseTo(900);
  });

  it('uses the component range when the scene is taller than the viewport', () => {
    mockViewport(1000, 3600);
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 800
    });

    const container = document.createElement('div');
    container.getBoundingClientRect = () =>
      ({
        top: -600,
        height: 2200
      }) as DOMRect;

    expect(resolveProgressFromScrollY(800, container)).toBeCloseTo(0.5);
    expect(resolveScrollYFromProgress(0.5, container)).toBeCloseTo(800);
  });
});

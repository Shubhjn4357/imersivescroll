import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock ResizeObserver which is not present in JSDOM
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock GSAP and ScrollTrigger if needed globally
vi.mock('gsap', () => ({
  default: {
    to: vi.fn(),
    from: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn(),
      add: vi.fn()
    })),
    registerPlugin: vi.fn(),
    context: vi.fn((fn) => {
      const ctx = { revert: vi.fn() };
      fn(ctx);
      return ctx;
    })
  }
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: vi.fn()
}));

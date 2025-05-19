import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vitest } from 'vitest';
expect.extend(matchers);

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vitest.fn().mockImplementation(() => ({
    matchMedia: vitest.fn(),
    addEventListener: vitest.fn(),
    removeEventListener: vitest.fn(),
  })),
});

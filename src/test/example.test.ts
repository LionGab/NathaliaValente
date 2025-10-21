import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  it('should have jest-dom matchers available', () => {
    const element = document.createElement('div');
    element.style.display = 'none';
    expect(element).not.toBeVisible();
  });
});

import { describe, it, expect } from 'vitest';
import { fionaPlaceholder } from '$helpers/placeholders';

describe('Helpers | Placeholders | Fiona placeholder', () => {
  it('should return a generated SVG given a seed', () => {
    const seed = 'testing',
      opts = { width: 1000, height: 400 };

    const placeholder = fionaPlaceholder(seed, opts);

    expect(placeholder).toBeDefined();
    expect(placeholder).toContain('data:image/svg+xml');

    const decodedPlaceholder = decodeURIComponent(placeholder);
    expect(decodedPlaceholder).toContain(`width="${opts.width}"`);
    expect(decodedPlaceholder).toContain(`height="${opts.height}"`);
  });

  it('should consistently return the same SVG given the same seed', () => {
    const seed = 'testing',
      opts = { width: 1000, height: 400 },
      placeholder1 = fionaPlaceholder(seed, opts),
      placeholder2 = fionaPlaceholder(seed, opts),
      placeholder3 = fionaPlaceholder(`${seed}2`, opts);

    [placeholder1, placeholder2, placeholder3].forEach((placeholder) => {
      expect(placeholder).toBeDefined();
      expect(placeholder).toContain('data:image/svg+xml');
    });

    expect(placeholder1).toBe(placeholder2);
    expect(placeholder1).not.toBe(placeholder3);
  });
});

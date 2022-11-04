import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Loader from '../../src/components/loading/full.svelte';

describe('Components | Loader | Full', () => {
  it('should render', () => {
    const { container } = render(Loader);
    expect(container).toBeTruthy();
  });

  it('should contain svg', () => {
    const { container } = render(Loader);

    expect(container.querySelector('div span')).toBeTruthy();
    expect(container.querySelectorAll('span div').length).toBe(3);
  });

  it('should render with default size', () => {
    const { container } = render(Loader);
    const style = (container.querySelector('div span') as HTMLSpanElement)
      ?.style;
    expect(style).toBeTruthy();

    expect(
      style.cssText
        .split(';')
        .filter((item) => item.includes('size'))[0]
        .split(':')[1]
        .trim()
    ).toContain('38px');
  });

  it('should render with default props', () => {
    const { container } = render(Loader);
    const style = (container.querySelector('div span') as HTMLSpanElement)
      ?.style;
    expect(style).toBeTruthy();

    let styles = {} as Record<string, string>;
    style.cssText.split(';').forEach((item) => {
      item.split(':')[0] !== '' &&
        (styles = {
          ...styles,
          [item.split(':')[0].trim()]: item.split(':')[1].trim()
        });
    });

    expect(Object.keys(styles).length).toBe(3);

    const expected = {
      '--size': '38px',
      '--color': '#1E293B',
      '--duration': '1.5s'
    } as Record<string, string>;

    for (const key in expected) {
      expect(styles[key]).toBeTruthy();
      expect(styles[key]).toBe(expected[key]);
    }
  });

  it('should render with dark theme provided', () => {
    const { container } = render(Loader, {
      props: { theme: 'dark' }
    });
    const style = (container.querySelector('div span') as HTMLSpanElement)
      ?.style;
    expect(style).toBeTruthy();

    let styles = {} as Record<string, string>;
    style.cssText.split(';').forEach((item) => {
      item.split(':')[0] !== '' &&
        (styles = {
          ...styles,
          [item.split(':')[0].trim()]: item.split(':')[1].trim()
        });
    });

    expect(Object.keys(styles).length).toBe(3);

    const expected = {
      '--size': '38px',
      '--color': '#F1F5F9',
      '--duration': '1.5s'
    } as Record<string, string>;

    for (const key in expected) {
      expect(styles[key]).toBeTruthy();
      expect(styles[key]).toBe(expected[key]);
    }
  });
});

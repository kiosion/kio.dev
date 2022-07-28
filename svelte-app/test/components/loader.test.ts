import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Loader from '@/components/loader.svelte';

describe('Components | Loader', () => {
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
    const style = container.querySelector('div span').style;
    expect(style).toBeTruthy();

    expect(
      style.cssText
        .split(';')
        .filter((item) => item.includes('size'))[0]
        .split(':')[1]
        .trim()
    ).toContain('38px');
  });

  it('should accept props', () => {
    const { container } = render(Loader, {
      props: { size: '44', color: '#000000' }
    });
    const style = container.querySelector('div span').style;
    expect(style).toBeTruthy();

    let styles = {};
    style.cssText.split(';').forEach((item) => {
      item.split(':')[0] !== '' &&
        (styles = {
          ...styles,
          [item.split(':')[0].trim()]: item.split(':')[1].trim()
        });
    });

    expect(Object.keys(styles).length).toBe(3);

    const expected = {
      '--size': '44px',
      '--color': '#000000',
      '--duration': '1.5s'
    };

    for (const key in expected) {
      expect(styles[key]).toBeTruthy();
      expect(styles[key]).toBe(expected[key]);
    }
  });
});

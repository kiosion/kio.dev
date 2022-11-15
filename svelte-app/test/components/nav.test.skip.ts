import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Nav from '../../src/components/nav/nav.svelte';

describe.skip('Components | Nav', () => {
  it.skip('should render', () => {
    const { container } = render(Nav);
    expect(container).toBeTruthy();
  });

  it.skip('should contain correct links', () => {
    const { container } = render(Nav);

    const expectedLinks = ['Blog', 'Work', 'About'];

    expectedLinks.forEach((item) => {
      expect(container.querySelector(`a[aria-label="${item}"]`)).toBeTruthy();
    });

    const expectedSocials = [
      'twitter.com/0xKI0',
      'github.com/kiosion',
      'discord.gg/kiosion'
    ];

    expectedSocials.forEach((item) => {
      expect(container.querySelector(`a[href="https://${item}"]`)).toBeTruthy();
    });
  });
});

import { describe, expect, it } from 'vitest';

import { normalizePathname, pathnameGroupKey } from '../../src/lib/utils';

// These drive the {#key}-ed page-transition group and nav highlighting; if they
// regress, transitions replay wrong / nav breaks. Pure, deterministic — no flake.
describe('pathnameGroupKey', () => {
  it('collapses /thoughts and tag routes into one group', () => {
    expect(pathnameGroupKey('/thoughts')).toBe('/thoughts');
    expect(pathnameGroupKey('/thoughts/+/security')).toBe('/thoughts');
  });

  it('leaves individual posts and other routes ungrouped', () => {
    expect(pathnameGroupKey('/thoughts/some-post')).toBe('/thoughts/some-post');
    expect(pathnameGroupKey('/')).toBe('/');
    expect(pathnameGroupKey('/etc')).toBe('/etc');
  });
});

describe('normalizePathname', () => {
  it('defaults empty/undefined to root', () => {
    expect(normalizePathname(undefined)).toBe('/');
    expect(normalizePathname('')).toBe('/');
  });

  it('strips a trailing slash but preserves root', () => {
    expect(normalizePathname('/thoughts/')).toBe('/thoughts');
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('/etc')).toBe('/etc');
  });
});

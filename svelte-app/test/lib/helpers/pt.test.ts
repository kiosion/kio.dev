import { describe, expect, it } from 'vitest';
import { getTotalWords, getHeadings, type Heading } from '$helpers/pt';
import { postBody } from '../../fixtures/pt';

describe('Helpers | Portable Text | getTotalWords', () => {
  it('should return all words as array from portable text block', () => {
    const words = getTotalWords(postBody);
    expect(words).toBeDefined();
    expect(words).toHaveLength(31);
  });
});

describe('Helpers | Portable Text | getHeadings', () => {
  it('should return headings as tree array from portable text block', async () => {
    const headings = await getHeadings(postBody);
    expect(headings).toBeDefined();
    expect(headings).toHaveLength(2);
    // Expect 0 children for the first top-level heading
    expect(headings[0].children).toHaveLength(0);
    // Expect 3 children for the second top-level heading
    expect(headings[1].children).toHaveLength(3);
    expect(headings[1].children[0].children).toHaveLength(1);
    expect(headings[1].children[0].children[0].children).toHaveLength(1);
    expect(
      headings[1].children[0].children[0].children[0].children
    ).toHaveLength(1);
    expect(
      headings[1].children[0].children[0].children[0].children[0].children
    ).toHaveLength(0);
  });

  it('should assign correct properties to headings', async () => {
    const headings = await getHeadings(postBody);
    // For all headings, expect props to be defined and of correct types
    headings.forEach((heading: Heading) => {
      const checkProps = (heading: Heading) => {
        expect(heading.text).toBeDefined();
        expect(heading.key).toBeDefined();
        expect(heading.type).toBeDefined();
        expect(heading.children).toBeDefined();
        expect(typeof heading.text).toBe('string');
        expect(typeof heading.key).toBe('string');
        expect(typeof heading.type).toBe('string');
        expect(Array.isArray(heading.children)).toBe(true);
        heading.children.forEach((child) => {
          checkProps(child);
        });
      };
      checkProps(heading);
    });
  });
});

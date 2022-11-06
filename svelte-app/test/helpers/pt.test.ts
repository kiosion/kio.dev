import { describe, expect, it } from 'vitest';
import { getTotalWords, getHeadings, type Heading } from '$helpers/pt';
import { postBody } from '../fixtures/pt';

describe('Helpers | Portable Text | getTotalWords', () => {
  it('should return all words as array from portable text block', () => {
    const words = getTotalWords(postBody);
    expect(words).toBeDefined();
    expect(words).toHaveLength(31);
  });
});

describe('Helpers | Portable Text | getHeadings', () => {
  it('should return headings as tree array from portable text block', () => {
    const headings = getHeadings(postBody);
    expect(headings).toBeDefined();
    // Expect 4 top-level headings
    expect(headings).toHaveLength(4);
    // Expect 0 children for the first top-level heading
    expect(headings[0].children).toHaveLength(0);
    // Expect 1 child for the second top-level heading, and its child + grandchild
    expect(headings[1].children).toHaveLength(1);
    expect(headings[1].children[0].children).toHaveLength(1);
    expect(headings[1].children[0].children[0].children).toHaveLength(1);
    // Expect 1 child for the third top-level heading
    expect(headings[2].children).toHaveLength(1);
    // Expect no children for the fourth top-level heading
    expect(headings[3].children).toHaveLength(0);
  });

  it('should assign correct properties to headings', () => {
    const headings = getHeadings(postBody);
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

interface MdNode {
  type: string;
  children?: MdNode[];
  value?: string;
  depth?: number;
  ordered?: boolean;
  spread?: boolean;
  identifier?: string;
  data?: { hProperties?: Record<string, unknown> };
}

type MdRoot = MdNode & { children: MdNode[] };

/**
 * Collapse multi-line ("block") footnote definitions into the single-line form
 * before mdsvex/remark parses them.
 */
export const flattenFootnoteDefinitions = (source: string): string => {
  const lines = source.split('\n');
  const out: string[] = [];
  let inFence = false;
  let fence = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!inFence) {
        inFence = true;
        fence = marker;
      } else if (fence === marker) {
        inFence = false;
      }
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    const match = line.match(/^\[\^([^\]]+)\]:[ \t]*$/);
    if (match) {
      const parts: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^[ \t]+\S/.test(lines[j])) {
        parts.push(lines[j].trim());
        j++;
      }
      if (parts.length > 0) {
        out.push(`[^${match[1]}]: ${parts.join(' ')}`);
        i = j - 1;
        continue;
      }
    }

    out.push(line);
  }

  return out.join('\n');
};

/**
 * Svelte preprocessor wrapping {@link flattenFootnoteDefinitions}. Must run
 * before mdsvex in the `preprocess` array so it sees raw markdown. Only `.md`
 * files are touched.
 */
export const footnotePreprocess = () => ({
  name: 'flatten-footnote-defs',
  markup: ({ content, filename }: { content: string; filename?: string }) => {
    if (!filename?.endsWith('.md')) {
      return;
    }
    return { code: flattenFootnoteDefinitions(content) };
  },
});

export default function remarkFootnotes() {
  return (tree: MdRoot) => {
    // id (without leading ^) -> definition children
    const definitions = new Map<string, MdNode[]>();

    // pass 1: pull footnote-definition paragraphs out of body
    tree.children = tree.children.filter((node) => {
      if (node.type !== 'paragraph' || !node.children?.length) {
        return true;
      }
      const first = node.children[0];
      if (first?.type !== 'linkReference') {
        return true;
      }
      const ident = first.identifier ?? '';
      if (!ident.startsWith('^')) {
        return true;
      }
      const second = node.children[1];
      if (second?.type !== 'text' || !second.value?.startsWith(':')) {
        return true;
      }

      const id = ident.slice(1);
      const trimmed = second.value.replace(/^:\s*/, '');
      const remaining: MdNode[] = [];
      if (trimmed.length > 0) {
        remaining.push({ type: 'text', value: trimmed });
      }
      remaining.push(...node.children.slice(2));
      definitions.set(id, remaining);
      return false;
    });

    // pass 2: walk the tree, replace [^id] linkReference nodes with sups
    const refOrder: string[] = [];
    transformLinkReferences(tree, refOrder);

    // pass 3: append the footnotes section if anything was referenced
    if (refOrder.length > 0) {
      tree.children.push(
        {
          type: 'heading',
          depth: 2,
          data: { hProperties: { class: 'footnotes-heading' } },
          children: [{ type: 'text', value: 'Footnotes' }],
        },
        {
          type: 'list',
          ordered: true,
          spread: false,
          data: { hProperties: { class: 'footnotes' } },
          children: refOrder.map((id) => ({
            type: 'listItem',
            data: { hProperties: { id: `fn-${id}` } },
            children: [
              {
                type: 'paragraph',
                children: [
                  ...(definitions.get(id) ?? [{ type: 'text', value: '' }]),
                  {
                    type: 'html',
                    value: ` <a href="#fnref-${id}" class="footnote-backref" aria-label="Back to content">↩</a>`,
                  },
                ],
              },
            ],
          })),
        },
      );
    }
  };
}

function transformLinkReferences(node: MdNode, refOrder: string[]): void {
  if (!node.children) {
    return;
  }
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === 'linkReference' && (child.identifier ?? '').startsWith('^')) {
      const id = (child.identifier as string).slice(1);
      if (!refOrder.includes(id)) {
        refOrder.push(id);
      }
      const num = refOrder.indexOf(id) + 1;
      node.children[i] = {
        type: 'html',
        value: `&nbsp;<sup class="footnote-ref" id="fnref-${id}"><a href="#fn-${id}">${num}</a></sup>`,
      };
    } else {
      transformLinkReferences(child, refOrder);
    }
  }
}

/**
 * Tiny remark plugin that adds GFM-style footnote support for mdsvex 0.12.
 *
 * mdsvex bundles its own remark-parse and applies user remarkPlugins AFTER
 * parsing, so syntax-extending plugins like remark-gfm can't actually hook
 * the tokenizer. mdsvex's parser treats `[^id]` as a `linkReference` node
 * (identifier `^id`), so we transform those rather than scanning text.
 *
 *   - Root paragraphs that start with a `linkReference[identifier=^*]`
 *     followed by a text node beginning with `:` → captured as definitions
 *     and stripped from the body.
 *   - Other `linkReference[identifier=^*]` nodes anywhere → replaced with
 *     <sup><a></a></sup> linking to the definition at the bottom.
 *
 * Numbering follows the order references first appear; an unused definition
 * is silently dropped.
 */

/**
 * @typedef {Object} MdNode
 * @property {string} type
 * @property {MdNode[]} [children]
 * @property {string} [value]
 * @property {number} [depth]
 * @property {boolean} [ordered]
 * @property {boolean} [spread]
 * @property {string} [identifier]
 * @property {{ hProperties?: Record<string, unknown> }} [data]
 */

/** @typedef {MdNode & { children: MdNode[] }} MdRoot */

export default function remarkFootnotes() {
  return (/** @type {MdRoot} */ tree) => {
    /** @type {Map<string, MdNode[]>} id (without leading ^) → definition children */
    const definitions = new Map();

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
      /** @type {MdNode[]} */
      const remaining = [];
      if (trimmed.length > 0) {
        remaining.push({ type: 'text', value: trimmed });
      }
      remaining.push(...node.children.slice(2));
      definitions.set(id, remaining);
      return false;
    });

    // pass 2: walk the tree, replace [^id] linkReference nodes with sups
    /** @type {string[]} */
    const refOrder = [];
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

/**
 * @param {MdNode} node
 * @param {string[]} refOrder
 */
function transformLinkReferences(node, refOrder) {
  if (!node.children) {
    return;
  }
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === 'linkReference' && (child.identifier ?? '').startsWith('^')) {
      const id = /** @type {string} */ (child.identifier).slice(1);
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

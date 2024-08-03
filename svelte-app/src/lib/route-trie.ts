class TrieNode {
  children: Record<string, TrieNode> = {};
  isWildcard: boolean = false;
  index: number | null = null;
}

export default class RouteTrie {
  root: TrieNode = new TrieNode();

  insert(route: string, index: number) {
    let node = this.root;
    const parts = route.split('/').filter(Boolean);
    parts.forEach((part, i) => {
      if (!node.children[part]) {
        node.children[part] = new TrieNode();
      }
      node = node.children[part];
      if (part === '*') {
        node.isWildcard = true;
      }
    });
    node.index = index;
  }

  search(route: string): number | null {
    const node = this.root;
    const parts = route.split('/').filter(Boolean);
    let bestMatchIndex: number | null = null;
    let bestMatchDepth = -1;

    function searchNode(node: TrieNode, depth: number) {
      if (depth > bestMatchDepth && node.index !== null) {
        bestMatchIndex = node.index;
        bestMatchDepth = depth;
      }
      if (depth >= parts.length) {
        return;
      }

      const part = parts[depth];
      if (node.children[part]) {
        searchNode(node.children[part], depth + 1);
      }
      if (node.children['*']) {
        searchNode(node.children['*'], depth + 1);
      }
    }

    searchNode(node, 0);
    return bestMatchIndex;
  }
}

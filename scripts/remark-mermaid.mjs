/** Turn ```mermaid fences into raw HTML so Shiki does not rewrite the source. */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function transform(node) {
  if (!node || typeof node !== "object" || !Array.isArray(node.children)) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child?.type === "code" && child.lang === "mermaid") {
      node.children[i] = {
        type: "html",
        value: `<div class="mermaid">${escapeHtml(child.value)}</div>`,
      };
      continue;
    }
    transform(child);
  }
}

export function remarkMermaid() {
  return (tree) => transform(tree);
}

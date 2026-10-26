import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { topicsRaw, seriesDefinitions } from "./catalog-data.mjs";
import { topicSlug } from "./slugify.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentDir = path.join(root, "src", "content", "topics");
const catalogPath = path.join(root, "src", "data", "catalog.json");

const seriesByTopicId = new Map();
for (const series of seriesDefinitions) {
  for (const id of series.topicIds) {
    const list = seriesByTopicId.get(id) ?? [];
    list.push(series.slug);
    seriesByTopicId.set(id, list);
  }
}

const tierOrder = { basic: 0, intermediate: 1, advanced: 2 };
const sorted = [...topicsRaw].sort((a, b) => {
  const td = tierOrder[a.tier] - tierOrder[b.tier];
  if (td !== 0) return td;
  return a.id.localeCompare(b.id, undefined, { numeric: true });
});

if (sorted.length !== 300) {
  console.warn(`Expected 300 topics, found ${sorted.length}`);
}

const catalog = sorted.map((t, index) => {
  const slug = topicSlug(t.id, t.title);
  const series = seriesByTopicId.get(t.id) ?? [];
  return {
    id: t.id,
    tier: t.tier,
    category: t.category,
    title: t.title,
    slug,
    series,
    publishOrder: index + 1,
    status: "draft",
    href: `/${t.tier}/${slug}/`,
  };
});

fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
fs.writeFileSync(catalogPath, JSON.stringify({ topics: catalog, series: seriesDefinitions }, null, 2));

let created = 0;
let skipped = 0;

for (const topic of catalog) {
  const dir = path.join(contentDir, topic.tier);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${topic.slug}.mdx`);
  if (fs.existsSync(filePath)) {
    skipped++;
    continue;
  }

  const seriesYaml =
    topic.series.length > 0 ? `series:\n${topic.series.map((s) => `  - ${s}`).join("\n")}\n` : "series: []\n";

  const body = `---
id: ${topic.id}
tier: ${topic.tier}
category: "${topic.category.replace(/"/g, '\\"')}"
title: "${topic.title.replace(/"/g, '\\"')}"
slug: ${topic.slug}
publishOrder: ${topic.publishOrder}
status: draft
${seriesYaml}---

> **Draft placeholder** — target length 1,500–2,500 words: concept, trade-offs, diagram, failure modes, and one real-world example.

## Concept

_TODO_

## Trade-offs

| Approach | When it wins | Cost / risk |
| -------- | ------------ | ----------- |
| _TODO_   |              |             |

## Diagram

\`\`\`mermaid
flowchart TB
  subgraph placeholder["Replace with system diagram"]
    Client[Client] --> Service[Service]
  end
\`\`\`

## Failure modes

- _TODO_

## Real-world example

_TODO_
`;

  fs.writeFileSync(filePath, body, "utf8");
  created++;
}

console.log(`Catalog: ${catalogPath}`);
console.log(`MDX stubs created: ${created}, skipped (existing): ${skipped}`);

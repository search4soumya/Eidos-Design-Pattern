import catalogJson from "../data/catalog.json";

export type Tier = "basic" | "intermediate" | "advanced";

export type TopicMeta = {
  id: string;
  tier: Tier;
  category: string;
  title: string;
  slug: string;
  series: string[];
  publishOrder: number;
  status: "draft" | "published";
  href: string;
};

export type SeriesMeta = {
  slug: string;
  title: string;
  description: string;
  topicIds: string[];
};

export const catalog = catalogJson as { topics: TopicMeta[]; series: SeriesMeta[] };

export const tierLabels: Record<Tier, { label: string; code: string; blurb: string }> = {
  basic: {
    code: "B",
    label: "Basic",
    blurb: "Foundations, vocabulary, and core building blocks for every engineer.",
  },
  intermediate: {
    code: "I",
    label: "Intermediate",
    blurb: "Distributed patterns, data and messaging, reliability, and classic case studies.",
  },
  advanced: {
    code: "A",
    label: "Advanced",
    blurb: "Consensus, storage internals, planet-scale design, and large case studies.",
  },
};

export function topicsByTier(tier: Tier): TopicMeta[] {
  return catalog.topics.filter((t) => t.tier === tier);
}

export function topicsByCategory(tier: Tier): Map<string, TopicMeta[]> {
  const map = new Map<string, TopicMeta[]>();
  for (const t of topicsByTier(tier)) {
    const list = map.get(t.category) ?? [];
    list.push(t);
    map.set(t.category, list);
  }
  return map;
}

export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type CategoryGroup = {
  name: string;
  slug: string;
  topics: TopicMeta[];
};

/** Categories in first-seen catalog order, spanning every tier. */
export function categoriesInOrder(): CategoryGroup[] {
  const map = new Map<string, TopicMeta[]>();
  for (const topic of catalog.topics) {
    const list = map.get(topic.category) ?? [];
    list.push(topic);
    map.set(topic.category, list);
  }
  return [...map.entries()].map(([name, topics]) => ({
    name,
    slug: categorySlug(name),
    topics,
  }));
}

export function seriesWithTopics(slug: string) {
  const series = catalog.series.find((s) => s.slug === slug);
  if (!series) return null;
  const byId = new Map(catalog.topics.map((t) => [t.id, t]));
  const topics = series.topicIds.map((id) => byId.get(id)).filter(Boolean) as TopicMeta[];
  return { ...series, topics };
}

export function topicPath(t: Pick<TopicMeta, "tier" | "slug">): string {
  return `/${t.tier}/${t.slug}/`;
}

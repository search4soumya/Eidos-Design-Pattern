import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const topics = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/topics" }),
  schema: z.object({
    id: z.string(),
    tier: z.enum(["basic", "intermediate", "advanced"]),
    category: z.string(),
    title: z.string(),
    slug: z.string(),
    publishOrder: z.number(),
    status: z.enum(["draft", "published"]),
    series: z.array(z.string()).default([]),
  }),
});

export const collections = { topics };

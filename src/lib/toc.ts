import type { MarkdownHeading } from "astro";

export type TocSection = {
  slug: string;
  text: string;
  children: { slug: string; text: string }[];
};

/** Build a two-level TOC from h2 (sections) and h3 (subsections). */
export function buildToc(headings: MarkdownHeading[]): TocSection[] {
  const sections: TocSection[] = [];
  let current: TocSection | null = null;

  for (const heading of headings) {
    if (heading.depth === 2) {
      current = { slug: heading.slug, text: heading.text, children: [] };
      sections.push(current);
    } else if (heading.depth === 3 && current) {
      current.children.push({ slug: heading.slug, text: heading.text });
    }
  }

  return sections;
}

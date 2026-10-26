export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function topicSlug(id, title) {
  return `${id.toLowerCase()}-${slugify(title)}`;
}

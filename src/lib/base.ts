const raw = import.meta.env.BASE_URL || "/";

/** Astro's BASE_URL may omit the trailing slash; page links need it. */
export const baseUrl = raw.endsWith("/") ? raw : `${raw}/`;

/**
 * Sanity environment. `hasSanity` gates the whole integration: when the project id is
 * absent (e.g. before setup, or a build without secrets), the Journal transparently
 * falls back to the local seed content — so the site always builds and never breaks.
 */
export const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '').trim();
export const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim();
export const apiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01').trim();

/** True once a Sanity project is configured. */
export const hasSanity = projectId.length > 0;

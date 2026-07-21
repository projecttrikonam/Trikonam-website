import { createClient, type SanityClient } from '@sanity/client';
import { projectId, dataset, apiVersion, hasSanity } from './env';

/**
 * Read-only Sanity client for build-time fetching. `useCdn: true` + `perspective:
 * 'published'` means we only ever pull published content through Sanity's fast CDN —
 * ideal for the static build. `null` when Sanity isn't configured (the data layer then
 * uses the local seed).
 */
export const client: SanityClient | null = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null;

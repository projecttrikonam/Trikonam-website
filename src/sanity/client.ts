import { createClient, type SanityClient } from '@sanity/client';
import { projectId, dataset, apiVersion, hasSanity } from './env';

/**
 * Read-only Sanity client for build-time fetching. `useCdn: false` + `perspective:
 * 'published'` means each static build pulls fresh, uncached published content directly
 * from the API. This matters because builds are triggered by the publish webhook: the
 * API-CDN is eventually-consistent and can serve stale data for up to ~a minute after a
 * publish, so a CDN-backed build racing the webhook would bake in the pre-edit content.
 * The client only runs at build time (static export), so there's no per-request CDN
 * benefit to trade away. `null` when Sanity isn't configured (the data layer then uses
 * the local seed).
 */
export const client: SanityClient | null = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: 'published',
    })
  : null;

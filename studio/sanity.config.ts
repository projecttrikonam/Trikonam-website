import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { journalStructure } from './structure';

/**
 * Trikonam Journal — Sanity Studio (v3).
 *
 * A single, focused workspace for the Journal. The desk is organised as
 * Journal → Articles / Categories / Series / Authors / Tags (see structure.ts), so
 * publishing feels simple. Vision (GROQ playground) is included for debugging.
 *
 * projectId/dataset come from env (SANITY_STUDIO_*) so the same config runs for
 * `sanity dev`, `sanity build`, and `sanity deploy`.
 */
export default defineConfig({
  name: 'trikonam-journal',
  title: 'Trikonam Journal',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({ structure: journalStructure }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: {
    types: schemaTypes,
  },
});

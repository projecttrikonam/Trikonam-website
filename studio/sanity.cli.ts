import { defineCliConfig } from 'sanity/cli';

/**
 * CLI config — used by `sanity dev`, `sanity build`, `sanity deploy`, and
 * `sanity dataset import`. Fill in projectId after running `sanity init`
 * (or paste your existing project id). Dataset is `production`.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /** Deploys to https://<studioHost>.sanity.studio — set with `sanity deploy`. */
  studioHost: 'trikonam',
  autoUpdates: true,
});

import { article } from './documents/article';
import { category } from './documents/category';
import { series } from './documents/series';
import { author } from './documents/author';
import { tag } from './documents/tag';

import { blockContent } from './objects/blockContent';
import { callout } from './objects/callout';
import { gallery } from './objects/gallery';
import { videoEmbed } from './objects/videoEmbed';
import { pullQuote } from './objects/pullQuote';
import { seo } from './objects/seo';

export const schemaTypes = [
  // Documents
  article,
  category,
  series,
  author,
  tag,
  // Objects
  blockContent,
  callout,
  gallery,
  videoEmbed,
  pullQuote,
  seo,
];

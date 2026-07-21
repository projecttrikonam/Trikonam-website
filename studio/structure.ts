import type { StructureResolver } from 'sanity/structure';

/**
 * Desk structure — a single, simple "Journal" section:
 *   Journal → Articles / Categories / Series / Authors / Tags
 * so writing and organising feels straightforward.
 */
export const journalStructure: StructureResolver = (S) =>
  S.list()
    .title('Journal')
    .items([
      S.listItem()
        .title('Articles')
        .child(S.documentTypeList('article').title('Articles').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])),
      S.divider(),
      S.listItem().title('Categories').child(S.documentTypeList('category').title('Categories')),
      S.listItem().title('Series').child(S.documentTypeList('series').title('Series')),
      S.listItem().title('Authors').child(S.documentTypeList('author').title('Authors')),
      S.listItem().title('Tags').child(S.documentTypeList('tag').title('Tags')),
    ]);

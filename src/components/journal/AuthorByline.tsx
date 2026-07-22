import type { Author } from '@/content/journal/types';

/** Author card shown at the foot of an article — photo, name, designation, bio, socials. */
export function AuthorByline({ author }: { author: Author }) {
  return (
    <>
      {/* Quiet close to the article body before the byline. */}
      <div
        aria-hidden
        className="prose-measure mx-auto mt-14 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
      <div className="prose-measure mx-auto mt-10 flex flex-col gap-5 rounded-[14px] border border-border/70 bg-surface/40 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-7">
        {author.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.photo}
            alt={author.name}
            loading="lazy"
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-black/5"
          />
        ) : (
          <span aria-hidden className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-bg-alt font-serif text-[1.5rem] text-moss">
            {author.name.charAt(0)}
          </span>
        )}
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.16em] text-secondary">Written by</p>
          <p className="mt-1 font-serif text-[1.25rem] text-primary">{author.name}</p>
          {(author.designation || author.role) && (
            <p className="text-[0.85rem] text-moss">{author.designation ?? author.role}</p>
          )}
          {author.bio && <p className="mt-3 text-body text-secondary">{author.bio}</p>}
          {author.socials && author.socials.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {author.socials.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.8rem] font-medium text-moss hover:text-moss-dark"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

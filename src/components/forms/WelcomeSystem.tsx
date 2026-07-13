'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { FieldGrid, FieldFull, SubmitButton } from './fields';
import { Confirmation } from './Confirmation';
import { useFormSubmit } from './useFormSubmit';
import { journeys, getJourney, type Journey, type JourneyField } from '@/content/registration';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * The Trikonam Welcome System (v2.1) — one premium registration experience for the whole
 * site. Step 1: choose a journey. Step 2: only the relevant questions appear (driven by
 * the journey's field schema in content/registration.ts). Step 3: a warm confirmation.
 *
 * A `?journey=<id>` query deep-links straight to a journey's form (e.g. from an Online
 * Programs "Begin Your Journey" button), with a quiet way back to the chooser.
 */
export function WelcomeSystem() {
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState<Journey | null>(null);
  const [prefill, setPrefill] = useState<Record<string, string>>({});

  // Deep-link: ?journey=<id> jumps to that form; any other params (e.g. ?practice= or
  // ?program=) pre-fill the matching field. Static-export friendly — no Suspense.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const map: Record<string, string> = {};
    params.forEach((value, key) => {
      if (key !== 'journey') map[key] = value;
    });
    setPrefill(map);
    const id = params.get('journey');
    if (id) {
      const j = getJourney(id);
      if (j) setSelected(j);
    }
  }, []);

  if (selected) {
    return (
      <JourneyForm
        journey={selected}
        prefill={prefill}
        onBack={() => {
          setSelected(null);
          setPrefill({});
          // Clear the query so a refresh returns to the chooser.
          if (typeof window !== 'undefined') window.history.replaceState(null, '', '/begin');
        }}
      />
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow eyebrow--tick mx-auto mb-5 w-fit">Choose Your Journey</span>
        <h2 className="text-balance font-serif text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.25] text-primary">
          Where would you like to begin?
        </h2>
      </div>
      <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {journeys.map((j, i) => (
          <motion.li
            key={j.id}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setSelected(j)}
              className="group flex h-full w-full flex-col rounded-[12px] surface-elevated p-6 text-left ring-1 ring-black/[0.04] transition-all duration-500 ease-calm hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <h3 className="font-serif text-[1.2rem] leading-snug text-primary">{j.label}</h3>
              <p className="mt-2 flex-1 text-body text-secondary">{j.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-moss">
                Continue
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const inputClass =
  'w-full rounded-[8px] border border-border bg-surface/70 px-4 py-3 text-body text-primary placeholder:text-secondary/50 transition-colors duration-200 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/25';
const labelClass = 'mb-2 block text-[0.8rem] font-medium tracking-[0.02em] text-primary';

/** Renders one journey's field schema and submits it through the unified backend. */
function JourneyForm({
  journey,
  prefill = {},
  onBack,
}: {
  journey: Journey;
  prefill?: Record<string, string>;
  onBack: () => void;
}) {
  const { status, submit } = useFormSubmit();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {
      category: journey.id,
      journey: journey.label,
      sheet: journey.sheet,
    };
    for (const field of journey.fields) {
      data[field.name] = ((fd.get(field.name) as string) ?? '').trim();
    }
    submit(data);
  }

  if (status === 'success') return <Confirmation />;

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={onBack}
        className="link-underline mb-8 inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.16em] text-moss"
      >
        <span aria-hidden>←</span> Choose a different journey
      </button>

      <span className="eyebrow eyebrow--tick mb-4">{journey.label}</span>
      <p className="prose-measure mb-9 text-body-lg text-secondary">{journey.blurb}</p>

      <form onSubmit={onSubmit} className="space-y-6">
        <FieldGrid>
          {journey.fields.map((field) =>
            field.full ? (
              <FieldFull key={field.name}>
                <Field field={field} initial={prefill[field.name]} />
              </FieldFull>
            ) : (
              <Field key={field.name} field={field} initial={prefill[field.name]} />
            ),
          )}
        </FieldGrid>

        <div className="pt-2">
          <SubmitButton pending={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : journey.submitLabel}
          </SubmitButton>
          {status === 'error' && (
            <p className="mt-4 text-body text-secondary">
              We opened your email app as a fallback — please send that message, or write to us
              directly and we&apos;ll take care of it.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

/** One schema-driven field (uncontrolled; read via FormData on submit). `initial`
 *  pre-fills the field from a query param (e.g. a pre-selected practice). */
function Field({ field, initial }: { field: JourneyField; initial?: string }) {
  const req = field.required;
  return (
    <div>
      <label htmlFor={field.name} className={labelClass}>
        {field.label}
        {req && <span aria-hidden className="ml-0.5 text-moss">*</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          name={field.name}
          required={req}
          placeholder={field.placeholder}
          defaultValue={initial}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      ) : field.type === 'select' ? (
        <div className="relative">
          <select
            id={field.name}
            name={field.name}
            required={req}
            defaultValue={initial ?? ''}
            className={`${inputClass} appearance-none pr-10`}
          >
            <option value="" disabled={req}>
              Select…
            </option>
            {field.optionGroups
              ? field.optionGroups.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </optgroup>
                ))
              : field.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-moss">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          required={req}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          defaultValue={initial}
          className={inputClass}
        />
      )}
    </div>
  );
}

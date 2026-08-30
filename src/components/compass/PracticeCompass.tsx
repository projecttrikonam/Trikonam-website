'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BreathMark } from '@/components/ui/BreathMark';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import {
  questions,
  computeCompass,
  type AnswerMap,
  type CompassResult,
} from '@/content/assessment';

/**
 * The Trikonam Practice Assessment → Practice Compass (2026 refinement).
 *
 * A ten-step self-enquiry, one question per screen, ending in a Practice Compass rather
 * than a score. The recommendation logic lives in src/content/assessment.ts
 * (computeCompass) — this component only collects answers and renders the result.
 *
 * All "I'm Interested" / "Join the Practice" actions open WhatsApp with a pre-filled
 * message; there is no checkout. Works on mobile and desktop; motion respects
 * prefers-reduced-motion.
 */
export function PracticeCompass() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0); // 0..questions.length-1, then === length → result
  const [answers, setAnswers] = useState<AnswerMap>({});

  // The first question must simply be present on load; only fade subsequent steps.
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  const total = questions.length;
  const isResult = step >= total;
  const q = questions[step];

  const result: CompassResult | null = useMemo(
    () => (isResult ? computeCompass(answers) : null),
    [isResult, answers],
  );

  const answered = (() => {
    if (isResult) return true;
    const a = answers[q.id];
    return q.multi ? Array.isArray(a) && a.length > 0 : typeof a === 'string' && a.length > 0;
  })();

  function selectSingle(value: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }
  function toggleMulti(value: string) {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[q.id]) ? (prev[q.id] as string[]) : [];
      const exclusive = ['none', 'private'];
      let next: string[];
      if (exclusive.includes(value)) {
        next = cur.includes(value) ? [] : [value];
      } else {
        next = cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur.filter((v) => !exclusive.includes(v)), value];
      }
      return { ...prev, [q.id]: next };
    });
  }

  // A keyed remount gives each step a quiet fade-in. No AnimatePresence / mode="wait"
  // here on purpose: a no-op exit transition under prefers-reduced-motion can leave that
  // pattern deadlocked on the outgoing child. `initial={false}` skips the enter fade
  // when motion is reduced.
  const fade = {
    initial: mounted.current && !reduced ? { opacity: 0, y: 10 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      {!isResult && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-micro uppercase tracking-[0.16em] text-secondary">
            <span>
              Question {step + 1} of {total}
            </span>
            <span>Practice Compass</span>
          </div>
          <div className="mt-3 h-px w-full bg-border">
            <div
              className="h-px bg-moss transition-[width] duration-500 ease-calm"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div>
        {!isResult ? (
          <motion.form
            key={q.id}
            {...fade}
            onSubmit={(e) => {
              e.preventDefault();
              if (answered) setStep((s) => s + 1);
            }}
          >
            <fieldset>
              <legend className="font-serif text-[clamp(1.35rem,2.6vw,1.9rem)] leading-[1.28] text-primary">
                {q.title}
              </legend>
              {q.help && (
                <p className="mt-3 text-caption text-secondary">{q.help}</p>
              )}
              {q.multi && (
                <p className="mt-2 text-micro uppercase tracking-[0.14em] text-moss">Select all that apply</p>
              )}

              <ul className="mt-7 space-y-3">
                {q.options.map((opt) => {
                  const selected = q.multi
                    ? Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(opt.value)
                    : answers[q.id] === opt.value;
                  return (
                    <li key={opt.value}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-[10px] border px-5 py-4 text-body transition-colors duration-200 ${
                          selected
                            ? 'border-moss bg-moss/[0.07] text-primary'
                            : 'border-border bg-bg text-secondary hover:border-moss/50 hover:bg-moss/[0.03]'
                        }`}
                      >
                        <input
                          type={q.multi ? 'checkbox' : 'radio'}
                          name={q.id}
                          value={opt.value}
                          checked={selected}
                          onChange={() => (q.multi ? toggleMulti(opt.value) : selectSingle(opt.value))}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                            q.multi ? 'rounded-[4px]' : 'rounded-full'
                          } ${selected ? 'border-moss bg-moss' : 'border-border'}`}
                        >
                          {selected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span>{opt.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="text-fine font-medium uppercase tracking-[0.12em] text-secondary transition-colors enabled:hover:text-moss disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!answered}
                className="inline-flex items-center justify-center rounded-[7px] gradient-gold px-7 py-3 text-[0.9rem] font-medium tracking-[0.01em] text-inverse shadow-soft ring-1 ring-inset ring-white/10 transition-all duration-300 ease-calm enabled:hover:-translate-y-0.5 enabled:hover:shadow-lift enabled:hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {step === total - 1 ? 'See Your Compass' : 'Next'}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div key="result" {...fade}>
            {result && <CompassView result={result} onRetake={() => { setAnswers({}); setStep(0); }} />}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CompassView({ result, onRetake }: { result: CompassResult; onRetake: () => void }) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-[16px] border border-border/70 bg-[radial-gradient(120%_140%_at_50%_-20%,rgba(91,107,78,0.09),transparent_60%)] px-6 py-10 text-center sm:px-12 sm:py-12">
        <BreathMark
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2"
          opacity={0.12}
        />
        <div className="relative">
          <span className="eyebrow eyebrow--tick mx-auto mb-4 w-fit">Your Practice Compass</span>
          <h2 className="font-serif text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.15] text-primary">
            {result.theme.title}
          </h2>
          <p className="prose-measure mx-auto mt-4 text-body-lg text-secondary">{result.theme.body}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {/* Practice to explore */}
        <div className="rounded-[12px] surface-elevated p-6 ring-1 ring-black/[0.04] sm:p-7">
          <span className="text-micro uppercase tracking-[0.16em] text-moss">A practice to explore</span>
          <h3 className="mt-2 font-serif text-[1.4rem] text-primary">{result.practice.name}</h3>
          <p className="mt-2 text-body text-secondary">{result.practice.note}</p>
          {result.practice.href && (
            <Link href={result.practice.href} className="mt-4 inline-flex text-fine font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark">
              About {result.practice.name}
            </Link>
          )}
        </div>

        {/* Program that may suit */}
        <div className="rounded-[12px] surface-elevated p-6 ring-1 ring-black/[0.04] sm:p-7">
          <span className="text-micro uppercase tracking-[0.16em] text-moss">A journey that may suit you</span>
          <h3 className="mt-2 font-serif text-[1.4rem] text-primary">
            {result.program.name}
            {result.program.gloss && (
              <span className="ml-2 align-middle text-[0.95rem] font-normal text-secondary">· {result.program.gloss}</span>
            )}
          </h3>
          <p className="mt-1.5 text-caption uppercase tracking-[0.12em] text-secondary">
            {result.program.meta}
            {result.program.location ? ` · ${result.program.location}` : ''}
          </p>
          <p className="mt-3 text-body text-secondary">{result.program.body}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <a
              href={result.program.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[7px] gradient-gold px-6 py-3 text-[0.9rem] font-medium tracking-[0.01em] text-inverse shadow-soft ring-1 ring-inset ring-white/10 transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              I’m Interested
            </a>
            <Link href={result.program.href} className="text-fine font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark">
              {result.program.mode === 'online' ? 'See online programs' : 'About this practice'}
            </Link>
          </div>
        </div>

        {/* Also in person */}
        {result.alsoInPerson && (
          <div className="rounded-[12px] border border-border bg-bg-alt/50 p-6 sm:p-7">
            <span className="text-micro uppercase tracking-[0.16em] text-moss">{result.alsoInPerson.title}</span>
            <p className="mt-2 text-body text-secondary">{result.alsoInPerson.body}</p>
            <a
              href={result.alsoInPerson.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-fine font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark"
            >
              Ask about in-person workshops
            </a>
          </div>
        )}

        {/* Community meditation */}
        <div className="rounded-[12px] border border-dashed border-moss/30 bg-bg/40 p-6 sm:p-7">
          <span className="text-micro uppercase tracking-[0.16em] text-moss">A daily practice, with company</span>
          <h3 className="mt-2 font-serif text-[1.3rem] text-primary">{result.community.name}</h3>
          <p className="mt-2 text-body text-secondary">{result.community.body}</p>
          <a
            href={result.community.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-fine font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark"
          >
            Join the Practice
          </a>
          {result.riseAndPractise && (
            <p className="mt-5 border-t border-border pt-4 text-caption text-secondary">
              <span className="font-medium text-primary">Rise &amp; Practise.</span> For longer
              journeys, we offer a little support for showing up — an optional early-morning
              check-in around 5 AM, for those who want it.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onRetake}
          className="text-fine font-medium uppercase tracking-[0.12em] text-secondary transition-colors hover:text-moss"
        >
          Retake the assessment
        </button>
        <p className="text-caption text-secondary">
          Not sure? <a href={result.program.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-moss underline-offset-2 hover:underline">Message us on WhatsApp</a> and we’ll guide you.
        </p>
      </div>
    </div>
  );
}

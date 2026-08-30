import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { SadhguruQuote } from '@/components/sections/SadhguruQuote';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { WhyClassicalHatha } from '@/components/sections/WhyClassicalHatha';
import { WhatPracticeBecomes } from '@/components/sections/WhatPracticeBecomes';
import { PracticeCompassInvite } from '@/components/sections/PracticeCompassInvite';
import { UpcomingPrograms } from '@/components/sections/UpcomingPrograms';
import { HomeTeachers } from '@/components/sections/HomeTeachers';
import { Stories } from '@/components/sections/Stories';
import { PracticePhotographs } from '@/components/sections/PracticePhotographs';
import { HomeJournal } from '@/components/sections/HomeJournal';
import { DeeperVisionClosing } from '@/components/sections/DeeperVisionClosing';
import { CtaBand } from '@/components/sections/CtaBand';
import { PracticeCompassPopup } from '@/components/sections/PracticeCompassPopup';
import { BeginJourneyButton } from '@/components/ui/BeginJourneyButton';
import { quotes } from '@/content/quotes';
import { siteConfig } from '@/content/site-config';
import { getArticles, getCategories } from '@/lib/journal';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: { absolute: 'Trikonam · Classical Hatha Yoga' },
  description: siteConfig.description,
  path: '/',
});

/**
 * Home — a single, unfolding story (2026 refinement).
 *
 * The page now tells one clear sequence: what Trikonam is → why Classical Hatha Yoga →
 * what practice can become → where to begin (the Practice Compass) → what's scheduled
 * now → the people who teach → real stories → practice as it is lived → the Journal →
 * a quiet closing invitation. Nothing repeats; each section is given room to breathe and
 * reveals as it enters the viewport.
 */
export default async function HomePage() {
  const [journalArticles, journalCategories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  return (
    <>
      {/* A calm, dismissible invitation to the Practice Compass — home page only. */}
      <PracticeCompassPopup />

      {/* Start the hero image download before the browser parses the <img>. */}
      <link rel="preload" as="image" href="/images/home/hero.webp" fetchPriority="high" />
      <Hero />

      {/* A held breath — the frame, in Sadhguru's words. */}
      <SadhguruQuote quote={quotes.yogaProcess} tone="light" compact />

      {/* 1 — What is Trikonam? (kept: it already says what it should). */}
      <AboutPreview />

      {/* 2 — Why Classical Hatha Yoga? (with the Sadhguru talk). */}
      <WhyClassicalHatha />

      {/* 3 — What can practice become in your life? */}
      <WhatPracticeBecomes />

      {/* 4 — Find where your practice begins. */}
      <PracticeCompassInvite />

      {/* 5 — Upcoming at Trikonam (only what is scheduled). */}
      <UpcomingPrograms />

      {/* 6 — Meet the Teachers. */}
      <HomeTeachers />

      {/* 7 — Stories from the Practice. */}
      <Stories />

      {/* 8 — Practice, as it is lived. */}
      <PracticePhotographs />

      {/* 9 — Journal. */}
      <HomeJournal articles={journalArticles} categories={journalCategories} />

      {/* 10 — The vision, then a quiet invitation to begin. */}
      <DeeperVisionClosing />
      <CtaBand
        title="Begin where you are."
        text="Tell us what you’re looking for, and we’ll help you find the right place to start."
      >
        <BeginJourneyButton />
      </CtaBand>
    </>
  );
}

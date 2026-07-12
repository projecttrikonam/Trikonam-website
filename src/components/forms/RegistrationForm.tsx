'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  FieldGrid,
  FieldFull,
  FormField,
  FormSelect,
  FormTextarea,
  SubmitButton,
} from './fields';
import { Confirmation } from './Confirmation';
import { useFormSubmit } from './useFormSubmit';
import { generalPrograms, batchOptions, BATCH_CUSTOM } from '@/content/online-programs';

/**
 * General online-registration form (v2.0). Uncontrolled fields are read via FormData on
 * submit; the Program select is prefilled from a `?program=<slug>` query (set when a
 * visitor clicks a programme card), and the Preferred Batch select reveals a free-text
 * field when "specify a suitable time" is chosen.
 */
export function RegistrationForm() {
  const [program, setProgram] = useState(generalPrograms[0].slug);
  const [batch, setBatch] = useState<string>(batchOptions[0]);
  const { status, submit } = useFormSubmit('online-registration');

  // Prefill the programme from the query string (static-export friendly — no Suspense).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('program');
    if (slug && generalPrograms.some((p) => p.slug === slug)) setProgram(slug);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const programName = generalPrograms.find((p) => p.slug === (fd.get('program') as string))?.name ?? '';
    const chosenBatch = fd.get('preferredBatch') as string;
    const data: Record<string, string> = {
      program: programName,
      name: (fd.get('name') as string) ?? '',
      email: (fd.get('email') as string) ?? '',
      phone: (fd.get('phone') as string) ?? '',
      country: (fd.get('country') as string) ?? '',
      timezone: (fd.get('timezone') as string) ?? '',
      preferredBatch:
        chosenBatch === BATCH_CUSTOM ? `Custom: ${(fd.get('preferredTime') as string) ?? ''}` : chosenBatch,
      previousExperience: (fd.get('previousExperience') as string) ?? '',
      additionalNotes: (fd.get('additionalNotes') as string) ?? '',
    };
    submit(data);
  }

  if (status === 'success') return <Confirmation />;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldGrid>
        <FieldFull>
          <FormSelect name="program" label="Program" required value={program} onChange={setProgram}>
            {generalPrograms.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </FormSelect>
        </FieldFull>

        <FormField name="name" label="Name" required autoComplete="name" />
        <FormField name="email" label="Email" type="email" required autoComplete="email" />
        <FormField name="phone" label="Phone" type="tel" required autoComplete="tel" />
        <FormField name="country" label="Country" required autoComplete="country-name" />
        <FormField name="timezone" label="Timezone" placeholder="e.g. GMT+5:30 (IST)" />

        <FormSelect name="preferredBatch" label="Preferred Batch" required value={batch} onChange={setBatch}>
          {batchOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
          <option value={BATCH_CUSTOM}>{BATCH_CUSTOM}</option>
        </FormSelect>

        {batch === BATCH_CUSTOM && (
          <FieldFull>
            <FormField
              name="preferredTime"
              label="Your preferred time"
              placeholder="Tell us a time that suits you"
            />
          </FieldFull>
        )}

        <FieldFull>
          <FormSelect name="previousExperience" label="Previous Yoga Experience" defaultValue="">
            <option value="">Select one</option>
            <option value="Complete beginner">Complete beginner</option>
            <option value="Some experience">Some experience</option>
            <option value="Experienced practitioner">Experienced practitioner</option>
          </FormSelect>
        </FieldFull>

        <FieldFull>
          <FormTextarea
            name="additionalNotes"
            label="Additional Notes"
            placeholder="Anything you'd like us to know (optional)"
          />
        </FieldFull>
      </FieldGrid>

      <div className="pt-2">
        <SubmitButton pending={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit Registration'}
        </SubmitButton>
        {status === 'error' && (
          <p className="mt-4 text-body text-secondary">
            We opened your email app as a fallback — please send that message, or write to us
            directly and we&apos;ll take care of your registration.
          </p>
        )}
      </div>
    </form>
  );
}

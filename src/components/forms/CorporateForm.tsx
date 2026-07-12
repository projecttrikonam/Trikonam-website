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
import { corporatePrograms } from '@/content/online-programs';

/**
 * Corporate online-programs enquiry form (v2.0). Separate from general registration —
 * no batch/timezone; instead company details, headcount, and preferred dates. Shares the
 * submit hook and confirmation screen. Program prefilled from `?program=<slug>`.
 */
export function CorporateForm() {
  const [program, setProgram] = useState(corporatePrograms[0].slug);
  const { status, submit } = useFormSubmit('corporate-enquiry');

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('program');
    if (slug && corporatePrograms.some((p) => p.slug === slug)) setProgram(slug);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const programName =
      corporatePrograms.find((p) => p.slug === (fd.get('program') as string))?.name ?? '';
    const data: Record<string, string> = {
      program: programName,
      company: (fd.get('company') as string) ?? '',
      name: (fd.get('name') as string) ?? '',
      designation: (fd.get('designation') as string) ?? '',
      email: (fd.get('email') as string) ?? '',
      phone: (fd.get('phone') as string) ?? '',
      participants: (fd.get('participants') as string) ?? '',
      preferredDates: (fd.get('preferredDates') as string) ?? '',
      message: (fd.get('message') as string) ?? '',
    };
    submit(data);
  }

  if (status === 'success') {
    return (
      <Confirmation
        title="Thank you for your enquiry."
        body="We have received your enquiry. Our team will be in touch shortly to discuss dates, scope, and next steps for your organisation."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldGrid>
        <FieldFull>
          <FormSelect name="program" label="Program" required value={program} onChange={setProgram}>
            {corporatePrograms.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </FormSelect>
        </FieldFull>

        <FormField name="company" label="Company" required autoComplete="organization" />
        <FormField name="name" label="Name" required autoComplete="name" />
        <FormField name="designation" label="Designation" autoComplete="organization-title" />
        <FormField name="email" label="Email" type="email" required autoComplete="email" />
        <FormField name="phone" label="Phone" type="tel" required autoComplete="tel" />
        <FormField name="participants" label="Number of Participants" type="text" placeholder="e.g. 25" />
        <FieldFull>
          <FormField name="preferredDates" label="Preferred Dates" placeholder="e.g. weekdays in March, mornings" />
        </FieldFull>

        <FieldFull>
          <FormTextarea
            name="message"
            label="Message"
            placeholder="Tell us a little about your team and what you're looking for (optional)"
          />
        </FieldFull>
      </FieldGrid>

      <div className="pt-2">
        <SubmitButton pending={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Request Consultation'}
        </SubmitButton>
        {status === 'error' && (
          <p className="mt-4 text-body text-secondary">
            We opened your email app as a fallback — please send that message, or write to us
            directly and we&apos;ll follow up.
          </p>
        )}
      </div>
    </form>
  );
}

import type { ReactNode } from 'react';

/**
 * Premium form field primitives (v2.0) — styled to Trikonam's system: Karla labels,
 * hairline inputs on a soft surface, moss focus ring. Fields are uncontrolled by
 * default (read via FormData on submit); pass value/onChange only where a field needs
 * to drive conditional UI (e.g. the batch selector revealing a custom-time field).
 */

const inputClass =
  'w-full rounded-[8px] border border-border bg-surface/70 px-4 py-3 text-body text-primary placeholder:text-secondary/50 transition-colors duration-200 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/25';

const labelClass = 'mb-2 block text-fine font-medium tracking-[0.02em] text-primary';

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required && <span aria-hidden className="ml-0.5 text-moss">*</span>}
    </label>
  );
}

/** A two-column grid on wider screens; wrap field groups in this. */
export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">{children}</div>;
}

/** Make a field span the full width inside a FieldGrid. */
export function FieldFull({ children }: { children: ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>;
}

export function FormField({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <Label htmlFor={name} required={required}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </div>
  );
}

export function FormTextarea({
  name,
  label,
  required = false,
  placeholder,
  rows = 4,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <Label htmlFor={name} required={required}>{label}</Label>
      <textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
}

export function FormSelect({
  name,
  label,
  required = false,
  value,
  defaultValue,
  onChange,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={name} required={required}>{label}</Label>
      <div className="relative">
        <select
          id={name}
          name={name}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className={`${inputClass} appearance-none pr-10`}
        >
          {children}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-moss">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/** Real submit button styled like the primary CTA (Button is a link; forms need this). */
export function SubmitButton({ children, pending }: { children: ReactNode; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-[7px] bg-[linear-gradient(180deg,#8a6230,#6e4d24)] px-8 py-3.5 text-[0.95rem] font-medium tracking-[0.01em] text-inverse shadow-soft ring-1 ring-inset ring-white/10 transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {pending && (
        <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-inverse/40 border-t-inverse" />
      )}
      {children}
    </button>
  );
}

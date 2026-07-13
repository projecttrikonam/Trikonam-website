/**
 * The Trikonam Welcome System (v2.1) — SINGLE SOURCE OF TRUTH for every registration
 * journey. There are no scattered forms and no Google Forms: one reusable, config-driven
 * architecture where only the questions change per journey. Add a field here and it
 * appears in the form; add an option to a catalog and it appears in a dropdown.
 *
 * Each journey routes to its own tab in the "Trikonam Student Hub" spreadsheet via the
 * `category` sent to the Apps Script backend (see docs/apps-script/Code.gs).
 *
 * Option lists for practices / online programs / corporate are derived from the existing
 * content files so a name is written once. The Group Workshops, Retreats, and Children's
 * catalogs have no fixed offering yet — they carry a graceful "please guide me" option and
 * are marked PENDING for the client's exact names (edit the arrays below).
 */

import { practices } from './practices';
import { generalPrograms, corporatePrograms } from './online-programs';

export type FieldType = 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea';

export interface JourneyField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  /** Flat option list for a select. */
  options?: string[];
  /** Grouped options for a select (e.g. Core / Other practices). */
  optionGroups?: { label: string; options: string[] }[];
  /** Full-width inside the two-column grid. */
  full?: boolean;
}

export interface Journey {
  id: string;
  label: string;
  blurb: string;
  /** The spreadsheet tab this journey routes to. */
  sheet: string;
  /** The submit button's resting label, phrased for this journey's intent. */
  submitLabel: string;
  fields: JourneyField[];
}

// --- Derived option lists (written once, in the content files) --------------
const CORE_PRACTICE_SLUGS = [
  'surya-kriya',
  'surya-shakti',
  'angamardhana',
  'yogasanas',
  'bhuta-shuddhi',
];
const OTHER_PRACTICE_SLUGS = [
  'upa-yoga',
  'sunayana-eye-care',
  'shanmukhi-mudra',
  'bhastrika-kriya',
  'pavanamuktasana',
];
const practiceName = (slug: string) => practices.find((p) => p.slug === slug)?.name ?? slug;

const onlineProgramNames = generalPrograms.map((p) => p.name);
const corporateProgramNames = corporatePrograms.map((p) => p.name);

// --- PENDING catalogs (client to supply exact names) ------------------------
// Until the client provides names, each carries a single graceful option so the form is
// always usable. Replace/extend these arrays and the dropdowns update everywhere.
const WORKSHOP_OPTIONS = ['I’m not sure yet — please guide me'];
const RETREAT_OPTIONS = ['I’m not sure yet — please guide me'];
const CHILDREN_PROGRAM_OPTIONS = ['I’m not sure yet — please guide me'];

// Shared option sets.
const BATCH_OPTIONS = [
  'Morning · 6:00–7:00',
  'Noon · 11:30–12:30',
  'Evening · 6:30–7:30',
  'Or specify a suitable time',
];
const HEARD_OPTIONS = ['Instagram', 'Google Search', 'Friend', 'Corporate', 'Journal', 'YouTube', 'Other'];
const COMMUNICATION_OPTIONS = ['Email', 'WhatsApp'];
const EXPERIENCE_OPTIONS = ['Complete beginner', 'Some experience', 'Experienced practitioner'];
const CORPORATE_OBJECTIVES = [
  'Employee Wellbeing',
  'Stress Management',
  'Leadership',
  'General Wellness',
  'Productivity',
  'Custom',
];

// Reusable field builders (keep the common contact fields consistent across journeys).
const nameField: JourneyField = { name: 'name', label: 'Name', type: 'text', required: true, autoComplete: 'name' };
const emailField: JourneyField = { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' };
const phoneField: JourneyField = { name: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel' };
const cityField: JourneyField = { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' };
const countryField: JourneyField = { name: 'country', label: 'Country', type: 'text', required: true, autoComplete: 'country-name' };
const notesField: JourneyField = { name: 'additionalNotes', label: 'Additional Notes', type: 'textarea', full: true, placeholder: 'Anything you’d like us to know (optional)' };

export const journeys: Journey[] = [
  {
    id: 'classical-hatha-yoga',
    label: 'Classical Hatha Yoga',
    blurb: 'Learn a classical practice in its original form, guided by certified teachers.',
    sheet: 'Classical Hatha Yoga',
    submitLabel: 'Submit Registration',
    fields: [
      {
        name: 'practice',
        label: 'Practice',
        type: 'select',
        required: true,
        full: true,
        optionGroups: [
          { label: 'Core Practices', options: CORE_PRACTICE_SLUGS.map(practiceName) },
          { label: 'Other Practices', options: OTHER_PRACTICE_SLUGS.map(practiceName) },
        ],
      },
      nameField,
      emailField,
      phoneField,
      cityField,
      countryField,
      { name: 'preferredDates', label: 'Preferred Dates', type: 'text', placeholder: 'e.g. weekday mornings in March' },
      { name: 'previousExperience', label: 'Previous Yoga Experience', type: 'select', options: EXPERIENCE_OPTIONS },
      { name: 'inspiration', label: 'What inspired you to explore Classical Hatha Yoga?', type: 'textarea', full: true },
      notesField,
    ],
  },
  {
    id: 'online-programs',
    label: 'Online Programs',
    blurb: 'Join a live online program and learn from anywhere in the world.',
    sheet: 'Online Programs',
    submitLabel: 'Submit Registration',
    fields: [
      { name: 'program', label: 'Program', type: 'select', required: true, full: true, options: onlineProgramNames },
      nameField,
      emailField,
      phoneField,
      countryField,
      { name: 'timezone', label: 'Timezone', type: 'text', placeholder: 'e.g. GMT+5:30 (IST)' },
      { name: 'preferredBatch', label: 'Preferred Batch', type: 'select', required: true, options: BATCH_OPTIONS },
      { name: 'previousExperience', label: 'Previous Yoga Experience', type: 'select', options: EXPERIENCE_OPTIONS },
      { name: 'inspiration', label: 'What inspired you to join?', type: 'textarea', full: true },
      { name: 'heardFrom', label: 'How did you hear about Trikonam?', type: 'select', options: HEARD_OPTIONS },
      { name: 'preferredCommunication', label: 'Preferred Communication', type: 'select', options: COMMUNICATION_OPTIONS },
      notesField,
    ],
  },
  {
    id: 'group-workshops',
    label: 'Group Workshops',
    blurb: 'Experience these practices together, in a shared and unhurried setting.',
    sheet: 'Group Workshops',
    submitLabel: 'Send Request',
    fields: [
      { name: 'workshop', label: 'Workshop', type: 'select', required: true, full: true, options: WORKSHOP_OPTIONS },
      nameField,
      emailField,
      phoneField,
      cityField,
      countryField,
      { name: 'preferredDates', label: 'Preferred Dates', type: 'text', placeholder: 'e.g. a weekend in April' },
      { name: 'groupSize', label: 'Group Size (optional)', type: 'text', placeholder: 'e.g. 12' },
      notesField,
    ],
  },
  {
    id: 'private-sessions',
    label: 'Private One-to-One Sessions',
    blurb: 'Individual guidance, met to your own pace, body, and needs.',
    sheet: 'Private Sessions',
    submitLabel: 'Request Consultation',
    fields: [
      nameField,
      emailField,
      phoneField,
      countryField,
      { name: 'preferredTiming', label: 'Preferred Timing', type: 'text', placeholder: 'e.g. weekday evenings' },
      { name: 'areaOfInterest', label: 'Area of Interest', type: 'text', full: true, placeholder: 'What would you like to focus on?' },
      notesField,
    ],
  },
  {
    id: 'childrens-programs',
    label: "Children's Programs",
    blurb: 'A gentle, age-appropriate practice, grounded in the classical tradition.',
    sheet: "Children's Programs",
    submitLabel: 'Send Enquiry',
    fields: [
      { name: 'childName', label: "Child's Name", type: 'text', required: true },
      { name: 'childAge', label: 'Age', type: 'number' },
      { name: 'guardianName', label: 'Parent / Guardian Name', type: 'text', required: true, autoComplete: 'name' },
      emailField,
      phoneField,
      cityField,
      countryField,
      { name: 'preferredProgram', label: 'Preferred Program', type: 'select', full: true, options: CHILDREN_PROGRAM_OPTIONS },
      notesField,
    ],
  },
  {
    id: 'retreats',
    label: 'Retreats',
    blurb: 'Time away to practise, rest, and return to yourself in a quieter setting.',
    sheet: 'Retreats',
    submitLabel: 'Send Enquiry',
    fields: [
      { name: 'retreat', label: 'Retreat', type: 'select', required: true, full: true, options: RETREAT_OPTIONS },
      nameField,
      emailField,
      phoneField,
      countryField,
      { name: 'accommodation', label: 'Accommodation Preference', type: 'text', placeholder: 'e.g. shared, private' },
      { name: 'dietary', label: 'Dietary Preference', type: 'text', placeholder: 'e.g. vegetarian, vegan' },
      { name: 'emergencyContact', label: 'Emergency Contact', type: 'text', full: true, placeholder: 'Name and phone' },
      notesField,
    ],
  },
  {
    id: 'corporate-wellness',
    label: 'Corporate Wellness',
    blurb: 'Bring steadiness, clarity, and wellbeing into your workplace.',
    sheet: 'Corporate Wellness',
    submitLabel: 'Request Consultation',
    fields: [
      { name: 'program', label: 'Program', type: 'select', required: true, full: true, options: corporateProgramNames },
      { name: 'company', label: 'Company Name', type: 'text', required: true, autoComplete: 'organization' },
      { name: 'contactPerson', label: 'Contact Person', type: 'text', required: true, autoComplete: 'name' },
      { name: 'designation', label: 'Designation', type: 'text', autoComplete: 'organization-title' },
      { name: 'email', label: 'Work Email', type: 'email', required: true, autoComplete: 'email' },
      phoneField,
      countryField,
      { name: 'participants', label: 'Number of Participants', type: 'text', placeholder: 'e.g. 25' },
      { name: 'preferredDates', label: 'Preferred Dates', type: 'text' },
      { name: 'primaryObjective', label: 'Primary Objective', type: 'select', full: true, options: CORPORATE_OBJECTIVES },
      { name: 'additionalRequirements', label: 'Additional Requirements', type: 'textarea', full: true },
    ],
  },
  {
    id: 'enquiry',
    label: 'General Enquiry',
    blurb: 'Just have a question? Tell us a little and we’ll be glad to help.',
    sheet: 'Contact Enquiries',
    submitLabel: 'Send Enquiry',
    fields: [
      nameField,
      emailField,
      { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel' },
      { name: 'message', label: 'Your Message', type: 'textarea', required: true, full: true, placeholder: 'How can we help?' },
    ],
  },
];

export const getJourney = (id: string): Journey | undefined => journeys.find((j) => j.id === id);

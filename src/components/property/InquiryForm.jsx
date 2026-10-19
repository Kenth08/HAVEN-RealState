import { useId, useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { site } from '../../config/site';
import { inquiriesEnabled, sendInquiry } from '../../lib/inquiry';

const INTENTS = ['Buy', 'Sell', 'Rent'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please tell us your name.';
  if (!EMAIL.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (values.message.trim().length < 10) errors.message = 'A sentence or two helps us match you with the right agent.';
  return errors;
}

function Field({ label, error, optional, children, id }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="normal-case tracking-normal">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Inquiry form: validates on the client, then delivers through Web3Forms
 * (see lib/inquiry.js). If delivery fails, the visitor keeps their text and
 * gets a direct email link as a fallback.
 */
export default function InquiryForm({ property }) {
  const uid = useId();
  const initial = {
    name: '',
    email: '',
    phone: '',
    intent: 'Buy',
    message: property ? `I'd like to arrange a viewing of ${property.title} in ${property.location}.` : '',
    botcheck: false,
  };
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [sendError, setSendError] = useState('');

  const update = (event) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }
    setStatus('sending');
    setSendError('');
    try {
      await sendInquiry(values, property);
      setStatus('idle');
      const first = values.name.trim().split(/\s+/)[0];
      // "KENTH" or "kenth" → "Kenth" for the thank-you line.
      setSubmitted(first.charAt(0).toUpperCase() + first.slice(1).toLowerCase());
    } catch (error) {
      setStatus('error');
      setSendError(error.message);
    }
  }

  if (submitted) {
    return (
      <div role="status" className="border-t border-line pt-8">
        <p className="font-serif text-4xl">Thank you, {submitted}.</p>
        <p className="mt-4 max-w-md leading-relaxed text-mute">
          Your message is on its way. We'll reply to {values.email.trim()} as soon as we can.
        </p>
        <button
          type="button"
          className="btn-outline mt-8"
          onClick={() => {
            setValues(initial);
            setSubmitted(null);
          }}
        >
          Write another message
        </button>
      </div>
    );
  }

  const inputProps = (name) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    onChange: update,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
    className: 'field',
  });

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-8 sm:grid-cols-2">
      <Field label="Name" id={`${uid}-name`} error={errors.name}>
        <input type="text" autoComplete="name" required {...inputProps('name')} />
      </Field>
      <Field label="Email" id={`${uid}-email`} error={errors.email}>
        <input type="email" autoComplete="email" required {...inputProps('email')} />
      </Field>
      <Field label="Phone" optional id={`${uid}-phone`}>
        <input type="tel" autoComplete="tel" {...inputProps('phone')} />
      </Field>
      <fieldset>
        <legend className="field-label">I'm looking to</legend>
        <div className="mt-2 flex gap-2">
          {INTENTS.map((intent) => (
            <label key={intent} className="cursor-pointer">
              <input type="radio" name="intent" value={intent} checked={values.intent === intent} onChange={update} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line px-4 py-2 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {intent}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <Field label="Message" id={`${uid}-message`} error={errors.message}>
          <textarea rows={4} required {...inputProps('message')} className="field resize-none" />
        </Field>
      </div>
      {/* Honeypot for spam bots: hidden from people and assistive tech. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        checked={values.botcheck}
        onChange={(event) => setValues((v) => ({ ...v, botcheck: event.target.checked }))}
      />
      <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
        <div aria-live="polite" className="max-w-sm text-sm">
          {status === 'error' && (
            <p className="text-accent">
              {sendError}{' '}
              <a href={`mailto:${site.contact.email}`} className="underline underline-offset-2">
                Or email {site.contact.email}
              </a>
            </p>
          )}
          {status !== 'error' && !inquiriesEnabled && (
            <p className="text-mute">
              Online inquiries aren't connected yet — email{' '}
              <a href={`mailto:${site.contact.email}`} className="underline underline-offset-2">{site.contact.email}</a>.
            </p>
          )}
        </div>
        <button type="submit" className="btn-dark group disabled:opacity-60" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send inquiry'}
          {status === 'sending' ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.75} />
          ) : (
            <ArrowRight aria-hidden="true" className="arrow-nudge size-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </form>
  );
}

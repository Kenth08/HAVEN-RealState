import { site } from '../config/site';

// Inquiries are delivered by Web3Forms (https://web3forms.com): a free
// form-to-email service that works from a static site with no backend.
// The access key is designed to be public (it only allows sending to the
// inbox it was created for), so it is read from a Vite env variable.
const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export const inquiriesEnabled = Boolean(ACCESS_KEY);

export class InquiryError extends Error {}

/** Sends an inquiry; resolves on delivery, throws InquiryError otherwise. */
export async function sendInquiry(values, property) {
  if (!inquiriesEnabled) throw new InquiryError('Online inquiries are not connected yet.');

  const data = new FormData();
  data.append('access_key', ACCESS_KEY);
  data.append('subject', property ? `Viewing request: ${property.title}` : `New inquiry from ${values.name.trim()}`);
  data.append('from_name', `${site.name} website`);
  data.append('name', values.name.trim());
  data.append('email', values.email.trim());
  if (values.phone.trim()) data.append('phone', values.phone.trim());
  data.append('looking_to', values.intent);
  if (property) {
    data.append('property', `${property.title} — ${property.location}`);
    data.append('property_page', `${window.location.origin}/properties/${property.id}`);
  }
  data.append('message', values.message.trim());
  // Honeypot: real visitors never see or fill this; Web3Forms rejects it when set.
  if (values.botcheck) data.append('botcheck', 'on');

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new InquiryError('We couldn’t reach the server. Check your connection and try again.');
  }

  const result = await response.json().catch(() => ({}));
  if (response.status === 429) throw new InquiryError('Too many messages in a short time. Please try again in a minute.');
  if (!response.ok || !result.success) throw new InquiryError('Your message couldn’t be sent. Please try again.');
}

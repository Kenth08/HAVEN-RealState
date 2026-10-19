import { site } from '../config/site';
import usePageMeta from '../hooks/usePageMeta';
import LegalPage from '../components/layout/LegalPage';

const UPDATED = 'October 19, 2026';

export default function Privacy() {
  usePageMeta({ title: 'Privacy Policy', path: '/privacy', description: `How ${site.name} handles the information you send through this website.` });
  const email = <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>;

  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      updated={UPDATED}
      intro={`${site.name} only collects what you choose to send us, and only uses it to help you find or sell a home.`}
      sections={[
        {
          heading: 'Who we are',
          body: (
            <p>
              {site.name} is a real estate studio based in {site.contact.offices.join(', ')}. For anything about your information, contact us at {email}.
            </p>
          ),
        },
        {
          heading: 'What we collect',
          body: (
            <>
              <p>We collect information only when you send an inquiry or viewing request through a form on this site:</p>
              <ul>
                <li>your name and email address;</li>
                <li>your phone number, if you choose to give it;</li>
                <li>whether you are looking to buy, sell or rent, and your message;</li>
                <li>the property you asked about, when you use a property page.</li>
              </ul>
              <p>We do not ask for payment details, and there are no user accounts on this site.</p>
            </>
          ),
        },
        {
          heading: 'How your message reaches us',
          body: (
            <p>
              Forms are delivered by <a href="https://web3forms.com/privacy" target="_blank" rel="noreferrer">Web3Forms</a>, a form-to-email service that forwards your message to our inbox. Web3Forms processes the
              message only to deliver it.
            </p>
          ),
        },
        {
          heading: 'How we use it',
          body: (
            <p>
              We use your details to reply to you and to help with your inquiry, for example to arrange a viewing. We do not sell your personal information, and we do not share it with third parties for their
              marketing.
            </p>
          ),
        },
        {
          heading: 'How long we keep it',
          body: <p>Your message stays in our email for as long as we need it to handle your inquiry and any follow-up. You can ask us to delete it at any time.</p>,
        },
        {
          heading: 'Analytics, cookies and storage',
          body: (
            <>
              <p>
                We use <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Vercel Web Analytics</a> to count page visits. It does not use cookies and does not identify you
                personally; we only see aggregated numbers.
              </p>
              <p>
                This site sets no cookies. It uses your browser&apos;s session storage only to remember that the opening animation has already played; that is cleared when you close the tab.
              </p>
            </>
          ),
        },
        {
          heading: 'Your choices',
          body: (
            <p>
              You can ask to see, correct or delete the information you have sent us by emailing {email}. We will respond as soon as we can. If you are a California resident, note that we do not sell or share
              personal information as defined by the CCPA.
            </p>
          ),
        },
        {
          heading: 'Hosting',
          body: <p>The site is hosted by Vercel, which may keep standard technical logs (such as IP addresses) to run and protect its service.</p>,
        },
        {
          heading: 'Changes',
          body: <p>If we change this policy we will update the date at the top of this page.</p>,
        },
      ]}
    />
  );
}

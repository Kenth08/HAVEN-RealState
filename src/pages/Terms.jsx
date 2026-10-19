import { Link } from 'react-router';
import { site } from '../config/site';
import { photos } from '../data/photos';
import usePageMeta from '../hooks/usePageMeta';
import LegalPage from '../components/layout/LegalPage';

const UPDATED = 'October 19, 2026';

export default function Terms() {
  usePageMeta({ title: 'Terms of Use', path: '/terms', description: `Terms for using the ${site.name} website, and photography credits.` });
  const email = <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>;

  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Use"
      updated={UPDATED}
      intro={`By using the ${site.name} website you agree to these terms. They are short, and written to be read.`}
      sections={[
        {
          heading: 'Listings',
          body: (
            <p>
              The homes, prices and details featured on this site are <strong>sample listings shown for illustration</strong>. They are not offers to sell or rent, and availability, prices and details can
              change. Please contact us to confirm any information before relying on it.
            </p>
          ),
        },
        {
          heading: 'No professional advice',
          body: <p>Content on this site is general information. It is not legal, financial, tax or appraisal advice. Speak with a qualified professional about your situation.</p>,
        },
        {
          heading: 'Inquiries',
          body: (
            <p>
              When you send an inquiry, you agree that we may contact you about it by email or phone. How we handle your information is explained in our <Link to="/privacy">Privacy Policy</Link>.
            </p>
          ),
        },
        {
          heading: 'Content and photography',
          body: (
            <>
              <p>The site design and text are © {new Date().getFullYear()} {site.name}. Please don&apos;t copy them without permission.</p>
              <p id="credits" className="scroll-mt-28">
                Photography ({Object.keys(photos).length + 1} images) comes from{' '}
                <a href="https://unsplash.com" target="_blank" rel="noreferrer">
                  Unsplash
                </a>{' '}
                and is used under the{' '}
                <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">
                  Unsplash License
                </a>
                . Our thanks to the photographers who share their work there.
              </p>
            </>
          ),
        },
        {
          heading: 'Links and availability',
          body: <p>We may link to other websites we don&apos;t control and aren&apos;t responsible for. We aim to keep this site available and accurate but can&apos;t guarantee it will always be either.</p>,
        },
        {
          heading: 'Liability',
          body: <p>To the extent the law allows, {site.name} is not liable for losses arising from use of this website or reliance on its content.</p>,
        },
        {
          heading: 'Contact',
          body: <p>Questions about these terms: {email}.</p>,
        },
      ]}
    />
  );
}

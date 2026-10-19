import { site } from '../../config/site';
import InquiryForm from '../property/InquiryForm';
import SplitText from '../ui/SplitText';
import Reveal from '../ui/Reveal';

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-section">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5 text-mute">Contact</p>
          <h2 id="contact-title" className="font-serif text-title">
            <SplitText text="Tell us where you're headed." />
          </h2>
          <Reveal>
            <p className="mt-8 max-w-sm leading-relaxed text-mute">
              Share what you're looking for and we'll match you with an agent who knows the area — buying, selling or renting.
            </p>
            <dl className="mt-10 space-y-4 text-sm">
              <div className="flex gap-6">
                <dt className="w-16 text-mute">Email</dt>
                <dd><a href={`mailto:${site.contact.email}`} className="link-line">{site.contact.email}</a></dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-16 text-mute">Phone</dt>
                <dd><a href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`} className="link-line">{site.contact.phone}</a></dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-16 text-mute">{site.contact.offices.length > 1 ? 'Offices' : 'Office'}</dt>
                <dd>{site.contact.offices.join(', ')}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <InquiryForm />
        </Reveal>
      </div>
    </section>
  );
}

import { CONTACT, SITE } from '@/content'
import { ContactForm } from './ContactForm'

export function Contact() {
  const { identity } = SITE
  const channels = [
    { label: 'Email', value: identity.email, href: `mailto:${identity.email}` },
    { label: 'Phone', value: identity.phone.display, href: `tel:${identity.phone.e164}` },
    { label: 'LinkedIn', value: identity.linkedin.label, href: identity.linkedin.url, external: true },
    { label: 'GitHub', value: identity.github.label, href: identity.github.url, external: true },
    { label: 'Base', value: identity.location },
  ]

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <h2 className="section-title" id="contact-title">{CONTACT.title}</h2>

        <div className="contact-grid">
          <div className="contact-copy flow" data-reveal>
            <p className="lead">{CONTACT.lead}</p>
            <p>{CONTACT.blurb}</p>
            <ul className="contact-list" role="list">
              {channels.map(({ label, value, href, external }) => (
                <li key={label}>
                  <span>{label}</span>
                  {href ? (
                    <a href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}

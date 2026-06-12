import { ContactForm } from './ContactForm'

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <h2 className="section-title" id="contact-title">Contact</h2>

        <div className="contact-grid">
          <div className="contact-copy flow" data-reveal>
            <p className="lead">Let's build something reliable.</p>
            <p>
              Recruiting, collaborating, or just want to talk systems and
              AI-assisted engineering? My inbox is open. I usually reply
              within a day.
            </p>
            <ul className="contact-list" role="list">
              <li>
                <span>Email</span>
                <a href="mailto:andrew@andrewgalvin.dev">andrew@andrewgalvin.dev</a>
              </li>
              <li>
                <span>Phone</span>
                <a href="tel:+17819275667">(781) 927-5667</a>
              </li>
              <li>
                <span>LinkedIn</span>
                <a href="https://www.linkedin.com/in/andrew-galvin-0000001/" target="_blank" rel="noopener">
                  andrew-galvin-0000001
                </a>
              </li>
              <li>
                <span>GitHub</span>
                <a href="https://github.com/andrewgalvin" target="_blank" rel="noopener">
                  andrewgalvin
                </a>
              </li>
              <li>
                <span>Base</span>
                <span>Weymouth / Boston, MA</span>
              </li>
            </ul>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}

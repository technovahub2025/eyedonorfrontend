/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import eyeHero from '../asset/eye.png';
import eyeLogo from '../asset/eyes.jpg';
import './RoleSelectPage.css';

function RoleSelectPage({ onRoleSelect }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);

  function handlePledge() {
    onRoleSelect?.('terms');
  }

  function handleAdmin() {
    onRoleSelect?.('admin');
  }

  function handleUserLogin() {
    onRoleSelect?.('user-login');
  }

  return (
    <div className="role-landing">
      <header className="role-header">
        <div className="role-header__inner">
          <a href="#" className="role-brand" onClick={(event) => event.preventDefault()}>
            <img alt="Vision of Hope logo" className="role-brand__logo" src={eyeLogo} />
            <span className="role-brand__copy">
              <strong>Vision of Hope</strong>
              <small>Eye Donation Pledge</small>
            </span>
          </a>

          <nav className="role-nav" aria-label="Primary">
            <button
              className="role-nav__toggle"
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>

            <div className={`role-nav__links ${mobileOpen ? 'role-nav__links--open' : ''}`}>
              <a className="role-nav__link role-nav__link--active" href="#home">
                Home
              </a>
              <a className="role-nav__link" href="https://jothieyecare.in/" target="_blank" rel="noreferrer">
                About Us
              </a>
              
              <a className="role-nav__link" href="#stories">
                Stories
              </a>
              <a className="role-nav__link" href="#faq">
                FAQ
              </a>
              <a className="role-nav__link" href="#contact">
                Contact Us
              </a>
              
              <button className="role-nav__cta" type="button" onClick={handlePledge}>
                Pledge My Eyes
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="role-main" id="home">
        <section className="role-hero">
          <div className="role-hero__inner">
            <div className="role-hero__content">
              <p className="role-kicker">A small decision. A lifetime of sight.</p>
              <h1 className="role-title">
                Give the Gift
                <br />
                of <span>Sight</span>
              </h1>
              <p className="role-copy">
                Your pledge can help restore vision, comfort a family, and leave behind a legacy
                of compassion. Start by choosing how you want to continue.
              </p>

              <div className="role-actions">
                <button className="role-button role-button--primary" type="button" onClick={handlePledge}>
                  Pledge My Eyes
                </button>
               
              </div>

              <div className="role-mini-stats" aria-label="Impact highlights">
                <div className="role-mini-stats__item">
                  <strong>1 Donor</strong>
                  <span>can restore sight to 2 people</span>
                </div>
                <div className="role-mini-stats__divider" />
                <div className="role-mini-stats__item">
                  <strong>75,432+</strong>
                  <span>pledges and counting</span>
                </div>
                <div className="role-mini-stats__divider" />
                <div className="role-mini-stats__item">
                  <strong>48,921+</strong>
                  <span>successful transplants</span>
                </div>
              </div>
            </div>

            <div className="role-hero__visual">
              <img
                className="role-hero__image"
                alt="Eye donation themed illustration"
                src={eyeHero}
              />
              <div className="role-hero__badge">
                <span className="material-symbols-outlined" aria-hidden="true">
                  visibility
                </span>
                <div>
                  <strong>Be the reason</strong>
                  <span>someone sees tomorrow</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="role-strip" aria-label="Quick impact">
          <div className="role-strip__inner">
            <div className="role-strip__card">
              <span className="material-symbols-outlined" aria-hidden="true">
                groups
              </span>
              <strong>1 Donor</strong>
              <span>can restore sight to 2 people</span>
            </div>
            <div className="role-strip__card">
              <span className="material-symbols-outlined" aria-hidden="true">
                favorite
              </span>
              <strong>75,432+</strong>
              <span>pledges and counting</span>
            </div>
            <div className="role-strip__card">
              <span className="material-symbols-outlined" aria-hidden="true">
                visibility
              </span>
              <strong>48,921+</strong>
              <span>successful corneal transplants</span>
            </div>
            <div className="role-strip__card">
              <span className="material-symbols-outlined" aria-hidden="true">
                medical_services
              </span>
              <strong>20+</strong>
              <span>partner eye banks</span>
            </div>
          </div>
        </section>

        <section id="process" className="role-section">
          <div className="role-section__inner">
            <div className="role-section__head">
              <p className="role-section__eyebrow">How eye donation works</p>
              <h2>Simple steps that create lasting impact</h2>
            </div>

            <div className="role-steps">
              <article className="role-step">
                <span className="role-step__number">1</span>
                <h3>Pledge</h3>
                <p>Register your intent online in just a few minutes.</p>
              </article>
              <article className="role-step">
                <span className="role-step__number">2</span>
                <h3>Inform family</h3>
                <p>Share your decision so your loved ones can support your wish.</p>
              </article>
              <article className="role-step">
                <span className="role-step__number">3</span>
                <h3>Donation support</h3>
                <p>When the time comes, the family contacts the eye bank promptly.</p>
              </article>
              <article className="role-step">
                <span className="role-step__number">4</span>
                <h3>Sight restored</h3>
                <p>Donated tissue can help another person see a brighter world.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="about" className="role-cards">
          <div className="role-cards__inner">
            <article className="role-panel role-panel--soft">
              <p className="role-section__eyebrow">Who can donate?</p>
              <ul className="role-list">
                <li>Anyone above 18 years can pledge.</li>
                <li>No upper age limit.</li>
                <li>People with spectacles, diabetes, or cataract can donate.</li>
                <li>Almost everyone can contribute to this cause.</li>
              </ul>
              <button className="role-panel__button" type="button" onClick={handlePledge}>
                Know More
              </button>
            </article>

            <article className="role-panel role-panel--accent">
              <p className="role-section__eyebrow">Report an eye donor</p>
              <h3>24x7 support line</h3>
              <p>In case of a sad demise, contact the nearest eye bank immediately.</p>
              <a className="role-call" href="tel:18001234567">
                <span className="material-symbols-outlined" aria-hidden="true">
                  call
                </span>
                1800 123 4567
              </a>
              <span className="role-panel__note">Available 24x7 - Toll free</span>
            </article>

            <article id="support" className="role-panel role-panel--light">
              <p className="role-section__eyebrow">Find an eye bank near you</p>
              <div className="role-search">
                <input type="text" placeholder="Enter your city or location" aria-label="City or location" />
                <button type="button">Find Eye Banks</button>
              </div>
              <div className="role-panel__stats">
                <div>
                  <strong>20+</strong>
                  <span>Eye banks</span>
                </div>
                <div>
                  <strong>100+</strong>
                  <span>Cities</span>
                </div>
                <div>
                  <strong>24x7</strong>
                  <span>Availability</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="stories" className="role-stories">
          <div className="role-section__inner">
            <div className="role-section__head">
              <p className="role-section__eyebrow">Stories of light</p>
              <h2>People whose lives changed after a pledge</h2>
            </div>

            <div className="role-story-grid">
              <article className="role-story">
                <div className="role-story__avatar role-story__avatar--one" aria-hidden="true">
                  <span className="material-symbols-outlined role-story__avatar-icon">person</span>
                </div>
                <p>
                  "Thanks to my donor, I can see my grandchildren today. I will be forever grateful."
                </p>
                <strong>- Ramesh, Chennai</strong>
                <span>Cornea recipient</span>
              </article>

              <article className="role-story">
                <div className="role-story__avatar role-story__avatar--two" aria-hidden="true">
                  <span className="material-symbols-outlined role-story__avatar-icon">person</span>
                </div>
                <p>
                  "My father believed in giving. His eyes are now helping someone else see a new
                  life."
                </p>
                <strong>- Meena, Madurai</strong>
                <span>Donor's daughter</span>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="role-faq">
          <div className="role-section__inner">
            <div className="role-section__head">
              <p className="role-section__eyebrow">Frequently asked questions</p>
              <h2>Quick answers before you pledge</h2>
            </div>

            <div className="role-faq__grid">
              <details className="role-faq__item">
                <summary>Is there any age limit for eye donation?</summary>
                <p>No upper age limit. Most healthy adults can pledge, and evaluation happens at the time of need.</p>
              </details>
              <details className="role-faq__item">
                <summary>Can people with spectacles donate eyes?</summary>
                <p>Yes, wearing spectacles does not prevent a person from pledging their eyes.</p>
              </details>
              <details className="role-faq__item">
                <summary>Does religion allow eye donation?</summary>
                <p>Many faiths support donation as an act of generosity and service.</p>
              </details>
              <details className="role-faq__item">
                <summary>Can eyes be donated after cataract surgery?</summary>
                <p>Often yes. Medical suitability is checked by the eye bank team.</p>
              </details>
              <details className="role-faq__item">
                <summary>Can diabetic patients donate eyes?</summary>
                <p>In many cases, yes. The eye bank determines suitability after review.</p>
              </details>
              <details className="role-faq__item">
                <summary>How long should we wait to contact the eye bank?</summary>
                <p>Contact them as soon as possible, ideally within a few hours.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="role-cta">
          <div className="role-cta__inner">
            <div>
              <p className="role-section__eyebrow">Be the reason someone sees tomorrow</p>
              <h2>Pledge your eyes today and leave a legacy of light.</h2>
            </div>
            <button className="role-button role-button--primary" type="button" onClick={handlePledge}>
              Pledge My Eyes
            </button>
          </div>
        </section>
      </main>

      <footer className="role-footer" id="contact">
        <div className="role-footer__inner">
          <div className="role-footer__brand">
            <div className="role-footer__brand-row">
              <img alt="Vision of Hope logo" src={eyeLogo} />
              <div>
                <strong>Vision of Hope</strong>
                <span>Eye Donation Pledge</span>
              </div>
            </div>
            <p>Let's build a society where no one suffers from corneal blindness.</p>
          </div>

          <div className="role-footer__links">
            <strong>Quick Links</strong>
            <a href="#home">Home</a>
            <a href="https://jothieyecare.in/" target="_blank" rel="noreferrer">
              About Us
            </a>
            <a href="#process">Eye Donation</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="role-footer__links">
            <strong>Contact Us</strong>
            <span>JOTHI EYE CARE CENTRE</span>
            <span>152 &amp; 154, Calve Subraya Chetty Street, Puducherry - 605 001.</span>
            <a href="tel:+914132224534">+91-413-2224534</a>
            <a href="tel:+914132337659">+91-413-2337659</a>
            <a href="mailto:jothieyecare@gmail.com">jothieyecare@gmail.com</a>
          </div>

          <div className="role-footer__links">
            <strong>Choose a path</strong>
            <button type="button" onClick={handlePledge}>Pledge My Eyes</button>
            
            <button type="button" onClick={handleAdmin}>Admin Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RoleSelectPage;

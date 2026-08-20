/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import eyeHero from '../asset/eyehero.png';
import eyeLogo from '../asset/logo.png';
import meenaImage from '../asset/profile1.png';
import rameshImage from '../asset/profile2.png';
import './RoleSelectPage.css';
import { FileText, Users, HeartHandshake, Eye } from 'lucide-react';

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
          <div className="role-hero__surface">
            <div className="role-hero__content">
              <p className="role-kicker">A small decision, a lasting gift.</p>
              <h1 className="role-title">
                Give the Gift
                <br />
                of <span>Sight</span>
              </h1>
              <p className="role-copy">
                Pledge your eyes today and help restore sight for someone in need.
              </p>

              <div className="role-actions">
                <button
                  className="role-button role-button--primary"
                  type="button"
                  onClick={handlePledge}
                >
                  Pledge My Eyes
                </button>
              </div>
            </div>

            <div className="role-hero__visual" aria-hidden="true">
              <img src={eyeHero} alt="" className="role-hero__image" />
            </div>
          </div>
        </section>

        <section className="role-impact" aria-label="Quick impact">
          <div className="role-impact__inner">
            <div className="role-impact__card">
              <span className="material-symbols-outlined" aria-hidden="true">
                groups
              </span>
              <strong>1 Donor</strong>
              <span>can restore sight to 2 people</span>
            </div>
            <div className="role-impact__card">
              <span className="material-symbols-outlined" aria-hidden="true">
                favorite
              </span>
              <strong>75,432+</strong>
              <span>pledges and counting</span>
            </div>
            <div className="role-impact__card">
              <span className="material-symbols-outlined" aria-hidden="true">
                visibility
              </span>
              <strong>48,921+</strong>
              <span>successful corneal transplants</span>
            </div>
            <div className="role-impact__card">
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
            <div className="role-step__icon-wrapper">
              <span className="role-step__number">1</span>
              <FileText className="role-step__icon" size={22} strokeWidth={1.5} />
            </div>
            <h3>Pledge</h3>
            <p>Register your intent online in just a few minutes.</p>
          </article>

          <article className="role-step">
            <div className="role-step__icon-wrapper">
              <span className="role-step__number">2</span>
              <Users className="role-step__icon" size={22} strokeWidth={1.5} />
            </div>
            <h3>Inform family</h3>
            <p>Share your decision so your loved ones can support your wish.</p>
          </article>

          <article className="role-step">
            <div className="role-step__icon-wrapper">
              <span className="role-step__number">3</span>
              <HeartHandshake className="role-step__icon" size={22} strokeWidth={1.5} />
            </div>
            <h3>Donation support</h3>
            <p>When the time comes, the family contacts the eye bank promptly.</p>
          </article>

          <article className="role-step">
            <div className="role-step__icon-wrapper">
              <span className="role-step__number">4</span>
              <Eye className="role-step__icon" size={22} strokeWidth={1.5} />
            </div>
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
  <p className="role-section__eyebrow">Make a difference</p>

  <h2>Leave Behind the Gift of Vision</h2>

  <p className="role-panel__description">
    By pledging your eyes, you can help restore sight and bring hope
    into someone's life.
  </p>

  <div className="role-panel__stats">
    <div>
      <strong>1</strong>
      <span>Donor can help restore vision</span>
    </div>

    <div>
      <strong>2</strong>
      <span>Corneas can be donated</span>
    </div>

    <div>
      <strong>3</strong>
      <span>Lives can be inspired</span>
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
                <div className="role-story__avatar role-story__avatar--one">
                  <img src={rameshImage} alt="Ramesh" />
                </div>

                <p>
                  Thanks to my donor, I can see my grandchildren today. I will be forever grateful.
                </p>

                <strong>- Ramesh, Madurai</strong>
                <span>Cornea recipient</span>
              </article>

              <article className="role-story">
                <div className="role-story__avatar role-story__avatar--two">
                  <img src={meenaImage} alt="Meena" />
                </div>

                <p>
                  My father believed in giving. His eyes are now helping someone else see a new life.
                </p>

                <strong>- Meena, Chennai</strong>
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

    <div className="role-faq__list">

      <details className="role-faq__item">
        <summary>
          <span>Is there any age limit for eye donation?</span>
          <span className="faq-icon">+</span>
        </summary>
        <p>
          No upper age limit. Most healthy adults can pledge, and evaluation
          happens at the time of need.
        </p>
      </details>

      <details className="role-faq__item">
        <summary>
          <span>Can people with spectacles donate eyes?</span>
          <span className="faq-icon">+</span>
        </summary>
        <p>
          Yes, wearing spectacles does not prevent a person from pledging
          their eyes.
        </p>
      </details>

      <details className="role-faq__item">
        <summary>
          <span>Does religion allow eye donation?</span>
          <span className="faq-icon">+</span>
        </summary>
        <p>
          Many faiths support donation as an act of generosity and service.
        </p>
      </details>

      <details className="role-faq__item">
        <summary>
          <span>Can eyes be donated after cataract surgery?</span>
          <span className="faq-icon">+</span>
        </summary>
        <p>
          Often yes. Medical suitability is checked by the eye bank team.
        </p>
      </details>

      <details className="role-faq__item">
        <summary>
          <span>Can diabetic patients donate eyes?</span>
          <span className="faq-icon">+</span>
        </summary>
        <p>
          In many cases, yes. The eye bank determines suitability after review.
        </p>
      </details>

      <details className="role-faq__item">
        <summary>
          <span>How long should we wait to contact the eye bank?</span>
          <span className="faq-icon">+</span>
        </summary>
        <p>
          Contact the eye bank as soon as possible, ideally within a few hours.
        </p>
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

    {/* Brand */}
    <div className="role-footer__brand">
      <div className="role-footer__brand-row">
        <img src={eyeLogo} alt="Vision of Hope logo" />

        <div>
          <strong>Vision of Hope</strong>
          <span>Eye Donation Pledge</span>
        </div>
      </div>

      <p>
        Together, we can bring the gift of sight and build a future where
        no one suffers from avoidable corneal blindness.
      </p>
    </div>

    {/* Quick Links */}
    <div className="role-footer__links">
      <strong>Quick Links</strong>

      <a href="#home">Home</a>

      <a
        href="https://jothieyecare.in/"
        target="_blank"
        rel="noreferrer"
      >
        About Jothi Eye Care
      </a>

      <a href="#process">How Eye Donation Works</a>

      <a href="#faq">Frequently Asked Questions</a>
    </div>

    {/* Contact */}
    <div className="role-footer__links role-footer__contact">
      <strong>Contact Us</strong>

      <span className="role-footer__hospital">
        JOTHI EYE CARE CENTRE
      </span>

      <span>
        152 &amp; 154, Calve Subraya Chetty Street,
        Puducherry – 605 001
      </span>

      <a href="tel:+914132224534">
        +91 413 222 4534
      </a>

      <a href="tel:+914132337659">
        +91 413 233 7659
      </a>

      <a href="mailto:jothieyecare@gmail.com">
        jothieyecare@gmail.com
      </a>
    </div>

    {/* Actions */}
    <div className="role-footer__links role-footer__actions">
      <strong>Make a Difference</strong>

      <p>
        Your decision today could help someone see the world tomorrow.
      </p>

      <button
        type="button"
        className="role-footer__pledge-btn"
        onClick={handlePledge}
      >
        Pledge My Eyes
      </button>

      <button
        type="button"
        className="role-footer__admin-btn"
        onClick={handleAdmin}
      >
        Admin Login
      </button>

      <a
        className="role-footer__admin-btn"
        href="https://www.technovahub.in"
        target="_blank"
        rel="noreferrer"
      >
        Powered by TechnovaHub
      </a>
    </div>

  </div>

  {/* Bottom Bar */}
  <div className="role-footer__bottom">
    <p>
      © {new Date().getFullYear()} Vision of Hope. All rights reserved.
    </p>

    <p>
      An initiative supporting the gift of sight.
    </p>
  </div>
</footer>
    </div>
  );
}

export default RoleSelectPage;

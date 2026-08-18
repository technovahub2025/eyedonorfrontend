/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import eyeHero from '../asset/eye.jpg';
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

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header__inner">
          <a href="#" className="landing-header__logo" onClick={(e) => e.preventDefault()}>
            <img alt="VisionGift eye donation logo" className="landing-header__logo-img" src={eyeLogo} />
            <span>LegacyEye</span>
          </a>
          <nav className="landing-nav" aria-label="Main navigation">
            <button
              className="landing-nav__toggle"
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
            <div
              className={
                'landing-nav__links ' + (mobileOpen ? 'landing-nav__links--open' : '')
              }
            >
              <a className="landing-nav__link landing-nav__link--active" href="#why">
                Home
              </a>
              <a className="landing-nav__link" href="#why">
                About
              </a>
              <a className="landing-nav__link" href="#how-it-works">
                How It Works
              </a>
              <a className="landing-nav__link" href="#why">
                Myths &amp; Facts
              </a>
              <a className="landing-nav__link" href="#why">
                FAQs
              </a>
              <button className="landing-nav__admin" type="button" onClick={handleAdmin}>
                Admin
              </button>
              <button className="landing-nav__cta" type="button" onClick={handlePledge}>
                Pledge Your Eyes
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-section__inner">
            <div className="hero-section__copy">
              <div className="hero-badge">
                <span className="material-symbols-outlined" aria-hidden="true">
                  favorite
                </span>
                Your pledge can help restore vision to others.
              </div>

              <p className="hero-slogan">இருவிழி கொடுப்போம், இருளை விரட்டுவோம்!</p>

              <h1 className="hero-title">
                Give the <br />
                <span className="hero-title__gradient">Gift of Sight</span>
              </h1>

              <p className="hero-subtitle">
                Your decision today can help someone see a brighter tomorrow. Pledge your eyes and
                leave behind a legacy of vision.
              </p>

              <div className="hero-actions">
                <button className="hero-cta" type="button" onClick={handlePledge}>
                  Pledge Your Eyes
                </button>
                <a className="hero-cta hero-cta--outline" href="#how-it-works">
                  Learn How It Works
                </a>
              </div>

              <div className="hero-steps">
                <div className="hero-step">
                  <span className="hero-step__number">1</span>
                  <span className="hero-step__label">Pledge</span>
                </div>
                <div className="hero-step__divider" />
                <div className="hero-step">
                  <span className="hero-step__number">2</span>
                  <span className="hero-step__label">Eyes</span>
                </div>
                <div className="hero-step__divider" />
                <div className="hero-step">
                  <span className="hero-step__number">3</span>
                  <span className="hero-step__label">Lifetime Of Impact</span>
                </div>
              </div>
            </div>

            <div className="hero-illustration" aria-label="Eye donation illustration">
              <img className="hero-illustration__img" alt="Eye representing the gift of sight" src={eyeHero} />
              <div className="hero-illustration__overlay" aria-hidden="true" />
              <div className="hero-illustration__note">
                <div className="hero-illustration__icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    visibility
                  </span>
                </div>
                <div className="hero-illustration__kicker">
                  <p className="hero-illustration__kicker-label">See the Difference</p>
                  <p className="hero-illustration__kicker-sub">Join thousands of donors</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-bg" aria-hidden="true" />
        </section>

        <section id="why" className="why-section">
          <div className="why-section__inner">
            <div className="section-head">
              <h2 className="section-title">One Decision Can Change Someone's World</h2>
              <p className="section-subtitle">
                Understand the profound impact of your simple decision to pledge.
              </p>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-card__icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    visibility
                  </span>
                </div>
                <h3 className="feature-card__title">Restore Vision</h3>
                <p className="feature-card__text">
                  Donated corneal tissue helps restore sight to those suffering from corneal blindness.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card__icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    diversity_1
                  </span>
                </div>
                <h3 className="feature-card__title">Leave a Legacy</h3>
                <p className="feature-card__text">
                  Your generosity continues long after, offering the ultimate gift to someone in need.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card__icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    verified
                  </span>
                </div>
                <h3 className="feature-card__title">Simple &amp; Free</h3>
                <p className="feature-card__text">
                  The pledging process is entirely free and only takes a few minutes to complete.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card__icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    campaign
                  </span>
                </div>
                <h3 className="feature-card__title">Spread Awareness</h3>
                <p className="feature-card__text">
                  Inform your family about your decision to ensure your wishes are honored.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="impact-section">
          <div className="impact-section__inner">
            <div className="impact-grid">
              <div className="impact-item">
                <span className="impact-value">25K+</span>
                <span className="impact-label">People Reached</span>
              </div>
              <div className="impact-item">
                <span className="impact-value">12K</span>
                <span className="impact-label">Donors Pledged</span>
              </div>
              <div className="impact-item">
                <span className="impact-value">8,500</span>
                <span className="impact-label">Vision Restored</span>
              </div>
              <div className="impact-item">
                <span className="impact-value">10K+</span>
                <span className="impact-label">Families Inspired</span>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-section">
          <div className="how-section__inner">
            <div className="section-head">
              <h2 className="section-title">How Pledging Works</h2>
              <p className="section-subtitle">
                A simple, transparent process to leave a lasting legacy.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-card__number">01</div>
                <h3 className="step-card__title">Pledge</h3>
                <p className="step-card__text">
                  Fill out the online form with your basic details to register your intent.
                </p>
              </div>
              <div className="step-card">
                <div className="step-card__number">02</div>
                <h3 className="step-card__title">Inform Family</h3>
                <p className="step-card__text">
                  Discuss your decision with next of kin, as their consent is needed at the time.
                </p>
              </div>
              <div className="step-card">
                <div className="step-card__number">03</div>
                <h3 className="step-card__title">At Time of Need</h3>
                <p className="step-card__text">Family contacts the eye bank within 6-8 hours of passing.</p>
              </div>
              <div className="step-card">
                <div className="step-card__number">04</div>
                <h3 className="step-card__title">Restore Sight</h3>
                <p className="step-card__text">
                  The retrieved tissue is evaluated and used to help someone see again.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-section__inner">
            <h2 className="cta-title">Ready to leave a legacy?</h2>
            <p className="cta-subtitle">
              It only takes two minutes to register as a donor. Join us in our mission to eliminate
              corneal blindness.
            </p>
            <button className="cta-cta" type="button" onClick={handlePledge}>
              Pledge Your Eyes Now
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="footer-brand">
            <div className="footer-brand__logo">
              <img alt="VisionGift eye donation logo" src={eyeLogo} />
            </div>
            <p className="footer-brand__text">
              Dedicated to facilitating eye donations and restoring vision through compassion and
              transparency.
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-links__title">Quick Links</h4>
            <a href="#" onClick={(e) => e.preventDefault()}>Medical Advisory Board</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Partner Hospitals</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Contact Us</a>
          </div>

          <div className="footer-legal">
            <h4 className="footer-legal__title">Legal</h4>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>

        <div className="landing-footer__base">
          <p>© 2024 LegacyEye Foundation. Honoring the gift of sight.</p>
          <a
            className="landing-footer__powered"
            href="https://www.technovahub.in"
            rel="noreferrer"
            target="_blank"
          >
            Powered by TechnovaHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default RoleSelectPage;

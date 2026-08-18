/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import './RoleSelectPage.css';

function EyeDonationLanding({ onRoleSelect }) {
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
    <div className="eye-donation-landing">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <a href="#" className="site-logo" onClick={(e) => e.preventDefault()}>
              <span className="logo-icon">👁️</span>
              <span className="logo-text">Vision of Hope</span>
            </a>

            <nav className="main-nav" aria-label="Main navigation">
              <button
                className="nav-toggle"
                type="button"
                aria-label="Toggle menu"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span className="hamburger-icon">{mobileOpen ? '✕' : '☰'}</span>
              </button>

              <ul className={`nav-list ${mobileOpen ? 'nav-list--open' : ''}`}>
                <li><a href="#home" className="nav-link active">Home</a></li>
                <li><a href="#about" className="nav-link">About Us</a></li>
                <li><a href="#donation" className="nav-link">Eye Donation</a></li>
                <li><a href="#banks" className="nav-link">Eye Banks</a></li>
                <li><a href="#stories" className="nav-link">Stories</a></li>
                <li><a href="#faq" className="nav-link">FAQ</a></li>
                <li><a href="#contact" className="nav-link">Contact Us</a></li>
                <li>
                  <button className="btn-pledge-nav" onClick={handlePledge}>
                    Pledge My Eyes
                  </button>
                </li>
                <li>
                  <button className="btn-admin" onClick={handleAdmin}>
                    Admin
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Give the <span className="highlight">Gift of Sight</span>
              </h1>
              <p className="hero-subtitle">
                Your eyes can light up someone's world.<br />
                Pledge today. Inspire forever.
              </p>
              <button className="btn-hero" onClick={handlePledge}>
                Pledge My Eyes
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-number">1</span>
                <span className="stat-label">Donor can restore sight to <strong>2 People</strong></span>
              </div>
              <div className="stat-card">
                <span className="stat-number">75,432+</span>
                <span className="stat-label">Pledges and counting</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">48,921+</span>
                <span className="stat-label">Successful Corneal Transplants</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">20+</span>
                <span className="stat-label">Partner Eye Banks Across India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="donation">
        <div className="container">
          <h2 className="section-title">How Eye Donation Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Pledge</h3>
              <p>Pledge your eyes online in just 2 minutes.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Inform Your Family</h3>
              <p>Let your family know about your decision.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Donation After Death</h3>
              <p>Your family informs the eye bank.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Sight Restored</h3>
              <p>Your eyes bring new light to 2 lives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Donate */}
      <section className="eligibility-section">
        <div className="container">
          <div className="eligibility-content">
            <div className="eligibility-text">
              <h2>Who Can Donate?</h2>
              <ul>
                <li>✅ Anyone above 18 years can pledge.</li>
                <li>✅ No upper age limit.</li>
                <li>✅ People with spectacles, diabetes, or cataract can donate.</li>
                <li>✅ Almost everyone can donate eyes.</li>
              </ul>
            </div>
            <div className="emergency-contact">
              <h3>📞 Report an Eye Donor (24x7)</h3>
              <p>In case of a sad demise, please contact the nearest eye bank immediately.</p>
              <div className="emergency-phone">1800 123 4567</div>
              <p className="emergency-note">Available 24x7 • Toll Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Eye Banks */}
      <section className="banks-section" id="banks">
        <div className="container">
          <h2>Find an Eye Bank Near You</h2>
          <div className="bank-search">
            <input type="text" placeholder="Enter your city or location" />
            <button className="btn-search">Find Eye Banks</button>
          </div>
          <div className="bank-stats">
            <span>20+ Eye Banks</span>
            <span>100+ Cities</span>
            <span>24x7 Availability</span>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="stories-section" id="stories">
        <div className="container">
          <h2>Stories of Light</h2>
          <div className="stories-grid">
            <div className="story-card">
              <blockquote>
                "Thanks to my donor, I can see my grandchildren today. I will be forever grateful."
              </blockquote>
              <cite>— Ramesh, Chennai<br /><span>Cornea Recipient</span></cite>
            </div>
            <div className="story-card">
              <blockquote>
                "My father believed in giving. His eyes are now giving someone else a new life."
              </blockquote>
              <cite>— Meena, Madurai<br /><span>Donor's Daughter</span></cite>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Is there any age limit for eye donation?</h4>
            </div>
            <div className="faq-item">
              <h4>Can people with spectacles donate eyes?</h4>
            </div>
            <div className="faq-item">
              <h4>Can eyes be donated if we have cataract?</h4>
            </div>
            <div className="faq-item">
              <h4>Can diabetic patients donate eyes?</h4>
            </div>
            <div className="faq-item">
              <h4>Does religion allow eye donation?</h4>
            </div>
            <div className="faq-item">
              <h4>How long should we wait to contact eye bank?</h4>
            </div>
          </div>
          <div className="faq-cta">
            <button className="btn-faq">View All FAQs</button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <h2>Be the Reason Someone Sees Tomorrow</h2>
          <p>Pledge your eyes today and leave a legacy of light.</p>
          <button className="btn-cta" onClick={handlePledge}>Pledge My Eyes</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>Vision of Hope</h3>
              <p>Let's build a society where no one suffers from corneal blindness.</p>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#donation">Eye Donation</a></li>
                <li><a href="#banks">Eye Banks</a></li>
                <li><a href="#stories">Stories</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Information</h4>
              <ul>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Myths &amp; Facts</a></li>
                <li><a href="#">Pledge Your Eyes</a></li>
                <li><a href="#">Become a Volunteer</a></li>
                <li><a href="#">News &amp; Events</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Us</h4>
              <p className="contact-phone">📞 1800 123 4567</p>
              <p className="contact-info">(Toll Free 24x7)</p>
              <p className="contact-email">✉️ info@visionofhope.org</p>
              <p className="contact-address">📍 123, Main Street, Chennai – 600 001.</p>
            </div>

            <div className="footer-col">
              <h4>Our Partners</h4>
              <div className="partners">
                <span className="partner">ARAVIND</span>
                <span className="partner">SANKARA</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Vision of Hope. All rights reserved.</p>
            <div className="footer-legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EyeDonationLanding;
import eyeLogo from '../asset/logo.png';
import './SharedFooter.css';

function SharedFooter({ onHome, onPledge, onAdmin }) {
  const currentYear = new Date().getFullYear();

  function handleHomeClick(event) {
    if (onHome) {
      event.preventDefault();
      onHome();
    }
  }

  return (
    <footer className="role-footer" id="contact">
      <div className="role-footer__inner">
        <div className="role-footer__brand">
          <div className="role-footer__brand-row">
            <img src={eyeLogo} alt="Vision of Hope logo" />

            <div>
              <strong>Vision of Hope</strong>
              <span>Eye Donation Pledge</span>
            </div>
          </div>

          <p>
            Together, we can bring the gift of sight and build a future where no one suffers from
            avoidable corneal blindness.
          </p>
        </div>

        <div className="role-footer__links">
          <strong>Quick Links</strong>

          <a href="#home" onClick={handleHomeClick}>
            Home
          </a>

          <a href="https://jothieyecare.in/" target="_blank" rel="noreferrer">
            About Jothi Eye Care
          </a>

          <a href="#process">How Eye Donation Works</a>

          <a href="#faq">Frequently Asked Questions</a>
        </div>

        <div className="role-footer__links role-footer__contact">
          <strong>Contact Us</strong>

          <span className="role-footer__hospital">JOTHI EYE CARE CENTRE</span>

          <span>152 &amp; 154, Calve Subraya Chetty Street, Puducherry - 605 001</span>

          <a href="tel:+914132224534">+91 413 222 4534</a>

          <a href="tel:+914132337659">+91 413 233 7659</a>

          <a href="mailto:jothieyecare@gmail.com">jothieyecare@gmail.com</a>
        </div>

        <div className="role-footer__links role-footer__actions">
          <strong>Make a Difference</strong>

          <p>Your decision today could help someone see the world tomorrow.</p>

          <button type="button" className="role-footer__pledge-btn" onClick={onPledge}>
            Pledge My Eyes
          </button>

          <button type="button" className="role-footer__admin-btn" onClick={onAdmin}>
            Admin Login
          </button>

          <a
            className="role-footer__powered-btn"
            href="https://www.technovahub.in"
            target="_blank"
            rel="noreferrer"
          >
            Powered by TechnovaHub
          </a>
        </div>
      </div>

      <div className="role-footer__bottom">
        <p>© {currentYear} Vision of Hope. All rights reserved.</p>

        <p>An initiative supporting the gift of sight.</p>
      </div>
    </footer>
  );
}

export default SharedFooter;

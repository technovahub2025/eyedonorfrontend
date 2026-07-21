import { useEffect, useState } from 'react';
import ProgressStepper from '../components/ProgressStepper';
import { apiRequest } from '../lib/apiClient';
import './TermsPage.css';

const steps = [
  { label: 'Registration' },
  { label: 'Terms' },
  { label: 'Confirm' },
];

const terms = [
  {
    title: 'Your gift',
    body: 'I agree that my eye donation may be used to help restore sight, support learning, or improve care for others after my lifetime.',
  },
  {
    title: 'Medical review',
    body: 'I understand that the team will review the details at the time of donation to make sure the gift is suitable and safe.',
  },
  {
    title: 'How it may be used',
    body: 'My gift may support sight-restoring treatment, learning, or improvements in care and recovery methods.',
  },
  {
    title: 'No cost to family',
    body: 'I understand that my family will not be charged, and the process will be handled with care and respect.',
  },
  {
    title: 'Privacy',
    body: 'My personal details will be kept private and used only to support the donation process.',
  },
];

function TermsPage({ onAccept, onDecline }) {
  const [rootStatus, setRootStatus] = useState('Checking your connection...');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkRoot() {
      try {
        const data = await apiRequest('/');
        if (!active) return;
        setRootStatus(typeof data === 'string' ? data : data?.message || 'Everything is connected.');
      } catch (err) {
        if (!active) return;
        setRootStatus(`Connection check failed: ${err.message}`);
      }
    }

    checkRoot();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="terms-page">
     

      <main className="terms-page__main">
        <section className="terms-page__content">
          <div className="terms-page__stepper-wrap">
            <ProgressStepper steps={steps} currentStep={2} />
          </div>

          <section className="terms-card" aria-labelledby="terms-title">
            <h1 id="terms-title">Consent for Eye Donation</h1>
            <p className="terms-card__intro">
              Please review the simple terms below before you continue with your gift of sight.
            </p>
            <p className="terms-card__status">{rootStatus}</p>

            <div className="terms-card__scroll custom-scrollbar">
              {terms.map((item, index) => (
                <article className="terms-card__section" key={item.title}>
                  <h3>
                    {index + 1}. {item.title}
                  </h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>

            <label className="terms-card__agree">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />
              <span>I agree to these terms and want to continue.</span>
            </label>

            <div className="terms-card__actions">
              <button
                className="terms-card__button terms-card__button--primary"
                type="button"
                onClick={() => onAccept?.()}
                disabled={!accepted}
              >
                <span>Accept</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
              <button
                className="terms-card__button terms-card__button--secondary"
                type="button"
                onClick={() => onDecline?.()}
              >
                <span>Decline</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>
          </section>

          <section className="terms-page__notice">
            <span className="material-symbols-outlined" aria-hidden="true">
              info
            </span>
            <p>You can change your mind later by contacting our support team.</p>
          </section>
        </section>
      </main>

      <footer className="terms-page__footer">
        <div className="terms-page__footer-inner">
          <div className="terms-page__footer-brand">
            <span className="material-symbols-outlined" aria-hidden="true">
              visibility
            </span>
            <span>VisionGift</span>
          </div>

          <div className="terms-page__footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#accessibility">Accessibility</a>
            <a href="#contact">Contact Us</a>
          </div>
          <a className="terms-page__powered-by" href="https://www.technovahub.in">
            Powered by TechnovaHub
          </a>

          <p>Copyright 2026 VisionGift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default TermsPage;

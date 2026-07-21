import { useEffect, useState } from 'react';
import ProgressStepper from '../components/ProgressStepper';
import { API_BASE_URL, apiRequest } from '../lib/apiClient';
import './TermsPage.css';

const steps = [
  { label: 'Registration' },
  { label: 'Terms' },
  { label: 'Confirm' },
];

const terms = [
  {
    title: 'Authorization and Consent',
    body: 'I hereby authorize VisionGift to recover my ocular tissues for transplantation, research, or education upon my legal passing. I understand that this gift is voluntary and altruistic in nature, intended to restore vision to those in clinical need or to advance the field of ophthalmology.',
  },
  {
    title: 'Medical Suitability',
    body: 'I understand that final suitability for donation is determined by professional clinical screening at the time of recovery. This includes a review of medical records and potential blood testing to ensure the safety of the recipient and the integrity of the medical gift.',
  },
  {
    title: 'Use of Ocular Tissue',
    body: 'Recovered tissues may be used for sight-restoring corneal transplants, glaucoma research, medical education for ophthalmologists-in-training, or development of new surgical techniques. All uses strictly adhere to national medical ethics and professional standards.',
  },
  {
    title: 'No Cost to Family',
    body: 'VisionGift confirms that there are no costs to the donor’s family or estate associated with the eye donation process. The recovery process is performed with the utmost respect and does not interfere with traditional funeral arrangements or open-casket viewings.',
  },
  {
    title: 'Privacy and Records',
    body: 'Personal information is handled with absolute confidentiality under HIPAA standards. Data is used solely for the coordination of donation services and clinical verification.',
  },
];

function TermsPage() {
  const [rootStatus, setRootStatus] = useState('Checking API connection...');

  useEffect(() => {
    let active = true;

    async function checkRoot() {
      try {
        const data = await apiRequest('/');
        if (!active) return;
        setRootStatus(typeof data === 'string' ? data : data?.message || 'API root reachable');
      } catch (err) {
        if (!active) return;
        setRootStatus(`API check failed: ${err.message}`);
      }
    }

    checkRoot();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="terms-page">
      <header className="terms-page__header">
        <div className="terms-page__brand">
          <span className="material-symbols-outlined" aria-hidden="true">
            visibility
          </span>
          <span>VisionGift</span>
        </div>
      </header>

      <main className="terms-page__main">
        <section className="terms-page__content">
          <div className="terms-page__stepper-wrap">
            <ProgressStepper steps={steps} currentStep={2} />
          </div>

          <section className="terms-card" aria-labelledby="terms-title">
            <h1 id="terms-title">Consent for Eye Donation</h1>
            <p className="terms-card__intro">
              Please review the medical excellence standards and altruistic commitments below to
              proceed with your gift of sight.
            </p>
            <p className="terms-card__status">{rootStatus}</p>
            <p className="terms-card__status">
              API base: <code>{API_BASE_URL}</code>
            </p>

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
              <input type="checkbox" />
              <span>
                I agree to the terms and conditions described above and reaffirm my commitment to
                the gift of sight.
              </span>
            </label>

            <div className="terms-card__actions">
              <button className="terms-card__button terms-card__button--primary" type="button">
                <span>Accept</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
              <button className="terms-card__button terms-card__button--secondary" type="button">
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
            <p>
              You can withdraw your consent at any time through our Support portal or by contacting
              our 24/7 donation coordination center.
            </p>
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

          <p>© 2024 VisionGift. All rights reserved. Medical Excellence in Eye Donation.</p>
        </div>
      </footer>
    </div>
  );
}

export default TermsPage;

import { useEffect, useState } from 'react';
import ReviewRow from '../components/ReviewRow';
import ProgressStepper from '../components/ProgressStepper';
import {
  API_BASE_URL,
  apiRequest,
} from '../lib/apiClient';
import './VerificationPage.css';

const steps = [
  { label: 'Basics' },
  { label: 'Consent' },
  { label: 'Verify' },
];

const profile = [
  {
    icon: 'person',
    label: 'Full Name',
    value: 'Eleanor Vance',
  },
  {
    icon: 'mail',
    label: 'Email Address',
    value: 'e.vance@medical-institute.org',
  },
  {
    icon: 'call',
    label: 'Phone Number',
    value: '+1 (555) 902-1244',
  },
];

function VerificationPage({ userToken, onSubmitSuccess, onCancel }) {
  const [token, setToken] = useState(userToken || '');
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
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

    async function loadUserProfile() {
      if (!token) return;
      setLoadingProfile(true);
      try {
        const data = await apiRequest('/api/user/me', { token });
        if (active) {
          setUserProfile(data);
        }
      } catch {
        if (active) {
          setUserProfile(null);
        }
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    }

    checkRoot();
    loadUserProfile();

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    setToken(userToken || '');
  }, [userToken]);

  return (
    <div className="verification-page">
      <header className="verification-page__header">
        <div className="verification-page__header-inner">
          <div className="verification-page__brand">
            <span className="material-symbols-outlined" aria-hidden="true">
              visibility
            </span>
            <span>VisionGift</span>
          </div>

          <nav className="verification-page__nav" aria-label="Primary">
            <a href="#how-it-works">How it Works</a>
            <a href="#impact">Impact</a>
            <a href="#support">Support</a>
            <button type="button">Register Now</button>
          </nav>
        </div>
      </header>

      <main className="verification-page__main">
        <section className="verification-page__content">
          <div className="verification-page__stepper-wrap">
            <ProgressStepper steps={steps} currentStep={3} />
          </div>

          <section className="verification-card" aria-labelledby="verification-title">
            <div className="verification-card__top">
              <div>
                <h1 id="verification-title">Review Your Details</h1>
                <p>
                  Please confirm your registration information before final submission.
                </p>
                <p className="verification-card__status-line">{rootStatus}</p>
                <p className="verification-card__status-line">
                  API base: <code>{API_BASE_URL}</code>
                </p>
              </div>

              <div className="verification-card__status">
                <span className="material-symbols-outlined" aria-hidden="true">
                  info
                </span>
                <span>Status: Pending Verification</span>
              </div>
            </div>

            <div className="verification-card__rows">
              {profile.map((item) => (
                <ReviewRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>

            <div className="verification-card__user-profile">
              <span className="verification-card__profile-label">Live User Profile</span>
              <p>
                {loadingProfile
                  ? 'Loading user profile...'
                  : userProfile
                  ? JSON.stringify(userProfile)
                  : 'No user profile loaded yet. Sign in through the user login screen first.'}
              </p>
            </div>

            <div className="verification-card__actions">
              <div className="verification-card__notice">
                <span className="material-symbols-outlined" aria-hidden="true">
                  verified_user
                </span>
                <p>
                  By clicking 'Submit Registration', I confirm that the data provided is
                  accurate and I understand my donation can restore sight to those in need.
                </p>
              </div>

              <div className="verification-card__buttons">
                <button
                  className="verification-card__button verification-card__button--primary"
                  type="button"
                  onClick={() => onSubmitSuccess?.()}
                >
                  Submit Registration
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                  </span>
                </button>
                <button
                  className="verification-card__button verification-card__button--secondary"
                  type="button"
                  onClick={() => onCancel?.()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>

          <section className="verification-page__trust">
            <div>
              <span className="material-symbols-outlined" aria-hidden="true">
                encrypted
              </span>
              <span>HIPAA Compliant Data Handling</span>
            </div>
            <div>
              <span className="material-symbols-outlined" aria-hidden="true">
                verified
              </span>
              <span>Verified Donor Database</span>
            </div>
          </section>
        </section>
      </main>

      <footer className="verification-page__footer">
        <div className="verification-page__footer-inner">
          <div className="verification-page__footer-brand">
            <span className="material-symbols-outlined" aria-hidden="true">
              visibility
            </span>
            <span>VisionGift</span>
          </div>

          <p>© 2026 VisionGift. All rights reserved. Medical Excellence in Eye Donation.</p>

          <div className="verification-page__footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#accessibility">Accessibility</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default VerificationPage;

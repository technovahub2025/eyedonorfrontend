import { useEffect, useState } from 'react';
import ReviewRow from '../components/ReviewRow';
import ProgressStepper from '../components/ProgressStepper';
import { apiRequest } from '../lib/apiClient';
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
  const [rootStatus, setRootStatus] = useState('Checking your connection...');

  useEffect(() => {
    let active = true;

    async function checkRoot() {
      try {
        const data = await apiRequest('/');
        if (!active) return;
        setRootStatus(typeof data === 'string' ? data : data?.message || 'Everything is ready.');
      } catch (err) {
        if (!active) return;
        setRootStatus(`Connection check failed: ${err.message}`);
      }
    }

    async function loadUserProfile() {
      if (!token) return;
      setLoadingProfile(true);
      try {
        const data = await apiRequest('/api/donors/me', { token });
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
      
      <main className="verification-page__main">
        <section className="verification-page__content">
          <div className="verification-page__stepper-wrap">
            <ProgressStepper steps={steps} currentStep={3} />
          </div>

          <section className="verification-card" aria-labelledby="verification-title">
            <div className="verification-card__top">
              <div>
                <h1 id="verification-title">Check your details</h1>
                <p>Please confirm your information before you finish.</p>
                <p className="verification-card__status-line">{rootStatus}</p>
              </div>

              <div className="verification-card__status">
                <span className="material-symbols-outlined" aria-hidden="true">
                  info
                </span>
                <span>Status: Ready to continue</span>
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
              <span className="verification-card__profile-label">Saved details</span>
              <p>
                {loadingProfile
                  ? 'Loading your details...'
                  : userProfile
                  ? 'Your details are ready to verify.'
                  : 'No details loaded yet. Sign in through the login screen first.'}
              </p>
            </div>

            <div className="verification-card__actions">
              <div className="verification-card__notice">
                <span className="material-symbols-outlined" aria-hidden="true">
                  verified_user
                </span>
                <p>
                  By clicking Submit, I confirm that the details I shared are correct and I
                  understand my donation can help restore sight.
                </p>
              </div>

              <div className="verification-card__buttons">
                <button
                  className="verification-card__button verification-card__button--primary"
                  type="button"
                  onClick={() => onSubmitSuccess?.()}
                >
                  Submit
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
              <span>Private handling</span>
            </div>
            <div>
              <span className="material-symbols-outlined" aria-hidden="true">
                verified
              </span>
              <span>Trusted list</span>
            </div>
          </section>
        </section>
      </main>

    </div>
  );
}

export default VerificationPage;

import { useEffect, useState } from 'react';
import ProgressStepper from '../components/ProgressStepper';
import { apiRequest } from '../lib/apiClient';
import './TermsPage.css';

const steps = [
  { label: 'Registration' },
  { label: 'Terms' },
  { label: 'Confirm' },
];

const createTermsEndpoint = '/api/terms/createterms';

const initialTermForm = {
  name: '',
  age: '',
  gender: '',
};

function TermsPage({ onAccept, onDecline }) {
  const [rootStatus, setRootStatus] = useState('Checking your connection...');
  const [accepted, setAccepted] = useState(false);
  const [savingTerm, setSavingTerm] = useState(false);
  const [termsMessage, setTermsMessage] = useState('');
  const [termsError, setTermsError] = useState('');
  const [termForm, setTermForm] = useState(initialTermForm);

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

    checkRoot();

    return () => {
      active = false;
    };
  }, []);

  async function handleCreateTerm(event) {
    event.preventDefault();
    setSavingTerm(true);
    setTermsMessage('');
    setTermsError('');

    const payload = {
      fullName: termForm.name.trim(),
      name: termForm.name.trim(),
      age: termForm.age === '' ? '' : Number(termForm.age),
      gender: termForm.gender.trim(),
    };

    try {
      await apiRequest(createTermsEndpoint, {
        method: 'POST',
        body: payload,
      });

      setTermsMessage('Your details were saved successfully.');
      setTermForm(initialTermForm);
    } catch (err) {
      setTermsError(err.message);
    } finally {
      setSavingTerm(false);
    }
  }

  return (
    <div className="terms-page">
      <main className="terms-page__main">
        <section className="terms-page__content">
          <div className="terms-page__stepper-wrap">
            <ProgressStepper steps={steps} currentStep={2} />
          </div>

          <section className="terms-card" aria-labelledby="terms-title">
            <div className="terms-card__header">
              <div>
                <h1 id="terms-title">Review and continue</h1>
                <p className="terms-card__intro">
                  Please review the simple notes below before you continue.
                </p>
                <p className="terms-card__status">{rootStatus}</p>
              </div>

              <div className="terms-card__summary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  checklist
                </span>
                <div>
                  <strong>Complete the form</strong>
                  <p>Your submission is saved for the team to review.</p>
                </div>
              </div>
            </div>

            <section className="terms-card__admin-panel" aria-labelledby="terms-admin-title">
              <div className="terms-card__admin-header">
                <div>
                  <p className="terms-card__eyebrow">Your entry</p>
                  <h2 id="terms-admin-title">Add your details</h2>
                </div>
                <span className="terms-card__admin-badge">Saved automatically</span>
              </div>

              <form className="terms-card__admin-form" onSubmit={handleCreateTerm}>
                <label className="terms-card__field">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={termForm.name}
                    onChange={(event) => setTermForm({ ...termForm, name: event.target.value })}
                    required
                  />
                </label>

                <label className="terms-card__field">
                  <span>Age</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="25"
                    value={termForm.age}
                    onChange={(event) => setTermForm({ ...termForm, age: event.target.value })}
                    required
                  />
                </label>

                <label className="terms-card__field">
                  <span>Gender</span>
                  <select
                    value={termForm.gender}
                    onChange={(event) => setTermForm({ ...termForm, gender: event.target.value })}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </label>

                <button className="terms-card__submit" type="submit" disabled={savingTerm}>
                  {savingTerm ? 'Saving...' : 'Save Details'}
                </button>
              </form>

              {termsMessage ? <p className="terms-card__success">{termsMessage}</p> : null}
              {termsError ? <p className="terms-card__error">{termsError}</p> : null}
            </section>

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
    </div>
  );
}

export default TermsPage;

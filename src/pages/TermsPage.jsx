import { useEffect, useMemo, useState } from 'react';
import ProgressStepper from '../components/ProgressStepper';
import { apiRequest } from '../lib/apiClient';
import './TermsPage.css';

const steps = [
  { label: 'Registration' },
  { label: 'Terms' },
  { label: 'Confirm' },
];

const termsEndpoint = '/api/terms/getall';
const createTermsEndpoint = '/api/terms/createterms';

const initialTermForm = {
  name: '',
  age: '',
  gender: '',
};

function getSalutation(gender) {
  const value = String(gender || '').trim().toLowerCase();

  if (['male', 'm', 'mr', 'man'].includes(value)) {
    return 'Mr';
  }

  if (['female', 'f', 'mrs', 'woman'].includes(value)) {
    return 'Mrs';
  }

  return '';
}

function extractItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.data || payload?.terms || payload?.items || payload?.records || payload?.result || [];
}

function normalizeTerm(item, index) {
  const salutation = getSalutation(item?.gender);
  const baseName = item?.fullName || item?.name || item?.title || item?.label || `Term ${index + 1}`;

  return {
    id: item?._id || item?.id || item?.termId || `term-${index}`,
    name: salutation ? `${salutation} ${baseName}` : baseName,
    age: item?.age ?? '',
    gender: item?.gender ?? '',
    body: item?.body || item?.description || item?.details || item?.note || '',
  };
}

function TermsPage({ onAccept, onDecline }) {
  const [rootStatus, setRootStatus] = useState('Checking your connection...');
  const [accepted, setAccepted] = useState(false);
  const [terms, setTerms] = useState([]);
  const [loadingTerms, setLoadingTerms] = useState(true);
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
        setRootStatus(typeof data === 'string' ? data : data?.message || 'Everything is connected.');
      } catch (err) {
        if (!active) return;
        setRootStatus(`Connection check failed: ${err.message}`);
      }
    }

    async function loadTerms() {
      setLoadingTerms(true);
      try {
        const response = await apiRequest(termsEndpoint);
        if (!active) return;

        setTerms(extractItems(response).map(normalizeTerm));
        setTermsError('');
      } catch (err) {
        if (!active) return;
        setTerms([]);
        setTermsError(err.message);
      } finally {
        if (active) {
          setLoadingTerms(false);
        }
      }
    }

    checkRoot();
    loadTerms();

    return () => {
      active = false;
    };
  }, []);

  const summaryText = useMemo(() => {
    if (!terms.length) {
      return 'No terms have been loaded yet.';
    }

    return `${terms.length} term${terms.length === 1 ? '' : 's'} ready to review.`;
  }, [terms]);

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

      setTermsMessage('Your details were submitted successfully.');
      setTermForm(initialTermForm);

      const response = await apiRequest(termsEndpoint);
      setTerms(extractItems(response).map(normalizeTerm));
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
                <h1 id="terms-title">Consent for Eye Donation</h1>
                <p className="terms-card__intro">
                  Please review the simple terms below before you continue with your gift of sight.
                </p>
                <p className="terms-card__status">{rootStatus}</p>
              </div>

              <div className="terms-card__summary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  checklist
                </span>
                <div>
                  <strong>{summaryText}</strong>
                  <p>Your submission is saved to the admin record list.</p>
                </div>
              </div>
            </div>

            <section className="terms-card__admin-panel" aria-labelledby="terms-admin-title">
              <div className="terms-card__admin-header">
                <div>
                  <p className="terms-card__eyebrow">User entry</p>
                  <h2 id="terms-admin-title">Enter your details</h2>
                </div>
                <span className="terms-card__admin-badge">POST /api/terms/createterms</span>
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

              <div className="terms-card__scroll custom-scrollbar">
                {loadingTerms ? (
                  <div className="terms-card__empty">Loading saved entries...</div>
                ) : terms.length ? (
                  terms.map((item, index) => (
                    <article className="terms-card__row" key={item.id || `${item.name}-${index}`}>
                      <div className="terms-card__row-index">{index + 1}</div>
                      <div className="terms-card__row-content">
                        <div className="terms-card__row-heading">
                          <h3>{item.name}</h3>
                          {item.age !== '' || item.gender ? (
                            <span className="terms-card__row-meta">
                              {[item.age !== '' ? `Age ${item.age}` : null, getSalutation(item.gender) || item.gender || null]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          ) : null}
                        </div>
                        <p>{item.body || 'No additional description was provided.'}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="terms-card__empty">No saved entries yet.</div>
                )}
              </div>
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

import { useEffect, useState } from 'react';
import ProgressStepper from '../components/ProgressStepper';
import { apiRequest } from '../lib/apiClient';
import './TermsPage.css';

const steps = [
  { label: 'Registration' },
  { label: 'Pledge' },
  { label: 'Complete' },
];

const createTermsEndpoint = '/api/terms/createterms';

const pledgePoints = [
  'I understand this is a voluntary pledge.',
  'I agree to share accurate details with the admin team.',
  'I am ready to continue to the final thank you step.',
];

const initialTermForm = {
  name: '',
  age: '',
  gender: '',
};

function TermsPage({ onAccept, onDecline }) {
  const [rootStatus, setRootStatus] = useState('Checking your connection...');
  const [savingTerm, setSavingTerm] = useState(false);
  const [termsMessage, setTermsMessage] = useState('');
  const [termsError, setTermsError] = useState('');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [termForm, setTermForm] = useState(initialTermForm);
  const [submittedRows, setSubmittedRows] = useState([]);
  const [rowMessage, setRowMessage] = useState('');
  const [rowError, setRowError] = useState('');
  const [addingRow, setAddingRow] = useState(false);

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

    if (!pledgeAccepted) {
      setTermsError('Please confirm the pledge before you continue.');
      setSavingTerm(false);
      return;
    }

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

      const newRow = {
        ...payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setSubmittedRows((current) => [newRow, ...current]);
      setTermsMessage('Your details and pledge were submitted successfully.');
      setTermForm(initialTermForm);
      setPledgeAccepted(false);
    } catch (err) {
      setTermsError(err.message);
    } finally {
      setSavingTerm(false);
    }
  }

  async function handleAddAnotherRow(event) {
    event.preventDefault();
    setAddingRow(true);
    setRowMessage('');
    setRowError('');

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

      const newRow = {
        ...payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setSubmittedRows((current) => [newRow, ...current]);
      setRowMessage('New row added successfully.');
      setTermForm(initialTermForm);
      setPledgeAccepted(false);
    } catch (err) {
      setRowError(err.message);
    } finally {
      setAddingRow(false);
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
                <h1 id="terms-title">Enter your details and confirm your pledge</h1>
                <p className="terms-card__intro">
                  First share your name, age, and gender. Then review and accept the pledge before
                  submitting.
                </p>
                <p className="terms-card__status">{rootStatus}</p>
              </div>

              <div className="terms-card__summary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  checklist
                </span>
                <div>
                  <strong>Two-part step</strong>
                  <p>Fill in your details, then confirm the pledge below.</p>
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

                <div className="terms-card__form-actions">
                  <button className="terms-card__submit" type="submit" disabled={savingTerm}>
                    {savingTerm ? 'Saving...' : 'Save Details'}
                  </button>
                  <button
                    className="terms-card__add-row"
                    type="button"
                    onClick={handleAddAnotherRow}
                    disabled={addingRow}
                  >
                    {addingRow ? 'Adding...' : 'Add Row'}
                  </button>
                </div>

                <section className="terms-card__scroll" aria-label="Pledge points">
                  {pledgePoints.map((point, index) => (
                    <article key={point} className="terms-card__row">
                      <div className="terms-card__row-index">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="terms-card__row-content">
                        <div className="terms-card__row-heading">
                          <h3>Pledge point {index + 1}</h3>
                        </div>
                        <p>{point}</p>
                      </div>
                    </article>
                  ))}
                </section>

                <label className="terms-card__agree">
                  <input
                    type="checkbox"
                    checked={pledgeAccepted}
                    onChange={(event) => setPledgeAccepted(event.target.checked)}
                  />
                  <span>I pledge that the details I shared are correct and I want to continue.</span>
                </label>

                <div className="terms-card__actions">
                  <button
                    className="terms-card__button terms-card__button--primary"
                    type="submit"
                    disabled={savingTerm || !pledgeAccepted}
                  >
                    <span>Submit pledge</span>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                  <button
                    className="terms-card__button terms-card__button--secondary"
                    type="button"
                    onClick={() => onDecline?.()}
                  >
                    <span>Back</span>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      close
                    </span>
                  </button>
                </div>
              </form>

              {termsMessage ? <p className="terms-card__success">{termsMessage}</p> : null}
              {termsError ? <p className="terms-card__error">{termsError}</p> : null}
              {rowMessage ? <p className="terms-card__success">{rowMessage}</p> : null}
              {rowError ? <p className="terms-card__error">{rowError}</p> : null}

              {submittedRows.length > 0 && (
                <section className="terms-card__submitted" aria-label="Submitted entries">
                  <h3>Your submitted entries</h3>
                  <div className="terms-card__submitted-list">
                    {submittedRows.map((row) => (
                      <div key={row.id} className="terms-card__submitted-row">
                        <span><strong>Name:</strong> {row.name}</span>
                        <span><strong>Age:</strong> {row.age}</span>
                        <span><strong>Gender:</strong> {row.gender}</span>
                        <span className="terms-card__submitted-time">
                          {new Date(row.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="terms-card__complete"
                    type="button"
                    onClick={onAccept}
                  >
                    Complete and Continue
                    <span className="material-symbols-outlined" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                </section>
              )}

            <section className="terms-page__notice">
              <span className="material-symbols-outlined" aria-hidden="true">
                info
              </span>
              <p>This step collects your details first, then asks you to confirm the pledge.</p>
            </section>
          </section>
        </section>
      </main>
    </div>
  );
}

export default TermsPage;

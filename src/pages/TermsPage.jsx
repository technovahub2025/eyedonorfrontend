import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Eye,
  Handshake,
  Heart,
  ListChecks,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  UserRound,
} from 'lucide-react';
import ProgressStepper from '../components/ProgressStepper';
import { apiRequest } from '../lib/apiClient';
import eyeImage from '../asset/eye.jpg';
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

let personId = 0;
const initialPerson = () => ({
  id: ++personId,
  fullName: '',
  age: '',
  gender: '',
  phone: '',
  address: '',
});

function TermsPage({ adminToken, onAccept, onDecline }) {
  const isAdminView = Boolean(adminToken);
  const [savingTerm, setSavingTerm] = useState(false);
  const [termsMessage, setTermsMessage] = useState('');
  const [termsError, setTermsError] = useState('');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [people, setPeople] = useState([initialPerson()]);
  const [submittedRows, setSubmittedRows] = useState([]);
  const [adminRows, setAdminRows] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [rowMessage] = useState('');
  const [rowError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadAdminTerms() {
      if (!isAdminView) {
        setAdminRows([]);
        setAdminError('');
        setAdminLoading(false);
        return;
      }

      setAdminLoading(true);
      setAdminError('');

      try {
        const response = await apiRequest('/api/terms/getall', {
          token: adminToken,
        });

        if (!active) return;

        const terms = Array.isArray(response)
          ? response
          : response?.data || response?.terms || response?.rows || [];

        setAdminRows(terms);
      } catch (err) {
        if (!active) return;
        setAdminRows([]);
        setAdminError(err.message);
      } finally {
        if (active) {
          setAdminLoading(false);
        }
      }
    }

    loadAdminTerms();

    return () => {
      active = false;
    };
  }, [adminToken, isAdminView]);

  function updatePerson(id, field, value) {
    setPeople((current) =>
      current.map((person) => (person.id === id ? { ...person, [field]: value } : person))
    );
  }

  function addPerson() {
    setPeople((current) => [...current, initialPerson()]);
  }

  function removePerson(id) {
    if (people.length <= 1) return;
    setPeople((current) => current.filter((person) => person.id !== id));
  }

  function resetPeople() {
    setPeople([initialPerson()]);
  }

  async function submitPerson(person) {
    const payload = {
      fullName: person.fullName.trim(),
      name: person.fullName.trim(),
      age: person.age === '' ? '' : Number(person.age),
      gender: person.gender.trim(),
      phone: person.phone.trim(),
      address: person.address.trim(),
    };

    return apiRequest(createTermsEndpoint, {
      method: 'POST',
      body: payload,
    });
  }

  async function handleCreateTerm(event) {
    event.preventDefault();
    setTermsMessage('');
    setTermsError('');

    if (!pledgeAccepted) {
      setTermsError('Please confirm the pledge before you continue.');
      return;
    }

    const incomplete = people.find(
      (person) => !person.fullName || !person.age || !person.gender || !person.phone || !person.address
    );
    if (incomplete) {
      setTermsError('Please fill in all five fields for each person.');
      return;
    }

    setSavingTerm(true);

    try {
      const saved = [];
      for (const person of people) {
        const response = await submitPerson(person);
        const savedPerson = {
          ...person,
          id: response?.data?._id || response?._id || person.id,
          createdAt: response?.data?.createdAt || response?.createdAt || new Date().toISOString(),
        };
        saved.push(savedPerson);
      }

      setSubmittedRows((current) => [...saved, ...current]);
      setTermsMessage('Your details and pledge were submitted successfully.');
      resetPeople();
      setPledgeAccepted(false);

      if (!isAdminView) {
        onAccept?.();
      }
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
          {!isAdminView ? (
            <div className="terms-page__stepper-wrap">
              <ProgressStepper steps={steps} currentStep={2} />
            </div>
          ) : null}

        <section className="terms-card" aria-labelledby="terms-title">
            <div className="terms-card__header">
              <div className="terms-card__header-copy">
                <h1 id="terms-title">
                  {isAdminView ? 'Terms page submissions' : 'Enter your details and confirm your pledge'}
                </h1>
                <p className="terms-card__intro">
                  {isAdminView
                    ? 'Admins can review only the records submitted through the terms page.'
                    : 'Share the full details for each person. Then review and accept the pledge before submitting.'}
                </p>
              </div>

              <div className="terms-card__hero-visual" aria-hidden="true">
                <div className="terms-card__eye-rings" />
                <img
                  src={eyeImage}
                  alt=""
                  className="terms-card__eye"
                  aria-hidden="true"
                />
                <div className="terms-card__leaf terms-card__leaf--left">
                  <Sparkles />
                </div>
                <div className="terms-card__leaf terms-card__leaf--right">
                  <Heart />
                </div>
                <div className="terms-card__leaf terms-card__leaf--bottom">
                  <ShieldCheck />
                </div>
              </div>

              <div className="terms-card__summary">
                <ListChecks aria-hidden="true" />
                <div>
                  <strong>{isAdminView ? 'Admin review' : 'Two-part step'}</strong>
                  <p>
                    {isAdminView
                      ? 'Review the records that came through the terms page.'
                      : 'Fill in the details for each person, then confirm the pledge below.'}
                  </p>
                </div>
              </div>
            </div>

            <section className="terms-card__admin-panel" aria-labelledby="terms-admin-title">
              <div className="terms-card__admin-header">
                <div>
                  <p className="terms-card__eyebrow">{isAdminView ? 'Admin review' : 'Your entry'}</p>
                  <h2 id="terms-admin-title">
                    {isAdminView ? 'Terms page data' : 'Add your details'}
                  </h2>
                </div>
                <span className="terms-card__admin-badge">
                  {isAdminView ? 'Read only' : 'Saved automatically'}
                </span>
              </div>

              {isAdminView ? (
                <>
                  <p className="terms-card__admin-copy">
                    Review only the entries that came through the terms page.
                  </p>

                  <div className="terms-card__admin-icons" aria-hidden="true">
                    <div className="terms-card__admin-icon">
                      <CheckCircle2 />
                    </div>
                    <div className="terms-card__admin-icon terms-card__admin-icon--pink">
                      <Eye />
                    </div>
                    <div className="terms-card__admin-icon">
                      <Stethoscope />
                    </div>
                  </div>

                  {adminLoading ? (
                    <p className="terms-card__empty">Loading terms data...</p>
                  ) : adminError ? (
                    <p className="terms-card__error">{adminError}</p>
                  ) : adminRows.length > 0 ? (
                    <div className="terms-card__submitted-list terms-card__submitted-list--admin">
                      {adminRows.map((row) => {
                        const id = row._id || row.id || `${row.name}-${row.createdAt}`;
                        return (
                          <div key={id} className="terms-card__submitted-row">
                            <span>
                              <strong>Title:</strong> {row.title || 'N/A'}
                            </span>
                            <span>
                              <strong>Name:</strong> {row.name || 'Unnamed'}
                            </span>
                            <span>
                              <strong>Age:</strong> {row.age ?? 'N/A'}
                            </span>
                            <span>
                              <strong>Gender:</strong> {row.gender || 'N/A'}
                            </span>
                            <span className="terms-card__submitted-time">
                              {row.createdAt ? new Date(row.createdAt).toLocaleString() : 'No date'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="terms-card__empty">No terms submissions found.</p>
                  )}
                </>
              ) : (
                <>
                  <form className="terms-card__admin-form" onSubmit={handleCreateTerm} noValidate>
                    <section className="terms-card__section terms-card__section--details">
                      <div className="terms-card__section-header">
                        <div className="terms-card__section-title">
                          <UserRound aria-hidden="true" />
                          <span>YOUR DETAILS</span>
                        </div>
                        <span className="terms-card__admin-badge">Saved automatically</span>
                      </div>

                      {people.map((person, index) => (
                        <div key={person.id} className="terms-card__person">
                          <div className="terms-card__field terms-card__field--full">
                            <label className="terms-card__field-label">
                              <span>Full Name</span>
                              <input
                                type="text"
                                placeholder="Enter your full name"
                                value={person.fullName}
                                onChange={(event) =>
                                  updatePerson(person.id, 'fullName', event.target.value)
                                }
                                required
                              />
                            </label>
                          </div>

                          <div className="terms-card__details-grid">
                            <label className="terms-card__field">
                              <span>Age</span>
                              <input
                                type="number"
                                min="0"
                                placeholder="Enter your age"
                                value={person.age}
                                onChange={(event) => updatePerson(person.id, 'age', event.target.value)}
                                required
                              />
                            </label>

                            <label className="terms-card__field">
                              <span>Gender</span>
                              <select
                                value={person.gender}
                                onChange={(event) =>
                                  updatePerson(person.id, 'gender', event.target.value)
                                }
                                required
                              >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </label>

                            <label className="terms-card__field">
                              <span>Phone Number</span>
                              <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={person.phone}
                                onChange={(event) => updatePerson(person.id, 'phone', event.target.value)}
                                required
                              />
                            </label>

                            <label className="terms-card__field">
                              <span>Address</span>
                              <textarea
                                placeholder="Enter your address"
                                value={person.address}
                                onChange={(event) =>
                                  updatePerson(person.id, 'address', event.target.value)
                                }
                                rows={2}
                                required
                              />
                            </label>
                          </div>

                          {people.length > 1 ? (
                            <button
                              type="button"
                              className="terms-card__remove-person"
                              onClick={() => removePerson(person.id)}
                              aria-label={`Remove person ${index + 1}`}
                            >
                              <Trash2 aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                      ))}

                      <div className="terms-card__add-person-wrap">
                        <button
                          type="button"
                          className="terms-card__add-row"
                          onClick={addPerson}
                        >
                          <Plus aria-hidden="true" />
                          <span>+ Add Another Person</span>
                        </button>
                      </div>
                    </section>

                    <section className="terms-card__section terms-card__section--pledge" aria-label="Pledge points">
                      <div className="terms-card__section-header">
                        <div className="terms-card__section-title">
                          <ShieldCheck aria-hidden="true" />
                          <span>YOUR PLEDGE</span>
                        </div>
                      </div>

                      <div className="terms-card__scroll">
                        {pledgePoints.map((point, index) => {
                          const rowIcons = [Handshake, ClipboardList, Heart];
                          const RowIcon = rowIcons[index] || Heart;

                          return (
                            <article key={point} className="terms-card__row">
                              <div className="terms-card__row-index">
                                {String(index + 1).padStart(2, '0')}
                              </div>
                              <div className="terms-card__row-icon">
                                <RowIcon aria-hidden="true" />
                              </div>
                              <div className="terms-card__row-content">
                                <div className="terms-card__row-heading">
                                  <h3>Pledge point {index + 1}</h3>
                                </div>
                                <p>{point}</p>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>

                    <label className="terms-card__agree">
                      <input
                        type="checkbox"
                        checked={pledgeAccepted}
                        onChange={(event) => setPledgeAccepted(event.target.checked)}
                      />
                      <span>I pledge that the details I shared are correct and I want to continue.</span>
                    </label>

                    {rowMessage ? <p className="terms-card__success">{rowMessage}</p> : null}
                    {rowError ? <p className="terms-card__error">{rowError}</p> : null}

                    <div className="terms-card__form-actions terms-card__form-actions--bottom">
                      <button
                        className="terms-card__button terms-card__button--secondary"
                        type="button"
                        onClick={() => onDecline?.()}
                      >
                        <ArrowLeft aria-hidden="true" />
                        <span>Back</span>
                      </button>

                      <button
                        className="terms-card__button terms-card__button--primary"
                        type="submit"
                        disabled={savingTerm || !pledgeAccepted}
                      >
                        <Heart aria-hidden="true" />
                        <span>{savingTerm ? 'Submitting...' : 'Submit pledge'}</span>
                      </button>
                    </div>
                  </form>

                  {termsMessage ? <p className="terms-card__success">{termsMessage}</p> : null}
                  {termsError ? <p className="terms-card__error">{termsError}</p> : null}

                  {submittedRows.length > 0 ? (
                    <section className="terms-card__submitted" aria-label="Submitted entries">
                      <h3>Your submitted entries</h3>
                      <div className="terms-card__submitted-list">
                        {submittedRows.map((row) => (
                          <div key={row.id} className="terms-card__submitted-row">
                            <span><strong>Name:</strong> {row.fullName || row.name}</span>
                            <span><strong>Age:</strong> {row.age}</span>
                            <span><strong>Gender:</strong> {row.gender}</span>
                            <span><strong>Phone:</strong> {row.phone || 'N/A'}</span>
                            <span><strong>Address:</strong> {row.address || 'N/A'}</span>
                            <span className="terms-card__submitted-time">
                              {new Date(row.createdAt).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </>
              )}
            </section>

              {!isAdminView ? (
                <section className="terms-page__notice">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    info
                  </span>
                <p>This step collects your details first, then asks you to confirm the pledge.</p>
              </section>
            ) : null}
          </section>
        </section>
      </main>
    </div>
  );
}

export default TermsPage;

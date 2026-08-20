import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  Handshake,
  Heart,
  Plus,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import ProgressStepper from '../components/ProgressStepper';
import eyeImage from '../asset/eyehero.png';
import { apiDownload, apiRequest } from '../lib/apiClient';
import './TermsPage.css';

const steps = [
  { label: 'Registration' },
  { label: 'Pledge' },
  { label: 'Complete' },
];

const createTermsEndpoint = '/api/terms/createterms';
const requiredPeopleCount = 3;

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
  const [updatingPeople, setUpdatingPeople] = useState(false);
  const [termsMessage, setTermsMessage] = useState('');
  const [termsError, setTermsError] = useState('');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [people, setPeople] = useState([initialPerson()]);
  const [submittedRows, setSubmittedRows] = useState([]);
  const [adminRows, setAdminRows] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

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
        const response = await apiRequest(
          `/api/terms/getall/paginated?page=${currentPage}&limit=${itemsPerPage}`,
          {
            token: adminToken,
          }
        );

        if (!active) return;

        const terms = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
          ? response.data
          : [];

        setAdminRows(terms);
        setTotalPages(response?.data?.pagination?.totalPages || 1);
      } catch (err) {
        if (!active) return;
        setAdminRows([]);
        setTotalPages(1);
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
  }, [adminToken, isAdminView, currentPage]);

  function updatePerson(id, field, value) {
    setPeople((current) =>
      current.map((person) => (person.id === id ? { ...person, [field]: value } : person))
    );
  }

  function addPerson() {
    setUpdatingPeople(true);
    setPeople((current) => [...current, initialPerson()]);
    setTimeout(() => setUpdatingPeople(false), 1500);
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
    setSavingTerm(true);
    setTermsMessage('');
    setTermsError('');

    if (!pledgeAccepted) {
      setTermsError('Please confirm the pledge before you continue.');
      setSavingTerm(false);
      return;
    }

    // Check if there are at least 3 people
    if (people.length < requiredPeopleCount) {
      setTermsError(`Please add at least ${requiredPeopleCount} people before submitting the pledge.`);
      setSavingTerm(false);
      return;
    }

    const incomplete = people.find(
      (person) =>
        (person.fullName || person.age || person.gender || person.phone || person.address) &&
        (!person.fullName || !person.age || !person.gender || !person.phone || !person.address)
    );

    if (incomplete) {
      setTermsError('Please fill in all five fields for each person you added.');
      setSavingTerm(false);
      return;
    }

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
        onAccept?.(saved);
      }
    } catch (err) {
      setTermsError(err.message);
    } finally {
      setSavingTerm(false);
    }
  }

  async function handleDownloadPdf() {
    setDownloadingPdf(true);

    try {
      const blob = await apiDownload('/api/terms/download/pdf', {
        token: adminToken,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `terms-data-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setAdminError(err.message);
    } finally {
      setDownloadingPdf(false);
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
              <div className="terms-card__hero-visual" aria-hidden="true">
                <img src={eyeImage} alt="" className="terms-card__hero-image" aria-hidden="true" />
                {!isAdminView ? (
                  <div
                    className={`terms-card__hero-progress${updatingPeople ? ' terms-card__hero-progress--active' : ''}`}
                  >
                    <div className="terms-card__hero-progress__top">
                      <span>Registration progress</span>
                      <strong>
                        {Math.min(people.length, requiredPeopleCount)}/{requiredPeopleCount}
                      </strong>
                    </div>
                    <div className="terms-card__hero-progress__track">
                      <div
                        className="terms-card__hero-progress__fill"
                        style={{
                          width: `${Math.min((people.length / requiredPeopleCount) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    {updatingPeople ? (
                      <span className="terms-card__hero-progress__note">Adding another person...</span>
                    ) : null}
                  </div>
                ) : null}
                <div className="terms-card__hero-overlay">
                  <p className="terms-card__hero-kicker">
                    {isAdminView ? 'Admin review' : 'A small decision. A lifetime of sight.'}
                  </p>
                  <h1 id="terms-title">
                    {isAdminView ? 'Terms page submissions' : 'Give the Gift of Sight'}
                  </h1>
                  <p className="terms-card__intro">
                    {isAdminView
                      ? 'Admins can review only the records submitted through the terms page.'
                      : 'Share the full details for each person. Then review and accept the pledge before submitting.'}
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
                <div className="terms-card__admin-actions">
                  {isAdminView ? (
                    <button
                      type="button"
                      className="terms-card__download"
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf || adminLoading || adminRows.length === 0}
                    >
                      <Download aria-hidden="true" />
                      <span>{downloadingPdf ? 'Preparing PDF...' : 'Download PDF'}</span>
                    </button>
                  ) : null}
                 
                </div>
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
                               <strong>Name:</strong> {row.name || row.fullName || 'Unnamed'}
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

                    {true ? (() => {
                      const pages = [];
                      const start = Math.max(1, currentPage - 2);
                      const end = Math.min(totalPages, currentPage + 2);
                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }
                      return (
                        <div className="terms-card__pagination">
                          <button
                            type="button"
                            className="terms-card__pagination-btn"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || adminLoading}
                          >
                            Previous
                          </button>
                          {pages.map((pageNum) => (
                            <button
                              key={pageNum}
                              type="button"
                              className={`terms-card__pagination-btn${pageNum === currentPage ? ' terms-card__pagination-btn--active' : ''}`}
                              onClick={() => setCurrentPage(pageNum)}
                              disabled={adminLoading}
                            >
                              {pageNum}
                            </button>
                          ))}
                          <button
                            type="button"
                            className="terms-card__pagination-btn"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || adminLoading}
                          >
                            Next
                          </button>
                        </div>
                      );
                    })() : null}
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
                        {updatingPeople && (
                          <span className="terms-card__updating-status">Updating in progress...</span>
                        )}
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

                            <label className="terms-card__field terms-card__field--full">
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

                        </div>
                      ))}

                      <div className="terms-card__add-person-wrap">
                        <button
                          type="button"
                          className="terms-card__add-row"
                          onClick={addPerson}
                          disabled={updatingPeople}
                        >
                          <Plus aria-hidden="true" />
                          <span>Add Another Person</span>
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
                                  <h3>Pledge  {index + 1}</h3>
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
                        disabled={savingTerm || !pledgeAccepted || people.length < 3}
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
                            <span>
                              <strong>Name:</strong> {row.fullName || row.name}
                            </span>
                            <span>
                              <strong>Age:</strong> {row.age}
                            </span>
                            <span>
                              <strong>Gender:</strong> {row.gender}
                            </span>
                            <span>
                              <strong>Phone:</strong> {row.phone || 'N/A'}
                            </span>
                            <span>
                              <strong>Address:</strong> {row.address || 'N/A'}
                            </span>
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

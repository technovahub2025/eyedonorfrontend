import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ClipboardList,
  ChevronRight,
  Handshake,
  Heart,
  Plus,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import ProgressStepper from '../components/ProgressStepper';
import eyeImage from '../asset/eyehero.png';
import { apiRequest } from '../lib/apiClient';
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

const normalizeTermsRows = (response, fallbackRows = []) => {
  const rows = Array.isArray(response?.data?.data)
    ? response.data.data
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(fallbackRows)
    ? fallbackRows
    : [];

  return rows;
};

const getRowTitle = (row) => {
  if (row?.title) return row.title;
  if (row?.gender === 'Male') return 'Mr.';
  if (row?.gender === 'Female') return 'Ms.';
  return 'Mr./Ms.';
};

const getRowDisplayName = (row) => row?.fullName || row?.name || 'N/A';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [adminFilters, setAdminFilters] = useState({
    date: '',
    weekday: '',
    month: '',
    year: '',
  });
  const itemsPerPage = 20;
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getRowDate = (row) => {
    if (!row?.createdAt) return null;
    const date = new Date(row.createdAt);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const filteredAdminRows = adminRows.filter((row) => {
    const date = getRowDate(row);
    const rowDate = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : '';
    const rowWeekday = date ? weekdays[date.getDay()] : '';
    const rowMonth = date ? months[date.getMonth()] : '';
    const rowYear = date ? String(date.getFullYear()) : '';

    const dateMatch = !adminFilters.date || rowDate === adminFilters.date;
    const weekdayMatch = !adminFilters.weekday || rowWeekday === adminFilters.weekday;
    const monthMatch = !adminFilters.month || rowMonth === adminFilters.month;
    const yearMatch = !adminFilters.year || rowYear === adminFilters.year;

    return dateMatch && weekdayMatch && monthMatch && yearMatch;
  });

  const safeTotalPages = Math.max(Math.ceil(filteredAdminRows.length / itemsPerPage), 1);
  const currentSafePage = Math.min(currentPage, safeTotalPages);
  const startIndex = (currentSafePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAdminRows = filteredAdminRows.slice(startIndex, endIndex);
  const hasPrevPage = currentSafePage > 1;
  const hasNextPage = currentSafePage < safeTotalPages;
  const paginationItems = (() => {
    if (safeTotalPages <= 6) {
      return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
    }

    if (currentSafePage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', safeTotalPages];
    }

    if (currentSafePage >= safeTotalPages - 2) {
      return [1, 'ellipsis', safeTotalPages - 3, safeTotalPages - 2, safeTotalPages - 1, safeTotalPages];
    }

    return [1, 'ellipsis', currentSafePage - 1, currentSafePage, currentSafePage + 1, 'ellipsis', safeTotalPages];
  })();
  const availableYears = Array.from(
    new Set(
      adminRows
        .map((row) => getRowDate(row)?.getFullYear())
        .filter((year) => Number.isFinite(year))
    )
  ).sort((a, b) => b - a);
  const adminEmptyMessage =
    totalRecords > 0 && filteredAdminRows.length === 0
      ? 'No matching submissions found.'
      : 'No terms submissions found.';
  const registrationProgress = Math.min(people.length, requiredPeopleCount) / requiredPeopleCount;

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

        const terms = normalizeTermsRows(response);

        setAdminRows(terms);
        setTotalRecords(Number(response?.data?.count ?? terms.length ?? 0));
        setCurrentPage(1);
      } catch (err) {
        if (!active) return;
        setAdminRows([]);
        setTotalRecords(0);
        setCurrentPage(1);
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

  function updateAdminFilter(field, value) {
    setAdminFilters((current) => ({ ...current, [field]: value }));
    setCurrentPage(1);
  }

  function clearAdminFilters() {
    setAdminFilters({
      date: '',
      weekday: '',
      month: '',
      year: '',
    });
    setCurrentPage(1);
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
                <div className="terms-card__hero-overlay">
                 
                
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
                </div>
              </div>

              {isAdminView ? (
                <>
                  <div className="terms-card__filters">
                    <div className="terms-card__filters-head">
                      <div>
                        <p className="terms-card__filters-kicker">Filter results</p>
                        <h3>Find entries by date</h3>
                      </div>
                      <button
                        type="button"
                        className="terms-card__filters-clear"
                        onClick={clearAdminFilters}
                        disabled={
                          !adminFilters.date &&
                          !adminFilters.weekday &&
                          !adminFilters.month &&
                          !adminFilters.year
                        }
                      >
                        Clear filters
                      </button>
                    </div>

                    <div className="terms-card__filters-grid">
                      <label className="terms-card__filter">
                        <span>Date</span>
                        <input
                          type="date"
                          value={adminFilters.date}
                          onChange={(event) => updateAdminFilter('date', event.target.value)}
                        />
                      </label>

                      <label className="terms-card__filter">
                        <span>Week day</span>
                        <select
                          value={adminFilters.weekday}
                          onChange={(event) => updateAdminFilter('weekday', event.target.value)}
                        >
                          <option value="">All days</option>
                          {weekdays.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="terms-card__filter">
                        <span>Month</span>
                        <select
                          value={adminFilters.month}
                          onChange={(event) => updateAdminFilter('month', event.target.value)}
                        >
                          <option value="">All months</option>
                          {months.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="terms-card__filter">
                        <span>Year</span>
                        <select
                          value={adminFilters.year}
                          onChange={(event) => updateAdminFilter('year', event.target.value)}
                        >
                          <option value="">All years</option>
                          {availableYears.map((year) => (
                            <option key={year} value={String(year)}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="terms-card__table-copy">
                    <p className="terms-card__admin-copy">
                      Review the entries returned from the terms API in a clean card layout instead
                      of a table.
                    </p>
                  </div>

                  {adminLoading ? (
                    <p className="terms-card__empty">Loading terms data...</p>
                  ) : adminError ? (
                    <p className="terms-card__error">{adminError}</p>
                  ) : displayedAdminRows.length > 0 ? (
                    <div className="terms-card__admin-cards">
                      {displayedAdminRows.map((row, index) => {
                        const id =
                          row._id ||
                          row.id ||
                          `${row.name || row.fullName || 'row'}-${row.createdAt || index}`;
                        const createdLabel = row.createdAt
                          ? new Date(row.createdAt).toLocaleString()
                          : 'N/A';

                        return (
                          <article key={id} className="terms-card__admin-card">
                            <div className="terms-card__admin-card-head">
                              <div>
                                <p className="terms-card__admin-card-kicker">
                                  Entry {startIndex + index + 1}
                                </p>
                                <h3 className="terms-card__admin-card-title">
                                  {getRowDisplayName(row)}
                                </h3>
                                <p className="terms-card__admin-card-subtitle">
                                  {getRowTitle(row)}
                                </p>
                              </div>
                              <span className="terms-card__admin-card-time">{createdLabel}</span>
                            </div>

                            <div className="terms-card__admin-card-grid">
                              <div>
                                <strong>Age</strong>
                                <span>{row.age ?? 'N/A'}</span>
                              </div>
                              <div>
                                <strong>Gender</strong>
                                <span>{row.gender || 'N/A'}</span>
                              </div>
                              <div>
                                <strong>Phone</strong>
                                <span>{row.phone || row.mobile || row.telephone || 'N/A'}</span>
                              </div>
                              <div className="terms-card__admin-card-span">
                                <strong>Address</strong>
                                <span>{row.address || row.fullAddress || 'N/A'}</span>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="terms-card__empty">{adminEmptyMessage}</p>
                  )}

                    <div className="terms-card__pagination-wrap">
                      <div className="terms-card__pagination-info">
                        <span>
                          Page <strong>{currentSafePage}</strong> of <strong>{safeTotalPages}</strong>
                        </span>
                        <span>
                          <strong>{filteredAdminRows.length}</strong> shown of{' '}
                          <strong>{totalRecords}</strong> total records
                        </span>
                        <span>{itemsPerPage} per page</span>
                      </div>

                      <div className="terms-card__pagination" aria-label="Admin pagination">
                        <button
                          type="button"
                          className="terms-card__pagination-btn terms-card__pagination-btn--nav"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={adminLoading || !hasPrevPage}
                        >
                          <ArrowLeft aria-hidden="true" />
                          <span>Prev</span>
                        </button>
                        {paginationItems.map((item, index) =>
                          item === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="terms-card__pagination-ellipsis">
                              ...
                            </span>
                          ) : (
                            <button
                              key={item}
                              type="button"
                              className={`terms-card__pagination-btn${
                                currentSafePage === item ? ' terms-card__pagination-btn--active' : ''
                              }`}
                              onClick={() => setCurrentPage(item)}
                              disabled={adminLoading || currentSafePage === item}
                            >
                              {item}
                            </button>
                          )
                        )}
                        <button
                          type="button"
                          className="terms-card__pagination-btn terms-card__pagination-btn--nav"
                          onClick={() => setCurrentPage((p) => Math.min(safeTotalPages, p + 1))}
                          disabled={adminLoading || !hasNextPage}
                        >
                          <span>Next</span>
                          <ChevronRight aria-hidden="true" />
                        </button>
                      </div>
                    </div>
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

                      {!isAdminView ? (
                        <div
                          className={`terms-card__form-progress${updatingPeople ? ' terms-card__form-progress--active' : ''}`}
                          aria-label="Registration progress"
                        >
                          <div className="terms-card__form-progress__top">
                            <span>Registration progress</span>
                            <strong>
                              {Math.min(people.length, requiredPeopleCount)}/{requiredPeopleCount}
                            </strong>
                          </div>
                          <div className="terms-card__form-progress__track">
                            <div
                              className="terms-card__form-progress__fill"
                              style={{ width: `${registrationProgress * 100}%` }}
                            />
                          </div>
                          {updatingPeople ? (
                            <span className="terms-card__form-progress__note">Adding another person...</span>
                          ) : null}
                        </div>
                      ) : null}

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

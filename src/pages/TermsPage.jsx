import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Heart,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react';
import ProgressStepper from '../components/ProgressStepper';
import eyeImage from '../asset/eye.png';
import { apiRequest } from '../lib/apiClient';
import './TermsPage.css';

const steps = [
  { label: 'Registration' },
  { label: 'Pledge' },
  { label: 'Complete' },
];

const createTermsEndpoint = '/api/terms/createterms';
const requiredPeopleCount = 2;
const adminRowsPerPage = 20;

const mythsAndFacts = [
  {
    myth: 'Only young, healthy people can donate.',
    fact:
      'Age, spectacles, diabetes, or hypertension are no bar. Almost anyone can pledge, except in cases of active systemic infections like HIV or Hepatitis, or other blood-borne diseases.',
  },
  {
    myth: 'Donation disfigures the face.',
    fact:
      'Harvesting takes about 20 minutes, is performed by trained professionals, and does not alter the donor\'s facial appearance.',
  },
  {
    myth: 'The entire eyeball is removed for transplant.',
    fact:
      'Only the thin, clear front layer of the eye, the cornea, is retrieved for transplantation.',
  },
  {
    myth: 'Pledging eyes automatically guarantees donation after death.',
    fact:
      'A pledge is an expression of intent. At the time of passing, written consent from immediate family is legally mandatory for harvesting to proceed.',
  },
  {
    myth: 'My family has to be eye donors too.',
    fact:
      'You can pledge individually, and no one else in your family needs to. You can also donate your loved one\'s eyes even if they have not pledged.',
  },
  {
    myth: 'Previous eye surgeries or poor vision prevent donation.',
    fact:
      'Cataract surgery, LASIK, or refractive errors do not affect the clarity of the cornea or exclude someone from donating.',
  },
  {
    myth: 'Eye donation delays funeral rites or costs money.',
    fact:
      'Harvesting is completed quickly without delaying funeral arrangements, and the service is entirely free of cost.',
  },
];

let personId = 0;

const initialPerson = () => ({
  id: ++personId,
  fullName: '',
  age: '',
  gender: '',
  phone: '',
});

function createBatchId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `batch-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

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

const getRowPlace = (row) => row?.place || 'N/A';

function getRowTime(row) {
  if (!row?.createdAt) return null;
  const time = new Date(row.createdAt).getTime();
  return Number.isNaN(time) ? null : time;
}

function collectPdfRows(row, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [row].filter(Boolean);
  }

  const batchId = row?.batchId;
  if (batchId) {
    const grouped = rows.filter((entry) => entry.batchId === batchId);
    if (grouped.length > 0) {
      return grouped;
    }
  }

  const clickedTime = getRowTime(row);
  if (clickedTime === null) {
    return [row].filter(Boolean);
  }

  const withTime = rows
    .map((entry) => ({
      entry,
      time: getRowTime(entry),
    }))
    .filter((item) => item.time !== null)
    .sort((a, b) => a.time - b.time);

  const nearest = withTime
    .map((item) => ({
      ...item,
      distance: Math.abs(item.time - clickedTime),
    }))
    .filter((item) => item.distance <= 120000)
    .sort((a, b) => a.distance - b.distance || a.time - b.time)
    .map((item) => item.entry);

  if (nearest.length > 0) {
    return nearest;
  }

  return [row].filter(Boolean);
}

function isValidMobileNumber(value) {
  return /^[6-9]\d{9}$/.test(`${value || ''}`.trim());
}

function validatePersonField(field, value) {
  const text = `${value ?? ''}`.trim();

  if (field === 'fullName') {
    return text ? '' : 'Please enter a full name.';
  }

  if (field === 'age') {
    if (text === '') {
      return 'Please enter a valid age.';
    }

    const ageValue = Number(text);
    if (!Number.isFinite(ageValue) || ageValue < 1 || ageValue > 99) {
      return 'Please enter a valid age.';
    }

    return '';
  }

  if (field === 'gender') {
    return text ? '' : 'Please select a gender.';
  }

  if (field === 'phone') {
    return isValidMobileNumber(text)
      ? ''
      : 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.';
  }

  return '';
}

function showSubmissionPopup(message) {
  window.alert(message);
}

function openWhatsAppText(message) {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const popup = window.open(whatsappUrl, '_blank');
  if (!popup) {
    window.location.href = whatsappUrl;
  }
}

function TermsPage({ adminToken, onAccept, onDecline }) {
  const isAdminView = Boolean(adminToken);
  const [savingTerm, setSavingTerm] = useState(false);
  const [updatingPeople, setUpdatingPeople] = useState(false);
  const [termsMessage, setTermsMessage] = useState('');
  const [termsError, setTermsError] = useState('');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [place, setPlace] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ place: '', people: {} });
  const [people, setPeople] = useState([initialPerson()]);
  const [submittedRows, setSubmittedRows] = useState([]);
  const [adminRows, setAdminRows] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [exportingPdf, setExportingPdf] = useState(false);
  const [downloadingPdfId, setDownloadingPdfId] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [adminPage, setAdminPage] = useState(1);
  const [adminFilters, setAdminFilters] = useState({
    name: '',
    date: '',
    weekday: '',
    month: '',
    year: '',
  });
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
    const nameQuery = adminFilters.name.trim().toLowerCase();
    const rowName = `${row?.fullName || row?.name || ''}`.toLowerCase();
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
    const nameMatch = !nameQuery || rowName.includes(nameQuery);

    return nameMatch && dateMatch && weekdayMatch && monthMatch && yearMatch;
  });
  const adminTotalPages = Math.max(1, Math.ceil(filteredAdminRows.length / adminRowsPerPage));
  const adminCurrentPage = Math.min(adminPage, adminTotalPages);
  const adminPageStart = (adminCurrentPage - 1) * adminRowsPerPage;
  const paginatedAdminRows = filteredAdminRows.slice(adminPageStart, adminPageStart + adminRowsPerPage);

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
      } catch (err) {
        if (!active) return;
        setAdminRows([]);
        setTotalRecords(0);
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

  useEffect(() => {
    setAdminPage(1);
  }, [adminFilters]);

  useEffect(() => {
    setAdminPage((current) => Math.min(current, adminTotalPages));
  }, [adminTotalPages]);

  function updatePerson(id, field, value) {
    setPeople((current) =>
      current.map((person) => (person.id === id ? { ...person, [field]: value } : person))
    );
    setFieldErrors((current) => {
      const fieldError = validatePersonField(field, value);
      const personErrors = { ...(current.people?.[id] || {}) };

      if (fieldError) {
        personErrors[field] = fieldError;
      } else {
        delete personErrors[field];
      }

      const nextPeopleErrors = { ...(current.people || {}) };
      if (Object.keys(personErrors).length === 0) {
        delete nextPeopleErrors[id];
      } else {
        nextPeopleErrors[id] = personErrors;
      }

      return {
        ...current,
        people: nextPeopleErrors,
      };
    });
  }

  function updateAdminFilter(field, value) {
    setAdminFilters((current) => ({ ...current, [field]: value }));
  }

  function clearAdminFilters() {
    setAdminFilters({
      name: '',
      date: '',
      weekday: '',
      month: '',
      year: '',
    });
  }

  function goToAdminPage(nextPage) {
    setAdminPage(Math.max(1, Math.min(nextPage, adminTotalPages)));
  }

  function getAdminPaginationItems() {
    if (adminTotalPages <= 7) {
      return Array.from({ length: adminTotalPages }, (_, index) => index + 1);
    }

    const items = [1];
    const start = Math.max(2, adminCurrentPage - 1);
    const end = Math.min(adminTotalPages - 1, adminCurrentPage + 1);

    if (start > 2) {
      items.push('ellipsis-start');
    }

    for (let page = start; page <= end; page += 1) {
      items.push(page);
    }

    if (end < adminTotalPages - 1) {
      items.push('ellipsis-end');
    }

    items.push(adminTotalPages);
    return items;
  }

  async function handleExportAdminPdf() {
    setExportingPdf(true);

    try {
      const rowsToExport = filteredAdminRows.map((row) => ({ ...row }));
      window.__PLEDGE_EXPORT_ROWS__ = rowsToExport;

      const exportUrl = new URL('/pledge-export.html', window.location.origin);
      const popup = window.open(exportUrl.toString(), '_blank');

      if (!popup) {
        throw new Error('Please allow popups for this site to export the PDF.');
      }
    } catch (err) {
      setTermsError(err.message);
    } finally {
      setExportingPdf(false);
    }
  }

  async function handleDownloadRowPdf(row) {
    const rowsToExport = collectPdfRows(row, adminRows);
    const firstRow = rowsToExport[0];
    const rowId = firstRow?._id || firstRow?.id;

    if (!rowId) {
      setTermsError('This entry does not have a valid PDF id.');
      return;
    }

    setDownloadingPdfId(rowId);
    setTermsError('');

    try {
      window.__PLEDGE_EXPORT_ROWS__ = rowsToExport;

      const exportUrl = new URL('/pledge-export.html', window.location.origin);
      const popup = window.open(exportUrl.toString(), '_blank');

      if (!popup) {
        throw new Error('Please allow popups for this site to export the PDF.');
      }
    } catch (err) {
      setTermsError(err.message);
    } finally {
      setDownloadingPdfId('');
    }
  }

  function addPerson() {
    setUpdatingPeople(true);
    setPeople((current) => [...current, initialPerson()]);
    setTimeout(() => setUpdatingPeople(false), 1500);
  }

  function removePerson(id) {
    setPeople((current) => {
      if (current.length <= 1) {
        return current;
      }

      return current.filter((person) => person.id !== id);
    });

    setFieldErrors((current) => {
      if (!current.people?.[id]) {
        return current;
      }

      const nextPeopleErrors = { ...(current.people || {}) };
      delete nextPeopleErrors[id];

      return {
        ...current,
        people: nextPeopleErrors,
      };
    });
  }

  function touchPersonField(id, field, value) {
    setFieldErrors((current) => {
      const fieldError = validatePersonField(field, value);
      const personErrors = { ...(current.people?.[id] || {}) };

      if (fieldError) {
        personErrors[field] = fieldError;
      } else {
        delete personErrors[field];
      }

      const nextPeopleErrors = { ...(current.people || {}) };
      if (Object.keys(personErrors).length === 0) {
        delete nextPeopleErrors[id];
      } else {
        nextPeopleErrors[id] = personErrors;
      }

      return {
        ...current,
        people: nextPeopleErrors,
      };
    });
  }

  function resetPeople() {
    setPeople([initialPerson()]);
    setFieldErrors({ place: '', people: {} });
  }

  async function submitPerson(person) {
    const payload = {
      fullName: person.fullName.trim(),
      name: person.fullName.trim(),
      age: person.age === '' ? '' : Number(person.age),
      gender: person.gender.trim(),
      place: place.trim(),
      phone: person.phone.trim(),
      batchId: person.batchId,
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
    setFieldErrors({ place: '', people: {} });

    if (!pledgeAccepted) {
      setTermsError('Please confirm the pledge before you continue.');
      setSavingTerm(false);
      return;
    }

    // Check if there are at least 2 people
    const completePeopleCount = people.filter((person) => {
      const ageValue = Number(person.age);
      return (
        person.fullName.trim() &&
        Number.isFinite(ageValue) &&
        ageValue >= 1 &&
        person.gender &&
        person.phone
      );
    }).length;

    if (completePeopleCount < requiredPeopleCount) {
      setTermsError(`Please add at least ${requiredPeopleCount} complete people before submitting the pledge.`);
      setSavingTerm(false);
      return;
    }

    const nextFieldErrors = { place: '', people: {} };
    let hasInlineError = false;

    people.forEach((person) => {
      const personErrors = {};

      if (person.fullName && !person.fullName.trim()) {
        personErrors.fullName = 'Please enter a full name.';
      }

      const ageValue = Number(person.age);
      if (person.age === '' || person.age === null || person.age === undefined || !Number.isFinite(ageValue) || ageValue < 1) {
        personErrors.age = 'Please enter a valid age.';
      }

      if (!person.gender) {
        personErrors.gender = 'Please select a gender.';
      }

      if (!person.phone) {
        personErrors.phone = 'Please enter a phone number.';
      }

      if (Object.keys(personErrors).length > 0) {
        nextFieldErrors.people[person.id] = personErrors;
        hasInlineError = true;
      }
    });

    if (hasInlineError) {
      setFieldErrors(nextFieldErrors);
      setTermsError('Please fix the highlighted fields below.');
      setSavingTerm(false);
      return;
    }

    if (!place.trim()) {
      setTermsError('Please enter the place before submitting the pledge.');
      setFieldErrors({ place: 'Please enter the place.', people: {} });
      setSavingTerm(false);
      return;
    }

    const invalidPhone = people.find((person) => !isValidMobileNumber(person.phone));

    if (invalidPhone) {
      setTermsError('Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.');
      setFieldErrors((current) => ({
        ...current,
        people: {
          ...current.people,
          [invalidPhone.id]: {
            ...(current.people?.[invalidPhone.id] || {}),
            phone: 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.',
          },
        },
      }));
      setSavingTerm(false);
      return;
    }

    try {
      const saved = [];
      const batchId = createBatchId();

      for (const person of people) {
        const response = await submitPerson({
          ...person,
          batchId,
        });
        const savedPerson = {
          ...person,
          place: place.trim(),
          id: response?.data?._id || response?._id || person.id,
          createdAt: response?.data?.createdAt || response?.createdAt || new Date().toISOString(),
          batchId: response?.data?.batchId || response?.batchId || batchId,
        };
        saved.push(savedPerson);
      }

      setSubmittedRows(saved);
      setTermsMessage('Your details and pledge were submitted successfully.');
      if (!isAdminView) {
        showSubmissionPopup('Successfully submitted.');
      }
      resetPeople();
      setPlace('');
      setPledgeAccepted(false);

      if (!isAdminView) {
        window.__PLEDGE_EXPORT_ROWS__ = saved;
        window.localStorage?.setItem('pledge_export_rows', JSON.stringify(saved));

        const whatsappMessage =
          `My eye donation pledge has been submitted successfully.\n` +
          `People added: ${saved.length}\n` +
          `Place: ${place.trim()}`;

        openWhatsAppText(whatsappMessage);

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
                  {isAdminView && (
                    <button
                      type="button"
                      className="terms-card__download"
                      onClick={handleExportAdminPdf}
                      disabled={adminLoading || exportingPdf || filteredAdminRows.length === 0}
                    >
                      <Download aria-hidden="true" />
                      <span>{exportingPdf ? 'Downloading...' : 'Download PDF'}</span>
                    </button>
                  )}
                </div>
              </div>

              {isAdminView ? (
                <>
                  <div className="terms-card__filters">
                    <div className="terms-card__filters-head">
                      <div>
                        <p className="terms-card__filters-kicker">Filter results</p>
                        <h3>Find entries by name or date</h3>
                      </div>
                      <button
                        type="button"
                        className="terms-card__filters-clear"
                        onClick={clearAdminFilters}
                        disabled={
                          !adminFilters.name &&
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
                        <span>Name</span>
                        <input
                          type="search"
                          value={adminFilters.name}
                          onChange={(event) => updateAdminFilter('name', event.target.value)}
                          placeholder="Search by name"
                        />
                      </label>

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
                      Review the entries returned from the terms API in a tabular layout.
                    </p>
                  </div>

                  {adminLoading ? (
                    <p className="terms-card__empty">Loading terms data...</p>
                  ) : adminError ? (
                    <p className="terms-card__error">{adminError}</p>
                  ) : filteredAdminRows.length > 0 ? (
                    <>
                      <div className="terms-card__table-wrap">
                        <table className="terms-card__pledge-table">
                        <thead>
                          <tr>
                            <th className="col-title">Title</th>
                            <th>Name</th>
                            <th>Place</th>
                            <th className="col-age">Age</th>
                            <th className="col-sex">Gender</th>
                            <th>Phone</th>
                            <th>Created At</th>
                            <th className="col-action">PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedAdminRows.map((row) => {
                            const id =
                              row._id || row.id || `${row.name || row.fullName || 'row'}-${row.createdAt || ''}`;
                            const createdLabel = row.createdAt
                              ? new Date(row.createdAt).toLocaleString()
                              : 'N/A';

                            return (
                              <tr key={id}>
                                <td>{getRowTitle(row)}</td>
                                <td>{getRowDisplayName(row)}</td>
                                <td>{getRowPlace(row)}</td>
                                <td className="text-center">{row.age ?? 'N/A'}</td>
                                <td className="text-center">{row.gender || 'N/A'}</td>
                                <td>{row.phone || row.mobile || row.telephone || 'N/A'}</td>
                                <td>{createdLabel}</td>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="terms-card__row-download"
                                    onClick={() => handleDownloadRowPdf(row)}
                                    disabled={adminLoading || downloadingPdfId === id}
                                  >
                                    <Download aria-hidden="true" />
                                    <span>{downloadingPdfId === id ? '...' : 'PDF'}</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      </div>
                      <div className="terms-card__pagination-wrap">
                        <div className="terms-card__pagination-info">
                          <span>
                            Showing <strong>{adminPageStart + 1}</strong>-
                            <strong>{Math.min(adminPageStart + adminRowsPerPage, filteredAdminRows.length)}</strong> of{' '}
                            <strong>{filteredAdminRows.length}</strong>
                          </span>
                          <span>
                            Page <strong>{adminCurrentPage}</strong> of <strong>{adminTotalPages}</strong>
                          </span>
                        </div>

                        <div className="terms-card__pagination" aria-label="Admin table pagination">
                          <button
                            type="button"
                            className="terms-card__pagination-btn terms-card__pagination-btn--nav"
                            onClick={() => goToAdminPage(adminCurrentPage - 1)}
                            disabled={adminCurrentPage === 1}
                          >
                            <ArrowLeft aria-hidden="true" />
                            <span>Prev</span>
                          </button>

                          {getAdminPaginationItems().map((item) => {
                            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                              return (
                                <span key={item} className="terms-card__pagination-ellipsis" aria-hidden="true">
                                  ...
                                </span>
                              );
                            }

                            return (
                              <button
                                key={item}
                                type="button"
                                className={`terms-card__pagination-btn${
                                  adminCurrentPage === item ? ' terms-card__pagination-btn--active' : ''
                                }`}
                                onClick={() => goToAdminPage(item)}
                                aria-current={adminCurrentPage === item ? 'page' : undefined}
                              >
                                {item}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            className="terms-card__pagination-btn terms-card__pagination-btn--nav"
                            onClick={() => goToAdminPage(adminCurrentPage + 1)}
                            disabled={adminCurrentPage === adminTotalPages}
                          >
                            <span>Next</span>
                            <ArrowRight aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="terms-card__empty">{adminEmptyMessage}</p>
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

                    </section>

                    <section className="terms-card__section terms-card__section--pledge" aria-label="Myths and facts">
                      <div className="terms-card__section-header">
                        <div className="terms-card__section-title">
                          <ShieldCheck aria-hidden="true" />
                          <span>MYTHS &amp; FACTS</span>
                        </div>
                      </div>

                      <div className="terms-card__myths-grid">
                        {mythsAndFacts.map((item, index) => (
                          <article key={item.myth} className="terms-card__myth-item">
                            <div className="terms-card__myth-badge">0{index + 1}</div>
                            <div className="terms-card__myth-pair">
                              <div className="terms-card__myth-box terms-card__myth-box--wrong">
                                <span className="terms-card__myth-label">Myth</span>
                                <p>{item.myth}</p>
                              </div>
                              <div className="terms-card__myth-box terms-card__myth-box--right">
                                <span className="terms-card__myth-label">Fact</span>
                                <p>{item.fact}</p>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>

                    <section className="terms-card__section terms-card__section--people" aria-label="People details">
                      <div className="terms-card__section-header">
                        <div className="terms-card__section-title">
                          <UserRound aria-hidden="true" />
                          <span>PEOPLE DETAILS</span>
                        </div>
                        <span className="terms-card__updating-status">
                          {Math.min(people.length, requiredPeopleCount)}/{requiredPeopleCount} added
                        </span>
                      </div>

                      <div className="terms-card__people-stack">
                        {people.map((person, index) => (
                          <div key={person.id} className="terms-card__person">
                            <div className="terms-card__person-head">
                              <div className="terms-card__person-title">
                                <span>Person {index + 1}</span>
                                <small>Enter details for this person</small>
                              </div>
                              <button
                                type="button"
                                className="terms-card__person-delete"
                                onClick={() => removePerson(person.id)}
                                disabled={people.length === 1}
                                title={
                                  people.length === 1
                                    ? 'At least one person row is required.'
                                    : 'Delete this person'
                                }
                              >
                                <Trash2 aria-hidden="true" />
                                <span>Delete row</span>
                              </button>
                            </div>
                            <div
                              className={`terms-card__field terms-card__field--full${
                                fieldErrors.people?.[person.id]?.fullName
                                  ? ' terms-card__field--invalid'
                                  : ''
                              }`}
                            >
                              <label className="terms-card__field-label">
                                <span>Full Name {index + 1}</span>
                                <input
                                  type="text"
                                  placeholder="Enter your full name"
                                  value={person.fullName}
                                  aria-invalid={Boolean(fieldErrors.people?.[person.id]?.fullName)}
                                  onChange={(event) =>
                                    updatePerson(person.id, 'fullName', event.target.value)
                                  }
                                  onBlur={(event) => touchPersonField(person.id, 'fullName', event.target.value)}
                                  required
                                />
                              </label>
                              {fieldErrors.people?.[person.id]?.fullName ? (
                                <span className="terms-card__field-error">
                                  {fieldErrors.people[person.id].fullName}
                                </span>
                              ) : null}
                            </div>

                            <div className="terms-card__details-grid">
                              <label
                                className={`terms-card__field${
                                  fieldErrors.people?.[person.id]?.age
                                    ? ' terms-card__field--invalid'
                                    : ''
                                }`}
                              >
                                <span>Age</span>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={2}
                                  placeholder="Enter your age"
                                  value={person.age}
                                  aria-invalid={Boolean(fieldErrors.people?.[person.id]?.age)}
                                  onChange={(event) =>
                                    updatePerson(
                                      person.id,
                                      'age',
                                      event.target.value.replace(/\D/g, '').slice(0, 2)
                                    )
                                  }
                                  onBlur={(event) => touchPersonField(person.id, 'age', event.target.value)}
                                  required
                                />
                                {fieldErrors.people?.[person.id]?.age ? (
                                  <span className="terms-card__field-error">
                                    {fieldErrors.people[person.id].age}
                                  </span>
                                ) : null}
                              </label>

                              <label
                                className={`terms-card__field${
                                  fieldErrors.people?.[person.id]?.gender
                                    ? ' terms-card__field--invalid'
                                    : ''
                                }`}
                              >
                                <span>Gender</span>
                                <select
                                  value={person.gender}
                                  aria-invalid={Boolean(fieldErrors.people?.[person.id]?.gender)}
                                  onChange={(event) =>
                                    updatePerson(person.id, 'gender', event.target.value)
                                  }
                                  onBlur={(event) => touchPersonField(person.id, 'gender', event.target.value)}
                                  required
                                >
                                  <option value="">Select gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                                {fieldErrors.people?.[person.id]?.gender ? (
                                  <span className="terms-card__field-error">
                                    {fieldErrors.people[person.id].gender}
                                  </span>
                                ) : null}
                              </label>

                              <label
                                className={`terms-card__field${
                                  fieldErrors.people?.[person.id]?.phone
                                    ? ' terms-card__field--invalid'
                                    : ''
                                }`}
                              >
                                <span>Phone Number</span>
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  maxLength={10}
                                  pattern="[6-9][0-9]{9}"
                                  placeholder="Enter your phone number"
                                  value={person.phone}
                                  aria-invalid={Boolean(fieldErrors.people?.[person.id]?.phone)}
                                  onChange={(event) =>
                                    updatePerson(
                                      person.id,
                                      'phone',
                                      event.target.value.replace(/\D/g, '').slice(0, 10)
                                    )
                                  }
                                  onBlur={(event) => touchPersonField(person.id, 'phone', event.target.value)}
                                  required
                                />
                                {fieldErrors.people?.[person.id]?.phone ? (
                                  <span className="terms-card__field-error">
                                    {fieldErrors.people[person.id].phone}
                                  </span>
                                ) : null}
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
                      </div>
                    </section>

                    <section className="terms-card__bottom-note" aria-label="Minimum people notice">
                     
                      <div className="terms-card__bottom-note-copy">
                        <strong>Add at least 2 people to continue</strong>
                        <span>You need at least two complete people details before submitting.</span>
                      </div>
                    </section>

                    <section className="terms-card__section terms-card__section--place" aria-label="Place details">
                      <div className="terms-card__section-header">
                        <div className="terms-card__section-title">
                          <Heart aria-hidden="true" />
                          <span>PLACE</span>
                        </div>
                      </div>

                      <div className="terms-card__place-row">
                          <label
                            className={`terms-card__field terms-card__field--compact terms-card__field--place${
                              fieldErrors.place ? ' terms-card__field--invalid' : ''
                            }`}
                          >
                          <span>Place</span>
                            <input
                              type="text"
                              placeholder="Enter place"
                              value={place}
                              aria-invalid={Boolean(fieldErrors.place)}
                              onChange={(event) => {
                                const nextPlace = event.target.value;
                                setPlace(nextPlace);
                                setFieldErrors((current) => ({
                                  ...current,
                                  place: nextPlace.trim() ? '' : 'Please enter the place.',
                                }));
                              }}
                              onBlur={(event) => {
                                const nextPlace = event.target.value;
                                setFieldErrors((current) => ({
                                  ...current,
                                  place: nextPlace.trim() ? '' : 'Please enter the place.',
                                }));
                              }}
                              required
                            />
                          {fieldErrors.place ? (
                            <span className="terms-card__field-error">{fieldErrors.place}</span>
                          ) : null}
                        </label>
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
                        disabled={savingTerm || !pledgeAccepted || people.length < requiredPeopleCount}
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
                              <strong>Place:</strong> {row.place || 'N/A'}
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

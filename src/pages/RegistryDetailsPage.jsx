import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/apiClient';
import './RegistryPage.css';

const pledgeEndpoint = '/api/terms/getall';

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function extractRecord(payload) {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    return payload[0] || null;
  }

  const candidates = [
    payload.data,
    payload.record,
    payload.item,
    payload.result,
    payload.terms,
    payload.pledge,
    payload.donor,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object') {
      return candidate;
    }

    if (Array.isArray(candidate)) {
      return candidate[0] || null;
    }
  }

  return typeof payload === 'object' ? payload : null;
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function buildDetailRows(payload) {
  const record = extractRecord(payload) || {};
  const details = [];
  const seen = new Set();

  function add(label, value) {
    if (value === undefined || value === null || value === '') {
      return;
    }

    details.push({ label, value: formatValue(value) });
    seen.add(label);
  }

  add('Name', record.name || record.fullName);
  add('Age', record.age);
  add('Gender', record.gender);
  add('Email', record.email);
  add('Phone', record.phone);
  add('Status', record.status);
  add('Notes', record.notes || record.body || record.description || record.note);
  add('Created At', record.createdAt || record.created_at);
  add('Updated At', record.updatedAt || record.updated_at);
  add('Reference ID', record._id || record.id || record.termId);

  Object.entries(record).forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase();
    const label = key
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    if (
      seen.has(label) ||
      ['_id', 'id', 'v', '__v', 'termid', 'createdat', 'updatedat', 'created_at', 'updated_at'].includes(
        normalizedKey
      ) ||
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      return;
    }

    add(label, value);
  });

  return details;
}

function isMatchingPledgeRecord(row, record) {
  if (!row || !record) {
    return false;
  }

  const rowNames = [row.fullName, row.name].map(normalizeText).filter(Boolean);
  const recordNames = [record.fullName, record.name].map(normalizeText).filter(Boolean);
  const rowEmails = [row.email].map(normalizeText).filter(Boolean);
  const recordEmails = [record.email].map(normalizeText).filter(Boolean);
  const rowPhones = [row.phone].map(normalizeText).filter(Boolean);
  const recordPhones = [record.phone].map(normalizeText).filter(Boolean);

  const nameMatch = rowNames.some((rowName) =>
    recordNames.some((recordName) => rowName === recordName || rowName.includes(recordName) || recordName.includes(rowName))
  );
  const emailMatch = rowEmails.some((rowEmail) =>
    recordEmails.some((recordEmail) => rowEmail === recordEmail)
  );
  const phoneMatch = rowPhones.some((rowPhone) =>
    recordPhones.some((recordPhone) => rowPhone === recordPhone)
  );
  const idMatch = normalizeText(row._id || row.id || row.__rowId) === normalizeText(record._id || record.id);

  return nameMatch || emailMatch || phoneMatch || idMatch;
}

function rowToPairs(row) {
  if (!row) {
    return [];
  }

  return [
    { label: 'Full Name', value: row.fullName || row.name || 'Unnamed user' },
    { label: 'Email Address', value: row.email || 'No email provided' },
    { label: 'Phone Number', value: row.phone || 'No phone provided' },
    { label: 'Record Type', value: row.__source === 'term' ? 'Terms' : 'User' },
    { label: 'Created At', value: row.createdAt || row.created_at || 'Not provided' },
    { label: 'Updated At', value: row.updatedAt || row.updated_at || 'Not provided' },
    { label: 'Reference ID', value: row._id || row.id || row.termId || row.__rowId || 'Not provided' },
  ];
}

function RegistryDetailsPage({ adminToken, selectedAdminRow, onDetailsBack }) {
  const [pledgeRows, setPledgeRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPledgeRows() {
      if (!adminToken) {
        setPledgeRows([]);
        setError('Please sign in to view details.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await apiRequest(pledgeEndpoint, { token: adminToken });
        if (!active) return;
        const nextRows = Array.isArray(response) ? response : response?.data || [];
        setPledgeRows(nextRows);
      } catch (err) {
        if (!active) return;
        setPledgeRows([]);
        setError(err.message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPledgeRows();

    return () => {
      active = false;
    };
  }, [adminToken]);

  const selectedPledge = useMemo(() => {
    if (!selectedAdminRow) {
      return null;
    }

    if (selectedAdminRow.__source === 'term') {
      return selectedAdminRow;
    }

    return pledgeRows.find((record) => isMatchingPledgeRecord(selectedAdminRow, record)) || null;
  }, [pledgeRows, selectedAdminRow]);

  const selectedUserRows = useMemo(() => rowToPairs(selectedAdminRow), [selectedAdminRow]);
  const detailRows = useMemo(() => buildDetailRows(selectedPledge), [selectedPledge]);

  return (
    <div className="registry-page">
      <main className="registry-page__main">
        <section className="registry-page__hero">
          <div className="registry-page__breadcrumb">
            <span>Admin</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_right
            </span>
            <span className="registry-page__breadcrumb-current">User details</span>
          </div>

          <div className="registry-page__hero-row">
            <div>
              <h1>User details</h1>
              <p>Review the selected user in a table layout on a separate page.</p>
              <p className="registry-page__status">
                {selectedAdminRow
                  ? `Selected row ${selectedAdminRow.__rowId || selectedAdminRow._id || ''}`
                  : 'No row selected.'}
              </p>
            </div>

            <div className="registry-page__hero-actions">
              <button
                type="button"
                className="registry-page__action registry-page__action--secondary"
                onClick={() => onDetailsBack?.()}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_back
                </span>
                Back to list
              </button>
            </div>
          </div>
        </section>

        {error ? <div className="registry-page__toast registry-page__toast--error">{error}</div> : null}

        {!selectedAdminRow ? (
          <section className="registry-page__details-card">
            <div className="registry-page__details-empty">
              Select a user from the registry list to open this page.
            </div>
          </section>
        ) : (
          <section className="registry-page__details-card">
            <div className="registry-page__details-header">
              <div>
                <p className="registry-page__eyebrow">Selected user</p>
                <h2>{selectedAdminRow.fullName || selectedAdminRow.name || 'Unnamed user'}</h2>
              </div>
              <span className="registry-page__sidebar-badge">
                {selectedAdminRow.__source === 'term' ? 'Terms record' : 'Donor record'}
              </span>
            </div>

            <div className="registry-page__table-scroll">
              <table className="registry-details-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUserRows.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td>{formatValue(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="registry-page__details-card">
          <div className="registry-page__details-header">
            <div>
              <p className="registry-page__eyebrow">Submission details</p>
              <h2>Pledge table</h2>
            </div>
            <span className="registry-page__sidebar-badge">
              {loading ? 'Loading...' : 'By user'}
            </span>
          </div>

          {loading ? (
            <div className="registry-page__details-empty">Loading details...</div>
          ) : detailRows.length ? (
            <div className="registry-page__table-scroll">
              <table className="registry-details-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map((detail) => (
                    <tr key={detail.label}>
                      <td>{detail.label}</td>
                      <td>{detail.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="registry-page__details-empty">
              No pledge details were found for this user.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default RegistryDetailsPage;

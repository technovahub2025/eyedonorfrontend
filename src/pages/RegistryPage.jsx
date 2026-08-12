import { useCallback, useEffect, useMemo, useState } from 'react';
import RegistryRow from '../components/RegistryRow';
import { apiRequest } from '../lib/apiClient';
import './RegistryPage.css';

const initialSearch = {
  query: '',
  status: 'all',
};

const registryEndpoint = '/api/donors';
const pledgeEndpoint = '/api/terms/getall';

function isAuthError(message = '') {
  const text = String(message).toLowerCase();
  return text.includes('token') || text.includes('unauthorized') || text.includes('forbidden');
}

function extractRegistryRows(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.data || payload?.users || payload?.donors || payload?.records || payload?.items || payload?.result || [];
}

function getRowKind(row) {
  return row?.__source || row?.source || row?.kind || 'donor';
}

function getRowId(row) {
  const rawId = row?._id || row?.id || row?.termId || `${row?.email || row?.name || 'row'}`;
  return `${getRowKind(row)}:${rawId}`;
}

function normalizeRow(row, source) {
  return {
    ...row,
    __source: source,
    __rowId: getRowId({ ...row, __source: source }),
  };
}

function extractDetailRecord(payload) {
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

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function isMatchingPledgeRecord(row, record) {
  if (!row || !record) {
    return false;
  }

  const rowNameCandidates = [row.fullName, row.name];
  const recordNameCandidates = [record.fullName, record.name];
  const rowEmailCandidates = [row.email];
  const recordEmailCandidates = [record.email];
  const rowPhoneCandidates = [row.phone];
  const recordPhoneCandidates = [record.phone];

  const rowNames = rowNameCandidates.map(normalizeText).filter(Boolean);
  const recordNames = recordNameCandidates.map(normalizeText).filter(Boolean);
  const rowEmails = rowEmailCandidates.map(normalizeText).filter(Boolean);
  const recordEmails = recordEmailCandidates.map(normalizeText).filter(Boolean);
  const rowPhones = rowPhoneCandidates.map(normalizeText).filter(Boolean);
  const recordPhones = recordPhoneCandidates.map(normalizeText).filter(Boolean);

  const nameMatch = rowNames.some((rowName) =>
    recordNames.some((recordName) => rowName === recordName || rowName.includes(recordName) || recordName.includes(rowName))
  );

  const emailMatch = rowEmails.some((rowEmail) =>
    recordEmails.some((recordEmail) => rowEmail === recordEmail)
  );

  const phoneMatch = rowPhones.some((rowPhone) =>
    recordPhones.some((recordPhone) => rowPhone === recordPhone)
  );

  const idMatch = normalizeText(row._id || row.id) === normalizeText(record._id || record.id);

  return nameMatch || emailMatch || phoneMatch || idMatch;
}

function formatDetailValue(value) {
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

function buildPledgeDetails(payload) {
  const record = extractDetailRecord(payload) || {};
  const details = [];
  const seen = new Set();

  function add(label, value) {
    if (value === undefined || value === null || value === '') {
      return;
    }

    details.push({ label, value: formatDetailValue(value) });
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
      ['_id', 'id', 'termid', 'createdat', 'updatedat', 'created_at', 'updated_at'].includes(
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

function RegistryPage({ adminToken }) {
  const [rows, setRows] = useState([]);
  const [pledgeRows, setPledgeRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rootStatus, setRootStatus] = useState('Checking your connection...');
  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState('');
  const [selectedPledgeRaw, setSelectedPledgeRaw] = useState(null);
  const [pledgeLoading, setPledgeLoading] = useState(false);
  const [pledgeError, setPledgeError] = useState('');
  const pageSize = 10;

  const combinedRows = useMemo(() => {
    const nextRows = [
      ...rows.map((row) => normalizeRow(row, 'donor')),
      ...pledgeRows.map((row) => normalizeRow(row, 'term')),
    ];

    return nextRows.sort((left, right) => {
      const leftTime = new Date(left.createdAt || left.updatedAt || 0).getTime();
      const rightTime = new Date(right.createdAt || right.updatedAt || 0).getTime();
      return rightTime - leftTime;
    });
  }, [pledgeRows, rows]);

  const loadRegistry = useCallback(
    async () => {
      if (!adminToken) {
        setRows([]);
        setTotalCount(0);
        setError('Please sign in to view the list.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await apiRequest(registryEndpoint, { token: adminToken });
        const nextRows = extractRegistryRows(response);
        setRows(nextRows);
        setTotalCount(response?.count ?? response?.total ?? response?.totalCount ?? nextRows.length);
      } catch (err) {
        setRows([]);
        setTotalCount(0);
        setError(isAuthError(err.message) ? 'Unable to load the list right now.' : err.message);
      } finally {
        setLoading(false);
      }
    },
    [adminToken]
  );

  const loadPledgeRows = useCallback(
    async () => {
      if (!adminToken) {
        setPledgeRows([]);
        setPledgeError('Please sign in to view details.');
        return;
      }

      setPledgeLoading(true);
      setPledgeError('');

      try {
        const response = await apiRequest(pledgeEndpoint, { token: adminToken });
        const nextRows = extractRegistryRows(response);
        setPledgeRows(nextRows);
      } catch (err) {
        setPledgeRows([]);
        setPledgeError(isAuthError(err.message) ? 'Unable to load details right now.' : err.message);
      } finally {
        setPledgeLoading(false);
      }
    },
    [adminToken]
  );

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
    loadRegistry();
    loadPledgeRows();

    return () => {
      active = false;
    };
  }, [loadPledgeRows, loadRegistry]);

  const filteredRows = useMemo(() => {
    return combinedRows.filter((row) => {
      const haystack = [
        row.fullName || row.name || '',
        row.email || '',
        row.phone || '',
        row.age || '',
        row.gender || '',
        row._id || row.id || '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = search.query
        ? haystack.includes(search.query.trim().toLowerCase())
        : true;

      const rowStatus = (row.status || '').toLowerCase();
      const matchesStatus =
        !search.status || search.status === 'all' ? true : rowStatus.includes(search.status);

      return matchesQuery && matchesStatus;
    });
  }, [combinedRows, search]);

  const selectedRow = useMemo(
    () => combinedRows.find((row) => row.__rowId === selectedRowId) || null,
    [combinedRows, selectedRowId]
  );

  const selectedPledgeDetails = useMemo(
    () => {
      const matchedRecord =
        selectedRow?.__source === 'term'
          ? selectedRow
          : pledgeRows.find((record) => isMatchingPledgeRecord(selectedRow, record));
      return buildPledgeDetails(matchedRecord || selectedPledgeRaw);
    },
    [pledgeRows, selectedPledgeRaw, selectedRow]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search.query, search.status]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredRows]);

  function escapeCsvValue(value) {
    const text = String(value ?? '');
    if (/[",\n]/.test(text)) {
      return `"${text.replaceAll('"', '""')}"`;
    }

    return text;
  }

  function exportCsv() {
    if (!filteredRows.length) {
      setMessage('No people are ready to download.');
      setError('');
      return;
    }

    const headers = [
      'Record Type',
      'Full Name',
      'Email Address',
      'Phone Number',
      'Age',
      'Gender',
      'Notes',
      'Status',
      'Active',
      'Created At',
      'Updated At',
    ];

    const csvRows = [
      headers.join(','),
      ...filteredRows.map((row) =>
        [
          row.__source === 'term' ? 'Terms' : 'User',
          row.fullName || row.name || '',
          row.email || '',
          row.phone || '',
          row.age || '',
          row.gender || '',
          row.notes || '',
          row.status || '',
          row.isActive === false ? 'No' : 'Yes',
          row.createdAt || '',
          row.updatedAt || '',
        ]
          .map(escapeCsvValue)
          .join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `people-list-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${filteredRows.length} user${filteredRows.length === 1 ? '' : 's'}.`);
    setError('');
  }

  async function deleteuser(row) {
    const id = row?.__rowId;
    const rawId = row?._id || row?.id;
    if (!id || row?.__source !== 'donor' || !rawId) return;
    if (!window.confirm('Delete this user?')) return;

    setActionLoading(id);
    setMessage('');
    setError('');

    try {
      await apiRequest(`${registryEndpoint}/${rawId}`, {
        method: 'DELETE',
        token: adminToken,
      });
      setMessage(`Deleted user ${rawId}.`);
      if (selectedRowId === id) {
        setSelectedRowId('');
        setSelectedPledgeRaw(null);
        setPledgeError('');
      }
      await loadRegistry();
    } catch (err) {
      setError(isAuthError(err.message) ? 'Unable to delete this user right now.' : err.message);
    } finally {
      setActionLoading('');
    }
  }

  async function handleSelectRow(row) {
    const id = row.__rowId;
    if (!id) return;

    setSelectedRowId(id);
    setSelectedPledgeRaw(null);
    setPledgeError('');
    const matchedRecord = pledgeRows.find((record) => isMatchingPledgeRecord(row, record));
    setSelectedPledgeRaw(matchedRecord || null);
    setPledgeLoading(false);
  }

  return (
    <div className="registry-page">
      <main className="registry-page__main">
        <section className="registry-page__hero">
          <div className="registry-page__breadcrumb">
            <span>Admin</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_right
            </span>
            <span className="registry-page__breadcrumb-current">User list</span>
          </div>

          <div className="registry-page__hero-row">
            <div>
              <h1>User list</h1>
              <p>
                Manage and review all registered users. New submissions arrive here, and you can
                download, search, or remove them as needed.
              </p>
              <p className="registry-page__status">{rootStatus}</p>
            </div>

            <div className="registry-page__hero-actions">
              <button
                type="button"
                className="registry-page__action registry-page__action--secondary"
                onClick={exportCsv}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  file_download
                </span>
                Download list
              </button>
            </div>
          </div>
        </section>

        <section className="registry-page__filters">
          <div className="registry-page__search">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, email, or reference..."
              value={search.query}
              onChange={(event) => setSearch({ ...search, query: event.target.value })}
            />
          </div>

          <select
            className="registry-page__select"
            value={search.status}
            onChange={(event) => setSearch({ ...search, status: event.target.value })}
          >
            <option value="all">All</option>
            <option value="pending">Waiting</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="button" className="registry-page__action registry-page__action--ghost">
            <span className="material-symbols-outlined" aria-hidden="true">
              tune
            </span>
            More filters
          </button>
        </section>

        {message ? <div className="registry-page__toast registry-page__toast--success">{message}</div> : null}
        {error ? <div className="registry-page__toast registry-page__toast--error">{error}</div> : null}

        <section className="registry-page__workspace">
          <section className="registry-page__table-card">
            <div className="registry-page__table-scroll">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Registration Date</th>
                    <th className="registry-table__actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="registry-page__empty" colSpan={5}>
                        Loading users...
                      </td>
                    </tr>
                  ) : paginatedRows.length ? (
                    paginatedRows.map((row) => {
                      const id = row.__rowId;
                      const initials =
                        (row.fullName || row.name || 'user')
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join('')
                          .toUpperCase() || 'DN';

                      return (
                        <RegistryRow
                          key={id || row.email}
                          initials={initials}
                          name={row.fullName || row.name || 'Unnamed user'}
                          email={row.email || 'No email'}
                          phone={row.phone || 'No phone'}
                          date={
                            row.createdAt
                              ? new Date(row.createdAt).toLocaleDateString()
                              : row.date || 'Unknown'
                          }
                          onSelect={() => handleSelectRow(row)}
                          onDelete={row.__source === 'donor' ? () => deleteuser(row) : undefined}
                          actionLoading={actionLoading === id}
                          selected={selectedRowId === id}
                        />
                      );
                    })
                  ) : (
                    <tr>
                      <td className="registry-page__empty" colSpan={5}>
                        No users found. Sign in to add the first one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="registry-page__pagination">
                <span>
                Showing {filteredRows.length ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
                {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length}{' '}
                matching users
              </span>
              <div className="registry-page__pages">
                <button
                  type="button"
                  className="registry-page__page-button registry-page__page-button--icon"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    chevron_left
                  </span>
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`registry-page__page-button ${
                      page === currentPage ? 'registry-page__page-button--active' : ''
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  className="registry-page__page-button registry-page__page-button--icon"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>

          <aside className="registry-page__sidebar">
            <div className="registry-page__sidebar-header">
              <div>
                <p className="registry-page__eyebrow">Admin only</p>
                <h2>Selected user</h2>
              </div>
              <span className="registry-page__sidebar-badge">
                {selectedRowId ? `ID ${selectedRowId}` : 'Select a row'}
              </span>
            </div>

            {!selectedRow ? (
              <div className="registry-page__sidebar-empty">
                Click a row to load the related details.
              </div>
            ) : (
              <div className="registry-page__detail-list">
                <article className="registry-page__sidebar-card">
                  <p className="registry-page__sidebar-label">Selected user</p>
                  <strong>{selectedRow.fullName || selectedRow.name || 'Unnamed user'}</strong>
                  <span>{selectedRow.email || 'No email provided'}</span>
                  <span>{selectedRow.phone || 'No phone provided'}</span>
                </article>

                <article className="registry-page__sidebar-card">
                  <div className="registry-page__sidebar-header">
                    <div>
                      <p className="registry-page__eyebrow">Filtered result</p>
                      <h2>Submission details</h2>
                    </div>
                    <span className="registry-page__sidebar-badge">
                      {pledgeLoading ? 'Loading...' : 'By user'}
                    </span>
                  </div>

                  {pledgeLoading ? (
                      <div className="registry-page__sidebar-empty">Loading details...</div>
                  ) : pledgeError ? (
                    <div className="registry-page__toast registry-page__toast--error">{pledgeError}</div>
                  ) : selectedPledgeDetails.length ? (
                    <div className="registry-page__detail-list">
                      {selectedPledgeDetails.map((detail) => (
                        <article key={detail.label} className="registry-page__detail-item">
                          <span>{detail.label}</span>
                          <strong>{detail.value}</strong>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="registry-page__sidebar-empty">
                      No extra details were found for this user.
                    </div>
                  )}
                </article>
              </div>
            )}
          </aside>
        </section>

        <section className="registry-page__insights">
          <article className="insight-card">
            <div className="insight-card__top">
              <span className="insight-card__icon insight-card__icon--primary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  group
                </span>
              </span>
            </div>
            <div>
              <p>Total Users</p>
              <strong>{combinedRows.length || totalCount || rows.length}</strong>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default RegistryPage;

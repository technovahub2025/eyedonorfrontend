import { useCallback, useEffect, useMemo, useState } from 'react';
import RegistryRow from '../components/RegistryRow';
import { apiRequest } from '../lib/apiClient';
import './RegistryPage.css';

const initialSearch = {
  query: '',
  status: 'all',
};

const registryEndpoint = '/api/donors';
const pledgeEndpoint = '/api/terms/gettermsbyid';

function extractRegistryRows(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.data || payload?.users || payload?.donors || payload?.records || payload?.items || payload?.result || [];
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

function buildPledgeDetails(payload, fallbackRow) {
  const record = extractDetailRecord(payload) || {};
  const merged = { ...fallbackRow, ...record };
  const details = [];
  const seen = new Set();

  function add(label, value) {
    if (value === undefined || value === null || value === '') {
      return;
    }

    details.push({ label, value: formatDetailValue(value) });
    seen.add(label);
  }

  add('Name', merged.name || merged.fullName);
  add('Age', merged.age);
  add('Gender', merged.gender);
  add('Email', merged.email);
  add('Phone', merged.phone);
  add('Status', merged.status);
  add('Notes', merged.notes || merged.body || merged.description || merged.note);
  add('Created At', merged.createdAt || merged.created_at);
  add('Updated At', merged.updatedAt || merged.updated_at);
  add('Record ID', merged._id || merged.id || merged.termId);

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

function RegistryPage() {
  const [rows, setRows] = useState([]);
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

  const loadRegistry = useCallback(
    async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiRequest(registryEndpoint);
        const nextRows = extractRegistryRows(response);
        setRows(nextRows);
        setTotalCount(response?.count ?? response?.total ?? response?.totalCount ?? nextRows.length);
      } catch (err) {
        setRows([]);
        setTotalCount(0);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

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

    checkRoot();
    loadRegistry();

    return () => {
      active = false;
    };
  }, [loadRegistry]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const haystack = [
        row.fullName || row.name || '',
        row.email || '',
        row.phone || '',
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
  }, [rows, search]);

  const selectedRow = useMemo(
    () => rows.find((row) => (row._id || row.id || '') === selectedRowId) || null,
    [rows, selectedRowId]
  );

  const selectedPledgeDetails = useMemo(
    () => buildPledgeDetails(selectedPledgeRaw, selectedRow),
    [selectedPledgeRaw, selectedRow]
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
      setMessage('No records are ready to export.');
      setError('');
      return;
    }

    const headers = [
      'Full Name',
      'Email Address',
      'Phone Number',
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
          row.fullName || row.name || '',
          row.email || '',
          row.phone || '',
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
    link.download = `user-registry-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${filteredRows.length} record${filteredRows.length === 1 ? '' : 's'}.`);
    setError('');
  }

  async function deleteuser(id) {
    if (!id) return;
    if (!window.confirm('Delete this record?')) return;

    setActionLoading(id);
    setMessage('');
    setError('');

    try {
      await apiRequest(`${registryEndpoint}/${id}`, {
        method: 'DELETE',
      });
      setMessage(`Deleted record ${id}.`);
      if (selectedRowId === id) {
        setSelectedRowId('');
        setSelectedPledgeRaw(null);
        setPledgeError('');
      }
      await loadRegistry();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  }

  async function handleSelectRow(row) {
    const id = row._id || row.id;
    if (!id) return;

    setSelectedRowId(id);
    setSelectedPledgeRaw(null);
    setPledgeError('');
    setPledgeLoading(true);

    try {
      const response = await apiRequest(`${pledgeEndpoint}/${id}`);
      setSelectedPledgeRaw(extractDetailRecord(response) || response);
    } catch (err) {
      setPledgeError(err.message);
      setSelectedPledgeRaw(row);
    } finally {
      setPledgeLoading(false);
    }
  }

  return (
    <div className="registry-page">
      <main className="registry-page__main">
        <section className="registry-page__hero">
          <div className="registry-page__breadcrumb">
            <span>admin</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_right
            </span>
            <span className="registry-page__breadcrumb-current">user List</span>
          </div>

          <div className="registry-page__hero-row">
            <div>
              <h1>user List</h1>
              <p>
                Manage and review all registered users. New submissions arrive here, and you can
                export, search, or remove them as needed.
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
                Export CSV
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
              placeholder="Search by name, email, or ID..."
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
                        Loading records...
                      </td>
                    </tr>
                  ) : paginatedRows.length ? (
                    paginatedRows.map((row) => {
                      const id = row._id || row.id;
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
                          onDelete={() => deleteuser(id)}
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
                filtered records
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
                <h2>Pledge data</h2>
              </div>
              <span className="registry-page__sidebar-badge">
                {selectedRowId ? `ID ${selectedRowId}` : 'Select a row'}
              </span>
            </div>

            {!selectedRow ? (
              <div className="registry-page__sidebar-empty">
                Click a user row to load the related pledge data from the API.
              </div>
            ) : (
              <>
                <div className="registry-page__sidebar-card">
                  <p className="registry-page__sidebar-label">Selected user</p>
                  <strong>{selectedRow.fullName || selectedRow.name || 'Unnamed user'}</strong>
                  <span>{selectedRow.email || 'No email provided'}</span>
                </div>

                {pledgeLoading ? <div className="registry-page__sidebar-empty">Loading pledge data...</div> : null}
                {pledgeError ? <div className="registry-page__toast registry-page__toast--error">{pledgeError}</div> : null}

                {selectedPledgeDetails.length ? (
                  <div className="registry-page__detail-list">
                    {selectedPledgeDetails.map((detail) => (
                      <article key={detail.label} className="registry-page__detail-item">
                        <span>{detail.label}</span>
                        <strong>{detail.value}</strong>
                      </article>
                    ))}
                  </div>
                ) : null}

                {!pledgeLoading && !selectedPledgeDetails.length ? (
                  <div className="registry-page__sidebar-empty">
                    The API returned no pledge fields for this record.
                  </div>
                ) : null}
              </>
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
              <p>Total Records</p>
              <strong>{totalCount || rows.length}</strong>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default RegistryPage;

import { useCallback, useEffect, useMemo, useState } from 'react';
import RegistryRow from '../components/RegistryRow';
import { apiRequest } from '../lib/apiClient';
import './RegistryPage.css';

const initialSearch = {
  query: '',
  status: 'all',
};

function RegistryPage({ adminToken, onAdminTokenChange, onAdminLogout }) {
  const [token, setToken] = useState(adminToken || '');
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rootStatus, setRootStatus] = useState('Checking your connection...');
  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadRegistry = useCallback(
    async (authToken = token) => {
      if (!authToken) {
        setLoading(false);
        setError('Staff sign in is needed to view the list.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const donors = await apiRequest('/api/donors', { token: authToken });
        const nextRows = Array.isArray(donors) ? donors : donors?.data || donors?.donors || [];
        setRows(nextRows);
        setTotalCount(donors?.count ?? nextRows.length);
      } catch (err) {
        setRows([]);
        setTotalCount(0);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
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
    loadRegistry(token);

    return () => {
      active = false;
    };
  }, [loadRegistry, token]);

  useEffect(() => {
    setToken(adminToken || '');
  }, [adminToken]);

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
    link.download = `donor-registry-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${filteredRows.length} record${filteredRows.length === 1 ? '' : 's'}.`);
    setError('');
  }

  async function deleteDonor(id) {
    if (!id) return;
    if (!window.confirm('Delete this record?')) return;

    setActionLoading(id);
    setMessage('');
    setError('');

    try {
      await apiRequest(`/api/donors/${id}`, {
        method: 'DELETE',
        token,
      });
      setMessage(`Deleted record ${id}.`);
      await loadRegistry(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  }

  function handleLogout() {
    setToken('');
    onAdminTokenChange?.('');
    onAdminLogout?.();
    setRows([]);
    setTotalCount(0);
    setMessage('Signed out.');
  }

  return (
    <div className="registry-page">
      <header className="registry-page__header">
        <nav className="registry-page__nav">
          <div className="registry-page__brand">
            <span className="material-symbols-outlined" aria-hidden="true">
              visibility
            </span>
            <span>VisionGift</span>
          </div>

          <div className="registry-page__nav-links">
            <a href="#how-it-works">How it Works</a>
            <a href="#impact">Impact</a>
            <a href="#support">Support</a>
          </div>

          <div className="registry-page__nav-actions">
            <button className="registry-page__register" type="button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      <main className="registry-page__main">
        <section className="registry-page__hero">
          <div className="registry-page__breadcrumb">
            <span>Staff</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_right
            </span>
            <span className="registry-page__breadcrumb-current">Donor List</span>
          </div>

          <div className="registry-page__hero-row">
            <div>
              <h1>Donor List</h1>
              <p>
                Manage and review all registered donors. New submissions arrive here, and you can
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
                      (row.fullName || row.name || 'Donor')
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
                        name={row.fullName || row.name || 'Unnamed donor'}
                        email={row.email || 'No email'}
                        phone={row.phone || 'No phone'}
                        date={row.createdAt ? new Date(row.createdAt).toLocaleDateString() : row.date || 'Unknown'}
                        onDelete={() => deleteDonor(id)}
                        actionLoading={actionLoading === id}
                      />
                    );
                  })
                ) : (
                  <tr>
                    <td className="registry-page__empty" colSpan={5}>
                      No donors found. Sign in to add the first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="registry-page__pagination">
            <span>
              Showing {filteredRows.length ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} filtered records
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

      <footer className="registry-page__footer">
        <div className="registry-page__footer-inner">
          <div className="registry-page__footer-brand-wrap">
            <div className="registry-page__footer-brand">
              <span className="material-symbols-outlined" aria-hidden="true">
                visibility
              </span>
              <span>VisionGift</span>
            </div>
            <p>Copyright 2026 VisionGift. All rights reserved.</p>
          </div>

          <div className="registry-page__footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#accessibility">Accessibility</a>
            <a href="#contact">Contact Us</a>
          </div>
          <a className="registry-page__powered-by" href="https://www.technovahub.in">
            Powered by TechnovaHub
          </a>

          <div className="registry-page__footer-social">
            <a href="#share" aria-label="Share">
              <span className="material-symbols-outlined" aria-hidden="true">
                share
              </span>
            </a>
            <a href="#mail" aria-label="Email">
              <span className="material-symbols-outlined" aria-hidden="true">
                mail
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RegistryPage;

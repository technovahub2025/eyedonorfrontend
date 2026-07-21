import { useCallback, useEffect, useMemo, useState } from 'react';
import RegistryRow from '../components/RegistryRow';
import {
  API_BASE_URL,
  apiRequest,
} from '../lib/apiClient';
import './RegistryPage.css';

const initialSearch = {
  query: '',
  status: '',
};

function RegistryPage({ adminToken, onAdminTokenChange, onAdminLogout }) {
  const [token, setToken] = useState(adminToken || '');
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rootStatus, setRootStatus] = useState('Checking API connection...');
  const [search, setSearch] = useState(initialSearch);

  const loadRegistry = useCallback(
    async (authToken = token) => {
      if (!authToken) {
        setLoading(false);
        setError('Admin login required to view the registry.');
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
        setRootStatus(typeof data === 'string' ? data : data?.message || 'API root reachable');
      } catch (err) {
        if (!active) return;
        setRootStatus(`API check failed: ${err.message}`);
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
      const matchesStatus = search.status ? rowStatus.includes(search.status) : true;

      return matchesQuery && matchesStatus;
    });
  }, [rows, search]);

  const statusCounts = useMemo(() => {
    const normalizeStatus = (value) => (value || '').toLowerCase();
    const pendingRows = rows.filter((row) => normalizeStatus(row.status) === 'pending');
    const acceptedRows = rows.filter((row) => normalizeStatus(row.status) === 'accepted');
    const declinedRows = rows.filter((row) => normalizeStatus(row.status) === 'declined');
    const activeRows = rows.filter((row) => row.isActive !== false);
    const inactiveRows = rows.filter((row) => row.isActive === false);

    return {
      total: totalCount || rows.length,
      pending: pendingRows.length,
      accepted: acceptedRows.length,
      declined: declinedRows.length,
      active: activeRows.length,
      inactive: inactiveRows.length,
    };
  }, [rows, totalCount]);

  async function updateStatus(id, status) {
    if (!id) return;
    setActionLoading(id);
    setMessage('');
    setError('');

    try {
      await apiRequest(`/api/donors/${id}`, {
        method: 'PUT',
        token,
        body: { status },
      });
      setMessage(`Updated donor ${id} to ${status}.`);
      await loadRegistry(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  }

  async function deleteDonor(id) {
    if (!id) return;
    if (!window.confirm('Delete this donor record?')) return;

    setActionLoading(id);
    setMessage('');
    setError('');

    try {
      await apiRequest(`/api/donors/${id}`, {
        method: 'DELETE',
        token,
      });
      setMessage(`Deleted donor ${id}.`);
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
    setMessage('Admin token cleared.');
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
              Logout
            </button>
            <div className="registry-page__avatar">
              <img
                alt="Healthcare administrator"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuJjT3z6vdh0wgveuO6ll0A9hi6hqkKeRe8XXi1fKysi-TLOiJS9SZ9ODwjTYZvgkk2MpJeoIG7eWrblJpkGHYwViHO46DXd1sxYEPmXYlAeCrLKdkswvoBPtNfuOpeW_OXaP6AHa_Tql5cKh43m9TiieZvLyLjADDWBbpdxTJtDDR6dxqlmdpdz6HQS3yfeW2kTnLYMUQTeORInSXbukZK2KHM3qWEM7CaQs_FUWuE6MQaCqhjaY"
              />
            </div>
            <button className="registry-page__menu material-symbols-outlined" type="button">
              menu
            </button>
          </div>
        </nav>
      </header>

      <main className="registry-page__main">
        <section className="registry-page__hero">
          <div className="registry-page__breadcrumb">
            <span>Admin</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_right
            </span>
            <span className="registry-page__breadcrumb-current">Donor Management</span>
          </div>

          <div className="registry-page__hero-row">
            <div>
              <h1>Donor Registry</h1>
              <p>
                Manage and review all registered eye donors. Ensure compliance and verification
                across the national database. New user submissions arrive here as pending records
                and can be marked accepted or declined.
              </p>
              <p className="registry-page__status">{rootStatus}</p>
              <p className="registry-page__status">
                API base: <code>{API_BASE_URL}</code>
              </p>
            </div>

            <div className="registry-page__hero-actions">
              <button type="button" className="registry-page__action registry-page__action--secondary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  file_download
                </span>
                Export CSV
              </button>
              <button type="button" className="registry-page__action registry-page__action--primary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  add
                </span>
                New Entry
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
            <option value="">All Statuses</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
            <option value="active">Active Donor</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>

          <button type="button" className="registry-page__action registry-page__action--ghost">
            <span className="material-symbols-outlined" aria-hidden="true">
              tune
            </span>
            Advanced Filters
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
                  <th>Status</th>
                  <th className="registry-table__actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="registry-page__empty" colSpan={6}>
                      Loading donors...
                    </td>
                  </tr>
                ) : filteredRows.length ? (
                  filteredRows.map((row) => {
                    const id = row._id || row.id;
                    const status = row.status || 'Pending';
                    const normalizedStatus = status.toLowerCase();
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
                        status={status}
                        statusTone={
                          normalizedStatus.includes('verified')
                            ? 'verified'
                            : normalizedStatus.includes('pending')
                              ? 'pending'
                              : normalizedStatus.includes('declined')
                                ? 'neutral'
                                : 'active'
                        }
                        onAccept={() => updateStatus(id, 'Accepted')}
                        onDecline={() => updateStatus(id, 'Declined')}
                        onDelete={() => deleteDonor(id)}
                        actionLoading={actionLoading === id}
                      />
                    );
                  })
                ) : (
                  <tr>
                    <td className="registry-page__empty" colSpan={6}>
                      No donors found. Sign in as admin or create a donor to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="registry-page__pagination">
            <span>
              Showing {filteredRows.length ? 1 : 0} to {filteredRows.length} of {statusCounts.total} donors
            </span>
            <div className="registry-page__pages">
              <button type="button" className="registry-page__page-button registry-page__page-button--icon">
                <span className="material-symbols-outlined" aria-hidden="true">
                  chevron_left
                </span>
              </button>
              <button type="button" className="registry-page__page-button registry-page__page-button--active">
                1
              </button>
              <button type="button" className="registry-page__page-button">2</button>
              <button type="button" className="registry-page__page-button">3</button>
              <span className="registry-page__ellipsis">...</span>
              <button type="button" className="registry-page__page-button">50</button>
              <button type="button" className="registry-page__page-button registry-page__page-button--icon">
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
              <p>Total Registrations</p>
              <strong>{statusCounts.total}</strong>
            </div>
          </article>
          <article className="insight-card">
            <div className="insight-card__top">
              <span className="insight-card__icon insight-card__icon--secondary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  verified_user
                </span>
              </span>
            </div>
            <div>
              <p>Accepted</p>
              <strong>{statusCounts.accepted}</strong>
            </div>
          </article>
          <article className="insight-card">
            <div className="insight-card__top">
              <span className="insight-card__icon insight-card__icon--error">
                <span className="material-symbols-outlined" aria-hidden="true">
                  pending_actions
                </span>
              </span>
            </div>
            <div>
              <p>Pending Review</p>
              <strong>{statusCounts.pending}</strong>
            </div>
          </article>
          <article className="insight-card">
            <div className="insight-card__top">
              <span className="insight-card__icon insight-card__icon--primary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  do_not_disturb
                </span>
              </span>
            </div>
            <div>
              <p>Declined</p>
              <strong>{statusCounts.declined}</strong>
            </div>
          </article>
          <article className="insight-card">
            <div className="insight-card__top">
              <span className="insight-card__icon insight-card__icon--secondary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  toggle_on
                </span>
              </span>
            </div>
            <div>
              <p>Active</p>
              <strong>{statusCounts.active}</strong>
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
            <p>© 2024 VisionGift. All rights reserved. Medical Excellence in Eye Donation.</p>
          </div>

          <div className="registry-page__footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#accessibility">Accessibility</a>
            <a href="#contact">Contact Us</a>
          </div>

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

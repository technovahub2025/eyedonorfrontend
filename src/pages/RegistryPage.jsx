import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/apiClient';
import './RegistryPage.css';

const registryEndpoint = '/api/donors';
const pledgeEndpoint = '/api/terms/getall';

function RegistryPage({ adminToken }) {
  const [rows, setRows] = useState([]);
  const [pledgeRows, setPledgeRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!adminToken) {
        setRows([]);
        setPledgeRows([]);
        setError('Please sign in to view details.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [donorsResponse, termsResponse] = await Promise.all([
          apiRequest(registryEndpoint, { token: adminToken }),
          apiRequest(pledgeEndpoint, { token: adminToken }),
        ]);

        if (!active) return;

        const donors = Array.isArray(donorsResponse) ? donorsResponse : donorsResponse?.data || donorsResponse?.users || donorsResponse?.donors || [];
        const terms = Array.isArray(termsResponse) ? termsResponse : termsResponse?.data || termsResponse?.users || termsResponse?.terms || [];

        const normalizedDonors = donors.map((donor) => ({
          ...donor,
          __source: 'donor',
          displayName: donor.fullName || donor.name || 'Unnamed',
          displayAge: donor.age || 'N/A',
          displayGender: donor.gender || 'N/A',
          displayEmail: donor.email || 'N/A',
          displayPhone: donor.phone || 'N/A',
          displayStatus: donor.status || 'N/A',
        }));

        const normalizedTerms = terms.map((term) => ({
          ...term,
          __source: 'term',
          displayName: term.fullName || term.name || 'Unnamed',
          displayAge: term.age || 'N/A',
          displayGender: term.gender || 'N/A',
          displayEmail: 'N/A',
          displayPhone: 'N/A',
          displayStatus: term.status || 'Pledge',
        }));

        const combined = [...normalizedDonors, ...normalizedTerms].sort((a, b) => {
          const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime();
          const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime();
          return bTime - aTime;
        });

        setRows(combined);
        setPledgeRows(terms);
      } catch (err) {
        setRows([]);
        setPledgeRows([]);
        setError(err.message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [adminToken]);

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
              <p>All registered users and their details are shown below.</p>
              <p className="registry-page__status">
                {loading ? 'Loading...' : `Showing ${rows.length} record${rows.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
        </section>

        {error ? <div className="registry-page__toast registry-page__toast--error">{error}</div> : null}

        <section className="registry-page__table-card">
          <div className="registry-page__table-scroll">
            <table className="registry-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="registry-page__empty" colSpan={6}>
                      Loading user details...
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((row) => {
                    const id = row._id || row.id || row.termId || `${row.displayName}-${row.displayEmail}`;
                    return (
                      <tr key={id}>
                        <td className="registry-row__cell registry-row__cell--name">
                          <div className="registry-row__identity">
                            <div className="registry-row__avatar registry-row__avatar--active">
                              {row.displayName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'DN'}
                            </div>
                            <span className="registry-row__name">{row.displayName}</span>
                          </div>
                        </td>
                        <td className="registry-row__cell">{row.displayAge}</td>
                        <td className="registry-row__cell">{row.displayGender}</td>
                        <td className="registry-row__cell">{row.displayEmail}</td>
                        <td className="registry-row__cell">{row.displayPhone}</td>
                        <td className="registry-row__cell">
                          <span className={`registry-row__badge ${row.displayStatus === 'Accepted' ? 'registry-row__badge--success' : row.displayStatus === 'Declined' ? 'registry-row__badge--error' : 'registry-row__badge--neutral'}`}>
                            {row.displayStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="registry-page__empty" colSpan={6}>
                      No user details found. Sign in to view registered users.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RegistryPage;

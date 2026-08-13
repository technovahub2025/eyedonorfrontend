import { useEffect, useState } from 'react';
import BrandMark from '../components/BrandMark';
import { apiRequest } from '../lib/apiClient';
import './UserDashboardPage.css';

function UserDashboardPage({ userToken, onUserLogout, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!userToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest('/api/user/me', { token: userToken });
        if (active) {
          setProfile(data?.user || data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [userToken]);

  function handleLogout() {
    onUserLogout?.();
    onNavigate?.('role-select');
  }

  return (
    <div className="user-dashboard-page">
      <main className="user-dashboard-page__main">
        <section className="user-dashboard-card" aria-labelledby="user-dashboard-title">
          <header className="user-dashboard-card__header">
            <BrandMark title="VisionGift" subtitle="Your dashboard" />
            <h2 id="user-dashboard-title">Welcome</h2>
          </header>

          {loading ? (
            <p className="user-dashboard-card__status">Loading your details...</p>
          ) : error ? (
            <p className="user-dashboard-card__error">{error}</p>
          ) : profile ? (
            <div className="user-dashboard-card__profile">
              <p><strong>Name:</strong> {profile.fullName}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Status:</strong> {profile.status}</p>
              {profile.notes && <p><strong>Notes:</strong> {profile.notes}</p>}
              <p><strong>Member since:</strong> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          ) : (
            <p className="user-dashboard-card__status">No profile data available.</p>
          )}

          <div className="user-dashboard-card__actions">
            <button type="button" className="user-dashboard-card__ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboardPage;

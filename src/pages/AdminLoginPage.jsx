import { useEffect, useState } from 'react';
import FormField from '../components/FormField';
import {
  API_BASE_URL,
  apiRequest,
} from '../lib/apiClient';
import './AdminLoginPage.css';

const initialForm = {
  username: '',
  password: '',
  otp: '',
};

function AdminLoginPage({ adminToken, onAdminTokenChange }) {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(adminToken || '');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rootStatus, setRootStatus] = useState('Checking API connection...');

  async function loadProfile(authToken = token) {
    if (!authToken) {
      return;
    }

    setProfileLoading(true);
    try {
      const data = await apiRequest('/api/admin/me', { token: authToken });
      setProfile(data);
    } catch (err) {
      setProfile(null);
      setError(err.message);
      setToken('');
      onAdminTokenChange?.('');
    } finally {
      setProfileLoading(false);
    }
  }

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

    setToken(adminToken || '');
    if (adminToken) {
      loadProfile(adminToken);
    }

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await apiRequest('/api/admin/login', {
        method: 'POST',
        body: {
          username: form.username,
          password: form.password,
        },
      });

      const nextToken = data?.token || data?.accessToken || data?.adminToken;
      if (!nextToken) {
        throw new Error('Login response did not include a token.');
      }

      setToken(nextToken);
      onAdminTokenChange?.(nextToken);
      setMessage(data?.message || 'Admin login successful.');
      await loadProfile(nextToken);
    } catch (err) {
      setProfile(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    setProfile(null);
    setMessage('');
    setError('');
    onAdminTokenChange?.('');
  }

  return (
    <div className="admin-login-page">
      <aside className="admin-login-page__panel">
        <div className="admin-login-page__brand">
          <span className="material-symbols-outlined" aria-hidden="true">
            visibility
          </span>
          <span>VisionGift Admin</span>
        </div>

        <div className="admin-login-page__panel-copy">
          <p className="admin-login-page__eyebrow">Protected access</p>
          <h1>Admin Portal Sign In</h1>
          <p>
            Use your administrator credentials to manage donor records, review
            verification queues, and access compliance tools.
          </p>
        </div>

        <div className="admin-login-page__trust-grid">
          <article>
            <strong>2FA</strong>
            <span>Optional multi-factor verification</span>
          </article>
          <article>
            <strong>HIPAA</strong>
            <span>Compliance-first access controls</span>
          </article>
          <article>
            <strong>Audit</strong>
            <span>Signed activity trail for admin actions</span>
          </article>
        </div>

        <div className="admin-login-page__notice">
          <span className="material-symbols-outlined" aria-hidden="true">
            shield
          </span>
          <p>
            Administrator access is monitored and restricted to approved staff only.
          </p>
        </div>
      </aside>

      <main className="admin-login-page__main">
        <section className="admin-login-card" aria-labelledby="admin-login-title">
          <header className="admin-login-card__header">
            <p className="admin-login-card__kicker">VisionGift Secure Portal</p>
            <h2 id="admin-login-title">Admin Login</h2>
            <p>Enter your credentials to open the dashboard and donor management tools.</p>
            <p className="admin-login-card__status">{rootStatus}</p>
            <p className="admin-login-card__status">
              API base: <code>{API_BASE_URL}</code>
            </p>
          </header>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <FormField
              id="admin-username"
              label="Username or Email"
              placeholder="admin@example.com"
              icon="person"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              autoComplete="username"
              required
            />

            <div className="admin-login-form__password-row">
              <FormField
                id="admin-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon="lock"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                autoComplete="current-password"
                required
              />
              <button
                className="admin-login-form__toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <FormField
              id="admin-otp"
              label="Authenticator Code"
              placeholder="6-digit code"
              icon="pin"
              value={form.otp}
              onChange={(event) => setForm({ ...form, otp: event.target.value })}
              inputMode="numeric"
              autoComplete="one-time-code"
            />

            <div className="admin-login-form__options">
              <a href="#forgot-password">Forgot password?</a>
            </div>

            <button className="admin-login-form__submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
          </form>

          {message ? <p className="admin-login-card__success">{message}</p> : null}
          {error ? <p className="admin-login-card__error">{error}</p> : null}

          <div className="admin-login-card__actions">
            <button type="button" className="admin-login-card__secondary" onClick={() => loadProfile()}>
              {profileLoading ? 'Refreshing...' : 'Refresh Profile'}
            </button>
            <button type="button" className="admin-login-card__ghost" onClick={handleLogout} disabled={!token}>
              Logout
            </button>
          </div>

          <div className="admin-login-card__footer">
            <span className="material-symbols-outlined" aria-hidden="true">
              verified_user
            </span>
            <p>
              All admin access is logged and protected by secure session controls.
            </p>
          </div>

          <div className="admin-login-card__profile">
            <span className="admin-login-card__profile-label">Admin Profile</span>
            <p>{profileLoading ? 'Loading profile...' : profile ? JSON.stringify(profile) : 'No profile loaded yet.'}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminLoginPage;

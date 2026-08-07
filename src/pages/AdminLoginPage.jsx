import { useEffect, useState } from 'react';
import BrandMark from '../components/BrandMark';
import FormField from '../components/FormField';
import { apiRequest } from '../lib/apiClient';
import './AdminLoginPage.css';

const initialForm = {
  username: '',
  password: '',
};

function AdminLoginPage({ adminToken, onAdminTokenChange, onAdminLoginSuccess, onAdminLogout }) {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rootStatus, setRootStatus] = useState('Checking your connection...');

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

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!adminToken) {
      return;
    }

    setLoginData((current) => current || { username: '', password: '' });
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

      setLoginData({
        username: form.username,
        password: form.password,
      });
      onAdminTokenChange?.(nextToken);
      setShowDetails(false);
      setMessage(data?.message || 'Sign in successful.');
      onAdminLoginSuccess?.(nextToken, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setLoginData(null);
    setShowDetails(false);
    setMessage('');
    setError('');
    onAdminTokenChange?.('');
    onAdminLogout?.();
  }

  return (
    <div className="admin-login-page">
      <aside className="admin-login-page__panel">
        <div className="admin-login-page__brand">
          <BrandMark title="VisionGift" subtitle="Admin access" />
        </div>

        <div className="admin-login-page__panel-copy">
          <p className="admin-login-page__eyebrow">Admin access</p>
          <h1>Sign in</h1>
          <p>Use your admin details to review people and keep things moving.</p>
        </div>

        <div className="admin-login-page__trust-grid">
          <article>
            <strong>Extra check</strong>
            <span>A second layer before entry</span>
          </article>
          <article>
            <strong>Private access</strong>
            <span>Only approved people can enter</span>
          </article>
          <article>
            <strong>Activity log</strong>
            <span>A simple history of changes</span>
          </article>
        </div>

        <div className="admin-login-page__notice">
          <span className="material-symbols-outlined" aria-hidden="true">
            shield
          </span>
          <p>Admin access is limited to approved members.</p>
        </div>
      </aside>

      <main className="admin-login-page__main">
        <section className="admin-login-card" aria-labelledby="admin-login-title">
          <header className="admin-login-card__header">
            <p className="admin-login-card__kicker">VisionGift</p>
            <h2 id="admin-login-title">Admin sign in</h2>
            <p>Enter your details to open the list and tools.</p>
            <p className="admin-login-card__status">{rootStatus}</p>
          </header>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <FormField
              id="admin-username"
              label="Email or name"
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
                placeholder="Enter your passcode"
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

            <button className="admin-login-form__submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
          </form>

          {message ? <p className="admin-login-card__success">{message}</p> : null}
          {error ? <p className="admin-login-card__error">{error}</p> : null}

          <div className="admin-login-card__actions">
            <button
              type="button"
              className="admin-login-card__secondary"
              onClick={() => setShowDetails((current) => !current)}
              disabled={!loginData}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            <button type="button" className="admin-login-card__ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="admin-login-card__footer">
            <span className="material-symbols-outlined" aria-hidden="true">
              verified_user
            </span>
            <p>All admin access is protected and kept for approved admins.</p>
          </div>

          <div className="admin-login-card__profile">
            <span className="admin-login-card__profile-label">Saved details</span>
            {!loginData ? (
              <p>No details loaded yet.</p>
            ) : showDetails ? (
              <div>
                <p>Username: {loginData.username || 'Not provided'}</p>
                <p>Password: {loginData.password || 'Not provided'}</p>
              </div>
            ) : (
              <p>Your details are ready. Use Show Details to see them.</p>
            )}
          </div>
        </section>
      </main>

    </div>
  );
}

export default AdminLoginPage;

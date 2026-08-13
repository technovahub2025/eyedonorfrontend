import { useEffect, useState } from 'react';
import BrandMark from '../components/BrandMark';
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
        <div className="admin-login-page__brand-wrap">
          <BrandMark
            title="VisionGift"
            subtitle="Admin access"
            className="admin-login-page__brand"
          />
        </div>

        <div className="admin-login-page__hero">
          <p className="admin-login-page__eyebrow">Admin access</p>
          <h1>Welcome back!</h1>
          <span className="admin-login-page__accent" aria-hidden="true" />
          <p className="admin-login-page__lead">
            Use your admin details to review people and keep things moving.
          </p>
        </div>

        <div className="admin-login-page__feature-grid">
          <article>
            <div className="admin-login-page__feature-icon" aria-hidden="true">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <strong>Extra check</strong>
            <span>A second layer of security</span>
          </article>
          <article>
            <div className="admin-login-page__feature-icon" aria-hidden="true">
              <span className="material-symbols-outlined">lock</span>
            </div>
            <strong>Private access</strong>
            <span>Secure and restricted access</span>
          </article>
          <article>
            <div className="admin-login-page__feature-icon" aria-hidden="true">
              <span className="material-symbols-outlined">assignment</span>
            </div>
            <strong>Activity log</strong>
            <span>A simple audit history</span>
          </article>
        </div>

        <div className="admin-login-page__overlay-eye" aria-hidden="true" />
      </aside>

      <main className="admin-login-page__main">
        <section className="admin-login-card" aria-labelledby="admin-login-title">
          <header className="admin-login-card__header">
            <p className="admin-login-card__kicker">VisionGift</p>
            <h2 id="admin-login-title">Admin sign in</h2>
            <p>Enter your details to open the list and tools.</p>
            <div className="admin-login-card__status" role="status" aria-live="polite">
              <span className="admin-login-card__status-badge">
                <span className="material-symbols-outlined" aria-hidden="true">
                  check_circle
                </span>
                VisionGift API Running
              </span>
              <span className="admin-login-card__status-copy">{rootStatus}</span>
            </div>
          </header>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="admin-login-form__field" htmlFor="admin-username">
              <span className="admin-login-form__label">Email or name</span>
              <div className="admin-login-form__control">
                <span className="material-symbols-outlined admin-login-form__icon" aria-hidden="true">
                  person
                </span>
                <input
                  id="admin-username"
                  className="admin-login-form__input"
                  type="text"
                  placeholder="admin"
                  value={form.username}
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <label className="admin-login-form__field" htmlFor="admin-password">
              <span className="admin-login-form__label">Password</span>
              <div className="admin-login-form__control admin-login-form__control--password">
                <span className="material-symbols-outlined admin-login-form__icon" aria-hidden="true">
                  lock
                </span>
                <input
                  id="admin-password"
                  className="admin-login-form__input admin-login-form__input--password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  autoComplete="current-password"
                  required
                />
                <button
                  className="admin-login-form__toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    visibility
                  </span>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button className="admin-login-form__submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
          </form>

          <div className="admin-login-card__separator" aria-hidden="true">
            <span />
            <span>or</span>
            <span />
          </div>

          <div className="admin-login-card__actions">
            <button
              type="button"
              className="admin-login-card__secondary"
              onClick={() => setShowDetails((current) => !current)}
              disabled={!loginData}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                info
              </span>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            <button type="button" className="admin-login-card__ghost" onClick={handleLogout}>
              <span className="material-symbols-outlined" aria-hidden="true">
                logout
              </span>
              Logout
            </button>
          </div>

          {message ? <p className="admin-login-card__success">{message}</p> : null}
          {error ? <p className="admin-login-card__error">{error}</p> : null}

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

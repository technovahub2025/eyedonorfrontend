import { useCallback, useEffect, useState } from 'react';
import FormField from '../components/FormField';
import {
  API_BASE_URL,
  apiRequest,
} from '../lib/apiClient';
import './UserLoginPage.css';

const initialForm = {
  email: '',
  phone: '',
};

function UserLoginPage({ userToken, onUserTokenChange }) {
  const [form, setForm] = useState(initialForm);
  const [token, setToken] = useState(userToken || '');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  const loadProfile = useCallback(
    async (authToken = token) => {
      if (!authToken) {
        return;
      }

      setProfileLoading(true);
      try {
        const data = await apiRequest('/api/user/me', { token: authToken });
        setProfile(data);
      } catch (err) {
        setProfile(null);
        setError(err.message);
        setToken('');
        onUserTokenChange?.('');
      } finally {
        setProfileLoading(false);
      }
    },
    [onUserTokenChange, token]
  );

  useEffect(() => {
    setToken(userToken || '');
    if (userToken) {
      loadProfile(userToken);
    }
  }, [loadProfile, userToken]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await apiRequest('/api/user/login', {
        method: 'POST',
        body: form,
      });

      const nextToken = data?.token || data?.accessToken || data?.userToken;
      if (!nextToken) {
        throw new Error('Login response did not include a token.');
      }

      setToken(nextToken);
      onUserTokenChange?.(nextToken);
      setMessage(data?.message || 'User login successful.');
      await loadProfile(nextToken);
    } catch (err) {
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    setProfile(null);
    setMessage('');
    setError('');
    onUserTokenChange?.('');
  }

  return (
    <div className="user-login-page">
      <section className="user-login-page__hero">
        <div className="user-login-page__brand">
          <span className="material-symbols-outlined" aria-hidden="true">
            visibility
          </span>
          <span>VisionGift</span>
        </div>

        <div className="user-login-page__hero-copy">
          <p className="user-login-page__eyebrow">User access</p>
          <h1>Sign in with your email and phone</h1>
          <p>
            This screen talks to <code>{API_BASE_URL}/api/user/login</code> and
            then fetches <code>/api/user/me</code> with the returned token.
          </p>
        </div>

        <div className="user-login-page__facts">
          <article>
            <strong>Login</strong>
            <span>email + phone</span>
          </article>
          <article>
            <strong>Profile</strong>
            <span>/api/user/me</span>
          </article>
          <article>
            <strong>Session</strong>
            <span>Stored locally</span>
          </article>
        </div>
      </section>

      <section className="user-login-card" aria-labelledby="user-login-title">
        <header className="user-login-card__header">
          <p className="user-login-card__kicker">VisionGift User Portal</p>
          <h2 id="user-login-title">User Login</h2>
          <p>Use your registered details to get a user token and load your profile.</p>
        </header>

        <form className="user-login-form" onSubmit={handleSubmit}>
          <FormField
            id="user-email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon="mail"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            autoComplete="email"
            required
          />

          <FormField
            id="user-phone"
            label="Phone Number"
            type="tel"
            placeholder="9876543210"
            icon="call"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            autoComplete="tel"
            required
          />

          <button className="user-login-form__submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </button>
        </form>

        {message ? <p className="user-login-card__success">{message}</p> : null}
        {error ? <p className="user-login-card__error">{error}</p> : null}

        <div className="user-login-card__actions">
          <button type="button" className="user-login-card__secondary" onClick={() => loadProfile()}>
            {profileLoading ? 'Refreshing...' : 'Refresh Profile'}
          </button>
          <button type="button" className="user-login-card__ghost" onClick={handleLogout} disabled={!token}>
            Logout
          </button>
        </div>

        <div className="user-login-card__profile">
          <span className="user-login-card__profile-label">Profile</span>
          <p>{profileLoading ? 'Loading profile...' : profile ? JSON.stringify(profile) : 'No profile loaded yet.'}</p>
        </div>
      </section>
    </div>
  );
}

export default UserLoginPage;

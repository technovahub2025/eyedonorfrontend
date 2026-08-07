import { useCallback, useEffect, useState } from 'react';
import BrandMark from '../components/BrandMark';
import FormField from '../components/FormField';
import { apiRequest } from '../lib/apiClient';
import './UserLoginPage.css';

const initialForm = {
  email: '',
  phone: '',
};

function UserLoginPage({ userToken, onUserTokenChange, onLoginSuccess, onUserLogout }) {
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
      onLoginSuccess?.(data, nextToken);
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
    onUserLogout?.();
  }

  return (
    <div className="user-login-page">
      <section className="user-login-page__hero">
        <div className="user-login-page__brand">
          <BrandMark title="VisionGift" subtitle="Start with your details" />
        </div>

        <div className="user-login-page__hero-copy">
          <p className="user-login-page__eyebrow">Start here</p>
          <h1>Sign in with your email and phone</h1>
          <p>Use your contact details to continue.</p>
        </div>

        <div className="user-login-page__facts">
          <article>
            <strong>Quick start</strong>
            <span>Email and phone</span>
          </article>
          <article>
            <strong>Your details</strong>
            <span>Kept for the next step</span>
          </article>
          <article>
            <strong>Private</strong>
            <span>Only on this device</span>
          </article>
        </div>
      </section>

      <section className="user-login-card" aria-labelledby="user-login-title">
        <header className="user-login-card__header">
          <p className="user-login-card__kicker">VisionGift</p>
          <h2 id="user-login-title">Sign in</h2>
          <p>Use your registered details to continue.</p>
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
          <span className="user-login-card__profile-label">Your details</span>
          <p>{profileLoading ? 'Loading your details...' : profile ? 'Your details are ready.' : 'No details loaded yet.'}</p>
        </div>

      </section>
    </div>
  );
}

export default UserLoginPage;

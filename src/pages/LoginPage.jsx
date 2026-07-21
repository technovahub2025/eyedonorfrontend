import { useEffect, useState } from 'react';
import { API_BASE_URL, apiRequest } from '../lib/apiClient';
import './LoginPage.css';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  notes: '',
};

function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [rootStatus, setRootStatus] = useState('Checking API connection...');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await apiRequest('/api/donors', {
        method: 'POST',
        body: form,
      });

      setMessage(data?.message || 'Donor submitted successfully.');
      setForm(initialForm);
      onLoginSuccess?.(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <nav className="login-page__nav">
        <div className="login-page__nav-inner">
          <div className="login-page__brand">VisionGift</div>

          <div className="login-page__links" aria-label="Primary">
            <a href="#how-it-works">How it Works</a>
            <a href="#impact">Impact</a>
            <a href="#support">Support</a>
          </div>

          <button className="login-page__nav-button" type="button">
            Public Submit
          </button>
        </div>
      </nav>

      <main className="login-page__main">
        <section className="login-page__layout">
          <div className="login-page__intro">
            <p className="login-page__eyebrow">Public submission</p>
            <h1>Begin your donor registration</h1>
            <p className="login-page__copy">
              Share your contact details and intent to donate. This form sends data
              directly to the backend at {API_BASE_URL}.
            </p>

            <div className="login-page__highlights" aria-label="Highlights">
              <article>
                <strong>Secure</strong>
                <span>POST /api/donors</span>
              </article>
              <article>
                <strong>Private</strong>
                <span>Root check enabled</span>
              </article>
              <article>
                <strong>Fast</strong>
                <span>Instant submission flow</span>
              </article>
            </div>
          </div>

          <section className="login-card" aria-labelledby="login-title">
            <header className="login-card__header">
              <p className="login-card__kicker">VisionGift Donor Form</p>
              <h2 id="login-title">Submit your details</h2>
              <p>
                Please provide the donor information required by the public API.
              </p>
            </header>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-form__field">
                <span>Full Name</span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                  required
                />
              </label>

              <label className="login-form__field">
                <span>Email Address</span>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </label>

              <label className="login-form__field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  required
                />
              </label>

              <label className="login-form__field">
                <span>Notes</span>
                <textarea
                  rows={4}
                  placeholder="I want to donate eyes after death"
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  required
                />
              </label>

              <button className="login-form__submit" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Donor Form'}
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </form>

            {message ? <p className="login-card__success">{message}</p> : null}
            {error ? <p className="login-card__error">{error}</p> : null}

            <div className="login-card__note">
              <span className="material-symbols-outlined" aria-hidden="true">
                verified_user
              </span>
              <p>{rootStatus}</p>
            </div>
          </section>
        </section>

        <section className="login-page__footer" id="support">
          <div className="login-page__footer-brand">VisionGift</div>
          <div className="login-page__footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#accessibility">Accessibility</a>
            <a href="#contact">Contact Us</a>
          </div>
          <p>© 2024 VisionGift. All rights reserved.</p>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;

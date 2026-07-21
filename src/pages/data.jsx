import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/apiClient';
import './data.css';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  notes: '',
};

function DataPage({ onDataSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [rootStatus, setRootStatus] = useState('Checking your connection...');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        body: {
          ...form,
          status: 'Pending',
        },
      });

      setMessage(data?.message || 'Your details were saved and are waiting for verification.');
      setForm(initialForm);
      onDataSuccess?.(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      

      <main className="login-page__main">
        <section className="login-page__layout">
          <div className="login-page__intro">
            <p className="login-page__eyebrow">Your details</p>
            <h1>Enter the details for your registration</h1>
            <p className="login-page__copy">
              Share the details that will be checked before the next step.
            </p>

            <div className="login-page__highlights" aria-label="Highlights">
              <article>
                <strong>Check</strong>
                <span>Details verification step</span>
              </article>
              <article>
                <strong>Quick</strong>
                <span>Moves to the next step</span>
              </article>
            </div>
          </div>

          <section className="login-card" aria-labelledby="login-title">
            <header className="login-card__header">
              <p className="login-card__kicker">VisionGift Data Form</p>
              <h2 id="login-title">Submit your details</h2>
              <p>Please provide the registration information needed to continue.</p>
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
                {loading ? 'Saving...' : 'Save and Continue'}
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
          <a className="login-page__powered-by" href="https://www.technovahub.in">
            Powered by TechnovaHub
          </a>
          <p>Copyright 2026 VisionGift. All rights reserved.</p>
        </section>
      </main>
    </div>
  );
}

export default DataPage;

import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/apiClient';
import './data.css';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  notes: '',
  supportEyeDonation: false,
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

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!form.supportEyeDonation) {
        setError('Please confirm that you support eye donation to continue.');
        return;
      }

      const data = await apiRequest('/api/donors', {
        method: 'POST',
        body: {
          ...form,
          status: 'Pending',
        },
      });

      setMessage(data?.message || 'Your details were saved and are waiting for the next step.');
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
            <h1>Tell us a little about yourself</h1>
            <p className="login-page__copy">
              Share the details we need before you continue.
            </p>
            <p className="login-page__support-copy">
              Eye donation can help restore sight and give someone a new chance at life. Please
              confirm your support before moving to the pledge step.
            </p>

            <div className="login-page__highlights" aria-label="Highlights">
              <article>
                <strong>Simple</strong>
                <span>Easy to complete</span>
              </article>
              <article>
                <strong>Quick</strong>
                <span>Moves to the next step</span>
              </article>
            </div>
          </div>

          <section className="login-card" aria-labelledby="login-title">
            <header className="login-card__header">
              <p className="login-card__kicker">VisionGift</p>
              <h2 id="login-title">Share your details</h2>
              <p>Please fill in the information needed to continue.</p>
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
                  placeholder="I want to support eye donation"
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  required
                />
              </label>

              <label className="login-form__support">
                <input
                  type="checkbox"
                  checked={form.supportEyeDonation}
                  onChange={(event) =>
                    setForm({ ...form, supportEyeDonation: event.target.checked })
                  }
                  required
                />
                <span>I support eye donation</span>
              </label>

              <button
                className="login-form__submit"
                type="submit"
                disabled={loading || !form.supportEyeDonation}
              >
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

      </main>
    </div>
  );
}

export default DataPage;

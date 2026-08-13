import { ArrowRight, Eye, Heart, Shield } from 'lucide-react';
import { useState } from 'react';
import './RoleSelectPage.css';

function RoleSelectPage({ onRoleSelect }) {
  const [supportsEyeDonation, setSupportsEyeDonation] = useState(false);
  const [error, setError] = useState('');

  function handleContinue() {
    if (!supportsEyeDonation) {
      setError('Please confirm that you support eye donation to continue.');
      return;
    }

    setError('');
    onRoleSelect?.('terms');
  }

  return (
    <div className="role-select-page">
      <main className="role-select-page__shell">
        <section className="role-select-page__hero">
          <p className="role-select-page__eyebrow">Eye donation</p>
          <h1>Help share the gift of sight</h1>

          <article className="role-select-page__story">
            <Eye className="role-select-page__story-icon" aria-hidden="true" />
            <p>
              Eye donation can restore vision for someone waiting for hope. A single decision can
              create a lasting impact for families and communities.
            </p>
          </article>

          <article className="role-select-page__story">
            <Heart className="role-select-page__story-icon" aria-hidden="true" />
            <p>
              By supporting eye donation, you help bring compassion, dignity, and a new chance at
              life to people who need it most.
            </p>
          </article>
        </section>

        <section className="role-select-page__panel" aria-label="Continue to registration">
          <div className="role-select-page__panel-card">
            <p className="role-select-page__panel-kicker">Start here</p>
            <h2>Confirm your support and continue</h2>
            <p className="role-select-page__panel-copy">
              Check the box below to confirm your support for eye donation, then move to the next
              step in the registration flow.
            </p>

            <label className="role-select-page__support">
              <input
                type="checkbox"
                checked={supportsEyeDonation}
                onChange={(event) => {
                  setSupportsEyeDonation(event.target.checked);
                  if (event.target.checked) {
                    setError('');
                  }
                }}
              />
              <span>I support eye donation</span>
            </label>

            {error ? <p className="role-select-page__error">{error}</p> : null}

            <button className="role-select-page__continue" type="button" onClick={handleContinue}>
              <span>Continue</span>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>

          <button
            className="role-select-page__admin"
            type="button"
            onClick={() => onRoleSelect?.('admin')}
          >
            <Shield aria-hidden="true" />
            <span>Admin login</span>
          </button>
        </section>

      </main>
    </div>
  );
}

export default RoleSelectPage;

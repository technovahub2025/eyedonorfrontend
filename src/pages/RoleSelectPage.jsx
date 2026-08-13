import { ArrowRight, Eye, Gift, Heart, Shield, UserRound } from 'lucide-react';
import './RoleSelectPage.css';

function RoleSelectPage({ onRoleSelect }) {
  function handleContinue() {
    onRoleSelect?.('terms');
  }

  return (
    <div className="role-select-page">
      <header className="role-select-page__header">
        <div className="role-select-page__brand">
          <div className="role-select-page__brand-mark" aria-hidden="true">
            <Eye />
          </div>
          <div>
            <p className="role-select-page__brand-name">VisionGift</p>
            <p className="role-select-page__brand-tag">The Gift of Sight</p>
          </div>
        </div>
      </header>

      <main className="role-select-page__shell">
        <section className="role-select-page__hero" aria-label="Eye donation welcome">
          <p className="role-select-page__eyebrow">The Gift of Sight</p>
          <h1>Your eyes can give someone a lifetime of vision.</h1>
          <p className="role-select-page__copy">
            One decision can become a precious gift for someone waiting to see the world again.
          </p>

          <div className="role-select-page__actions">
            <button className="role-select-page__continue" type="button" onClick={handleContinue}>
              <span>Continue</span>
              <ArrowRight aria-hidden="true" />
            </button>

            <button
              className="role-select-page__admin"
              type="button"
              onClick={() => onRoleSelect?.('admin')}
            >
              <Shield aria-hidden="true" />
              <span>Admin login</span>
            </button>
          </div>

          <div className="role-select-page__feature">
            <Shield aria-hidden="true" />
            <span>A simple first step can create hope for tomorrow.</span>
          </div>

          <div className="role-select-page__insights" aria-label="What happens next">
            <article className="role-select-page__insight">
              <Heart aria-hidden="true" />
              <div>
                <strong>Gentle start</strong>
                <p>We begin with a simple, reassuring registration step.</p>
              </div>
            </article>
            <article className="role-select-page__insight">
              <UserRound aria-hidden="true" />
              <div>
                <strong>Family aware</strong>
                <p>Share your intention early so loved ones know your choice.</p>
              </div>
            </article>
            <article className="role-select-page__insight">
              <Shield aria-hidden="true" />
              <div>
                <strong>Clear process</strong>
                <p>Each step is organized to keep the experience calm and simple.</p>
              </div>
            </article>
          </div>
        </section>

        <aside className="role-select-page__visual" aria-label="Eye donation illustration">
          <div className="role-select-page__eye-scene" aria-hidden="true">
            <div className="role-select-page__eye-rings" />
            <div className="role-select-page__eye">
              <div className="role-select-page__eyelid role-select-page__eyelid--top" />
              <div className="role-select-page__eyelid role-select-page__eyelid--bottom" />
              <div className="role-select-page__iris">
                <div className="role-select-page__pupil" />
              </div>
            </div>
            <div className="role-select-page__badge role-select-page__badge--top">
              <Heart />
              <div>
                <strong>01</strong>
                <span>One decision</span>
              </div>
            </div>
            <div className="role-select-page__badge role-select-page__badge--middle">
              <Gift />
              <div>
                <strong>02</strong>
                <span>A lasting gift</span>
              </div>
            </div>
            <div className="role-select-page__badge role-select-page__badge--bottom">
              <Eye />
              <div>
                <strong>03</strong>
                <span>A new chance to see</span>
              </div>
            </div>
            <div className="role-select-page__visual-note">
              <p className="role-select-page__visual-note-kicker">Why it matters</p>
              <h3>One choice can change two lives.</h3>
              <p>
                A single eye donation can help restore sight and bring hope back into daily life.
              </p>
            </div>
          </div>
        </aside>
      </main>

      <section className="role-select-page__stats" aria-label="Eye donation highlights">
        <article className="role-select-page__stat">
          <UserRound aria-hidden="true" />
          <div>
            <strong>1 Donation</strong>
            <span>Can help restore vision</span>
          </div>
        </article>
        <article className="role-select-page__stat">
          <div className="role-select-page__stat-icon">
            <span />
          </div>
          <div>
            <strong>4-6 Hours</strong>
            <span>Critical time after death</span>
          </div>
        </article>
        <article className="role-select-page__stat">
          <UserRound aria-hidden="true" />
          <div>
            <strong>2 People</strong>
            <span>Can potentially receive corneal tissue</span>
          </div>
        </article>
        <article className="role-select-page__stat">
          <Heart aria-hidden="true" />
          <div>
            <strong>100%</strong>
            <span>A gift that can create lasting impact</span>
          </div>
        </article>
      </section>
    </div>
  );
}

export default RoleSelectPage;

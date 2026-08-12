import ProgressStepper from '../components/ProgressStepper';
import './TermsPage.css';

const steps = [
  { label: 'Registration' },
  { label: 'Pledge' },
  { label: 'Complete' },
];

const pledgePoints = [
  'I understand this is a voluntary pledge.',
  'I agree to share accurate details with the admin team.',
  'I am ready to continue to the final thank you step.',
];

function TermsPage({ onAccept, onDecline }) {
  return (
    <div className="terms-page">
      <main className="terms-page__main">
        <section className="terms-page__content">
          <div className="terms-page__stepper-wrap">
            <ProgressStepper steps={steps} currentStep={2} />
          </div>

          <section className="terms-card" aria-labelledby="terms-title">
            <div className="terms-card__header">
              <div>
                <h1 id="terms-title">Pledge before you continue</h1>
                <p className="terms-card__intro">
                  Review these three simple points, then submit your pledge to continue.
                </p>
              </div>

              <div className="terms-card__summary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  checklist
                </span>
                <div>
                  <strong>Three-point pledge</strong>
                  <p>No extra form fields are needed on this step.</p>
                </div>
              </div>
            </div>

            <section className="terms-card__scroll" aria-label="Pledge points">
              {pledgePoints.map((point, index) => (
                <article key={point} className="terms-card__row">
                  <div className="terms-card__row-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="terms-card__row-content">
                    <div className="terms-card__row-heading">
                      <h3>Pledge point {index + 1}</h3>
                    </div>
                    <p>{point}</p>
                  </div>
                </article>
              ))}
            </section>

            <div className="terms-card__actions">
              <button
                className="terms-card__button terms-card__button--primary"
                type="button"
                onClick={() => onAccept?.()}
              >
                <span>Submit pledge</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
              <button
                className="terms-card__button terms-card__button--secondary"
                type="button"
                onClick={() => onDecline?.()}
              >
                <span>Back</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>
          </section>

          <section className="terms-page__notice">
            <span className="material-symbols-outlined" aria-hidden="true">
              info
            </span>
            <p>This step is only a pledge. No verification screen is shown anymore.</p>
          </section>
        </section>
      </main>
    </div>
  );
}

export default TermsPage;

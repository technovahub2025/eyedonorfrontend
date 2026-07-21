import './ThankYouPage.css';

function ThankYouPage({ onRestart }) {
  return (
    <div className="thank-you-page">
      <main className="thank-you-page__shell">
        <section className="thank-you-page__card">
          <div className="thank-you-page__badge">
            <span className="material-symbols-outlined" aria-hidden="true">
              verified
            </span>
            <span>Completed</span>
          </div>

          <h1>Thank you</h1>
          <p>
            Your registration has been submitted and reviewed through the verification flow.
            We appreciate the time you took to complete the process.
          </p>

          <button className="thank-you-page__button" type="button" onClick={() => onRestart?.()}>
            Return to Role Selection
          </button>
        </section>
      </main>
    </div>
  );
}

export default ThankYouPage;

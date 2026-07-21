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
            Your registration has been submitted. Thank you for taking the time to complete the
            process.
          </p>

          <button className="thank-you-page__button" type="button" onClick={() => onRestart?.()}>
            Return to Start
          </button>
        </section>

        <footer className="thank-you-page__footer">
          <a className="thank-you-page__powered-by" href="https://www.technovahub.in">
            Powered by TechnovaHub
          </a>
        </footer>
      </main>
    </div>
  );
}

export default ThankYouPage;

import { useCallback } from 'react';
import './ThankYouPage.css';

function ThankYouPage({ onRestart, onRoleSelect }) {
  const handleStartOver = useCallback(() => {
    onRestart?.();
    onRoleSelect?.('user-login');
  }, [onRestart, onRoleSelect]);

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
            Your details have been submitted. Thank you for taking the time to complete the
            process.
          </p>

        
        </section>

      </main>
    </div>
  );
}

export default ThankYouPage;

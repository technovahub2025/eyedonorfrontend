import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircleMore, Sparkles } from 'lucide-react';
import './ThankYouPage.css';

function buildWhatsAppMessage(rows = []) {
  const people = Array.isArray(rows) ? rows : [];
  const header = 'My eye donation pledge has been submitted successfully.';

  if (people.length === 0) {
    return `${header}\n\nNo submitted data was available.`;
  }

  const lines = people.map(
    (row, index) =>
      `${index + 1}. ${row.fullName || row.name || 'N/A'} | Age: ${row.age || 'N/A'} | Gender: ${
        row.gender || 'N/A'
      } | Phone: ${row.phone || 'N/A'} | Place: ${row.place || 'N/A'}`
  );

  return `${header}\n\n${lines.join('\n')}`;
}

function WhatsAppTextPage({ submittedRows = [], onBackToThankYou, onRoleSelect }) {
  const [status, setStatus] = useState('opening');
  const [error, setError] = useState('');
  const message = useMemo(() => buildWhatsAppMessage(submittedRows), [submittedRows]);

  useEffect(() => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    try {
      const popup = window.open(whatsappUrl, '_blank');
      if (!popup) {
        window.location.href = whatsappUrl;
      }
      setStatus('opened');
    } catch (shareError) {
      console.warn('Could not open WhatsApp text:', shareError);
      setStatus('error');
      setError('Unable to open WhatsApp right now. Please try again.');
    }
  }, [message]);

  return (
    <div className="thank-you-page">
      <main className="thank-you-page__shell">
        <section className="thank-you-page__card">
          <div className="thank-you-page__badge">
            <MessageCircleMore aria-hidden="true" />
            <span>WhatsApp Text</span>
          </div>

          <p className="thank-you-page__eyebrow">Separate message screen</p>
          <h1>Opening WhatsApp with your submission text.</h1>
          <p className="thank-you-page__lead">
            This page sends the submitted people details as text, separate from the PDF share flow.
          </p>

          <div className="thank-you-page__actions">
            <button
              className="thank-you-page__button thank-you-page__button--secondary"
              type="button"
              onClick={() => onBackToThankYou?.()}
            >
              <ArrowLeft aria-hidden="true" />
              <span>Back to Thank You</span>
            </button>

            <button
              className="thank-you-page__button thank-you-page__button--ghost"
              type="button"
              onClick={() => onRoleSelect?.('role-select')}
            >
              <Sparkles aria-hidden="true" />
              <span>Go to Home</span>
            </button>
          </div>

          {status === 'opened' ? (
            <div className="thank-you-page__mini-notes">
              <article className="thank-you-page__note">
                <CheckCircle2 aria-hidden="true" />
                <div>
                  <strong>WhatsApp opened</strong>
                  <span>The text message has been prepared for sharing.</span>
                </div>
              </article>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="thank-you-page__mini-notes">
              <article className="thank-you-page__note">
                <CheckCircle2 aria-hidden="true" />
                <div>
                  <strong>Open failed</strong>
                  <span>{error}</span>
                </div>
              </article>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default WhatsAppTextPage;

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Share2,
} from 'lucide-react';
import './ThankYouPage.css';

function ThankYouPage({ onRestart, onRoleSelect, submittedRows = [] }) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const showFooter = !Array.isArray(submittedRows) || submittedRows.length === 0;
  const previewUrl = '/pledge-export.html?mode=preview';

  useEffect(() => {
    const rows = Array.isArray(submittedRows) ? submittedRows : [];
    setPreviewReady(false);
    try {
      window.__PLEDGE_EXPORT_ROWS__ = rows;
      window.localStorage?.setItem('pledge_export_rows', JSON.stringify(rows));
    } catch (error) {
      console.warn('Could not persist preview rows:', error);
    }
    setPreviewReady(true);
  }, [submittedRows]);

  function buildCombinedWhatsAppUrl(rows = []) {
    const savedRows = Array.isArray(rows) ? rows : [];
    const firstPhone = savedRows.find((row) => row.phone || row.mobile || row.telephone);
    const normalizedPhone = `${firstPhone?.phone || firstPhone?.mobile || firstPhone?.telephone || ''}`.replace(/\D/g, '');

    if (!normalizedPhone) {
      return '';
    }

    const messageLines = [
      'you registered successfully',
      '',
      'Submitted people:',
      ...savedRows.map((row, index) => {
        const label = row.fullName || row.name || `Person ${index + 1}`;
        const age = row.age ?? 'N/A';
        const gender = row.gender || 'N/A';
        const placeText = row.place || 'N/A';
        const phoneText = row.phone || 'N/A';

        return `${index + 1}. ${label} | Age: ${age} | Gender: ${gender} | Place: ${placeText} | Phone: ${phoneText}`;
      }),
    ];

    return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(messageLines.join('\n'))}`;
  }

  function handleDownloadPdf() {
    setExportingPdf(true);
    const downloadUrl = new URL('/pledge-export.html?mode=download', window.location.origin);
    const popup = window.open(downloadUrl.toString(), '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = downloadUrl.toString();
    }
    window.setTimeout(() => {
      setExportingPdf(false);
    }, 600);
  }

  function handleShare() {
    const whatsappUrl = buildCombinedWhatsAppUrl(submittedRows);
    if (!whatsappUrl) {
      return;
    }

    const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = whatsappUrl;
    }
  }

  return (
    <div className="thank-you-page">
      <main className="thank-you-page__shell">
        <section className="thank-you-page__card">
          <div className="thank-you-page__badge">
            <CheckCircle2 aria-hidden="true" />
            <span>Completed</span>
          </div>

          <p className="thank-you-page__eyebrow">The gift of sight</p>
          <h1>Thank you for taking this step.</h1>
          <p className="thank-you-page__lead">
            Your details have been submitted successfully. We appreciate your time and your
            compassionate choice.
          </p>

          <div className="thank-you-page__actions">
            <button
              className="thank-you-page__button thank-you-page__button--primary"
              type="button"
              onClick={() => onRoleSelect?.('role-select')}
            >
              <Sparkles aria-hidden="true" />
              <span>Go to Home</span>
            </button>

            <button
              className="thank-you-page__button thank-you-page__button--secondary"
              type="button"
              onClick={() => onRestart?.()}
            >
              <ArrowLeft aria-hidden="true" />
              <span>Restart</span>
            </button>

            <button
              className="thank-you-page__button thank-you-page__button--ghost"
              type="button"
              onClick={handleDownloadPdf}
              disabled={exportingPdf}
              title="Download PDF"
            >
              <Download aria-hidden="true" />
              <span>{exportingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              className="thank-you-page__button thank-you-page__button--secondary"
              type="button"
              onClick={handleShare}
              title="Share on WhatsApp"
            >
              <Share2 aria-hidden="true" />
              <span>Share</span>
            </button>

          </div>

          <div className="thank-you-page__mini-notes">
            <article className="thank-you-page__note">
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>Secure</strong>
                <span>Your entry has been recorded</span>
              </div>
            </article>
            <article className="thank-you-page__note">
              <HeartHandshake aria-hidden="true" />
              <div>
                <strong>Compassionate</strong>
                <span>You helped create a hopeful path</span>
              </div>
            </article>
          </div>
        </section>

        <section className="thank-you-page__preview-panel" aria-label="PDF preview">
          <div className="thank-you-page__preview-head">
            <div>
              <p className="thank-you-page__preview-kicker">PDF Preview</p>
              <h2>Review the generated pledge PDF</h2>
            </div>
            <div className="thank-you-page__preview-actions">
              <button
                className="thank-you-page__button thank-you-page__button--secondary"
                type="button"
                onClick={handleDownloadPdf}
              >
                <Download aria-hidden="true" />
                <span>Download</span>
              </button>
              <button
                className="thank-you-page__button thank-you-page__button--secondary"
                type="button"
                onClick={handleShare}
              >
                <Share2 aria-hidden="true" />
                <span>Share</span>
              </button>
            </div>
          </div>
          <div className="thank-you-page__preview-frame-wrap">
            <iframe
              key={previewReady ? previewUrl : 'preview-loading'}
              className="thank-you-page__preview-frame"
              src={previewReady ? previewUrl : 'about:blank'}
              title="Pledge PDF preview"
            />
          </div>
        </section>

        {showFooter ? (
          <section className="thank-you-page__footer-card">
            <div>
              <p className="thank-you-page__footer-kicker">What happens next</p>
              <p className="thank-you-page__footer-text">
                You can return to the home screen, restart the form, or export the PDF from the
                action buttons above.
              </p>
            </div>
            <div className="thank-you-page__footer-pulse" aria-hidden="true">
              <CheckCircle2 />
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default ThankYouPage;

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  HeartHandshake,
  Eye,
  ShieldCheck,
  Sparkles,
  Share2,
} from 'lucide-react';
import pdfSeal from '../asset/pdf.png';
import './ThankYouPage.css';

function ThankYouPage({ onRestart, onRoleSelect, onSharePdf, submittedRows = [] }) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const autoDownloadStartedRef = useRef(false);
  const showFooter = !Array.isArray(submittedRows) || submittedRows.length === 0;
  const exportBaseUrl = useMemo(() => new URL('/pledge-export.html', window.location.origin), []);
  const previewRows = Array.isArray(submittedRows) ? submittedRows : [];
  const previewPlace = previewRows[0]?.place || 'Place not set';
  const previewDate = new Date().toLocaleDateString('en-GB');
  const isMobilePreview = typeof window !== 'undefined' && window.innerWidth <= 640;

  useEffect(() => {
    const rows = Array.isArray(submittedRows) ? submittedRows : [];
    try {
      window.__PLEDGE_EXPORT_ROWS__ = rows;
      window.localStorage?.setItem('pledge_export_rows', JSON.stringify(rows));
    } catch (error) {
      console.warn('Could not persist preview rows:', error);
    }
  }, [submittedRows]);

  useEffect(() => {
    if (autoDownloadStartedRef.current) {
      return;
    }

    if (!previewRows.length) {
      return;
    }

    autoDownloadStartedRef.current = true;

    const downloadUrl = new URL(exportBaseUrl);
    downloadUrl.searchParams.set('mode', 'download');

    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.title = 'PDF download helper';
    iframe.style.position = 'fixed';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.src = downloadUrl.toString();

    document.body.appendChild(iframe);

    const cleanupTimer = window.setTimeout(() => {
      iframe.remove();
    }, 15000);

    return () => {
      window.clearTimeout(cleanupTimer);
      iframe.remove();
    };
  }, [exportBaseUrl, previewRows.length]);

  function handleDownloadPdf() {
    setExportingPdf(true);
    const downloadUrl = new URL(exportBaseUrl);
    downloadUrl.searchParams.set('mode', 'download');
    const popup = window.open(downloadUrl.toString(), '_blank');
    if (!popup) {
      window.location.href = downloadUrl.toString();
    }
    window.setTimeout(() => {
      setExportingPdf(false);
    }, 600);
  }

  function renderPreviewSheet() {
    return (
      <div className="thank-you-page__preview-sheet-inner">
        <div className="thank-you-page__preview-export-header">
          <img src={pdfSeal} alt="" className="thank-you-page__preview-seal" />
          <div className="thank-you-page__preview-title-block">
            <h3>Family Eye Donation Pledge Form</h3>
            <span className="thank-you-page__preview-subtitle">
              "Eye Donation, let us make it our Family Tradition !! Let us light up lives !!!"
            </span>
            <div className="thank-you-page__preview-contact-line">
              <span>
                <strong>Address:</strong> JOTHI EYE CARE CENTRE, 152 &amp; 154, Calve Subraya Chetty Street, Puducherry-605 001.
              </span>
              <span>
                <strong>Phone:</strong> +91-413-2224534, +91-413-2337659
              </span>
              <span>
                <strong>Email:</strong> jothieyecare@gmail.com
              </span>
            </div>
          </div>
        </div>

        <div className="thank-you-page__preview-bank-row">
          <div className="thank-you-page__preview-bank-left">
            <span className="thank-you-page__preview-bank-name">JOTHI EYE BANK</span>
            <span className="thank-you-page__preview-bank-detail">
              Run by JOTHI EYE CARE FOUNDATION (Society) @ JOTHI EYE CARE CENTRE
            </span>
          </div>
          <div className="thank-you-page__preview-bank-right">
            <span className="thank-you-page__preview-bank-label">FOR EYE DONATION</span>
            <strong>Toll No. 1919</strong>
            <span>[Free (BSNL) Service]</span>
          </div>
        </div>

        <p className="thank-you-page__preview-page-lead">
          I AM A PROUD EYE DONOR AND AMBASSADOR
        </p>

        <div className="thank-you-page__preview-table-wrap">
          <table className="thank-you-page__preview-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Title</th>
                <th>NAME</th>
                <th>AGE</th>
                <th>GENDER</th>
                <th>PHONE</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.length > 0 ? (
                previewRows.map((row, index) => {
                  const title = row.title || (row.gender === 'Female' ? 'Ms.' : 'Mr.');

                  return (
                    <tr key={row.id || `${row.fullName}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{title}</td>
                      <td>{row.fullName || row.name || 'N/A'}</td>
                      <td>{row.age || 'N/A'}</td>
                      <td>{row.gender || 'N/A'}</td>
                      <td>{row.phone || 'N/A'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">No submitted data available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="thank-you-page__preview-bottom-block">
          <div>
            <span className="thank-you-page__preview-bottom-label">DATE:</span>
            <strong>{previewDate}</strong>
          </div>
          <div>
            <span className="thank-you-page__preview-bottom-label">PLACE:</span>
            <strong>{previewPlace}</strong>
          </div>
        </div>
      </div>
    );
  }

  function renderPreviewPanel() {
    return (
      <section className="thank-you-page__preview-panel" aria-label="Pledge preview">
        <div className="thank-you-page__preview-head">
          <div>
            <p className="thank-you-page__preview-kicker">Preview</p>
            <h2>Exact pledge page layout</h2>
          </div>
          <div className="thank-you-page__preview-meta">
            <span>{previewRows.length} people</span>
            <span>{previewPlace}</span>
          </div>
        </div>

        <div className="thank-you-page__preview-sheet">
          {renderPreviewSheet()}
        </div>
      </section>
    );
  }

  return (
    <div className="thank-you-page">
      {mobilePreviewOpen ? (
        <div className="thank-you-page__mobile-preview-screen" role="dialog" aria-label="Pledge preview screen">
          <div className="thank-you-page__mobile-preview-topbar">
            <button
              className="thank-you-page__mobile-preview-close"
              type="button"
              onClick={() => setMobilePreviewOpen(false)}
            >
              <ArrowLeft aria-hidden="true" />
              <span>Back</span>
            </button>
            <div className="thank-you-page__mobile-preview-title">
              <p>Preview</p>
              <strong>Pledge page</strong>
            </div>
          </div>

          <div className="thank-you-page__mobile-preview-body">
            <div className="thank-you-page__mobile-preview-page">
              {renderPreviewSheet()}
            </div>
          </div>
        </div>
      ) : null}

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
              onClick={() => onSharePdf?.()}
              title="Open share page"
            >
              <Share2 aria-hidden="true" />
              <span>Share PDF</span>
            </button>

            {isMobilePreview ? (
              <button
                className="thank-you-page__button thank-you-page__button--ghost thank-you-page__button--preview"
                type="button"
                onClick={() => setMobilePreviewOpen(true)}
                title="Open preview"
              >
                <Eye aria-hidden="true" />
                <span>Preview PDF</span>
              </button>
            ) : null}

          </div>

          {!isMobilePreview ? renderPreviewPanel() : null}

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

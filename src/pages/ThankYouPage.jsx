import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import eyeHero from '../asset/eyehero.png';
import pdfBadge from '../asset/pdf.jpeg';
import './ThankYouPage.css';

function ThankYouPage({ onRestart, onRoleSelect, submittedRows = [] }) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const exportRows = Array.isArray(submittedRows) ? submittedRows : [];

  async function handleExportPdf() {
    if (exportRows.length === 0) {
      return;
    }

    setExportingPdf(true);

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Eye Donation Pledge - Submission Summary</title>
            <style>
              @page {
                size: A4;
                margin: 24mm 18mm;
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                color: #1a1a1a;
                background: #ffffff;
              }
              .cover {
                text-align: center;
                margin-bottom: 22px;
              }
              .cover img {
                width: 140px;
                height: 140px;
                object-fit: contain;
                display: block;
                margin: 0 auto 14px;
              }
              .cover h1 {
                margin: 0;
                font-size: 24px;
                color: #173f90;
              }
              .cover p {
                margin: 6px 0 0;
                color: #64748b;
                font-size: 13px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
              }
              th, td {
                border: 1px solid #d7deea;
                padding: 9px 10px;
                text-align: left;
                vertical-align: top;
              }
              th {
                background: #f0f6ff;
                color: #173f90;
              }
              tbody tr:nth-child(even) {
                background: #f8fbff;
              }
              .footer {
                margin-top: 18px;
                font-size: 11px;
                color: #64748b;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="cover">
              <img src="${pdfBadge}" alt="Jothi Eye Donor badge" />
              <h1>Eye Donation Pledge - Submission Summary</h1>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                ${exportRows
                  .map(
                    (row, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${row.fullName || row.name || 'N/A'}</td>
                    <td>${row.age ?? 'N/A'}</td>
                    <td>${row.gender || 'N/A'}</td>
                    <td>${row.phone || 'N/A'}</td>
                    <td>${row.address || 'N/A'}</td>
                    <td>${row.createdAt ? new Date(row.createdAt).toLocaleString() : 'N/A'}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="footer">
              <p>This PDF was generated from the thank you page after submission.</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Please allow popups for this site to export PDF.');
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExportingPdf(false);
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
              onClick={handleExportPdf}
              disabled={exportingPdf || exportRows.length === 0}
              title={exportRows.length === 0 ? 'No submission data to export yet' : 'Download PDF'}
            >
              <Download aria-hidden="true" />
              <span>{exportingPdf ? 'Generating...' : 'Export PDF'}</span>
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

        <aside className="thank-you-page__visual" aria-label="Celebration illustration">
          <div className="thank-you-page__halo" aria-hidden="true">
            <img className="thank-you-page__hero-image" src={eyeHero} alt="" aria-hidden="true" />
            <div className="thank-you-page__eye-rings" />
            <div className="thank-you-page__floating thank-you-page__floating--heart">
              <HeartHandshake aria-hidden="true" />
            </div>
            <div className="thank-you-page__floating thank-you-page__floating--shield">
              <ShieldCheck aria-hidden="true" />
            </div>
            <div className="thank-you-page__floating thank-you-page__floating--eye">
              <Eye aria-hidden="true" />
            </div>
          </div>

          <div className="thank-you-page__stats">
            <article className="thank-you-page__stat">
              <strong>Submitted</strong>
              <span>Your pledge is now recorded</span>
            </article>
            <article className="thank-you-page__stat">
              <strong>One step</strong>
              <span>Closer to helping someone see again</span>
            </article>
            <article className="thank-you-page__stat">
              <strong>Thank you</strong>
              <span>For choosing a compassionate path</span>
            </article>
          </div>
        </aside>

        <section className="thank-you-page__footer-card">
          <div>
            <p className="thank-you-page__footer-kicker">What happens next</p>
            <p className="thank-you-page__footer-text">
              If you need to make another entry or return to the beginning, you can use the buttons
              above.
            </p>
          </div>
          <div className="thank-you-page__footer-pulse" aria-hidden="true">
            <CheckCircle2 />
          </div>
        </section>
      </main>
    </div>
  );
}

export default ThankYouPage;

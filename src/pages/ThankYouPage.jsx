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
import { apiRequest } from '../lib/apiClient';
import './ThankYouPage.css';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeRows(response, fallbackRows) {
  const rows = Array.isArray(response?.data?.data)
    ? response.data.data
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(fallbackRows)
    ? fallbackRows
    : [];

  return rows.slice(0, 3);
}

function buildExportHtml(rows) {
  const displayedRows = Array.from({ length: 3 }, (_, index) => rows[index] || {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JOTHI EYE CARE CENTRE - Family Eye Donation Pledge Form</title>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@100..900&family=Public+Sans:wght@100..900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #f7f9fb;
      font-family: 'Public Sans', sans-serif;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #191c1e;
      overscroll-behavior: none;
    }

    main > :first-child { margin-top: 0 !important; }
    main > :last-child { margin-bottom: 0 !important; }
    ::-webkit-scrollbar { display: none; }

    .font-label-caps {
      font-family: 'Public Sans', sans-serif;
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .text-on-surface-variant { color: #45464d; }

    header {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      border-bottom: 1px solid #c6c6cd;
      height: 80px;
      display: flex;
      align-items: center;
    }

    .header-inner {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }

    main {
      padding-top: 80px;
      min-height: 100vh;
      background: #ffffff;
    }

    .form-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #ffffff;
    }

    .pledge-card {
      width: 100%;
      max-width: 896px;
      aspect-ratio: 1 / 1.414;
      background: #ffffff;
      border: 1px solid #c6c6cd;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-bg-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        radial-gradient(circle at top right, rgba(0, 99, 152, 0.03) 0%, transparent 40%),
        radial-gradient(circle at bottom left, rgba(0, 99, 152, 0.03) 0%, transparent 40%);
      z-index: 0;
    }

    .card-content {
      padding: 2.5rem 3rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      z-index: 1;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .logo-title-group {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex: 1;
      min-width: 0;
    }

    .logo-title-group img {
      height: 120px;
      width: auto;
      object-fit: contain;
      flex-shrink: 0;
    }

    .title-block {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      min-width: 0;
    }

    .title-block h1 {
      font-family: 'Manrope', sans-serif;
      font-size: 22px;
      line-height: 30px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: #000;
      white-space: nowrap;
    }

    .title-block .subtitle {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 13px;
      line-height: 18px;
      color: #006398;
      font-style: italic;
      white-space: nowrap;
    }

    .date-block {
      width: 12rem;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .date-block label {
      margin-bottom: 0.25rem;
    }

    .date-block .underline {
      height: 2rem;
      border-bottom: 1px solid #c6c6cd;
      width: 100%;
    }

    .bank-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #c6c6cd;
      border-bottom: 1px solid #c6c6cd;
      padding: 1rem 0;
      margin-bottom: 2rem;
      background: rgba(242, 244, 246, 0.3);
    }

    .bank-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .bank-name {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .bank-name .name {
      font-family: 'Manrope', sans-serif;
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      color: #000;
      white-space: nowrap;
    }

    .bank-name .detail {
      font-size: 14px;
      line-height: 20px;
      color: #45464d;
      white-space: nowrap;
    }

    .bank-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-left: 1px solid #c6c6cd;
      padding-left: 1.5rem;
      min-width: 160px;
    }

    .bank-right .label {
      font-family: 'Public Sans', sans-serif;
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #006398;
      margin-bottom: 0.25rem;
      text-align: center;
    }

    .bank-right .call {
      font-family: 'Manrope', sans-serif;
      font-size: 18px;
      line-height: 24px;
      font-weight: 600;
      color: #000;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .bank-right .hint {
      font-size: 12px;
      line-height: 16px;
      color: #45464d;
      text-align: center;
    }

    .address-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .address-row {
      display: flex;
      gap: 1rem;
    }

    .address-row .field {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .address-row .field label {
      margin-bottom: 0.25rem;
    }

    .address-row .field .double-underline,
    .address-grid .field .underline {
      height: 2rem;
      border-bottom: 1px solid #c6c6cd;
      width: 100%;
    }

    .address-row .field .double-underline:not(:last-child) {
      margin-bottom: 0.25rem;
    }

    .address-grid {
      display: flex;
      gap: 2rem;
    }

    .address-grid .field {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .address-grid .field label {
      margin-bottom: 0.25rem;
    }

    .desc-text {
      margin-bottom: 1rem;
      color: #45464d;
    }

    .table-wrap {
      flex: 1;
      border: 1px solid #c6c6cd;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .pledge-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Public Sans', sans-serif;
      font-size: 14px;
      line-height: 20px;
      color: #191c1e;
    }

    .pledge-table thead {
      background: #f2f4f6;
      border-bottom: 1px solid #c6c6cd;
    }

    .pledge-table th {
      padding: 0.75rem;
      font-family: 'Public Sans', sans-serif;
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #191c1e;
      border-right: 1px solid #c6c6cd;
      text-align: left;
    }

    .pledge-table th:last-child {
      border-right: none;
    }

    .pledge-table th.col-sn { width: 3rem; text-align: center; }
    .pledge-table th.col-title { width: 6rem; }
    .pledge-table th.col-name { }
    .pledge-table th.col-age { width: 5rem; text-align: center; }
    .pledge-table th.col-sex { width: 5rem; text-align: center; }
    .pledge-table th.col-sig { width: 12rem; text-align: center; }

    .pledge-table td {
      padding: 0.5rem;
      border-right: 1px solid #c6c6cd;
      vertical-align: middle;
    }

    .pledge-table td:last-child {
      border-right: none;
    }

    .pledge-table tbody tr {
      border-bottom: 1px solid #c6c6cd;
      height: 56px;
    }

    .pledge-table .text-center { text-align: center; }
    .pledge-table .text-muted { color: #45464d; }

    .place-row {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .place-row .field {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .place-row .field label {
      margin-bottom: 0.25rem;
    }

    .place-row .field .underline {
      height: 2rem;
      border-bottom: 1px solid #c6c6cd;
      width: 100%;
    }

    .witness-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 0.9rem;
    }

    .witness-row .label {
      width: 7rem;
      font-weight: 700;
    }

    .witness-row .colon {
      width: 0.6rem;
      text-align: center;
    }

    .witness-row .dash-underline {
      flex: 1;
      border-bottom: 1px solid #c6c6cd;
      height: 1rem;
    }

    .witness-row .empty-placeholder {
      width: 2rem;
      display: inline-block;
    }

    @media print {
      header, .no-print {
        display: none !important;
      }
      main {
        padding-top: 0;
      }
      body {
        background: #ffffff;
      }
      .pledge-card {
        box-shadow: none;
        border: none;
      }
    }

    @media (max-width: 768px) {
      .card-content {
        padding: 1.5rem;
      }
      .top-row {
        flex-direction: column;
        align-items: flex-start;
      }
      .logo-title-group {
        flex-direction: column;
        align-items: flex-start;
      }
      .bank-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .bank-right {
        border-left: none;
        padding-left: 0;
        align-items: flex-start;
      }
      .address-row {
        flex-direction: column;
      }
      .address-grid {
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .pledge-table th, .pledge-table td {
        padding: 0.4rem;
        font-size: 12px;
      }
    }
  </style>
</head>
<body>
  <main>
    <div class="form-wrapper">
      <div class="pledge-card">
        <div class="card-bg-overlay"></div>
        <div class="card-content">
          <div class="top-row">
            <div class="logo-title-group">
              <img src="${pdfBadge}" alt="Jothi Eye Care Centre badge">
              <div class="title-block">
                <h1>Family Eye Donation Pledge Form</h1>
                <span class="subtitle">"Eye Donation, let us make it our Family Tradition !! Let us light up lives !!!"</span>
              </div>
            </div>
            <div class="date-block">
              <label class="font-label-caps text-on-surface-variant">Date:</label>
              <div class="underline"></div>
            </div>
          </div>

          <div class="bank-row">
            <div class="bank-left">
              <div class="bank-name">
                <span class="name">JOTHI EYE CARE CENTRE</span>
                <span class="detail">152 & 154, Calve Subraya Chetty Street, Puducherry - 605 001.</span>
              </div>
            </div>
            <div class="bank-right">
              <span class="label">FOR EYE DONATION</span>
              <span class="call">Toll No. 1919</span>
              <span class="hint">+91-413-2224534, +91-413-2337659</span>
              <span class="hint">jothieyecare@gmail.com</span>
            </div>
          </div>

          <div class="address-section">
            <div class="address-row">
              <div class="field">
                <label class="font-label-caps text-on-surface-variant">Address:</label>
                <div class="double-underline"></div>
                <div class="double-underline"></div>
              </div>
            </div>
            <div class="address-grid">
              <div class="field">
                <label class="font-label-caps text-on-surface-variant">Pin</label>
                <div class="underline"></div>
              </div>
              <div class="field">
                <label class="font-label-caps text-on-surface-variant">Dist</label>
                <div class="underline"></div>
              </div>
              <div class="field">
                <label class="font-label-caps text-on-surface-variant">State</label>
                <div class="underline"></div>
              </div>
              <div class="field">
                <label class="font-label-caps text-on-surface-variant"><span class="material-symbols-outlined" style="font-size:16px; vertical-align:middle; margin-right:4px;">phone</span> Telephone</label>
                <div class="underline"></div>
              </div>
            </div>
          </div>

          <div class="desc-text font-body-md">
            Name, Age and Signature of adult family members who wish to pledge their eyes for donation as a family commitment are given below:
          </div>

          <div class="table-wrap">
            <table class="pledge-table">
              <thead>
                <tr>
                  <th class="col-sn">S.No</th>
                  <th class="col-title">Title</th>
                  <th class="col-name">NAME (BLOCK LETTERS)</th>
                  <th class="col-age">AGE</th>
                  <th class="col-sex">GENDER</th>
                  <th class="col-sig">SIGNATURE</th>
                </tr>
              </thead>
              <tbody>
                ${displayedRows
                  .map((row, index) => {
                    const title = row.title || (row.gender === 'Male' ? 'Mr.' : row.gender === 'Female' ? 'Ms.' : 'Mr./Ms.');
                    return `
                      <tr>
                        <td class="text-center">${index + 1}</td>
                        <td class="text-muted">${escapeHtml(title)}</td>
                        <td>${escapeHtml(row.fullName || row.name || 'N/A')}</td>
                        <td class="text-center">${escapeHtml(row.age ?? 'N/A')}</td>
                        <td class="text-center">${escapeHtml(row.gender || 'N/A')}</td>
                        <td></td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>

          <div class="place-row">
            <div class="field">
              <label class="font-label-caps text-on-surface-variant">Place:</label>
              <div class="underline"></div>
            </div>
          </div>

          <div class="witness-row">
            <span class="label">Witness 1</span>
            <span class="colon">:</span>
            <span class="dash-underline"></span>
          </div>
          <div class="witness-row">
            <span class="label">Witness 2</span>
            <span class="colon">:</span>
            <span class="dash-underline"></span>
          </div>
          <div class="witness-row">
            <span class="label">Witness 3</span>
            <span class="colon">:</span>
            <span class="dash-underline"></span>
          </div>
          <div class="witness-row">
            <span class="label">Date</span>
            <span class="colon">:</span>
            <span class="dash-underline"></span>
          </div>
          <div class="witness-row">
            <span class="label">Donor / Parent / Guardian Signature</span>
            <span class="colon">:</span>
            <span class="dash-underline"></span>
          </div>
          <div class="witness-row">
            <span class="label">Name</span>
            <span class="colon">:</span>
            <span class="dash-underline"></span>
          </div>
          <div class="witness-row">
            <span class="label">Relationship</span>
            <span class="colon">:</span>
            <span class="dash-underline"></span>
          </div>
          <div class="witness-row">
            <span class="label">Address</span>
            <span class="colon">:</span>
            <span class="dash-underline"></span>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`;
}

function ThankYouPage({ onRestart, onRoleSelect, submittedRows = [] }) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const exportRows = Array.isArray(submittedRows) ? submittedRows : [];

  async function handleExportPdf() {
    setExportingPdf(true);

    try {
      const response = await apiRequest('/api/terms/getall');
      const rows = normalizeRows(response, exportRows);

      if (rows.length === 0) {
        return;
      }

      const htmlContent = buildExportHtml(rows);

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
      }, 600);
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

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
import { apiRequest } from '../lib/apiClient';
import './ThankYouPage.css';

// ----- HELPER FUNCTIONS -----
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

// ----- PDF GENERATION USING HEADER.TXT TEMPLATE -----
function buildExportHtml(rows) {
  const displayedRows = Array.from({ length: 3 }, (_, index) => rows[index] || {});
  return buildPrintablePdfHtml(displayedRows);
}

function buildPrintablePdfHtml(rows) {
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

    .font-body-md {
      font-family: 'Public Sans', sans-serif;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
    }

    .text-on-surface-variant { color: #45464d; }
    .text-primary { color: #000000; }
    .text-secondary { color: #006398; }

    /* ----- header (empty) ----- */
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

    /* ----- pledge card (fixed aspect ratio) ----- */
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

    /* ----- top row: logo + title (inline) + date ----- */
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

    /* ----- bank info + call ----- */
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
    .bank-right .call .material-symbols-outlined {
      font-size: 18px;
      vertical-align: middle;
    }
    .bank-right .hint {
      font-size: 12px;
      line-height: 16px;
      color: #45464d;
      text-align: center;
    }

    /* ----- address fields ----- */
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
    .address-row .field .underline {
      height: 2rem;
      border-bottom: 1px solid #c6c6cd;
      width: 100%;
    }
    .address-row .field .double-underline {
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
    .address-grid .field .underline {
      height: 2rem;
      border-bottom: 1px solid #c6c6cd;
      width: 100%;
    }

    /* ----- description ----- */
    .desc-text {
      margin-bottom: 1rem;
      color: #45464d;
    }

    /* ----- table ----- */
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
      transition: background 0.15s;
    }
    .pledge-table tbody tr:hover {
      background: #ffffff;
    }
    .pledge-table tbody tr:last-child {
      border-bottom: none;
    }
    .pledge-table .text-center { text-align: center; }
    .pledge-table .text-muted { color: #45464d; }

    /* ----- bottom: place + witnesses ----- */
    .place-row {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .place-row .field {
      width: 16rem;
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

    .witness-label {
      font-style: italic;
      text-align: center;
      color: #45464d;
      margin-bottom: 1rem;
    }

    .witness-grid {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 3rem;
    }
    .witness-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(242, 244, 246, 0.3);
      border: 1px solid rgba(198, 198, 205, 0.5);
      border-radius: 2px;
    }
    .witness-box .witness-title {
      font-family: 'Public Sans', sans-serif;
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #000;
      margin-bottom: 0.5rem;
    }
    .witness-row {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
    }
    .witness-row .label {
      width: 8rem;
      flex-shrink: 0;
      color: #45464d;
      font-size: 14px;
      line-height: 20px;
    }
    .witness-row .colon {
      color: #45464d;
      margin-right: 0.5rem;
    }
    .witness-row .dash-underline {
      flex: 1;
      border-bottom: 1px dashed #c6c6cd;
      height: 1.5rem;
    }
    .witness-row .empty-placeholder {
      width: 8rem;
      flex-shrink: 0;
    }
    .witness-row .opacity-0 { opacity: 0; }

    /* ----- material symbols tweak ----- */
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }

    /* ----- responsive adjustments ----- */
    @media (max-width: 820px) {
      .title-block h1 { font-size: 18px; line-height: 24px; white-space: normal; }
      .title-block .subtitle { font-size: 12px; line-height: 16px; white-space: normal; }
      .logo-title-group img { height: 90px; }
      .card-content { padding: 1.5rem 1.25rem; }
      .bank-row { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
      .bank-right { border-left: none; padding-left: 0; align-items: center; width: 100%; }
      .bank-name { flex-wrap: wrap; }
      .bank-name .detail { white-space: normal; }
      .witness-grid { flex-direction: column; gap: 1.5rem; }
      .address-grid { flex-wrap: wrap; gap: 0.75rem; }
      .address-row { flex-direction: column; gap: 0.5rem; }
      .top-row { flex-direction: column; align-items: stretch; }
      .date-block { width: 100%; margin-left: 0; margin-top: 0.5rem; }
      .pledge-table th, .pledge-table td { padding: 0.4rem; font-size: 12px; }
      .pledge-table th.col-sn { width: 2.5rem; }
      .pledge-table th.col-title { width: 4rem; }
      .pledge-table th.col-age { width: 3.5rem; }
      .pledge-table th.col-sex { width: 3.5rem; }
      .pledge-table th.col-sig { width: 6rem; }
      .bank-right .call { font-size: 16px; }
      .bank-right .call .material-symbols-outlined { font-size: 16px; }
    }
    @media (max-width: 480px) {
      .card-content { padding: 1rem 0.75rem; }
      .logo-title-group { flex-wrap: wrap; gap: 0.5rem; }
      .logo-title-group img { height: 70px; }
      .title-block h1 { font-size: 15px; line-height: 20px; }
      .title-block .subtitle { font-size: 11px; line-height: 15px; }
      .pledge-table th, .pledge-table td { padding: 0.2rem; font-size: 10px; }
      .pledge-table th.col-sn { width: 2rem; }
      .pledge-table th.col-title { width: 3rem; }
      .pledge-table th.col-age { width: 2.5rem; }
      .pledge-table th.col-sex { width: 2.5rem; }
      .pledge-table th.col-sig { width: 4rem; }
      .witness-row .label { width: 5rem; font-size: 12px; }
      .bank-name .name { font-size: 16px; line-height: 22px; }
      .bank-name .detail { font-size: 12px; line-height: 16px; }
      .bank-right .call { font-size: 14px; }
      .bank-right .call .material-symbols-outlined { font-size: 14px; }
      .bank-right .hint { font-size: 10px; line-height: 14px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-inner"></div>
  </header>

  <main>
    <div class="form-wrapper">
      <div class="pledge-card">
        <div class="card-bg-overlay"></div>
        <div class="card-content">

          <!-- top row: logo + title (inline) + date -->
          <div class="top-row">
            <div class="logo-title-group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB_2L6WokL_lPCzrLNvNinfCFFfTLnhyA0qSx-tdSymMWCvDqjsu9ichinl2xd8ec8QCGDJvvqMZ_kKZZ1xAm7ksKDzY9lSLHKNMGUbsyaGw2qErp4pPPCpQ0GrgFO1vD0glf9oBctMPHtlfyODnFBssuSL9LcaTf006pwle60K52xRPHhG36xxGpIpVnOSNlx3hunTkoS-SZP97tlV_B2V5nH4X2DCU_3zh2vmuXkgkAeMq_R5RCwg-wJ7NiDNk-9EQ" alt="Jothi Eye Bank Seal">
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

          <!-- bank info + call -->
          <div class="bank-row">
            <div class="bank-left">
              <div class="bank-name">
                <span class="name">JOTHI EYE BANK</span>
                <span class="detail">Run by JOTHI EYE CARE FOUNDATION (Society) @ JOTHI EYE CARE CENTRE</span>
              </div>
            </div>
            <div class="bank-right">
              <span class="label">FOR EYE DONATION</span>
              <span class="call">Toll No. 1919</span>
              <span class="hint">[Free (BSNL) Service]</span>
            </div>
          </div>

          <!-- address -->
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

          <!-- description -->
          <div class="desc-text font-body-md">
            Name, Age and Signature of adult family members who wish to pledge their eyes for donation as a family commitment are give below:
          </div>

          <!-- table -->
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

          <!-- bottom: place + witnesses -->
          <div>
            <div class="place-row">
              <div class="field">
                <label class="font-label-caps text-on-surface-variant">Place:</label>
                <div class="underline"></div>
              </div>
            </div>

            <p class="witness-label font-body-md">To be filled in by two witnesses (Relatives, neighbours or friends)</p>

            <div class="witness-grid">
              <!-- witness 1 -->
              <div class="witness-box">
                <span class="witness-title">1. Witness (Next of kin):</span>
                <div class="witness-row">
                  <span class="label">Signature</span>
                  <span class="colon">:</span>
                  <div class="dash-underline"></div>
                </div>
                <div class="witness-row">
                  <span class="label">Name and Relationship</span>
                  <span class="colon">:</span>
                  <div class="dash-underline"></div>
                </div>
                <div class="witness-row">
                  <span class="label">Address</span>
                  <span class="colon">:</span>
                  <div class="dash-underline"></div>
                </div>
                <div class="witness-row">
                  <span class="empty-placeholder"></span>
                  <span class="colon opacity-0">:</span>
                  <div class="dash-underline"></div>
                </div>
              </div>

              <!-- witness 2 -->
              <div class="witness-box">
                <span class="witness-title">2. Witness (Next of kin):</span>
                <div class="witness-row">
                  <span class="label">Signature</span>
                  <span class="colon">:</span>
                  <div class="dash-underline"></div>
                </div>
                <div class="witness-row">
                  <span class="label">Name and Relationship</span>
                  <span class="colon">:</span>
                  <div class="dash-underline"></div>
                </div>
                <div class="witness-row">
                  <span class="label">Address</span>
                  <span class="colon">:</span>
                  <div class="dash-underline"></div>
                </div>
                <div class="witness-row">
                  <span class="empty-placeholder"></span>
                  <span class="colon opacity-0">:</span>
                  <div class="dash-underline"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</body>
</html>`;
}

// ----- MAIN COMPONENT -----
function ThankYouPage({ onRestart, onRoleSelect, submittedRows = [] }) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const exportRows = Array.isArray(submittedRows) ? submittedRows : [];

  async function handleExportPdf() {
    if (exportRows.length === 0) {
      alert('No submission data to export yet.');
      return;
    }

    setExportingPdf(true);

    try {
      // Fetch data from API
      const response = await apiRequest('/api/terms/getall');
      const rows = normalizeRows(response, exportRows);

      if (rows.length === 0) {
        alert('No data available to export.');
        return;
      }

      // Build the HTML content using the header.txt template
      const htmlContent = buildExportHtml(rows);

      // Open print window
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
      alert('Failed to export PDF: ' + err.message);
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
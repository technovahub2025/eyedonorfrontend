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
  return buildPrintablePdfHtml(displayedRows);

  /* eslint-disable-next-line no-unreachable */
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
  <main>
    <div class="form-wrapper">
      <div class="pledge-card">
        <div class="card-bg-overlay"></div>
        <div class="card-content">
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
              <span class="hint">[Free (BSNL) Service]</span>
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
            Name, Age and Signature of adult family members who wish to pledge their eyes for donation as a family commitment are give below:
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

          <div>
            <div class="place-row">
              <div class="field">
                <label class="font-label-caps text-on-surface-variant">Place:</label>
                <div class="underline"></div>
              </div>
            </div>

            <p class="witness-label font-body-md">To be filled in by two witnesses (Relatives, neighbours or friends)</p>

            <div class="witness-grid">
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

function buildPrintablePdfHtml(rows) {
  const displayedRows = Array.from({ length: 3 }, (_, index) => rows[index] || {});
  /* eslint-disable no-unreachable */
  return buildPrintablePdfBlob(displayedRows);

  /* eslint-disable-next-line no-unreachable */
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JOTHI EYE CARE CENTRE - Family Eye Donation Pledge Form</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Public+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    @page { size: A4 portrait; margin: 14mm; }
    html, body {
      margin: 0;
      padding: 0;
      background:
        radial-gradient(circle at top left, rgba(0, 102, 138, 0.08), transparent 24%),
        radial-gradient(circle at top right, rgba(31, 76, 201, 0.08), transparent 22%),
        #eef5fb;
      font-family: 'Public Sans', sans-serif;
      color: #191c1e;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body { min-height: 100vh; }
    .sheet {
      position: relative;
      background: #fff;
      border: 1px solid #c6c6cd;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(11, 29, 57, 0.12);
    }
    .sheet::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at top right, rgba(31, 76, 201, 0.08), transparent 24%),
        radial-gradient(circle at bottom left, rgba(0, 102, 138, 0.08), transparent 22%);
      pointer-events: none;
    }
    .content { position: relative; z-index: 1; padding: 22px 24px 20px; }
    .brand-row, .info-row, .footer-row { display: flex; gap: 14px; }
    .brand-row { justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .brand { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
    .brand img {
      width: 86px;
      height: 86px;
      object-fit: cover;
      border-radius: 18px;
      border: 1px solid rgba(31, 76, 201, 0.12);
      background: #fff;
      flex: none;
    }
    .eyebrow, .section-label, .column-head, .footer-chip {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .eyebrow { color: #00668a; margin-bottom: 6px; }
    h1 {
      margin: 0 0 6px;
      font-family: 'Manrope', sans-serif;
      font-size: 1.65rem;
      line-height: 1.08;
      letter-spacing: -0.04em;
      color: #102033;
    }
    .subtitle { color: #4e657b; font-size: 0.94rem; line-height: 1.45; max-width: 52ch; }
    .date-box {
      min-width: 160px;
      padding: 14px 16px;
      border-radius: 16px;
      border: 1px solid rgba(31, 76, 201, 0.12);
      background: linear-gradient(180deg, rgba(244, 248, 255, 0.98), rgba(255, 255, 255, 0.98));
    }
    .date-line, .field-line, .sig-line, .witness-line { border-bottom: 1px solid #c6c6cd; }
    .date-line { min-height: 20px; margin-top: 12px; }
    .info-row { align-items: stretch; margin: 14px 0 16px; }
    .info-card {
      flex: 1;
      padding: 14px 16px;
      border-radius: 16px;
      border: 1px solid rgba(31, 76, 201, 0.12);
      background: rgba(244, 248, 255, 0.88);
    }
    .info-card strong {
      display: block;
      font-family: 'Manrope', sans-serif;
      font-size: 1.04rem;
      line-height: 1.4;
      color: #102033;
      margin-bottom: 6px;
    }
    .info-card span { color: #50657c; font-size: 0.92rem; line-height: 1.45; }
    .callout {
      width: 210px;
      flex: none;
      padding: 14px 16px;
      border-radius: 16px;
      background: linear-gradient(135deg, #0b6c8d 0%, #1f4cc9 100%);
      color: #fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
    }
    .callout .label { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.92; }
    .callout .phone { font-family: 'Manrope', sans-serif; font-size: 1.25rem; font-weight: 800; }
    .callout .hint { font-size: 0.78rem; opacity: 0.9; }
    .address-row { margin: 0 0 14px; }
    .address-block {
      flex: 1;
      padding: 14px 16px 18px;
      border-radius: 16px;
      border: 1px solid #c6c6cd;
      background: #fff;
    }
    .address-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1.1fr;
      gap: 12px;
      margin-top: 14px;
    }
    .address-mini {
      padding: 12px 14px 14px;
      border-radius: 14px;
      border: 1px solid #d9dee8;
      background: #f9fbff;
    }
    .desc-text { margin: 16px 0 14px; color: #4b5d71; font-size: 0.95rem; line-height: 1.55; }
    .table-wrap { border: 1px solid #c6c6cd; border-radius: 14px; overflow: hidden; background: #fff; }
    .pledge-table { width: 100%; border-collapse: collapse; font-size: 0.95rem; color: #191c1e; }
    .pledge-table thead { background: linear-gradient(180deg, #f4f7fb 0%, #edf3f9 100%); }
    .pledge-table th, .pledge-table td {
      border-right: 1px solid #c6c6cd;
      border-bottom: 1px solid #c6c6cd;
      padding: 11px 10px;
      vertical-align: middle;
    }
    .pledge-table th:last-child, .pledge-table td:last-child { border-right: none; }
    .pledge-table tbody tr:last-child td { border-bottom: none; }
    .pledge-table th {
      font-size: 0.72rem;
      line-height: 1.2;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 800;
      color: #203042;
      text-align: left;
    }
    .center { text-align: center; }
    .muted { color: #4f5e70; }
    .sn { width: 58px; text-align: center; }
    .title { width: 92px; }
    .age, .gender { width: 72px; text-align: center; }
    .signature { width: 160px; text-align: center; }
    .sig-line { min-height: 20px; width: 100%; opacity: 0.8; }
    .footer { margin-top: 18px; }
    .place-row { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .place-field {
      width: 220px;
      padding: 12px 14px 14px;
      border-radius: 14px;
      border: 1px solid #c6c6cd;
      background: rgba(249, 251, 255, 0.96);
    }
    .witness-note { margin-bottom: 12px; font-style: italic; text-align: center; color: #526476; font-size: 0.9rem; }
    .witness-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .witness-box {
      padding: 14px 16px;
      border-radius: 16px;
      border: 1px solid rgba(198, 198, 205, 0.95);
      background: rgba(242, 246, 251, 0.82);
    }
    .witness-title { font-weight: 800; color: #102033; margin-bottom: 12px; }
    .witness-row {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-top: 10px;
      color: #4f5e70;
      font-size: 0.92rem;
    }
    .witness-row .label { width: 150px; flex: none; }
    .witness-row .colon { flex: none; }
    .witness-row .witness-line { flex: 1; min-height: 20px; border-bottom: 1px dashed #c6c6cd; }
    .footer-row {
      margin-top: 14px;
      align-items: center;
      justify-content: space-between;
      color: #66768a;
      font-size: 0.76rem;
    }
    .footer-chip {
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid rgba(31, 76, 201, 0.12);
      background: rgba(255, 255, 255, 0.92);
      color: #17316f;
    }
    @media print { body { background: #fff; } .sheet { box-shadow: none; } }
    @media (max-width: 820px) {
      .content { padding: 18px; }
      .brand-row { flex-direction: column; align-items: flex-start; }
      .info-row, .witness-grid { display: grid; grid-template-columns: 1fr; }
      .address-grid { grid-template-columns: 1fr; }
      .callout { width: 100%; }
    }
  </style>
</head>
<body>
  <main class="sheet">
    <div class="card">
      <div class="content">
        <div class="brand-row">
          <div class="brand">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB_2L6WokL_lPCzrLNvNinfCFFfTLnhyA0qSx-tdSymMWCvDqjsu9ichinl2xd8ec8QCGDJvvqMZ_kKZZ1xAm7ksKDzY9lSLHKNMGUbsyaGw2qErp4pPPCpQ0GrgFO1vD0glf9oBctMPHtlfyODnFBssuSL9LcaTf006pwle60K52xRPHhG36xxGpIpVnOSNlx3hunTkoS-SZP97tlV_B2V5nH4X2DCU_3zh2vmuXkgkAeMq_R5RCwg-wJ7NiDNk-9EQ" alt="Jothi Eye Bank Seal">
            <div>
              <div class="eyebrow">Family Eye Donation Pledge Form</div>
              <h1>JOTHI EYE CARE CENTRE</h1>
              <div class="subtitle">"Eye Donation, let us make it our Family Tradition !! Let us light up lives !!!"</div>
            </div>
          </div>
          <div class="date-box">
            <div class="section-label">Date</div>
            <div class="date-line"></div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-card">
            <strong>JOTHI EYE CARE CENTRE</strong>
            <span>152 &amp; 154, Calve Subraya Chetty Street, Puducherry - 605 001.</span>
          </div>
          <div class="callout">
            <div class="label">For Eye Donation</div>
            <div class="phone">Toll No. 1919</div>
            <div class="hint">Free (BSNL) Service</div>
          </div>
        </div>

        <div class="address-row">
          <div class="address-block">
            <div class="section-label">Address</div>
            <div class="field-line"></div>
            <div class="field-line"></div>
            <div class="address-grid">
              <div class="address-mini"><div class="column-head">Pin</div><div class="field-line"></div></div>
              <div class="address-mini"><div class="column-head">Dist</div><div class="field-line"></div></div>
              <div class="address-mini"><div class="column-head">State</div><div class="field-line"></div></div>
              <div class="address-mini"><div class="column-head">Telephone</div><div class="field-line"></div></div>
            </div>
          </div>
        </div>

        <div class="desc-text">
          Name, Age and Signature of adult family members who wish to pledge their eyes for donation as a family commitment are given below:
        </div>

        <div class="table-wrap">
          <table class="pledge-table">
            <thead>
              <tr>
                <th class="sn">S.No</th>
                <th class="title">Title</th>
                <th>Name (Block Letters)</th>
                <th class="age">Age</th>
                <th class="gender">Gender</th>
                <th class="signature">Signature</th>
              </tr>
            </thead>
            <tbody>
              ${displayedRows
                .map((row, index) => {
                  const title = row.title || (row.gender === 'Male' ? 'Mr.' : row.gender === 'Female' ? 'Ms.' : 'Mr./Ms.');
                  return `
                    <tr>
                      <td class="center">${index + 1}</td>
                      <td class="muted">${escapeHtml(title)}</td>
                      <td>${escapeHtml(row.fullName || row.name || 'N/A')}</td>
                      <td class="center">${escapeHtml(row.age ?? 'N/A')}</td>
                      <td class="center">${escapeHtml(row.gender || 'N/A')}</td>
                      <td><div class="sig-line"></div></td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <div class="place-row">
            <div class="place-field">
              <div class="section-label">Place</div>
              <div class="field-line"></div>
            </div>
          </div>

          <div class="witness-note">To be filled in by two witnesses (Relatives, neighbours or friends)</div>

          <div class="witness-grid">
            <div class="witness-box">
              <div class="witness-title">1. Witness (Next of kin)</div>
              <div class="witness-row"><span class="label">Signature</span><span class="colon">:</span><div class="witness-line"></div></div>
              <div class="witness-row"><span class="label">Name and Relationship</span><span class="colon">:</span><div class="witness-line"></div></div>
              <div class="witness-row"><span class="label">Address</span><span class="colon">:</span><div class="witness-line"></div></div>
              <div class="witness-row"><span class="label">&nbsp;</span><span class="colon" style="opacity:0">:</span><div class="witness-line"></div></div>
            </div>

            <div class="witness-box">
              <div class="witness-title">2. Witness (Next of kin)</div>
              <div class="witness-row"><span class="label">Signature</span><span class="colon">:</span><div class="witness-line"></div></div>
              <div class="witness-row"><span class="label">Name and Relationship</span><span class="colon">:</span><div class="witness-line"></div></div>
              <div class="witness-row"><span class="label">Address</span><span class="colon">:</span><div class="witness-line"></div></div>
              <div class="witness-row"><span class="label">&nbsp;</span><span class="colon" style="opacity:0">:</span><div class="witness-line"></div></div>
            </div>
          </div>

          <div class="footer-row">
            <div>JOTHI EYE CARE CENTRE</div>
            <div class="footer-chip">Eye Donation Pledge</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`;
}
/* eslint-enable no-unreachable */

function buildPrintablePdfBlob(rows) {
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const LEFT = 28;
  const TOP = 26;
  const USABLE_WIDTH = PAGE_WIDTH - LEFT * 2;
  const displayedRows = Array.from({ length: 3 }, (_, index) => rows[index] || {});
  const content = buildPdfPageContent(displayedRows, {
    PAGE_WIDTH,
    PAGE_HEIGHT,
    LEFT,
    TOP,
    USABLE_WIDTH,
  });
  const byteLength = (value) => new TextEncoder().encode(value).length;
  const objects = [];
  const offsets = [0];

  const catalogObjectNumber = 1;
  const pagesObjectNumber = 2;
  const fontRegularObjectNumber = 3;
  const fontBoldObjectNumber = 4;
  const pageObjectNumber = 5;
  const contentObjectNumber = 6;

  objects.push({ number: fontRegularObjectNumber, body: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>' });
  objects.push({ number: fontBoldObjectNumber, body: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>' });
  objects.push({
    number: contentObjectNumber,
    body: `<< /Length ${byteLength(content)} >>\nstream\n${content}\nendstream`,
  });
  objects.push({
    number: pageObjectNumber,
    body:
      `<< /Type /Page /Parent ${pagesObjectNumber} 0 R ` +
      `/MediaBox [0 0 ${PAGE_WIDTH.toFixed(2)} ${PAGE_HEIGHT.toFixed(2)}] ` +
      `/Resources << /Font << /F1 ${fontRegularObjectNumber} 0 R /F2 ${fontBoldObjectNumber} 0 R >> >> ` +
      `/Contents ${contentObjectNumber} 0 R >>`,
  });
  objects.push({
    number: pagesObjectNumber,
    body: `<< /Type /Pages /Kids [${pageObjectNumber} 0 R] /Count 1 >>`,
  });
  objects.push({
    number: catalogObjectNumber,
    body: `<< /Type /Catalog /Pages ${pagesObjectNumber} 0 R >>`,
  });

  objects.sort((a, b) => a.number - b.number);

  let pdf = '%PDF-1.4\n';
  for (const object of objects) {
    offsets[object.number] = byteLength(pdf);
    pdf += `${object.number} 0 obj\n${object.body}\nendobj\n`;
  }

  const xrefOffset = byteLength(pdf);
  pdf += 'xref\n0 7\n';
  pdf += '0000000000 65535 f \n';

  for (let number = 1; number <= 6; number += 1) {
    const offset = offsets[number] ?? 0;
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size 7 /Root ${catalogObjectNumber} 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return new Blob([pdf], { type: 'application/pdf' });
}

function buildPdfPageContent(rows, { PAGE_WIDTH, PAGE_HEIGHT, LEFT, TOP, USABLE_WIDTH }) {
  const parts = [];
  const regular = 1;
  const bold = 2;
  const darkBlue = '0.07 0.23 0.52 rg';
  const teal = '0.00 0.42 0.55 rg';
  const border = '0.78 0.78 0.80 RG';

  const drawRect = (x, y, w, h, fill, stroke) => {
    if (fill) parts.push(fill);
    if (stroke) parts.push(stroke);
    parts.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill ? 'B' : 'S'}`);
  };

  const line = (x1, y1, x2, y2, stroke = border) => {
    parts.push(stroke);
    parts.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  };

  const writeText = (text, x, y, size, options = {}) => {
    const {
      align = 'left',
      color = '0 0 0 rg',
      font = regular,
      maxWidth = null,
    } = options;
    const estimate = maxWidth || textWidthEstimate(text, size);
    let startX = x;
    if (align === 'center') startX = x - estimate / 2;
    if (align === 'right') startX = x - estimate;
    parts.push('BT');
    parts.push(color);
    parts.push(`/F${font} ${size.toFixed(2)} Tf`);
    parts.push(`1 0 0 1 ${startX.toFixed(2)} ${y.toFixed(2)} Tm`);
    parts.push(`(${escapePdfText(text)}) Tj`);
    parts.push('ET');
  };

  const headerTop = PAGE_HEIGHT - TOP;
  const headerBottom = headerTop - 130;
  drawRect(LEFT, headerBottom, USABLE_WIDTH, 130, '1 1 1 rg', border);
  drawRect(LEFT, headerBottom + 63, USABLE_WIDTH, 67, '0.95 0.97 1 rg', '0.90 0.92 0.96 RG');

  writeText('JOTHI EYE BANK', LEFT + 12, headerTop - 28, 21, { font: bold, color: darkBlue });
  writeText('Family Eye Donation Pledge Form', LEFT + 12, headerTop - 55, 15.5, { font: bold, color: teal });
  writeText('Eye donation - a noble gift that lives on.', LEFT + 12, headerTop - 75, 10.2, { color: '0.28 0.38 0.49 rg' });
  writeText('Let it be our family tradition.', LEFT + 12, headerTop - 88, 10.2, { color: '0.28 0.38 0.49 rg' });

  drawRect(PAGE_WIDTH - LEFT - 120, headerTop - 68, 108, 46, '0.11 0.31 0.66 rg', null);
  writeText('Date', PAGE_WIDTH - LEFT - 66, headerTop - 41, 12, { font: bold, color: '1 1 1 rg', align: 'center' });
  line(PAGE_WIDTH - LEFT - 108, headerTop - 57, PAGE_WIDTH - LEFT - 12, headerTop - 57, '1 1 1 RG');

  const bandTop = headerBottom - 16;
  drawRect(LEFT, bandTop - 60, USABLE_WIDTH, 60, darkBlue, null);
  writeText('JOTHI EYE CARE CENTRE', LEFT + 12, bandTop - 26, 19, { font: bold, color: '1 1 1 rg' });
  writeText('152 & 154, Calve Subraya Chetty Street, Puducherry - 605 001.', LEFT + 12, bandTop - 47, 11.4, { font: bold, color: '1 1 1 rg' });

  drawRect(PAGE_WIDTH - LEFT - 205, bandTop - 54, 195, 48, '0.98 0.94 0.76 rg', null);
  writeText('FOR EYE DONATION', PAGE_WIDTH - LEFT - 107.5, bandTop - 18, 10, { font: bold, align: 'center' });
  writeText('Toll No. 1919', PAGE_WIDTH - LEFT - 107.5, bandTop - 34, 14, { font: bold, align: 'center' });
  writeText('Free (BSNL) Service', PAGE_WIDTH - LEFT - 107.5, bandTop - 47, 9.2, { align: 'center' });

  const addressTop = bandTop - 78;
  drawRect(LEFT, addressTop - 122, USABLE_WIDTH, 122, '1 1 1 rg', border);
  drawRect(LEFT + 12, addressTop - 20, 112, 20, '0.00 0.42 0.55 rg', null);
  writeText('ADDRESS DETAILS', LEFT + 68, addressTop - 5, 10.2, { font: bold, color: '1 1 1 rg', align: 'center' });

  writeText('Address', LEFT + 10, addressTop - 40, 11.2, { font: bold });
  line(LEFT + 70, addressTop - 43, PAGE_WIDTH - LEFT - 12, addressTop - 43);
  line(LEFT + 10, addressTop - 60, PAGE_WIDTH - LEFT - 12, addressTop - 60);
  line(LEFT + 10, addressTop - 80, PAGE_WIDTH - LEFT - 12, addressTop - 80);

  writeText('Pin', LEFT + 10, addressTop - 101, 11, { font: bold });
  line(LEFT + 46, addressTop - 104, LEFT + 140, addressTop - 104);
  writeText('Dist', LEFT + 160, addressTop - 101, 11, { font: bold });
  line(LEFT + 202, addressTop - 104, LEFT + 296, addressTop - 104);
  writeText('State', LEFT + 316, addressTop - 101, 11, { font: bold });
  line(LEFT + 366, addressTop - 104, LEFT + 460, addressTop - 104);
  writeText('Telephone', LEFT + 10, addressTop - 120, 11, { font: bold });
  line(LEFT + 84, addressTop - 123, PAGE_WIDTH - LEFT - 12, addressTop - 123);

  writeText(
    'We, the undersigned adult members of the family, pledge to donate our eyes after our death for the benefit of the needy.',
    PAGE_WIDTH / 2,
    addressTop - 144,
    10.1,
    { font: bold, align: 'center', color: '0.10 0.20 0.42 rg' }
  );

  const tableTop = addressTop - 162;
  const tableHeight = 118;
  drawRect(LEFT, tableTop - tableHeight, USABLE_WIDTH, tableHeight, '1 1 1 rg', border);
  drawRect(LEFT, tableTop - 22, USABLE_WIDTH, 22, '0.04 0.45 0.57 rg', null);
  const colXs = [LEFT, LEFT + 52, LEFT + 122, LEFT + 312, LEFT + 382, LEFT + 452];
  const colWidths = [52, 70, 190, 70, 70, 126];
  ['S.No', 'Title', 'Name (Block Letters)', 'Age', 'Gender', 'Signature'].forEach((label, idx) => {
    writeText(label, colXs[idx] + colWidths[idx] / 2, tableTop - 8, 9.2, {
      font: bold,
      align: 'center',
      color: '1 1 1 rg',
    });
    if (idx > 0) line(colXs[idx], tableTop - 22, colXs[idx], tableTop - tableHeight);
  });

  const rowHeight = 32;
  rows.forEach((row, index) => {
    const rowTop = tableTop - 22 - rowHeight * (index + 1);
    line(LEFT, rowTop, LEFT + USABLE_WIDTH, rowTop);
    writeText(String(index + 1), LEFT + colWidths[0] / 2, rowTop + 11, 10, { align: 'center' });
    writeText(getRowTitle(row), colXs[1] + colWidths[1] / 2, rowTop + 11, 9.6, {
      align: 'center',
      color: '0.28 0.28 0.30 rg',
    });
    writeText(getRowDisplayName(row), colXs[2] + 6, rowTop + 11, 9.6, {
      maxWidth: colWidths[2] - 12,
    });
    writeText(String(row.age ?? 'N/A'), colXs[3] + colWidths[3] / 2, rowTop + 11, 9.6, { align: 'center' });
    writeText(row.gender || 'N/A', colXs[4] + colWidths[4] / 2, rowTop + 11, 9.6, { align: 'center' });
    line(colXs[5] + 10, rowTop + 8, colXs[5] + colWidths[5] - 10, rowTop + 8, '0.45 0.52 0.60 RG');
  });

  const footerTop = tableTop - tableHeight - 18;
  writeText('Place', LEFT + 2, footerTop, 11.2, { font: bold });
  line(LEFT + 46, footerTop - 3, LEFT + 200, footerTop - 3);
  writeText(
    'To be filled in by two witnesses (Relatives, neighbours or friends)',
    PAGE_WIDTH / 2,
    footerTop - 20,
    9.4,
    { align: 'center', color: '0.30 0.38 0.48 rg' }
  );

  const witnessTop = footerTop - 118;
  const witnessWidth = (USABLE_WIDTH - 12) / 2;
  drawRect(LEFT, witnessTop, witnessWidth, 100, '0.97 0.98 1 rg', border);
  drawRect(LEFT + witnessWidth + 12, witnessTop, witnessWidth, 100, '0.97 0.98 1 rg', border);
  writeText('1. Witness (Next of kin)', LEFT + witnessWidth / 2, witnessTop + 86, 10.1, {
    font: bold,
    align: 'center',
  });
  writeText('2. Witness (Next of kin)', LEFT + witnessWidth + 12 + witnessWidth / 2, witnessTop + 86, 10.1, {
    font: bold,
    align: 'center',
  });

  ['Signature', 'Name and Relationship', 'Address', ''].forEach((label, idx) => {
    const y = witnessTop + 64 - idx * 18;
    writeText(label, LEFT + 10, y, 9.1);
    writeText(':', LEFT + 72, y, 9.1);
    line(LEFT + 84, y - 3, LEFT + witnessWidth - 10, y - 3, '0.62 0.65 0.70 RG');

    writeText(label, LEFT + witnessWidth + 12 + 10, y, 9.1);
    writeText(':', LEFT + witnessWidth + 12 + 72, y, 9.1);
    line(
      LEFT + witnessWidth + 12 + 84,
      y - 3,
      LEFT + witnessWidth + 12 + witnessWidth - 10,
      y - 3,
      '0.62 0.65 0.70 RG'
    );
  });

  writeText('JOTHI EYE CARE CENTRE', PAGE_WIDTH / 2, 34, 8.5, { font: bold, align: 'center', color: teal });
  return parts.join('\n');
}

function escapePdfText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function textWidthEstimate(text, fontSize) {
  return String(text).length * fontSize * 0.52;
}

function getRowTitle(row) {
  if (row?.title) return row.title;
  if (row?.gender === 'Male') return 'Mr.';
  if (row?.gender === 'Female') return 'Ms.';
  return 'Mr./Ms.';
}

function getRowDisplayName(row) {
  return row?.fullName || row?.name || 'N/A';
}

function ThankYouPage({ onRestart, onRoleSelect, submittedRows = [] }) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const exportRows = Array.isArray(submittedRows) ? submittedRows : [];

  async function handleExportPdf() {
    setExportingPdf(true);

    try {
      const rows = normalizeRows(null, exportRows);

      if (rows.length === 0) {
        return;
      }

      const pdfBlob = buildExportHtml(rows);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jothi-eye-care-centre-pledge.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
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

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Share2, Sparkles } from 'lucide-react';
import './ThankYouPage.css';

function SharePdfPage({ submittedRows = [], onBackToThankYou, onRoleSelect }) {
  const shareIframeRef = useRef(null);
  const [status, setStatus] = useState('preparing');
  const [error, setError] = useState('');
  const [shareRows] = useState(() => {
    if (Array.isArray(submittedRows) && submittedRows.length > 0) {
      return submittedRows;
    }

    try {
      const storedRows = window.localStorage?.getItem('pledge_export_rows');
      const parsedRows = storedRows ? JSON.parse(storedRows) : [];
      return Array.isArray(parsedRows) ? parsedRows : [];
    } catch (storageError) {
      console.warn('Could not read stored pledge rows:', storageError);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.__PLEDGE_EXPORT_ROWS__ = shareRows;
      window.localStorage?.setItem('pledge_export_rows', JSON.stringify(shareRows));
    } catch (storageError) {
      console.warn('Could not persist share rows:', storageError);
    }
  }, [shareRows]);

  useEffect(() => {
    async function handleShareMessage(event) {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== 'PLEDGE_PDF_BLOB_URL') {
        return;
      }

      const blobUrl = event.data.blobUrl;
      if (!blobUrl) {
        return;
      }

      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const file = new File([blob], 'certificate.pdf', { type: 'application/pdf' });

        const canShareFiles = Boolean(
          navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))
        );

        if (!canShareFiles) {
          setStatus('error');
          setError('Your device does not support sharing PDF files. Please use Download PDF instead.');
          return;
        }

        setStatus('sharing');
        await navigator.share({
          title: 'Generated PDF',
          text: 'Here is your generated PDF',
          files: [file],
        });
        setStatus('done');
      } catch (shareError) {
        console.warn('Could not share the PDF file:', shareError);
        setStatus('error');
        setError('Unable to share the PDF right now. Please try again.');
      } finally {
        if (shareIframeRef.current) {
          shareIframeRef.current.remove();
          shareIframeRef.current = null;
        }
      }
    }

    window.addEventListener('message', handleShareMessage);
    return () => {
      window.removeEventListener('message', handleShareMessage);
    };
  }, []);

  function startShare() {
    try {
      if (!shareRows.length) {
        setStatus('error');
        setError('No submitted data is available to share.');
        return;
      }

      setStatus('preparing');
      setError('');

      if (shareIframeRef.current) {
        shareIframeRef.current.remove();
        shareIframeRef.current = null;
      }

      const iframe = document.createElement('iframe');
      iframe.title = 'PDF share helper';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';

      const shareUrl = new URL('/pledge-export.html', window.location.origin);
      shareUrl.searchParams.set('mode', 'blob-share');

      iframe.src = shareUrl.toString();
      shareIframeRef.current = iframe;
      document.body.appendChild(iframe);
    } catch (shareError) {
      console.warn('Could not start PDF sharing:', shareError);
      setStatus('error');
      setError('Unable to open the share flow right now. Please try again.');
    }
  }

  useEffect(() => {
    startShare();

    return () => {
      if (shareIframeRef.current) {
        shareIframeRef.current.remove();
        shareIframeRef.current = null;
      }
    };
    // Intentional one-time launch when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="thank-you-page">
      <main className="thank-you-page__shell">
        <section className="thank-you-page__card">
          <div className="thank-you-page__badge">
            <Share2 aria-hidden="true" />
            <span>WhatsApp Share</span>
          </div>

          <p className="thank-you-page__eyebrow">Separate share screen</p>
          <h1>Sharing your PDF now.</h1>
          <p className="thank-you-page__lead">
            This page handles the WhatsApp PDF share separately from the thank-you screen.
          </p>

          <div className="thank-you-page__actions">
            <button
              className="thank-you-page__button thank-you-page__button--primary"
              type="button"
              onClick={startShare}
            >
              <Share2 aria-hidden="true" />
              <span>{status === 'sharing' ? 'Opening...' : 'Share PDF'}</span>
            </button>

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

          {status === 'done' ? (
            <div className="thank-you-page__mini-notes">
              <article className="thank-you-page__note">
                <CheckCircle2 aria-hidden="true" />
                <div>
                  <strong>Shared</strong>
                  <span>The PDF share dialog has been opened.</span>
                </div>
              </article>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="thank-you-page__mini-notes">
              <article className="thank-you-page__note">
                <CheckCircle2 aria-hidden="true" />
                <div>
                  <strong>Share not ready</strong>
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

export default SharePdfPage;

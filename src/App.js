import { useEffect, useRef, useState } from 'react';
import AppNavigator from './components/AppNavigator';
import AdminLoginPage from './pages/AdminLoginPage';
import RoleSelectPage from './pages/RoleSelectPage';
import SharePdfPage from './pages/SharePdfPage';
import TermsPage from './pages/TermsPage';
import ThankYouPage from './pages/ThankYouPage';
import WhatsAppTextPage from './pages/WhatsAppTextPage';

import SharedFooter from './components/SharedFooter';
import './App.css';

const pages = {
  'role-select': RoleSelectPage,
  terms: TermsPage,
  'thank-you': ThankYouPage,
  'share-pdf': SharePdfPage,
  'whatsapp-text': WhatsAppTextPage,
  'admin-login': AdminLoginPage,
 
};

function App() {
  const [activePage, setActivePage] = useState(() => window.history.state?.page || 'role-select');
  const [activeRole, setActiveRole] = useState(null);
  const [adminToken, setAdminToken] = useState('');
  const [userToken, setUserToken] = useState('');
  const [thankYouRows, setThankYouRows] = useState([]);
  const whatsappRedirectRef = useRef(null);
  const suppressHistoryRef = useRef(false);
  const lastHistoryPageRef = useRef(null);
  const PageComponent = pages[activePage] || RoleSelectPage;

  useEffect(() => {
    if (!window.history.state?.page) {
      window.history.replaceState({ page: activePage }, '', window.location.href);
    }

    lastHistoryPageRef.current = window.history.state?.page || activePage;
  }, [activePage]);

  useEffect(() => {
    function handlePopState(event) {
      const nextPage = event.state?.page || 'role-select';

      suppressHistoryRef.current = true;
      lastHistoryPageRef.current = nextPage;
      setActivePage(nextPage);

      if (nextPage === 'role-select') {
        setActiveRole(null);
      } else if (nextPage === 'admin-login') {
        setActiveRole('admin');
      } else {
        setActiveRole('user');
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (suppressHistoryRef.current) {
      suppressHistoryRef.current = false;
      return;
    }

    if (lastHistoryPageRef.current === activePage) {
      return;
    }

    window.history.pushState({ page: activePage }, '', window.location.href);
    lastHistoryPageRef.current = activePage;
  }, [activePage]);

  function navigate(nextPage) {
    setActivePage(nextPage);
  }

  function handleRoleSelect(role) {
    setActiveRole(role === 'role-select' ? null : role);
    if (role === 'admin') {
      setActivePage('admin-login');
    } else if (role === 'user-login') {
      setActivePage('user-login');
    } else if (role === 'terms') {
      setActivePage('terms');
    } else if (role === 'role-select') {
      setActivePage('role-select');
    } else {
      setActivePage('terms');
    }
  }

  function handleTermsAccept(savedRows = []) {
    setThankYouRows(Array.isArray(savedRows) ? savedRows : []);
    setActiveRole('user');
    setActivePage('thank-you');

    if (whatsappRedirectRef.current) {
      window.clearTimeout(whatsappRedirectRef.current);
    }

    whatsappRedirectRef.current = window.setTimeout(() => {
      setActivePage((currentPage) => (currentPage === 'thank-you' ? 'whatsapp-text' : currentPage));
    }, 1400);
  }

  function handleSharePdf() {
    setActiveRole('user');
    setActivePage('share-pdf');
  }

  function handleBackToThankYou() {
    setActiveRole('user');
    setActivePage('thank-you');
  }

  function handleTermsDecline() {
    setActiveRole(null);
    setActivePage('role-select');
  }

  function handleAdminLoginSuccess(nextToken) {
    if (nextToken) {
      setAdminToken(nextToken);
    }
    setActiveRole('admin');
    setActivePage('terms');
  }

  function handleAdminLogout() {
    setAdminToken('');
    setActiveRole(null);
    setActivePage('role-select');
  }

  function handleUserLogout() {
    setUserToken('');
    setActiveRole(null);
    setActivePage('role-select');
  }

  function handleUserLoginSuccess() {
    setActiveRole('user');
    setActivePage('terms');
  }

  function handleFooterHome() {
    setActivePage('role-select');
  }

  function handleFooterPledge() {
    setActiveRole('user');
    setActivePage('terms');
  }

  function handleFooterAdmin(targetPage = 'admin-login') {
    setActiveRole('admin');
    setActivePage(targetPage);
  }

  return (
    <div className="app-shell">
      {activePage !== 'role-select' && activePage !== 'share-pdf' && activePage !== 'whatsapp-text' ? (
        <AppNavigator activePage={activePage} activeRole={activeRole} onNavigate={navigate} />
      ) : null}
      <main className="app-shell__content">
        <PageComponent
          submittedRows={thankYouRows}
          userToken={userToken}
          onRoleSelect={handleRoleSelect}
          onAccept={handleTermsAccept}
          onDecline={handleTermsDecline}
          onCancel={handleUserLogout}
          onRestart={handleUserLogout}
          onSharePdf={handleSharePdf}
          onBackToThankYou={handleBackToThankYou}
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onAdminLogout={handleAdminLogout}
          onUserLogout={handleUserLogout}
          onUserTokenChange={setUserToken}
          adminToken={adminToken}
          onAdminTokenChange={setAdminToken}
          onLoginSuccess={handleUserLoginSuccess}
        />
      </main>
      {activePage !== 'role-select' &&
      activePage !== 'thank-you' &&
      activePage !== 'share-pdf' &&
      activePage !== 'whatsapp-text' ? (
        <SharedFooter
          onHome={handleFooterHome}
          onPledge={handleFooterPledge}
          onAdmin={handleFooterAdmin}
        />
      ) : null}
    </div>
  );
}

export default App;

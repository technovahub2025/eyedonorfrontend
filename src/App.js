import { useState } from 'react';
import AppNavigator from './components/AppNavigator';
import AdminLoginPage from './pages/AdminLoginPage';
import RoleSelectPage from './pages/RoleSelectPage';
import TermsPage from './pages/TermsPage';
import ThankYouPage from './pages/ThankYouPage';
import UserLoginPage from './pages/UserLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import './App.css';

const pages = {
  'role-select': RoleSelectPage,
  terms: TermsPage,
  'thank-you': ThankYouPage,
  'admin-login': AdminLoginPage,
  'user-login': UserLoginPage,
  'user-dashboard': UserDashboardPage,
};

function App() {
  const [activePage, setActivePage] = useState('role-select');
  const [activeRole, setActiveRole] = useState(null);
  const [adminToken, setAdminToken] = useState('');
  const [userToken, setUserToken] = useState('');
  const PageComponent = pages[activePage] || RoleSelectPage;

  function navigate(nextPage) {
    setActivePage(nextPage);
  }

  function handleRoleSelect(role) {
    setActiveRole(role);
    if (role === 'admin') {
      setActivePage('admin-login');
    } else if (role === 'user-login') {
      setActivePage('user-login');
    } else if (role === 'terms') {
      setActivePage('terms');
    } else {
      setActivePage('terms');
    }
  }

  function handleTermsAccept() {
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

  return (
    <div className="app-shell">
      {activePage !== 'role-select' ? (
        <AppNavigator activePage={activePage} activeRole={activeRole} onNavigate={navigate} />
      ) : null}
      <main className="app-shell__content">
        <PageComponent
          userToken={userToken}
          onRoleSelect={handleRoleSelect}
          onAccept={handleTermsAccept}
          onDecline={handleTermsDecline}
          onCancel={handleUserLogout}
          onRestart={handleUserLogout}
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onAdminLogout={handleAdminLogout}
          onUserLogout={handleUserLogout}
          onUserTokenChange={setUserToken}
          adminToken={adminToken}
          onAdminTokenChange={setAdminToken}
          onLoginSuccess={handleUserLoginSuccess}
      />
      </main>
      <footer className="app-footer">
        <div className="app-footer__inner">
          <div className="app-footer__promo">
            <p className="app-footer__eyebrow">Supporting sight</p>
            <h2>Every registration begins with one thoughtful decision.</h2>
            <p>
              Jothi Eye Care Centre supports a clear, caring experience for eye donation and
              registration.
            </p>
          </div>

          <div className="app-footer__grid">
            <div className="app-footer__card">
              <p className="app-footer__title">JOTHI EYE CARE CENTRE</p>
              <p>152 &amp; 154, Calve Subraya Chetty Street,</p>
              <p>Puducherry - 605 001.</p>
            </div>

            <div className="app-footer__card">
              <p className="app-footer__eyebrow">Contact</p>
              <p>
                <a href="tel:+914132224534">+91-413-2224534</a>
              </p>
              <p>
                <a href="tel:+914132337659">+91-413-2337659</a>
              </p>
              <p>
                <a href="mailto:jothieyecare@gmail.com">jothieyecare@gmail.com</a>
              </p>
            </div>

            <div className="app-footer__card app-footer__card--accent">
              <p className="app-footer__eyebrow">Quick note</p>
              <p>Eye donation is a gift that can keep giving long after the choice is made.</p>
              <a
                className="app-footer__powered"
                href="https://www.technovahub.in"
                target="_blank"
                rel="noreferrer"
              >
                Powered by TechnovaHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

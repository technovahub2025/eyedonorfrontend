import { useState } from 'react';
import AppNavigator from './components/AppNavigator';
import AdminLoginPage from './pages/AdminLoginPage';
import RoleSelectPage from './pages/RoleSelectPage';
import TermsPage from './pages/TermsPage';
import ThankYouPage from './pages/ThankYouPage';
import UserLoginPage from './pages/UserLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import SharedFooter from './components/SharedFooter';
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
  const [thankYouRows, setThankYouRows] = useState([]);
  const PageComponent = pages[activePage] || RoleSelectPage;

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

  function handleFooterAdmin() {
    setActiveRole('admin');
    setActivePage('admin-login');
  }

  return (
    <div className="app-shell">
      {activePage !== 'role-select' ? (
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
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onAdminLogout={handleAdminLogout}
          onUserLogout={handleUserLogout}
          onUserTokenChange={setUserToken}
          adminToken={adminToken}
          onAdminTokenChange={setAdminToken}
          onLoginSuccess={handleUserLoginSuccess}
        />
      </main>
      <SharedFooter
        onHome={handleFooterHome}
        onPledge={handleFooterPledge}
        onAdmin={handleFooterAdmin}
      />
    </div>
  );
}

export default App;

import { useState } from 'react';
import AppNavigator from './components/AppNavigator';
import AdminLoginPage from './pages/AdminLoginPage';
import RoleSelectPage from './pages/RoleSelectPage';
import TermsPage from './pages/TermsPage';
import ThankYouPage from './pages/ThankYouPage';
import UserLoginPage from './pages/UserLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';

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
    </div>
  );
}

export default App;

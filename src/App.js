import { useState } from 'react';
import AppNavigator from './components/AppNavigator';
import AdminLoginPage from './pages/AdminLoginPage';
import DataPage from './pages/data';
import RoleSelectPage from './pages/RoleSelectPage';
import RegistryPage from './pages/RegistryPage';
import TermsPage from './pages/TermsPage';
import VerificationPage from './pages/VerificationPage';
import ThankYouPage from './pages/ThankYouPage';

const pages = {
  'role-select': RoleSelectPage,
  'login-data': DataPage,
  terms: TermsPage,
  verification: VerificationPage,
  'thank-you': ThankYouPage,
  'admin-login': AdminLoginPage,
  registry: RegistryPage,
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
    setActivePage(role === 'admin' ? 'admin-login' : 'login-data');
  }

  function handleDataSuccess() {
    setActiveRole('user');
    setActivePage('terms');
  }

  function handleTermsAccept() {
    setActiveRole('user');
    setActivePage('verification');
  }

  function handleTermsDecline() {
    setActiveRole(null);
    setActivePage('role-select');
  }

  function handleVerificationSubmit() {
    setActiveRole('user');
    setActivePage('thank-you');
  }

  function handleAdminLoginSuccess() {
    setActiveRole('admin');
    setActivePage('registry');
  }

  function handleAdminLogout() {
    setActiveRole(null);
    setActivePage('role-select');
  }

  function handleUserLogout() {
    setActiveRole(null);
    setActivePage('role-select');
  }

  return (
    <div className="app-shell">
      {activePage !== 'role-select' ? (
        <AppNavigator activePage={activePage} activeRole={activeRole} onNavigate={navigate} />
      ) : null}
      <PageComponent
        adminToken={adminToken}
        userToken={userToken}
        onRoleSelect={handleRoleSelect}
        onDataSuccess={handleDataSuccess}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
        onSubmitSuccess={handleVerificationSubmit}
        onCancel={handleUserLogout}
        onRestart={handleUserLogout}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onAdminLogout={handleAdminLogout}
        onUserLogout={handleUserLogout}
        onAdminTokenChange={setAdminToken}
        onUserTokenChange={setUserToken}
      />
    </div>
  );
}

export default App;

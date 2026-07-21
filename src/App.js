import { useState } from 'react';
import AppNavigator from './components/AppNavigator';
import AdminLoginPage from './pages/AdminLoginPage';
import DataPage from './pages/data';
import RoleSelectPage from './pages/RoleSelectPage';
import RegistryPage from './pages/RegistryPage';
import UserLoginPage from './pages/UserLoginPage';
import VerificationPage from './pages/VerificationPage';
import ThankYouPage from './pages/ThankYouPage';

const pages = {
  'role-select': RoleSelectPage,
  'user-login': UserLoginPage,
  'login-data': DataPage,
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
    setActivePage(role === 'admin' ? 'admin-login' : 'user-login');
  }

  function handleUserLoginSuccess() {
    setActiveRole('user');
    setActivePage('login-data');
  }

  function handleDataSuccess() {
    setActiveRole('user');
    setActivePage('verification');
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
    <>
      {activePage !== 'role-select' ? (
        <AppNavigator activePage={activePage} activeRole={activeRole} onNavigate={navigate} />
      ) : null}
      <PageComponent
        adminToken={adminToken}
        userToken={userToken}
        onRoleSelect={handleRoleSelect}
        onLoginSuccess={handleUserLoginSuccess}
        onDataSuccess={handleDataSuccess}
        onSubmitSuccess={handleVerificationSubmit}
        onCancel={handleUserLogout}
        onRestart={handleUserLogout}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onAdminLogout={handleAdminLogout}
        onUserLogout={handleUserLogout}
        onAdminTokenChange={setAdminToken}
        onUserTokenChange={setUserToken}
      />
    </>
  );
}

export default App;

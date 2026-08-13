import { useState } from 'react';
import AppNavigator from './components/AppNavigator';
import AdminLoginPage from './pages/AdminLoginPage';
import DataPage from './pages/data';
import RoleSelectPage from './pages/RoleSelectPage';
import RegistryPage from './pages/RegistryPage';
import RegistryDetailsPage from './pages/RegistryDetailsPage';
import TermsPage from './pages/TermsPage';
import ThankYouPage from './pages/ThankYouPage';
import UserLoginPage from './pages/UserLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';

const pages = {
  'role-select': RoleSelectPage,
  'login-data': DataPage,
  terms: TermsPage,
  'thank-you': ThankYouPage,
  'admin-login': AdminLoginPage,
  'user-login': UserLoginPage,
  'user-dashboard': UserDashboardPage,
  registry: RegistryPage,
  'registry-details': RegistryDetailsPage,
};

function App() {
  const [activePage, setActivePage] = useState('role-select');
  const [activeRole, setActiveRole] = useState(null);
  const [adminToken, setAdminToken] = useState('');
  const [userToken, setUserToken] = useState('');
  const [selectedAdminRow, setSelectedAdminRow] = useState(null);
  const PageComponent = pages[activePage] || RoleSelectPage;

  function navigate(nextPage) {
    setActivePage(nextPage);
  }

  function handleAdminRowSelect(row) {
    setSelectedAdminRow(row || null);
    setActivePage('registry-details');
  }

  function handleRoleSelect(role) {
    setActiveRole(role);
    if (role === 'admin') {
      setActivePage('admin-login');
    } else if (role === 'user-login') {
      setActivePage('user-login');
    } else {
      setActivePage('login-data');
    }
  }

  function handleDataSuccess() {
    setActiveRole('user');
    setActivePage('terms');
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
    setActivePage('registry');
  }

  function handleAdminLogout() {
    setAdminToken('');
    setActiveRole(null);
    setSelectedAdminRow(null);
    setActivePage('role-select');
  }

  function handleUserLogout() {
    setUserToken('');
    setActiveRole(null);
    setSelectedAdminRow(null);
    setActivePage('role-select');
  }

  function handleUserLoginSuccess() {
    setActiveRole('user');
    setActivePage('terms');
  }

  function handleDetailsBack() {
    setActivePage('registry');
  }

  return (
    <div className="app-shell">
      {activePage !== 'role-select' ? (
        <AppNavigator activePage={activePage} activeRole={activeRole} onNavigate={navigate} />
      ) : null}
      <PageComponent
        userToken={userToken}
        onRoleSelect={handleRoleSelect}
        onDataSuccess={handleDataSuccess}
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
        selectedAdminRow={selectedAdminRow}
        onAdminRowSelect={handleAdminRowSelect}
        onDetailsBack={handleDetailsBack}
        onLoginSuccess={handleUserLoginSuccess}
      />
    </div>
  );
}

export default App;

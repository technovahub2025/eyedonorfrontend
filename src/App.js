import { useState } from 'react';
import AppNavigator from './components/AppNavigator';
import AdminLoginPage from './pages/AdminLoginPage';
import LoginPage from './pages/LoginPage';
import RegistryPage from './pages/RegistryPage';
import TermsPage from './pages/TermsPage';
import UserLoginPage from './pages/UserLoginPage';
import VerificationPage from './pages/VerificationPage';

const pages = {
  login: LoginPage,
  'user-login': UserLoginPage,
  terms: TermsPage,
  verification: VerificationPage,
  'admin-login': AdminLoginPage,
  registry: RegistryPage,
};

const rolePages = {
  user: ['login', 'user-login', 'terms', 'verification'],
  admin: ['admin-login', 'registry'],
};

function App() {
  const [activePage, setActivePage] = useState('login');
  const [activeRole, setActiveRole] = useState(null);
  const [adminToken, setAdminToken] = useState('');
  const [userToken, setUserToken] = useState('');
  const PageComponent = pages[activePage] || UserLoginPage;

  function navigate(nextPage) {
    setActivePage(nextPage);

    if (rolePages.admin.includes(nextPage)) {
      setActiveRole('admin');
      return;
    }

    if (rolePages.user.includes(nextPage)) {
      setActiveRole('user');
    }
  }

  function handleLoginSuccess() {
    setActiveRole('user');
    setActivePage('terms');
  }

  function handleTermsAccept() {
    setActiveRole('user');
    setActivePage('verification');
  }

  function handleTermsDecline() {
    setActiveRole(null);
    setActivePage('login');
  }

  function handleAdminLoginSuccess() {
    setActiveRole('admin');
    setActivePage('registry');
  }

  function handleAdminLogout() {
    setActiveRole(null);
    setActivePage('admin-login');
  }

  function handleUserLogout() {
    setActiveRole(null);
    setActivePage('login');
  }

  return (
    <>
      <AppNavigator activePage={activePage} activeRole={activeRole} onNavigate={navigate} />
      <PageComponent
        adminToken={adminToken}
        userToken={userToken}
        onLoginSuccess={handleLoginSuccess}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
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

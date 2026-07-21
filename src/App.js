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

function App() {
  const [activePage, setActivePage] = useState('user-login');
  const [adminToken, setAdminToken] = useState('');
  const [userToken, setUserToken] = useState('');
  const PageComponent = pages[activePage] || UserLoginPage;

  return (
    <>
      <AppNavigator activePage={activePage} onNavigate={setActivePage} />
      <PageComponent
        adminToken={adminToken}
        userToken={userToken}
        onAdminTokenChange={setAdminToken}
        onUserTokenChange={setUserToken}
      />
    </>
  );
}

export default App;

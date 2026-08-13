import './AppNavigator.css';
import BrandMark from './BrandMark';

const navItems = [
  { key: 'login-data', label: 'Start' },
  { key: 'terms', label: 'Review' },
  { key: 'thank-you', label: 'Done' },
  { key: 'user-login', label: 'Sign in' },
  { key: 'user-dashboard', label: 'Dashboard' },
  { key: 'admin-login', label: 'Admin sign in' },
];

const roleNavMap = {
  user: ['login-data', 'terms', 'thank-you', 'user-login', 'user-dashboard'],
  admin: ['admin-login', 'terms'],
};

function AppNavigator({ activePage, activeRole, onNavigate }) {
  const visibleItems = activeRole
    ? navItems.filter((item) => roleNavMap[activeRole].includes(item.key))
    : [];

  return (
    <header className="app-navigator">
      <div className="app-navigator__inner">
        <div className="app-navigator__brand">
          <BrandMark title="VisionGift" subtitle="A kinder way to register" />
        </div>

        <nav className="app-navigator__tabs" aria-label="Page navigation">
          {visibleItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`app-navigator__tab ${
                activePage === item.key ? 'app-navigator__tab--active' : ''
              }`}
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default AppNavigator;

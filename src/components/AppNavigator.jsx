import './AppNavigator.css';

const navItems = [
  { key: 'login-data', label: 'Login Data' },
  { key: 'verification', label: 'Verification' },
  { key: 'thank-you', label: 'Thank You' },
  { key: 'admin-login', label: 'Admin Login' },
  { key: 'registry', label: 'Registry' },
];

const roleNavMap = {
  user: ['login-data', 'verification', 'thank-you'],
  admin: ['admin-login', 'registry'],
};

function AppNavigator({ activePage, activeRole, onNavigate }) {
  const visibleItems = activeRole
    ? navItems.filter((item) => roleNavMap[activeRole].includes(item.key))
    : [];

  return (
    <header className="app-navigator">
      <div className="app-navigator__inner">
        <div className="app-navigator__brand">
          <span className="material-symbols-outlined" aria-hidden="true">
            visibility
          </span>
          <div>
            <strong>VisionGift</strong>
            <span>Screen navigation</span>
          </div>
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

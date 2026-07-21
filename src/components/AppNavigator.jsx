import './AppNavigator.css';

const navItems = [
  { key: 'login-data', label: 'Your Details' },
  { key: 'terms', label: 'Terms' },
  { key: 'verification', label: 'Verify' },
  { key: 'thank-you', label: 'Done' },
  { key: 'admin-login', label: 'admin Sign In' },
  { key: 'registry', label: 'user List' },
];

const roleNavMap = {
  user: ['login-data', 'terms', 'verification', 'thank-you'],
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
            <span>Where you are</span>
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

import './AppNavigator.css';
import BrandMark from './BrandMark';

const navItems = [
  { key: 'terms', label: 'Review' },
  { key: 'thank-you', label: 'Done' },
];

const roleNavMap = {
  user: ['terms', 'thank-you'],
  admin: ['terms', 'thank-you'],
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

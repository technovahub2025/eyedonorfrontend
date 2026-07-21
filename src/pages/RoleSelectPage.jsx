import './RoleSelectPage.css';

function RoleSelectPage({ onRoleSelect }) {
  return (
    <div className="role-select-page">
      <main className="role-select-page__shell">
        <section className="role-select-page__hero">
          <p className="role-select-page__eyebrow">Step 1 of 4</p>
          <h1>Select your path</h1>
          <p>Choose how you want to continue with VisionGift.</p>
        </section>

        <section className="role-select-page__cards" aria-label="Choose a role">
          <button
            className="role-select-card role-select-card--admin"
            type="button"
            onClick={() => onRoleSelect?.('admin')}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              admin_panel_settings
            </span>
            <strong>admin</strong>
            <span>admin sign in and user list</span>
          </button>

          <button
            className="role-select-card role-select-card--user"
            type="button"
            onClick={() => onRoleSelect?.('user')}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              badge
            </span>
            <strong>user</strong>
            <span>Share details, review, and finish</span>
          </button>
        </section>

        <footer className="role-select-page__footer">
          <a className="role-select-page__powered-by" href="https://www.technovahub.in">
            Powered by TechnovaHub
          </a>
        </footer>
      </main>
    </div>
  );
}

export default RoleSelectPage;

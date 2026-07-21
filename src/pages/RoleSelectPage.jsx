import './RoleSelectPage.css';

function RoleSelectPage({ onRoleSelect }) {
  return (
    <div className="role-select-page">
      <main className="role-select-page__shell">
        <section className="role-select-page__hero">
          <p className="role-select-page__eyebrow">Step 1 of 4</p>
          <h1>Select your role</h1>
          <p>
            Choose how you want to continue. Admin users go to the protected dashboard,
            and donor users follow the registration and verification flow.
          </p>
        </section>

        <section className="role-select-page__cards" aria-label="Choose a role">
          <button className="role-select-card role-select-card--admin" type="button" onClick={() => onRoleSelect?.('admin')}>
            <span className="material-symbols-outlined" aria-hidden="true">
              admin_panel_settings
            </span>
            <strong>Admin</strong>
            <span>Admin Login then Registry</span>
          </button>

          <button className="role-select-card role-select-card--user" type="button" onClick={() => onRoleSelect?.('user')}>
            <span className="material-symbols-outlined" aria-hidden="true">
              badge
            </span>
            <strong>User</strong>
            <span>User Login, Login Data, Verification, Thank You</span>
          </button>
        </section>
      </main>
    </div>
  );
}

export default RoleSelectPage;

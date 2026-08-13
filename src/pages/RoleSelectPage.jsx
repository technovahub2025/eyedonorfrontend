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
            <strong>Admin</strong>
            <span>Admin sign in</span>
          </button>

          <button
            className="role-select-card role-select-card--user"
            type="button"
            onClick={() => onRoleSelect?.('user-login')}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              login
            </span>
            <strong>User Login</strong>
            <span>Sign in with your email and phone</span>
          </button>

          <button
            className="role-select-card role-select-card--register"
            type="button"
            onClick={() => onRoleSelect?.('user')}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              how_to_reg
            </span>
            <strong>New User</strong>
            <span>Register and share your details</span>
          </button>
        </section>

      </main>
    </div>
  );
}

export default RoleSelectPage;

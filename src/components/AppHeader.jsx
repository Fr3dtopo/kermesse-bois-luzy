import logo from '../assets/logo_bois_luzy_blanc.png'

export function AppHeader({
  adminUser,
  mode,
  onEnterAdmin,
  onLeaveAdmin,
  onLogout,
}) {
  const isAdminMode = mode === 'admin'

  return (
    <header className="hero-card">
      <div className="hero-content">
        <img className="school-logo" src={logo} alt="Logo Bois Luzy" />

        <div className="hero-title">
          <p className="eyebrow">École maternelle de Bois Luzy</p>
          <h1>Kermesse 2026</h1>
        </div>
      </div>

      <div className="header-actions">
        {isAdminMode ? (
          <button className="button button-secondary" onClick={onLeaveAdmin}>
            Mode parents
          </button>
        ) : (
          <button className="button button-primary" onClick={onEnterAdmin}>
            Mode admin
          </button>
        )}

        {adminUser && (
          <>
            <span className="admin-session">
              Connecté : {adminUser.email}
            </span>

            <button className="button button-ghost" onClick={onLogout}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  )
}

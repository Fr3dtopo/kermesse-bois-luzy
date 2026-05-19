import { useState } from 'react'

export function AdminLogin({ adminEmail, loading, onLogin }) {
  const [email, setEmail] = useState(adminEmail || '')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ email, password })
  }

  return (
    <section className="panel admin-login">
      <h2>Connexion admin</h2>
      <p className="muted">
        La session est mémorisée par Supabase Auth sur cet appareil.
      </p>

      <form className="admin-login-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email admin</span>
          <input
            autoComplete="username"
            onChange={(event) => setEmail(event.target.value)}
            readOnly={Boolean(adminEmail)}
            type="email"
            value={email}
          />
        </label>

        <label className="field">
          <span>Mot de passe</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        <button
          className="button button-primary"
          disabled={loading || !password || !email}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </section>
  )
}

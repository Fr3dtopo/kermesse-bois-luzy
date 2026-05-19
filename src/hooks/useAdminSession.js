import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient.js'

const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL

export function useAdminSession() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user || null)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const login = async ({ email, password }) => {
    const loginEmail = (configuredAdminEmail || email).trim()

    if (!loginEmail) {
      setError('Renseigne un email admin.')
      return
    }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    })

    if (authError) {
      setError('Mot de passe admin incorrect ou compte Supabase introuvable.')
    }

    setLoading(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    adminEmail: configuredAdminEmail,
    error,
    loading,
    login,
    logout,
    user,
  }
}

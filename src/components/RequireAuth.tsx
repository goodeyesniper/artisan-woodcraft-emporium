import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Navigate } from 'react-router-dom'

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser()

      if (data?.user) {
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }

      setLoading(false)
    }

    checkUser()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
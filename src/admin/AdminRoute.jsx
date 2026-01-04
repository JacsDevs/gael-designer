import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function AdminRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return <p>Carregando...</p>
  if (!user) return <Navigate to="/admin/login" />

  return children
}

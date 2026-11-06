import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { isAdminUser } from '../services/adminAuth'
import '../styles/admin.css'

// O Firestore é compartilhado com outro projeto (votação), onde eleitores também
// fazem login. As regras só liberam escrita com a custom claim `admin == true`,
// então o painel exige a mesma claim — estar logado não basta.
export default function AdminRoute({ children }) {
  const [state, setState] = useState('loading') // loading | admin | denied

  useEffect(() => onAuthStateChanged(auth, async user => {
    setState(user && await isAdminUser(user) ? 'admin' : 'denied')
  }), [])

  if (state === 'loading') return <p className="adm-status">Carregando...</p>
  if (state === 'denied') return <Navigate to="/admin/login" replace />

  return children
}

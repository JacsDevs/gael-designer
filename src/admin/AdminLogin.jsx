import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch (err) {
      setError('Login inválido')
    }
  }

  return (
    <div className="container">
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

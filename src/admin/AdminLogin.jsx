import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../services/firebase'
import { isAdminUser } from '../services/adminAuth'
import logo from '../assets/images/logo.png'
import desktopImage from '../assets/images/desktop-image.jpg'
import { ArrowLeftIcon } from '../components/Icons'
import { AlertIcon, EyeIcon, EyeOffIcon } from './AdminIcons'
import '../styles/admin.css'

function authMessage(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'E-mail ou senha incorretos.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
    case 'auth/network-request-failed':
      return 'Sem conexão. Verifique a internet e tente de novo.'
    default:
      return 'Não foi possível entrar. Tente de novo.'
  }
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Já logado como admin: vai direto para o painel.
  useEffect(() => onAuthStateChanged(auth, async user => {
    if (await isAdminUser(user)) navigate('/admin', { replace: true })
  }), [navigate])

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) return setError('Preencha e-mail e senha para entrar.')
    if (email.indexOf('@') < 1) return setError('Esse e-mail não parece válido.')

    setBusy(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password)
      // Conta válida, mas sem a claim admin (ex.: eleitor do outro projeto).
      if (!(await isAdminUser(user, true))) {
        await signOut(auth)
        setError('Esta conta não tem permissão de administrador.')
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(authMessage(err.code))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <img className="login-bg" src={desktopImage} alt="" aria-hidden="true" />

      <main className="login-main">
        <div className="login-card">
          <div className="login-head">
            <img src={logo} alt="Gael Designer" />
            <div>
              <h1>Painel do site</h1>
              <p>Entre para atualizar combos, preços e trabalhos.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div className="field">
              <label className="lbl" htmlFor="l-email">E-mail</label>
              <input
                className="fld"
                id="l-email"
                type="email"
                autoComplete="username"
                placeholder="seu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
              />
            </div>
            <div className="field">
              <label className="lbl" htmlFor="l-pass">Senha</label>
              <div className="pass-wrap">
                <input
                  className="fld"
                  id="l-pass"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {show ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <p className="login-error" role="alert">
                <AlertIcon />
                {error}
              </p>
            )}

            <button type="submit" className="gold-btn" disabled={busy}>
              {busy ? 'Entrando...' : 'Entrar no painel'}
            </button>
          </form>
        </div>

        <Link className="back-link" to="/">
          <ArrowLeftIcon />
          Voltar ao site
        </Link>
      </main>
    </div>
  )
}

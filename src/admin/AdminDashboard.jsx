import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'
import { getAllPackages } from '../services/packagesService'
import { getSettings, getWorks } from '../services/siteService'
import { useSettings } from '../hooks/useSettings'
import logo from '../assets/images/logo.png'
import CombosPanel from './CombosPanel'
import WorksPanel from './WorksPanel'
import PricesPanel from './PricesPanel'
import ConfigPanel from './ConfigPanel'
import { AlertIcon, ExternalIcon, LogoutIcon, OkIcon } from './AdminIcons'
import '../styles/admin.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { settings, setSettings } = useSettings()
  const [tab, setTab] = useState('combos')
  const [packages, setPackages] = useState([])
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    // Configurações sempre frescas no painel (o site pode ter carregado antes de uma edição).
    Promise.all([getAllPackages(), getWorks(), getSettings()])
      .then(([pkgs, wks, cfg]) => {
        setPackages(pkgs)
        setWorks(wks)
        setSettings(cfg)
      })
      .catch(error => {
        console.error(error)
        setLoadError('Não foi possível carregar os dados. Verifique a conexão e as permissões do Firestore.')
      })
      .finally(() => setLoading(false))
    return () => clearTimeout(timer.current)
  }, [setSettings])

  function flash(text, error = false) {
    setToast({ text, error })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), error ? 4500 : 2600)
  }

  async function logout() {
    try {
      await signOut(auth)
      navigate('/admin/login')
    } catch (error) {
      console.error('Erro ao sair:', error)
      flash('Não foi possível sair.', true)
    }
  }

  const tabs = [
    { id: 'combos', label: 'Combos', count: packages.length },
    { id: 'works', label: 'Trabalhos', count: works.length },
    { id: 'prices', label: 'Valores individuais', count: settings.prices.length },
    { id: 'config', label: 'Configurações', count: '•' },
  ]

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top-inner">
          <div className="adm-brand">
            <img src={logo} alt="Gael Designer" />
            <span>Painel do site</span>
          </div>
          <div className="adm-user">
            <a className="pill-btn" href="#/" target="_blank" rel="noreferrer">
              <ExternalIcon /> Ver site
            </a>
            <span className="adm-email">{auth.currentUser?.email}</span>
            <button type="button" className="pill-btn" onClick={logout}>
              <LogoutIcon /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="adm-body">
        <nav className="adm-side" aria-label="Seções do painel">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              className={t.id === tab ? 'on' : ''}
              aria-current={t.id === tab ? 'page' : undefined}
              onClick={() => setTab(t.id)}
            >
              <span>{t.label}</span>
              <span className="count">{t.count}</span>
            </button>
          ))}
        </nav>

        <main className="adm-main">
          {toast && (
            <div className={`toast ${toast.error ? 'error' : ''}`} role={toast.error ? 'alert' : 'status'}>
              {toast.error ? <AlertIcon /> : <OkIcon />}
              {toast.text}
            </div>
          )}

          {loading && <p className="adm-status">Carregando...</p>}
          {loadError && <div className="toast error" role="alert"><AlertIcon />{loadError}</div>}

          {!loading && !loadError && (
            <>
              {tab === 'combos' && (
                <CombosPanel packages={packages} setPackages={setPackages} settings={settings} flash={flash} />
              )}
              {tab === 'works' && <WorksPanel works={works} setWorks={setWorks} flash={flash} />}
              {tab === 'prices' && <PricesPanel settings={settings} setSettings={setSettings} flash={flash} />}
              {tab === 'config' && <ConfigPanel settings={settings} setSettings={setSettings} flash={flash} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

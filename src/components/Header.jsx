import { useState } from 'react'
import { useScrollToSection } from '../hooks/useScrollToSection'
import logo from '../assets/images/logo.png'
import { InstagramIcon, MenuIcon, CloseIcon } from './Icons'
import { useSettings } from '../hooks/useSettings'
import { instagramUrl } from '../utils/combos'

const LINKS = [
  { id: 'combos', label: 'Combos' },
  { id: 'trabalhos', label: 'Trabalhos' },
  { id: 'avulsos', label: 'Valores individuais' },
  { id: 'camisas', label: 'Confecção de camisas' },
  { id: 'como', label: 'Como funciona' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const scrollTo = useScrollToSection()
  const { settings } = useSettings()

  const go = (id) => {
    scrollTo(id)
    setOpen(false)
  }

  const links = LINKS.map(l => (
    <button key={l.id} type="button" className="nav-link" onClick={() => go(l.id)}>
      {l.label}
    </button>
  ))

  const insta = (
    <a
      className="nav-insta"
      href={instagramUrl(settings.instagram)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Instagram ${settings.instagram}`}
    >
      <InstagramIcon />
      {settings.instagram}
    </a>
  )

  return (
    <header className="site-header">
      <nav className="nav-pill" aria-label="Principal">
        <button type="button" className="nav-logo" onClick={() => go('topo')} aria-label="Gael Designer, início">
          <img src={logo} alt="Gael Designer" />
        </button>

        <div className="nav-links">{links}</div>
        {insta}

        <button
          type="button"
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div className={`nav-mobile ${open ? 'open' : ''}`}>
          {links}
          {insta}
        </div>
      </nav>
    </header>
  )
}

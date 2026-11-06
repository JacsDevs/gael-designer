import logo from '../assets/images/logo.png'
import { useScrollToSection } from '../hooks/useScrollToSection'
import { useSettings } from '../hooks/useSettings'
import { instagramUrl } from '../utils/combos'

export default function Footer() {
  const scrollTo = useScrollToSection()
  const { settings } = useSettings()

  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <button
            type="button"
            className="nav-logo"
            onClick={() => scrollTo('topo')}
            aria-label="Gael Designer, voltar ao topo"
          >
            <img src={logo} alt="Gael Designer" />
          </button>
          <span>© {new Date().getFullYear()} Gael Designer · Gael Cardoso</span>
        </div>
        <span>
          <a href={instagramUrl(settings.instagram)} target="_blank" rel="noreferrer">{settings.instagram}</a>
          {' · '}{settings.whatsapp}
        </span>
      </div>
    </footer>
  )
}

import logo from '../assets/images/logo.png'
import { useScrollToSection } from '../hooks/useScrollToSection'

export default function Footer() {
  const scrollTo = useScrollToSection()

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
          <a href="https://www.instagram.com/gael.designer/" target="_blank" rel="noreferrer">@gael.designer</a>
          {' · '}(91) 99915-1500
        </span>
      </div>
    </footer>
  )
}

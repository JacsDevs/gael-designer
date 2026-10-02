import { useState } from 'react'
import { FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa'

export default function Header() {
  const [open, setOpen] = useState(false)

  const handleClick = (id) => {
    const section = document.getElementById(id)
    section?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <header className="top-header">
      <div className="nav-container">

        {/* MENU DESKTOP */}
        <div className="nav-desktop">
          <nav className="nav-cont-desktop">
            <button onClick={() => handleClick('combos')}>Combos</button>
            <button onClick={() => handleClick('valoresind')}>Individuais</button>
            <button onClick={() => handleClick('confecamisas')}>Confecção Camisas</button>
            <button onClick={() => handleClick('infoimport')}>Informações</button>
          </nav>

          <div className="social-icons">
            
            <a
              href="https://www.instagram.com/gael.designer/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram - @gael.designer"
              className="instagram-link"
            >
              <FaInstagram />
              <span>@gael.designer</span>
            </a>
          </div>
        </div>

        <button
          className={`hamburger ocultarhamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MENU MOBILE */}
      <nav className={`nav-mobile ${open ? 'open' : ''}`}>
        <button onClick={() => handleClick('combos')}>Combos</button>
        <button onClick={() => handleClick('valoresind')}>Individuais</button>
        <button onClick={() => handleClick('confecamisas')}>Confecção Camisas</button>
        <button onClick={() => handleClick('infoimport')}>Informações</button>

        <div className="instamobile">
          <a
            href="https://www.instagram.com/gael.designer/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram - @gael.designer"
            className="instagram-link"
          >
            <FaInstagram />
            <span>@gael.designer</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
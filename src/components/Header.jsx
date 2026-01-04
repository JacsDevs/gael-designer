import logo from '../assets/images/logo.png';
import sublogo from '../assets/images/sublogo.png';

export default function Header() {
  return (
    <header>
      <img src={logo} alt="Logo" className="logo-img" />
      <img src={sublogo} alt="SubLogo" className="sublogo-img" />
      <p className="subtitle">
        Design Profissional para Identidade Visual e Eventos
      </p>
      <a
        href="https://wa.me/5591999151500"
        className="btn-order"
        target="_blank"
      >
        Falar no WhatsApp
      </a>
    </header>
  );
}


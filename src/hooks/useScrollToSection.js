import { useLocation, useNavigate } from 'react-router-dom'

// O site usa HashRouter, então links "#secao" quebrariam a rota:
// a rolagem é feita via JS (ou navegando para a home com a seção no state).
export function useScrollToSection() {
  const location = useLocation()
  const navigate = useNavigate()

  return (id) => {
    if (location.pathname === '/') {
      if (id === 'topo') window.scrollTo({ top: 0, behavior: 'smooth' })
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }
}

import { useEffect, useState } from 'react'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'
import { getPackages } from '../services/packagesService'
import logo from '../assets/images/logo.png';
import sublogo from '../assets/images/sublogo.png';
import gael from '../assets/images/gael.png'

export default function Home() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPackages() {
      try {
        const data = await getPackages()
        setPackages(data)
      } catch (error) {
        console.error('Erro ao buscar combos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPackages()
  }, [])

  return (
    <>
      {/* Seção de Boas-Vindas */}
      <div className="welcome-section">
        <div className="row-content">
          <div className='group-content'>
            <div className="welcome-left">
              <img src={logo} alt="Logo" className="logo-img" />
              <img src={sublogo} alt="Sublogo" className="sublogo-img" />
              <p className="subtitle">Design Profissional para Identidade Visual e Eventos</p>
              <button className="btn-call-to-action">Falar no WhatsApp</button>
            </div>
            <div className="welcome-right">
              <img src={gael} alt="Gael" className="welcome-image" />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <h2 className="section-title">Nossos Combos Promocionais</h2>

        {loading && <p>Carregando combos...</p>}

        <div className="packages-grid">
          {packages.map(pkg => (
            <PackageCard
              key={pkg.id}
              id={pkg.id}
              title={pkg.title}
              subtitle={pkg.subtitle}
              price={pkg.price}
            />
          ))}
        </div>

        <div className="info-box">
          <h2>Políticas e Prazos</h2>
          <ul>
            <li><strong>Início da Produção:</strong> Apenas após confirmação de 50% do pagamento.</li>
            <li><strong>Prazo de Entrega:</strong> Aproximadamente 7 dias úteis (dependendo da complexidade).</li>
            <li><strong>Envio Final:</strong> O material é enviado após a quitação do valor total.</li>
            <li><strong>Qualidade:</strong> Cada arte exige pesquisa e dedicação exclusiva.</li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  )
}

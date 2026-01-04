import { useEffect, useState } from 'react'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'
import { getPackages } from '../services/packagesService'
import desktopImage from '../assets/images/desktop-image.jpg';
import mobileImage from '../assets/images/mobile-image.jpg';

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
      {/* Seção de Boas-Vindas com imagens adaptativas */}
      <div className="welcome-section">
        <div className="image-container">
          {/* Imagem desktop (16:9) */}
          <img src={desktopImage} alt="Imagem de Apresentação - Desktop" className="image-desktop" />
          {/* Imagem mobile */}
          <img src={mobileImage} alt="Imagem de Apresentação - Mobile" className="image-mobile" />
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

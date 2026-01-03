import Header from '../components/Header'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Header />

      <div className="container">
        <h2 className="section-title">Nossos Combos Promocionais</h2>

        <div className="packages-grid">
          <PackageCard
            title="Combo 01"
            description="Logo Principal + Sublogo + Marca d'água"
            price="R$ 150"
            link="https://wa.me/5591999151500?text=Olá! Tenho interesse no Combo 01"
          />

          <PackageCard
            title="Combo 03"
            description="Projeto da Camisa + Pacote de Logo"
            price="R$ 270"
            link="https://wa.me/5591999151500?text=Olá! Tenho interesse no Combo 03"
          />
          {/* Continue os outros */}
        </div>

        <div className="info-box">
          <h2>Políticas e Prazos</h2>
          <ul>
            <li><strong>Início:</strong> 50% do pagamento.</li>
            <li><strong>Prazo:</strong> 7 dias úteis.</li>
            <li><strong>Envio:</strong> Após quitação.</li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  )
}

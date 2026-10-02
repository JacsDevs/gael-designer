import { useEffect, useState } from 'react'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'
import { getPackages } from '../services/packagesService'
import desktopImage from '../assets/images/desktop-image.jpg';
import mobileImage from '../assets/images/mobile-image.jpg';
import camisa from '../assets/images/camisa.jpeg';
import WhatsAppButton from '../components/WhatsAppButton'
import Header from '../components/Header'

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
    <Header />
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
        <section id="combos" className='section-container'>
          <h2 className="section-title">Combos Promocionais</h2>

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
        </section>

        <section id="valoresind" className='section-container'>
          <h2 className="section-title">Valores Individuais</h2>

          <div className="info-box">
            <h2>Faça seu orçamento para produção de material individual</h2>
            <ul>
              <li><strong>Logotipos –</strong> Apartir de R$100</li>
              <li><strong>Projeto de camisas –</strong> A partir de R$ 150</li>
              <li><strong>Banners –</strong> Verificar medidas para orçamento</li>
              <li><strong>Identidade visual –</strong> Verificar itens para orçamento</li>
              <li><strong>Folhetos e panfletos digitais –</strong> Apartir de R$ 40 </li>
              <li><strong>Flyers temáticos –</strong> R$ 70</li>
              <li><strong>Materiais de marketing –</strong> Verificar itens para orçamento</li>
              <li><strong>Catálogos –</strong> Verificar itens e número de folhas para orçamento</li>
              <li><strong>Convites interativos e digitais –</strong> Apartir de R$ 100</li>
              <li><strong>Convite virtual com música de fundo –</strong> R$ 150</li>
              <li><strong>Bandeiras –</strong> Verificar medidas para orçamento</li>
              <li><strong>Abadás (regata) –</strong> A partir de R$ 120</li>
              <li><strong>Vídeo de divulgação do tema (60s) –</strong> R$100</li>
              <li><strong>Vídeo de divulgação do tema (60s) –</strong> R$100</li>
              <li><strong>Faça seu orçamento para confecção de camisa</strong></li>
            </ul>
            <div className='button-content'>
              <h2>Para outros materiais, entre em contato via WhatsApp para orçamento.</h2>
              <a
                href={'https://wa.me/5591999151500?text=Olá! Gostaria de saber mais sobre os valores individuais'}
                target="_blank"
                rel="noreferrer"
                className="btn-order btn-highlight"
                >Entrar em contato pelo WhatsApp
              </a>
            </div>
          </div>
        </section>
          
        <section id="confecamisas" className='section-container'>
          <h2 className="section-title">Confecção de Camisas</h2>

          <div className="info-box">
            <div className="info-content">
              <div className="info-text">
                <h2>Trabalhamos com confecção de camisas de alta qualidade</h2>
                <ul>
                  <li><strong>Materiais –</strong> Elanca ou Dry Fit</li>
                  <li><strong>Modelagem –</strong> Masculina, feminina e infantil</li>
                  <li><strong>Tamanhos –</strong> 2 anos ao XGG</li>
                  <li>Ótimo custo-benefício</li>
                  <li>Entrega rápida e segura</li>
                </ul>
                <div className='button-content'>
                  <h2>Para mais informações entre em contato</h2>
                  <a
                    href={'https://wa.me/5591999151500?text=Olá! Tenho interesse em confeccionar camisas'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-order btn-highlight"
                    >Entrar em contato pelo WhatsApp
                  </a>
                </div>
              </div>
              <div className="info-image">
                <img src={camisa} alt="Confecção de camisas" />
              </div>
            </div>
          </div>
        </section>
        
        <section id="infoimport" className='section-container'>
          <h2 className="section-title">Detalhes de Pagamento, Entrega e Condições do Serviço</h2>
          <div className="info-box texth2">
            <p>Prezado(a) Cliente,</p>
            <p>Para dar início à produção da sua arte, é necessária a confirmação do pagamento de 50% do valor total, via Pix.</p>
            <h2>Informações Importantes</h2>
            <ul>
              <li><strong>Início da Produção:</strong> Apenas após confirmação de 50% do pagamento.</li>
              <li><strong>Prazo de Entrega:</strong> Aproximadamente 10 dias úteis (dependendo da complexidade).</li>
              <li><strong>Planilha de Produção:</strong> Após a confirmação do pagamento, o pedido será incluído na planilha de produção, respeitando rigorosamente a ordem de entrada.</li>
              <li><strong>Envio de Informações (OBRIGATÓRIO):</strong> Todas as descrições, orientações, referências, textos e especificações do projeto devem ser enviadas exclusivamente por escrito. O envio por escrito é indispensável para evitar divergências, retrabalhos e garantir fidelidade total ao material solicitado.</li>
            </ul>
            <h2>Sobre a Arte Contratada</h2>
            <ul>
              <li>O valor acordado refere-se exclusivamente à arte estática final.</li>
              <li>Após a entrega do material final, eventuais solicitações de ajustes ou modificações adicionais estarão sujeitas à cobrança de R$ 25,00 (vinte e cinco reais) por alteração.</li>
              <li><strong>Arquivo editável (PSD):</strong> Não está incluso no valor da arte estática. Caso haja interesse, será aplicado valor adicional a partir de R$ 150,00, podendo variar conforme a complexidade do arquivo, organização das camadas e tempo técnico necessário.</li>
              <li>Todo o material é desenvolvido exclusivamente no Adobe Photoshop.</li>
              <li>O material final será disponibilizado somente após a quitação integral (100%) do valor contratado, sem exceções.</li>
              <li>As artes de camisas serão entregues em JPG, no padrão, qualidade e tamanho adequados para impressão, e as logomarcas em PNG (sem fundo).</li>
              <li>Ao realizar o pagamento inicial e encaminhar as informações necessárias por escrito, entende-se que todas as condições acima foram lidas, compreendidas e aceitas, passando a reger a execução do serviço.</li>
              <p>Atenciosamente,</p>
              <p>Gael Cardoso - Designer</p>
            </ul>
          </div>
        </section>
      </div>

      <WhatsAppButton />
      <Footer />
    </>
  )
}

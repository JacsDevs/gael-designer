import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import { useScrollToSection } from '../hooks/useScrollToSection'
import Footer from '../components/Footer'
import Ticker from '../components/Ticker'
import ComboCard from '../components/ComboCard'
import WhatsAppButton from '../components/WhatsAppButton'
import { InstagramIcon, ChatIcon } from '../components/Icons'
import { getPackages } from '../services/packagesService'
import { toCombo, withTags, waLink } from '../utils/combos'
import desktopImage from '../assets/images/desktop-image.jpg'
import mobileImage from '../assets/images/mobile-image.jpg'
import camisa from '../assets/images/camisa.jpeg'
import workCamisa from '../assets/combos/combo-04/02.webp'
import workFlyer from '../assets/combos/combo-04/03.webp'
import workLogo from '../assets/combos/combo-04/04.webp'

const BUDGETS = [
  { id: 'all', label: 'Todos', min: 0, max: Infinity },
  { id: 'b1', label: 'Até R$ 200', min: 0, max: 200 },
  { id: 'b2', label: 'R$ 201 a R$ 270', min: 201, max: 270 },
  { id: 'b3', label: 'Acima de R$ 270', min: 271, max: Infinity },
]

const NEEDS = [
  { id: 'all', label: 'Tanto faz' },
  { id: 'logo', label: 'Logo' },
  { id: 'camisa', label: 'Camisa' },
  { id: 'abada', label: 'Abadá' },
  { id: 'flyer', label: 'Flyer' },
  { id: 'video', label: 'Vídeo' },
]

// Trabalhos reais (projeto Anarriê de São João). Para adicionar mais,
// importe a imagem e inclua um item com a categoria correspondente.
const TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'identidade', label: 'Identidade visual' },
  { id: 'vestuario', label: 'Camisas e abadás' },
  { id: 'divulgacao', label: 'Flyers e vídeos' },
  { id: 'convites', label: 'Convites' },
]

const WORKS = [
  { cat: 'vestuario', kind: 'Projeto de camisa', label: 'Anarriê de São João', note: 'No embalo do Pinduca', img: workCamisa },
  { cat: 'divulgacao', kind: 'Flyer temático', label: 'Anarriê de São João', note: 'No embalo do Pinduca', img: workFlyer },
  { cat: 'identidade', kind: 'Logotipo', label: 'Anarriê de São João', note: 'No embalo do Pinduca', img: workLogo },
]

const PRICES = [
  { name: 'Folhetos e panfletos digitais', from: true, value: 'R$ 40' },
  { name: 'Flyer temático', value: 'R$ 70' },
  { name: 'Logotipo', from: true, value: 'R$ 100' },
  { name: 'Vídeo de divulgação do tema (60s)', value: 'R$ 100' },
  { name: 'Convite interativo e digital', from: true, value: 'R$ 100' },
  { name: 'Abadá (regata)', from: true, value: 'R$ 120' },
  { name: 'Projeto de camisa', from: true, value: 'R$ 150' },
  { name: 'Convite virtual com música de fundo', value: 'R$ 150' },
]

const STEPS = [
  { title: 'Escolha e me chame', text: 'Um combo ou peças avulsas. O WhatsApp já abre com o seu pedido escrito.' },
  { title: 'Sinal de 50% via Pix', text: 'Com o pagamento confirmado, seu pedido entra na planilha de produção, por ordem de chegada.' },
  { title: 'Briefing por escrito', text: 'Tema, textos, referências e cores, sempre por mensagem escrita. É isso que evita retrabalho e garante a arte fiel ao pedido.' },
  { title: 'Arte pronta em ~10 dias úteis', text: 'O prazo varia com a complexidade. Quitados os 50% restantes, você recebe os arquivos finais.' },
]

const FAQ = [
  { q: 'Em que formato recebo os arquivos?', a: 'Artes de camisa em JPG, no padrão, tamanho e qualidade certos para impressão. Logomarcas em PNG, sem fundo.' },
  { q: 'Posso pedir alterações depois da entrega?', a: 'Pode. Depois da entrega do material final, cada ajuste ou modificação custa R$ 25.' },
  { q: 'O arquivo editável (PSD) vem junto?', a: 'Não. O valor contratado cobre a arte estática final. O PSD sai a partir de R$ 150, conforme a complexidade, a organização das camadas e o tempo técnico. Todo o material é feito no Adobe Photoshop.' },
  { q: 'Quando recebo o material final?', a: 'Somente após o pagamento de 100% do valor, sem exceções. Ao pagar o sinal e enviar as informações por escrito, você confirma que leu e aceita estas condições.' },
]

const TICKER = [
  'Identidade visual', 'Projeto de camisas', 'Abadás', 'Flyers temáticos',
  'Vídeo de divulgação', 'Convites digitais', 'Confecção de camisas',
]

const WA_GERAL = waLink('Olá, Gael! Vim pelo site e quero um orçamento.')
const WA_AVULSO = waLink('Olá, Gael! Quero orçamento de peça avulsa: [qual peça].')
const WA_CAMISA = waLink('Olá, Gael! Quero cotar confecção de camisas: [quantidade], [tecido], [tamanhos].')

function ChipGroup({ label, options, value, onChange, blue = false }) {
  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <div role="group" aria-label={label} className="chips">
        {options.map(o => (
          <button
            key={o.id}
            type="button"
            aria-pressed={o.id === value}
            className={`chip ${o.id === value ? 'is-on' : ''} ${blue ? 'chip-blue' : ''}`}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const [budget, setBudget] = useState('all')
  const [need, setNeed] = useState('all')
  const [tab, setTab] = useState('all')
  const location = useLocation()
  const scrollTo = useScrollToSection()

  useEffect(() => {
    getPackages()
      .then(data => setCombos(withTags(data.map(toCombo))))
      .catch(error => console.error('Erro ao buscar combos:', error))
      .finally(() => setLoading(false))
  }, [])

  // Vindo de outra página com uma seção alvo (ex.: "Voltar aos combos").
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target || loading) return
    requestAnimationFrame(() => {
      if (target === 'topo') window.scrollTo({ top: 0 })
      else document.getElementById(target)?.scrollIntoView()
    })
  }, [location.state, loading])

  const results = useMemo(() => {
    const b = BUDGETS.find(x => x.id === budget)
    return combos.filter(c => {
      const okB = budget === 'all' || (c.price != null && c.price >= b.min && c.price <= b.max)
      const okN = need === 'all' || c.keys.includes(need)
      return okB && okN
    })
  }, [combos, budget, need])

  const tabs = TABS.filter(t => t.id === 'all' || WORKS.some(w => w.cat === t.id))
  const works = WORKS.filter(w => tab === 'all' || w.cat === tab).slice(0, 4)

  return (
    <>
      <Header />

      <section id="topo" className="hero" aria-label="Boas-vindas">
        <img className="hero-d" src={desktopImage} alt="Gael Cardoso, designer gráfico, de braços cruzados ao lado do monograma GC" />
        <img className="hero-m" src={mobileImage} alt="Gael Cardoso, designer gráfico" />
      </section>

      <Ticker items={TICKER} />

      {/* COMBOS */}
      <section id="combos" className="wrap combos">
        <div className="section-head">
          <h2 className="section-title">combos<br /><span className="gold">promocionais</span></h2>
          <p className="lead">
            Cada combo mostra uma arte de exemplo. Toque na imagem para ver todas as peças do pacote,
            ou peça direto: o WhatsApp já abre com o combo escrito.
          </p>
        </div>

        <div className="filters">
          <ChipGroup label="Quanto quer investir?" options={BUDGETS} value={budget} onChange={setBudget} />
          <ChipGroup label="O que não pode faltar?" options={NEEDS} value={need} onChange={setNeed} blue />
        </div>

        {loading && <p className="lead">Carregando combos...</p>}

        <div className="combo-grid">
          {results.map(c => <ComboCard key={c.id} combo={c} />)}
        </div>

        {!loading && results.length === 0 && (
          <div className="empty-box">
            <p>Nenhum combo junta essa faixa de preço com essa peça. Dá para montar sob medida com os valores individuais.</p>
            <button type="button" className="btn btn-gold" onClick={() => scrollTo('avulsos')}>
              Ver valores individuais
            </button>
          </div>
        )}
      </section>

      {/* TRABALHOS */}
      <section id="trabalhos" className="works-section">
        <div className="wrap works-inner">
          <div className="section-head">
            <div className="works-head-text">
              <h2 className="section-title">trabalhos<br /><span className="gold">selecionados</span></h2>
              <p className="lead">
                Artes feitas para grupos, festas e eventos de verdade. Escolha um tipo de serviço e veja o
                nível de acabamento que chega até você.
              </p>
            </div>
            <div role="group" aria-label="Tipo de serviço" className="chips">
              {tabs.map(t => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={t.id === tab}
                  className={`chip ${t.id === tab ? 'is-on' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="works-grid">
            {works.map(w => (
              <figure className="work" key={w.kind}>
                <div className="wimg">
                  <img src={w.img} alt={`${w.kind} — ${w.label}`} loading="lazy" />
                  <span className="wkind">{w.kind}</span>
                </div>
                <figcaption>
                  <strong>{w.label}</strong>
                  <span>{w.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="works-foot">
            <p>Tem muito mais no Instagram, com bastidores e entregas recentes.</p>
            <a className="btn btn-line" href="https://www.instagram.com/gael.designer/" target="_blank" rel="noreferrer">
              <InstagramIcon />
              Ver mais em @gael.designer
            </a>
          </div>
        </div>
      </section>

      {/* VALORES INDIVIDUAIS */}
      <section id="avulsos" className="avulsos">
        <div className="wrap avulsos-inner">
          <div className="avulsos-intro">
            <h2 className="section-title">valores individuais</h2>
            <p className="lead">
              Peça avulsa também tem preço claro. O que depende de medida, quantidade ou número de páginas
              sai sob consulta, é só me mandar os detalhes.
            </p>
            <a className="btn btn-gold" href={WA_AVULSO} target="_blank" rel="noreferrer">Pedir orçamento avulso</a>
          </div>

          <ul className="price-list">
            {PRICES.map(p => (
              <li key={p.name}>
                <span className="name">{p.name}</span>
                <span className="dots" aria-hidden="true" />
                <span className="val">{p.from && <small>a partir de </small>}{p.value}</span>
              </li>
            ))}
            <li className="consult">
              <span className="eyebrow">Sob consulta</span>
              <span>
                Banners e bandeiras (conforme medidas) · Identidade visual completa · Catálogos (conforme nº de
                páginas) · Materiais de marketing
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* CONFECÇÃO DE CAMISAS */}
      <section id="camisas" className="camisas">
        <div className="wrap camisas-inner">
          <img src={camisa} alt="Camisas confeccionadas a partir de artes do Gael" loading="lazy" />
          <div className="camisas-text">
            <div>
              <h2 className="section-title">confecção de<br />camisas</h2>
              <p>
                Além de criar o projeto, cuido da confecção: a mesma arte que você aprovou, impressa com
                qualidade, ótimo custo-benefício e entrega rápida e segura.
              </p>
            </div>
            <div className="specs">
              <div className="spec"><span className="eyebrow">Tecido</span><span className="display">Elanca ou Dry Fit</span></div>
              <div className="spec"><span className="eyebrow">Modelagem</span><span className="display">Masc · Fem · Infantil</span></div>
              <div className="spec"><span className="eyebrow">Tamanhos</span><span className="display">2 anos ao XGG</span></div>
            </div>
            <a className="btn btn-gold" href={WA_CAMISA} target="_blank" rel="noreferrer">Cotar confecção no WhatsApp</a>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="wrap como">
        <h2 className="section-title">Como funciona</h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`step ${i === STEPS.length - 1 ? 'highlight' : ''}`}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>

        <div className="faq">
          {FAQ.map(f => (
            <details key={f.q}>
              <summary>{f.q}<span className="plus" aria-hidden="true">+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="wrap cta">
        <div className="cta-box">
          <div className="cta-text">
            <h2>Seu próximo projeto começa com uma mensagem.</h2>
            <p>Conte o que você precisa e eu respondo com o melhor caminho, combo ou sob medida.</p>
          </div>
          <a className="btn btn-dark" href={WA_GERAL} target="_blank" rel="noreferrer">
            <ChatIcon />
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton href={WA_GERAL} />
    </>
  )
}

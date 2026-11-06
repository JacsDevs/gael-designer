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
import { DEFAULT_WORKS, HOME_WORKS_LIMIT, WORK_CATEGORIES, getWorks } from '../services/siteService'
import { useSettings } from '../hooks/useSettings'
import { toCombo, withTags, waLink, instagramUrl } from '../utils/combos'
import { getWorkImage } from '../utils/workImages'
import desktopImage from '../assets/images/desktop-image.jpg'
import mobileImage from '../assets/images/mobile-image.jpg'
import camisa from '../assets/images/camisa.jpeg'

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

const TABS = [{ id: 'all', label: 'Todos' }, ...WORK_CATEGORIES]

// Textos que dependem das Configurações do painel (sinal, prazo, valores).
function buildSteps(cfg) {
  const rest = 100 - Number(cfg.sinal || 50)
  return [
    { title: 'Escolha e me chame', text: 'Um combo ou peças avulsas. O WhatsApp já abre com o seu pedido escrito.' },
    { title: `Sinal de ${cfg.sinal}% via Pix`, text: 'Com o pagamento confirmado, seu pedido entra na planilha de produção, por ordem de chegada.' },
    { title: 'Briefing por escrito', text: 'Tema, textos, referências e cores, sempre por mensagem escrita. É isso que evita retrabalho e garante a arte fiel ao pedido.' },
    { title: `Arte pronta em ~${cfg.prazo} dias úteis`, text: `O prazo varia com a complexidade. Quitados os ${rest}% restantes, você recebe os arquivos finais.` },
  ]
}

function buildFaq(cfg) {
  return [
    { q: 'Em que formato recebo os arquivos?', a: 'Artes de camisa em JPG, no padrão, tamanho e qualidade certos para impressão. Logomarcas em PNG, sem fundo.' },
    { q: 'Posso pedir alterações depois da entrega?', a: `Pode. Depois da entrega do material final, cada ajuste ou modificação custa R$ ${cfg.alteracao}.` },
    { q: 'O arquivo editável (PSD) vem junto?', a: `Não. O valor contratado cobre a arte estática final. O PSD sai a partir de R$ ${cfg.psd}, conforme a complexidade, a organização das camadas e o tempo técnico. Todo o material é feito no Adobe Photoshop.` },
    { q: 'Quando recebo o material final?', a: 'Somente após o pagamento de 100% do valor, sem exceções. Ao pagar o sinal e enviar as informações por escrito, você confirma que leu e aceita estas condições.' },
  ]
}

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
  const { settings: cfg } = useSettings()
  const [packages, setPackages] = useState([])
  const [workDocs, setWorkDocs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [budget, setBudget] = useState('all')
  const [need, setNeed] = useState('all')
  const [tab, setTab] = useState('all')
  const location = useLocation()
  const scrollTo = useScrollToSection()

  useEffect(() => {
    getPackages()
      .then(setPackages)
      .catch(error => console.error('Erro ao buscar combos:', error))
      .finally(() => setLoading(false))

    getWorks()
      .then(setWorkDocs)
      .catch(error => {
        console.error('Erro ao buscar trabalhos:', error)
        setWorkDocs([])
      })
  }, [])

  const combos = useMemo(
    () => withTags(packages.map(p => toCombo(p, cfg))),
    [packages, cfg]
  )

  // Coleção vazia (ou ainda não criada) -> trabalhos padrão.
  const homeWorks = useMemo(() => {
    const source = workDocs && workDocs.length ? workDocs : DEFAULT_WORKS
    return source
      .filter(w => w.home !== false)
      .map(w => ({ ...w, img: getWorkImage(w.image) }))
      .filter(w => w.img)
      .slice(0, HOME_WORKS_LIMIT)
  }, [workDocs])

  const waGeral = waLink(cfg.waMsg, cfg.whatsapp)
  const waAvulso = waLink('Olá, Gael! Quero orçamento de peça avulsa: [qual peça].', cfg.whatsapp)
  const waCamisa = waLink('Olá, Gael! Quero cotar confecção de camisas: [quantidade], [tecido], [tamanhos].', cfg.whatsapp)
  const steps = buildSteps(cfg)
  const faq = buildFaq(cfg)

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

  const tabs = TABS.filter(t => t.id === 'all' || homeWorks.some(w => w.cat === t.id))
  const works = homeWorks.filter(w => tab === 'all' || w.cat === tab)

  return (
    <>
      <Header />

      <section id="topo" className="hero" aria-label="Boas-vindas">
        <img className="hero-d" src={desktopImage} alt="Gael Cardoso, designer gráfico, de braços cruzados ao lado do monograma GC" />
        <img className="hero-m" src={mobileImage} alt="Gael Cardoso, designer gráfico" />
      </section>

      <Ticker items={cfg.fita} />

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
              <figure className="work" key={w.id}>
                <div className="wimg">
                  <img src={w.img} alt={`${w.kind} — ${w.client}`} loading="lazy" />
                  <span className="wkind">{w.kind}</span>
                </div>
                <figcaption>
                  <strong>{w.client}</strong>
                  <span>{w.event}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="works-foot">
            <p>Tem muito mais no Instagram, com bastidores e entregas recentes.</p>
            <a className="btn btn-line" href={instagramUrl(cfg.instagram)} target="_blank" rel="noreferrer">
              <InstagramIcon />
              Ver mais em {cfg.instagram}
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
            <a className="btn btn-gold" href={waAvulso} target="_blank" rel="noreferrer">Pedir orçamento avulso</a>
          </div>

          <ul className="price-list">
            {cfg.prices.filter(p => p.name).map((p, i) => (
              <li key={`${p.name}-${i}`}>
                <span className="name">{p.name}</span>
                <span className="dots" aria-hidden="true" />
                <span className="val">{p.from && <small>a partir de </small>}R$ {p.price}</span>
              </li>
            ))}
            {cfg.consult.length > 0 && (
              <li className="consult">
                <span className="eyebrow">Sob consulta</span>
                <span>{cfg.consult.join(' · ')}</span>
              </li>
            )}
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
              <div className="spec"><span className="eyebrow">Tecido</span><span className="display">{cfg.tecido}</span></div>
              <div className="spec"><span className="eyebrow">Modelagem</span><span className="display">{cfg.modelagem}</span></div>
              <div className="spec"><span className="eyebrow">Tamanhos</span><span className="display">{cfg.tamanhos}</span></div>
            </div>
            <a className="btn btn-gold" href={waCamisa} target="_blank" rel="noreferrer">Cotar confecção no WhatsApp</a>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="wrap como">
        <h2 className="section-title">Como funciona</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className={`step ${i === steps.length - 1 ? 'highlight' : ''}`}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>

        <div className="faq">
          {faq.map(f => (
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
          <a className="btn btn-dark" href={waGeral} target="_blank" rel="noreferrer">
            <ChatIcon />
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton href={waGeral} />
    </>
  )
}

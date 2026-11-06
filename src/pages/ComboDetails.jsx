import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { getPackages } from '../services/packagesService'
import Header from '../components/Header'
import { useScrollToSection } from '../hooks/useScrollToSection'
import Footer from '../components/Footer'
import Ticker from '../components/Ticker'
import WhatsAppButton from '../components/WhatsAppButton'
import { ComboCover } from '../components/ComboCard'
import {
  ArrowLeftIcon, ChatIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon,
} from '../components/Icons'
import { toCombo, waLink } from '../utils/combos'

function formatBRL(value) {
  return Number.isInteger(value) ? `R$ ${value}` : `R$ ${value.toFixed(2).replace('.', ',')}`
}

// A key por id remonta a página ao trocar de combo (estado zerado).
export default function ComboDetailsPage() {
  const { id } = useParams()
  return <ComboDetails key={id} id={id} />
}

function ComboDetails({ id }) {
  const [combo, setCombo] = useState(null)
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const touchStartX = useRef(0)
  const scrollTo = useScrollToSection()

  useEffect(() => {
    let alive = true
    window.scrollTo({ top: 0 })

    getDoc(doc(db, 'packages', id))
      .then(snapshot => {
        if (!alive) return
        setCombo(snapshot.exists() ? toCombo({ id: snapshot.id, ...snapshot.data() }) : null)
      })
      .catch(error => console.error('Erro ao buscar combo:', error))
      .finally(() => alive && setLoading(false))

    return () => { alive = false }
  }, [id])

  useEffect(() => {
    getPackages()
      .then(data => setAll(data.map(toCombo)))
      .catch(error => console.error('Erro ao buscar combos:', error))
  }, [])

  // Combos com preço mais próximo do atual.
  const related = useMemo(() => {
    if (!combo) return []
    return all
      .filter(c => c.id !== combo.id)
      .sort((a, b) => Math.abs((a.price ?? 0) - (combo.price ?? 0)) - Math.abs((b.price ?? 0) - (combo.price ?? 0)))
      .slice(0, 3)
  }, [all, combo])

  if (loading) {
    return (
      <>
        <Header />
        <p className="page-status">Carregando...</p>
      </>
    )
  }

  if (!combo) {
    return (
      <>
        <Header />
        <div className="page-status">
          <p>Combo não encontrado.</p>
          <p style={{ marginTop: 20 }}><Link to="/">Voltar ao início</Link></p>
        </div>
        <Footer />
      </>
    )
  }

  const { n, name, items, price, description, media, wa } = combo
  const active = media[current]
  const total = media.length

  const next = () => setCurrent((current + 1) % total)
  const prev = () => setCurrent((current - 1 + total) % total)

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (delta > 50) next()
    if (delta < -50) prev()
  }

  // Título em duas linhas: a última parte ("+ Flyer") fica dourada.
  const plusAt = name.lastIndexOf('+')
  const titleMain = plusAt > 0 ? name.slice(0, plusAt).trim() : name
  const titleGold = plusAt > 0 ? name.slice(plusAt).trim() : ''

  const half = price != null ? price / 2 : null

  return (
    <>
      <Header />

      <main className="wrap detail">
        <nav className="crumbs" aria-label="Você está em">
          <a href="#/" onClick={e => { e.preventDefault(); scrollTo('combos') }}>
            <ArrowLeftIcon />
            Voltar aos combos
          </a>
          <span aria-hidden="true">/</span>
          <span>Combo {n}</span>
        </nav>

        <div className="detail-grid">
          {/* GALERIA */}
          <section className="gallery" aria-label="Imagens do combo">
            <div className="gallery-main" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {active ? (
                <button
                  type="button"
                  className="media"
                  onClick={() => setFullscreen(true)}
                  aria-label="Ampliar"
                  key={active.url}
                >
                  {active.type === 'image'
                    ? <img src={active.url} alt={`Combo ${n}: imagem ${current + 1} de ${total}`} />
                    : <video src={active.url} autoPlay muted loop playsInline />}
                </button>
              ) : (
                <div className="cimg-empty">{n}</div>
              )}

              {total > 1 && (
                <>
                  <span className="pos-badge">{current + 1} / {total}</span>
                  <button type="button" className="gnav prev" onClick={prev} aria-label="Imagem anterior">
                    <ChevronLeftIcon />
                  </button>
                  <button type="button" className="gnav next" onClick={next} aria-label="Próxima imagem">
                    <ChevronRightIcon />
                  </button>
                </>
              )}
            </div>

            {total > 1 && (
              <div className="thumbs">
                {media.map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`thumb ${i === current ? 'active' : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Ver ${m.type === 'video' ? 'vídeo' : 'imagem'} ${i + 1}`}
                    aria-pressed={i === current}
                  >
                    {m.type === 'image'
                      ? <img src={m.url} alt="" loading="lazy" />
                      : (
                        <>
                          <video src={m.url} muted playsInline preload="metadata" />
                          <span className="play"><PlayIcon /></span>
                        </>
                      )}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* INFORMAÇÕES */}
          <section className="info" aria-labelledby="combo-titulo">
            <div className="info-head">
              <span className="cnum">COMBO {n}</span>
              <h1 id="combo-titulo">
                {titleMain}
                {titleGold && <><br /><span className="gold">{titleGold}</span></>}
              </h1>
              {description && <p>{description}</p>}
            </div>

            {items.length > 0 && (
              <div className="includes">
                <h2 className="eyebrow">O que vem no combo</h2>
                <ul>
                  {items.map(it => (
                    <li key={it}>
                      <CheckIcon width={2.8} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {price != null && (
              <div className="buy-row">
                <div>
                  <span className="eyebrow">Preço fechado</span>
                  <div className="big-price">
                    <span className="cur">R$</span>
                    <span className="val">{price}</span>
                  </div>
                </div>
                <div className="pay-split">
                  <span><strong>{formatBRL(half)}</strong> de sinal via Pix para começar</span>
                  <span><strong>{formatBRL(half)}</strong> na entrega dos arquivos</span>
                </div>
              </div>
            )}

            <div className="buy-actions">
              <a className="btn btn-gold" href={wa} target="_blank" rel="noreferrer">
                <ChatIcon />
                Quero o Combo {n}
              </a>
              <a
                className="btn btn-line"
                href={waLink(`Olá, Gael! Tenho uma dúvida sobre o COMBO ${n}: `)}
                target="_blank"
                rel="noreferrer"
              >
                Tirar uma dúvida
              </a>
            </div>

            <ul className="facts">
              <li><span className="display">~10 dias úteis</span><span>após o sinal e o briefing</span></li>
              <li><span className="display">Por escrito</span><span>tema, textos e referências</span></li>
              <li><span className="display">R$ 25</span><span>por alteração após a entrega</span></li>
            </ul>
          </section>
        </div>
      </main>

      <Ticker items={[...items, 'Tudo no mesmo tema']} small />

      {related.length > 0 && (
        <section className="wrap related" aria-labelledby="outros-titulo">
          <div className="section-head">
            <h2 id="outros-titulo" className="section-title">
              Quer comparar?<br /><span className="gold">Veja combos parecidos</span>
            </h2>
            <button type="button" className="btn btn-line" onClick={() => scrollTo('combos')}>
              Ver todos os {all.length} combos
            </button>
          </div>
          <div className="related-grid">
            {related.map(r => (
              <Link key={r.id} className="rcard" to={`/combo/${r.id}`}>
                <div className="cimg"><ComboCover combo={r} /></div>
                <div className="rcard-body">
                  <span className="cnum">COMBO {r.n}</span>
                  <strong>{r.name}</strong>
                  <span className="items">{r.items.join(' + ')}</span>
                  {r.price != null && <span className="price">R$ {r.price}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="wrap cta" style={{ paddingTop: 32 }}>
        <div className="cta-box">
          <div className="cta-text">
            <h2>Não achou o combo ideal?</h2>
            <p>Me conte o que você precisa e eu monto um pacote sob medida com os valores individuais.</p>
          </div>
          <a
            className="btn btn-dark"
            href={waLink('Olá, Gael! Quero montar um pacote sob medida com: [peças].')}
            target="_blank"
            rel="noreferrer"
          >
            <ChatIcon />
            Montar sob medida
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton href={wa} />

      {fullscreen && active && (
        <div className="fullscreen" onClick={() => setFullscreen(false)} role="dialog" aria-label="Imagem ampliada">
          {active.type === 'image'
            ? <img src={active.url} alt="" />
            : <video src={active.url} controls autoPlay />}
        </div>
      )}
    </>
  )
}

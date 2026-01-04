import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { db } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function ComboDetails() {
  const { id } = useParams()
  const [combo, setCombo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const touchStartX = useRef(0)

  useEffect(() => {
    async function loadCombo() {
      const ref = doc(db, 'packages', id)
      const snapshot = await getDoc(ref)

      if (snapshot.exists()) {
        const data = snapshot.data()
        data.media?.sort((a, b) => a.order - b.order)
        setCombo(data)
      }
      setLoading(false)
    }

    loadCombo()
  }, [id])

  if (loading) return <p style={{ padding: 40 }}>Carregando...</p>
  if (!combo) return <p style={{ padding: 40 }}>Combo não encontrado</p>

  const media = combo.media || []
  const active = media[current]

  function next() {
    setCurrent((current + 1) % media.length)
  }

  function prev() {
    setCurrent((current - 1 + media.length) % media.length)
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e) {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (delta > 50) next()
    if (delta < -50) prev()
  }

  return (
    <>
      <div className="container combo-layout">
        <Link to="/" className="btn-back">← Voltar</Link>

        <div className="combo-grid">
          {/* GALERIA */}
          <div className="combo-gallery">
            <div
              className="gallery-main"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <button className="nav left" onClick={prev}>‹</button>

              <div
                className="media-frame fade"
                onClick={() => setFullscreen(true)}
                key={active?.url}
              >
                {active?.type === 'image' ? (
                  <img src={active.url} alt="" />
                ) : (
                  <video src={active.url} />
                )}
              </div>

              <button className="nav right" onClick={next}>›</button>

              <div className="indicator">
                {current + 1} / {media.length}
              </div>
            </div>

            {/* MINIATURAS */}
            <div className="thumbnails">
              {media.map((m, i) => (
                <div
                  key={i}
                  className={`thumb ${i === current ? 'active' : ''}`}
                  onClick={() => setCurrent(i)}
                >
                  {m.type === 'image' ? (
                    <img src={m.url} />
                  ) : (
                    <video src={m.url} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="combo-info-card">
            <h2 className="combo-title">{combo.title}</h2>

            {combo.subtitle && (
              <p className="combo-subtitle">{combo.subtitle}</p>
            )}

            <p className="combo-description">{combo.description}</p>

            <div className="combo-price">{combo.price}</div>

            <a
              href={combo.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="btn-order btn-highlight"
            >
              Pedir agora no WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* FULLSCREEN */}
      {fullscreen && (
        <div className="fullscreen" onClick={() => setFullscreen(false)}>
          {active.type === 'image' ? (
            <img src={active.url} />
          ) : (
            <video src={active.url} controls autoPlay />
          )}
        </div>
      )}

      <Footer />
    </>
  )
}

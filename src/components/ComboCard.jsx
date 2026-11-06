import { Link } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, ImageIcon } from './Icons'

export function ComboCover({ combo }) {
  const { cover, n } = combo
  if (!cover) return <div className="cimg-empty">{n || '—'}</div>
  if (cover.type === 'video') {
    return <video src={cover.url} muted playsInline preload="metadata" />
  }
  return <img src={cover.url} alt={`Arte de exemplo do combo ${n}`} loading="lazy" />
}

export default function ComboCard({ combo }) {
  const { id, n, name, items, price, tag, wa, media } = combo

  return (
    <article className="ccard">
      <Link className="cimg" to={`/combo/${id}`} aria-label={`Ver as imagens do combo ${n}`}>
        <ComboCover combo={combo} />
        <span className="cimg-badge">
          <ImageIcon />
          {media.length > 1 ? `Ver ${media.length} imagens` : 'Ver detalhes'}
        </span>
      </Link>

      <div className="cbody">
        <div className="ctop">
          <span className="cnum">COMBO {n}</span>
          {tag && <span className="tag">{tag}</span>}
        </div>
        <h3 className="ctitle">{name}</h3>
        <ul className="checks">
          {items.map(it => (
            <li key={it}>
              <CheckIcon />
              {it}
            </li>
          ))}
        </ul>
        <div className="cfoot">
          {price != null && (
            <div className="cprice">
              <span className="cur">R$</span>
              <span className="val">{price}</span>
            </div>
          )}
          <a
            className="btn btn-gold"
            href={wa}
            target="_blank"
            rel="noreferrer"
            aria-label={`Quero o combo ${n} pelo WhatsApp`}
          >
            Quero esse
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </article>
  )
}

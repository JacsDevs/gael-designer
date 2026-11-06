export default function Ticker({ items, small = false }) {
  // A faixa é repetida duas vezes para o loop de -50% ficar contínuo.
  const run = (prefix) =>
    items.flatMap((item, i) => [
      <span key={`${prefix}t${i}`}>{item}</span>,
      <span key={`${prefix}s${i}`} className="star">✦</span>,
    ])

  return (
    <div className={`ticker ${small ? 'small' : ''}`} aria-hidden="true">
      <div className="ticker-track">
        {run('a')}
        {run('b')}
      </div>
    </div>
  )
}

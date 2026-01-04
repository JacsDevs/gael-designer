import { Link } from 'react-router-dom'

export default function PackageCard({ id, title, subtitle, price }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <span className="price">{price}</span>
      <Link to={`/combo/${id}`} className="btn-order">
        Saber mais
      </Link>
    </div>
  )
}

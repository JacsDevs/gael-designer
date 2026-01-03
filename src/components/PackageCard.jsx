export default function PackageCard({ title, description, price, link }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="price">{price}</span>
      <a href={link} className="btn-order" target="_blank">
        Pedir Agora
      </a>
    </div>
  )
}

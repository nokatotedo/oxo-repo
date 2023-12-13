import { Link } from 'react-router-dom'
import './Card.css'

export default function Card({ lodging }) {
  return (
    <div className="card">
      <img src={lodging.imgUrl} alt={lodging.name} />
      <div className="details">
        <h2>{lodging.name}</h2>
        <Link to={`/lodgings/${lodging.id}`} className="btn-details">
          <h5>Details</h5>
        </Link>
      </div>
    </div>
  )
}
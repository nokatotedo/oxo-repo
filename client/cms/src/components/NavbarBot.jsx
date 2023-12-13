import { Link } from 'react-router-dom'
import './NavbarBot.css'

export default function NavbarBot() {
  return (
    <div id="nav-bot">
      <ul>
        <li><Link to="/lodgings" id="btn-lodgings">Lodgings</Link></li>
        <li><Link to="/types" id="btn-types">Types</Link></li>
        <li><Link to="/register" id='btn-register'>Register</Link></li>
      </ul>
    </div>
  )
}
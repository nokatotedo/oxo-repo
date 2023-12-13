import { Link } from 'react-router-dom'
import './NavbarTop.css'

export default function NavbarTop() {
  return (
    <nav>
      <div id="nav-top">
        <div id="logo"><Link to="/">OXO</Link></div>
      </div>
    </nav>
  )
}
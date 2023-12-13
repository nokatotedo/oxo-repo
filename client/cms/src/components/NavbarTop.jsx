import { Link } from 'react-router-dom'
import './NavbarTop.css'

/* eslint-disable react/prop-types */
export default function NavbarTop({ notLogin }) {
  return (
    <div id="nav-top">
      <div id="logo"><Link to="/">OXO</Link></div>
      {notLogin && <div id="user">
        <Link to="/" onClick={() => {
          localStorage.removeItem("access_token")
        }}>
          <div id="user-icon"><i className="fa-regular fa-user"></i></div>
          <p>Logout</p>
        </Link>
      </div>}
    </div>
  )
}
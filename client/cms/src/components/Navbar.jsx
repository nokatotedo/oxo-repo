import './Navbar.css'
import NavbarBot from "./NavbarBot";
import NavbarTop from "./NavbarTop";

/* eslint-disable react/prop-types */
export default function Navbar({ notLogin=true }) {
  return (
    <nav>
      <NavbarTop notLogin={notLogin}/>
      {notLogin && <NavbarBot />}
    </nav>
  )
}
import './App.css'
import NavbarTop from './components/NavbarTop'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <NavbarTop />
      <Outlet />
      <Footer />
    </>
  )
}

export default App

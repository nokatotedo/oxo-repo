import { Outlet } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

function App() {
  const [notif, setNotif] = useState(null)

  useEffect(() => {
    if(notif) {
      switch(notif.type) {
        case "error": {
          toast.error(notif.message)
          break
        }
        case "success": {
          toast.success(notif.message)
          break
        }
      }

      setNotif(null)
    }
  }, [notif])
  
  return (
    <>
      <ToastContainer />
      <Outlet context={[setNotif, notif]}/>
      <Footer />
    </>
  )
}

export default App

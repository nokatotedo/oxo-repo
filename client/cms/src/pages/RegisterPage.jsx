import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { getValueForm } from "../helpers/getValueForm";
import './RegisterPage.css'
import axios from 'axios'
import { useNavigate, useOutletContext } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate()
  const [setNotif] = useOutletContext()

  async function register(value) {
    try {
      await axios({
        method: "POST",
        url: "https://oxo-server.nokatotedo.my.id/register",
        data: value,
        headers: {
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })
      
      navigate('/')
      setNotif({
        type: "success",
        message: "Successfully created user"
      })
    } catch (error) {
      setNotif({
        type: "error",
        message: error.response.data.message
      })
    }
  }
  return (
    <>
      <Navbar />
      <section id="register">
        <div id="register-background-container">
          <img src="/img/background.jpg" alt="Photo of Background" />
          <div id="register-description-container">
            <h2>Important!</h2>
            <p>Please login as admin first</p>
          </div>
        </div>
        <div id="register-container">
          <form onSubmit={(e) => {
            e.preventDefault()
            const value = getValueForm(e.target)
            register(value)
          }}>
            <h2>Register</h2>
            <div className="input">
              <i className="fa-solid fa-user"></i>
              <input type="text" id="username" name="username" placeholder="Username"/>
            </div>
            <div className="input">
              <i className="fa-solid fa-envelope"></i>
              <input type="email" name="email" id="email" placeholder="Email"/>
            </div>
            <div className="input">
              <i className="fa-solid fa-lock"></i>
              <input type="password" name="password" id="password" placeholder="Password"/>
            </div>
            <div className="input">
              <i className="fa-solid fa-phone"></i>
              <input type="text" name="phoneNumber" id="phone" placeholder="Phone"/>
            </div>
            <div className="input">
              <i className="fa-solid fa-location-dot"></i>
              <input type="text" name="address" id="address" placeholder="Address"/>
            </div>
            <Button value="Register" type="submit"/>
          </form>
        </div>
      </section>
    </>
  )
}
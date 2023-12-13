import { useNavigate, useOutletContext } from "react-router-dom";
import { getValueForm } from "../../../client-public/src/helpers/getValueForm";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import './LoginPage.css'
import axios from 'axios'

/* eslint-disable react/prop-types */
export default function LoginPage() {
  const navigate = useNavigate()
  const [setNotif] = useOutletContext()

  async function login(value) {
    try {
      const access_token = await axios({
        method: "POST",
        url: "https://oxo-server.nokatotedo.my.id/login",
        data: value
      })

      localStorage.access_token = access_token.data.access_token
      navigate('/')
      setNotif({
        type: "success",
        message: "Welcome back"
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
      <Navbar notLogin={false} />
      <section id="login">
        <div id="login-background-container">
          <img src="/img/background.jpg" alt="Background" />
          <div id="login-description-container">
            <h2>Welcome</h2>
            <p>Rent your room to another universe</p>
          </div>
        </div>
        <div id="login-container">
          <form onSubmit={(e) => {
            e.preventDefault()
            const value = getValueForm(e.target)
            login(value)
          }}>
            <h2>Login</h2>
            <div className="input">
              <i className="fa-solid fa-user"></i>
              <input type="text" id="username" name="username" placeholder="Username" />
            </div>
            <div className="input">
              <i className="fa-solid fa-lock"></i>
              <input type="password" name="password" id="password" placeholder="Password" />
            </div>
            <Button value="Login" type="submit"/>
          </form>
        </div>
      </section>
    </>
  )
}
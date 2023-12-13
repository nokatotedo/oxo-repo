import { useState } from "react"
import axios from 'axios'
import { toIdr } from "../helpers/toIdr"
import { useNavigate, useParams, useOutletContext } from "react-router-dom"
import { getTypes as getTypesHelper } from '../helpers/getTypes'
import { useEffect } from "react"
import Slider from "../components/Slider"
import Navbar from "../components/Navbar"
import './DetailsPage.css'

/* eslint-disable react-hooks/exhaustive-deps */
export default function DetailsPage() {
  const { id } = useParams()
  const [lodging, setLodging] = useState(null)
  const [types, setTypes] = useState(null)
  const [setNotif] = useOutletContext()
  const navigate = useNavigate()

  useEffect(() => {
    getLodgingById(id)
    getTypes()
  }, [])

  const type = () => {
    for(let typesData of types) {
      if(typesData.id === lodging.typeId) {
        return typesData.name
      }
    }
  }

  async function getLodgingById(id) {
    try {
      const lodging = await axios({
        url: `https://oxo-server.nokatotedo.my.id/lodgings/${id}`,
        headers: {
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })

      setLodging(lodging.data)
    } catch (error) {
      navigate("/error")
    }
  }

  async function getTypes() {
    try {
      const data = await getTypesHelper()

      setTypes(data)
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
      <section id="details" className="page">
        {lodging && <Slider imgUrl={lodging.imgUrl} name={lodging.name}/>}
        <div id="details-description">
          <div id="details-left">
            <div id="details-1">
              <h2>{lodging?.name}</h2>
              <div id="location">
                <i className="fa-solid fa-location-dot"></i>
                <p>{lodging?.location}</p>
              </div>
            </div>
            <div id="details-2">
              <h4>Facility</h4>
              <p>{lodging?.facility}</p>
            </div>
            <div id="details-3">
              <h4>Room Capacity</h4>
              <p>{lodging?.roomCapacity}</p>
            </div>
            <div id="details-4">
              <h4>Type</h4>
              <p>{lodging && types && type()} Room</p>
            </div>
          </div>
          <div id="details-right">
            <h2>{lodging && toIdr(lodging.price)}</h2>
            <div id="details-5">
              <h4>Owner</h4>
              <p>{lodging?.User.username}</p>
            </div>
            {lodging && <a href={`https://wa.me/${lodging.User.phoneNumber}`}><input type="button" value="Contact Owner"/></a>}
          </div>
        </div>
      </section>
    </>
  )
}
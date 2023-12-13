import './DetailsPage.css'
import Slider from '../components/Slider'
import { toIdr } from '../helpers/toIdr'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getTypes } from '../helpers/getTypes'

export default function DetailsPage() {
  const { id } = useParams()
  const [lodging, setLodging] = useState(null)
  const navigate = useNavigate()

  const types = getTypes()

  useEffect(() => {
    getLodgingById(id)
  }, [])

  async function getLodgingById(id) {
    try {
      const lodging = await axios({
        url: `https://oxo-server.nokatotedo.my.id/pub/lodgings/${id}`
      })

      setLodging(lodging.data)
    } catch (error) {
      navigate("/error")
    }
  }

  return (
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
            <p>{types[lodging?.typeId - 1]} Room</p>
          </div>
        </div>
        <div id="details-right">
          <h2>{lodging && toIdr(lodging.price)}</h2>
          <input type="button" value="Continue to Book"/>
        </div>
      </div>
    </section>
  )
}
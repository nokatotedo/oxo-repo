import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import './LodgingsPage.css'
import axios from 'axios'
import ListTable from '../components/ListTable'
import { getTypes as getTypesHelper } from '../helpers/getTypes'
import { useOutletContext, Link } from 'react-router-dom'

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
export default function LodgingsPage() {
  const [lodgings, setLodgings] = useState(null)
  const [types, setTypes] = useState(null)
  const [setNotif, notif] = useOutletContext()

  useEffect(() => {
    getLodgings()
    getTypes()
  }, [notif])

  async function getLodgings() {
    try {
      const { data } = await axios({
        url: "https://oxo-server.nokatotedo.my.id/lodgings",
        headers: {
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })

      setLodgings(data)
    } catch (error) {
      setNotif({
        type: "error",
        message: error.response.data.message
      })
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
      <Navbar/>
      <section id="lodgings" className="page">
        <div id="lodgings-description">
          <h1>Dashboard</h1>
          <div id="description-lodgings-container">
            <div className="card-description-entity">
              <div className="total-lodgings">
                <p>Total Lodgings</p>
                <h4>{lodgings?.length}</h4>
              </div>
              <div className="icon-lodgings">
                <i className="fa-solid fa-bed"></i>
              </div>
            </div>
          </div>
          <Link to="/lodgings/create">Add Lodging</Link>
        </div>
        <div className="table-entity">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Lodging Name</th>
                <th>Facility</th>
                <th>Room Capacity</th>
                <th>Location</th>
                <th>Price</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lodgings && lodgings.map((lodging, i) => {
                return <ListTable list={{...lodging, number:i+1 }} bonusList={types} key={lodging.id} setNotif={setNotif}/>
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
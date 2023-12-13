import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { useParams } from 'react-router-dom'
import { getValueForm } from "../helpers/getValueForm";
import { useState } from "react";
import { useEffect } from "react";
import { getTypes as getTypesHelper } from '../helpers/getTypes'
import { useNavigate, useOutletContext } from 'react-router-dom'
import axios from 'axios'
import './FormPage.css'

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
export default function FormLodgingPage({ type }) {
  const { id } = useParams()
  const [types, setTypes] = useState(null)
  const [lodging, setLodging] = useState(null)
  const [setNotif] = useOutletContext()
  const [selectedType, setSelectedType] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getTypes()
    if(id) {
      getLodgings()
    }
  }, [])

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

  async function getLodgings() {
    try {
      const { data } = await axios({
        url: `https://oxo-server.nokatotedo.my.id/lodgings/${id}`,
        headers: {
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })

      setLodging(data)
      setSelectedType(data.typeId)
    } catch (error) {
      navigate('/lodgings/create')
      setNotif({
        type: "error",
        message: error.response.data.message
      })
    }
  }

  async function makeLodging(value) {
    try {
      await axios({
        method: type === "Edit" ? "PUT" : "POST",
        url: type === "Edit" ? `https://oxo-server.nokatotedo.my.id/lodgings/${id}` : "https://oxo-server.nokatotedo.my.id/lodgings",
        data: {
          ...value,
          roomCapacity: Number(value.roomCapacity),
          price: Number(value.price),
          typeId: Number(value.typeId)
        },
        headers: {
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })

      navigate('/lodgings')
      setNotif({
        type: "success",
        message: `Successfully ${type.toLowerCase()} lodging`
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
      <section id="edit" className="page">
        <form onSubmit={(e) => {
          e.preventDefault()
          const value = getValueForm(e.target)
          makeLodging(value)
        }}>
          <h2>{type} Lodging</h2>
          <div className="input">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Name" defaultValue={lodging?.name}/>
          </div>
          <div className="input">
            <label htmlFor="facility">Facility</label>
            <input type="text" name="facility" id="facility" placeholder="Facility" defaultValue={lodging?.facility}/>
          </div>
          <div className="input">
            <label htmlFor="room-capacity">Room Capacity</label>
            <input type="number" name="roomCapacity" id="room-capacity" placeholder="Room Capacity" defaultValue={lodging?.roomCapacity}/>
          </div>
          <div className="input">
            <label htmlFor="image-url">Image URL</label>
            <input type="text" name="imgUrl" id="image-url" placeholder="Image URL" defaultValue={lodging?.imgUrl}/>
          </div>
          <div className="input">
            <label htmlFor="location">Location</label>
            <input type="text" name="location" id="location" placeholder="Location" defaultValue={lodging?.location}/>
          </div>
          <div className="input">
            <label htmlFor="price">Price</label>
            <input type="number" name="price" id="price" placeholder="Price" defaultValue={lodging?.price}/>
          </div>
          <div className="input">
            <label htmlFor="type-id">Type</label>
            <select name="typeId" id="type-id" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              {types && types.map(type => {
                return <option value={type.id} key={type.id}>{type.name}</option>
              })}
            </select>
          </div>
          <Button value={type} type="submit"/>
        </form>
      </section>
    </>
  )
}
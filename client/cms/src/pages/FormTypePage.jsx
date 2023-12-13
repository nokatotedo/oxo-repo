import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { getValueForm } from "../helpers/getValueForm";
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import axios from 'axios'
import './FormPage.css'

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
export default function FormTypePage({ type }) {
  const { id } = useParams()
  const [nameType, setNameType] = useState('')
  const [setNotif] = useOutletContext()
  const navigate = useNavigate()

  useEffect(() => {
    if(id) {
      getTypeById()
    }
  }, [])

  async function getTypeById() {
    try {
      const { data } = await axios({
        url: `https://oxo-server.nokatotedo.my.id/types`,
        headers: {
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })
      
      const findTypeName = data.find(dataType => dataType.id === +id)
      if(findTypeName) {
        setNameType(findTypeName.name)
      } else {
        navigate('/types/create')
        setNotif({
          type: "error",
          message: "Error Not Found"
        })
      }
    } catch (error) {
      setNotif({
        type: "error",
        message: error.response.data.message
      })
    }
  }

  async function makeType(value) {
    try {
      await axios({
        method: type === "Edit" ? "PUT" : "POST",
        url: type === "Edit" ? `https://oxo-server.nokatotedo.my.id/types/${id}` : "https://oxo-server.nokatotedo.my.id/types",
        data: value,
        headers: {
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })

      navigate('/types')
      setNotif({
        type: "success",
        message: `Successfully ${type.toLowerCase()} type`
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
      <div id="type">
        <section id="edit" className="page">
          <form onSubmit={(e) => {
            e.preventDefault()
            const value = getValueForm(e.target)
            makeType(value)
          }}>
            <h2>{type} Type</h2>
            <div className="input">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Name" defaultValue={nameType}/>
            </div>
            <Button value={type} type="submit"/>
          </form>
        </section>
      </div>
    </>
  )
}
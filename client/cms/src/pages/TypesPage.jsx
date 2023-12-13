import { useOutletContext, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTypes as getTypesHelper } from '../helpers/getTypes'
import { useEffect, useState } from "react";
import ListTable from "../components/ListTable";
import './TypesPage.css'

/* eslint-disable react-hooks/exhaustive-deps */
export default function TypesPage() {
  const [types, setTypes] = useState(null)
  const [setNotif, notif] = useOutletContext()

  useEffect(() => {
    getTypes()
  }, [notif])

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
      <section id="types" className="page">
        <div id="types-description">
          <h1>Dashboard</h1>
          <div id="description-types-container">
            <div className="card-description-entity">
              <div className="total-lodgings">
                <p>Total Types</p>
                <h4>{types?.length}</h4>
              </div>
              <div className="icon-lodgings">
                <i className="fa-solid fa-tag"></i>
              </div>
            </div>
          </div>
          <Link to="/types/create">Add Type</Link>
        </div>
        <div className="table-entity">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Type Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {types && types.map((type, i) => {
                return <ListTable list={{...type, number:i+1 }} key={type.id} setNotif={setNotif}/>
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
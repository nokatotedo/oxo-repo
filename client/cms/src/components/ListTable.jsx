import { Link } from "react-router-dom"
import { toIdr } from "../helpers/toIdr"
import './ListTable.css'
import axios from "axios"

/* eslint-disable react/prop-types */
export default function ListTable({ list, bonusList=null, setNotif }) {
  const type = () => {
    for(let bonusData of bonusList) {
      if(bonusData.id === list.typeId) {
        return bonusData.name
      }
    }
  }

  async function deleteList(id, typeData) {
    try {
      const { data } = await axios({
        method: "DELETE",
        url: `https://oxo-server.nokatotedo.my.id/${typeData}/${id}`,
        headers: {
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })

      setNotif({
        type: "error",
        message: `Successfully deleted ${data.name}`
      })
    } catch (error) {
      setNotif({
        type: "error",
        message: error.response.data.message
      })
    }
  }

  return (
    <tr>
      {list.number && <td>{list.number}</td>}
      {list.name && <td>{list.name}</td>}
      {list.facility && <td>{list.facility}</td>}
      {list.roomCapacity && <td>{list.roomCapacity}</td>}
      {list.location && <td>{list.location}</td>}
      {list.price && <td>{toIdr(list.price)}</td>}
      {list.typeId && bonusList && <td>{type()}</td>}
      {list.User && <td>{list.User.username}</td>}
      <td>
        <div className="action-group">
          {list.imgUrl ? <Link to={`/lodgings/${list.id}/upload`} id="upload-btn">Upload Image</Link> : ""}
          {bonusList ? <Link to={`/lodgings/${list.id}/edit`} id="edit-btn">Edit</Link> : <Link to={`/types/${list.id}/edit`} id="edit-btn">Edit</Link>}
          {bonusList ? <Link to={`/lodgings/${list.id}`} id="details-btn">Details</Link> : ""}
          {bonusList ? <Link to="/lodgings" onClick={() => {deleteList(list.id, "lodgings")}} id="delete-btn">Delete</Link> : <Link to="/types" id="delete-btn" onClick={() => {deleteList(list.id, "types")}}>Delete</Link>}
        </div>
      </td>
    </tr>
  )
}
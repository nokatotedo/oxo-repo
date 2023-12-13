import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import axios from 'axios'

export default function FormUploadPage() {
  const { id } = useParams()
  const [file, setFile] = useState(null)
  const [setNotif] = useOutletContext()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function uploadImageLodging() {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('imgUrl', file)

      await axios({
        method: 'PATCH',
        url: `https://oxo-server.nokatotedo.my.id/lodgings/${id}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": 'Bearer ' + localStorage.access_token
        }
      })

      navigate('/lodgings')
      setNotif({
        type: "success",
        message: "Successfully upload image lodging"
      })
    } catch (error) {
      setNotif({
        type: "error",
        message: error.response.data.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div id="upload">
        <section id="edit" className="page">
          <form onSubmit={(e) => {
            e.preventDefault()
            uploadImageLodging()
          }}>
            <h2>Upload</h2>
            <div className="input">
              <label htmlFor="image-url">File</label>
              <input type="file" id="image-url" name="imgUrl" onChange={(e) => {
                setFile(e.target.files[0])
              }}/>
            </div>
            {loading && <div id="loading">
              <img src="https://i.gifer.com/ZKZg.gif" alt="Loading"/>
              <p>Loading</p>
            </div>}
            {loading ? "" : <Button value="Upload" type="submit"/>}
          </form>
        </section>
      </div>
    </>
  )
}
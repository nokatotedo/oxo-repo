import { useEffect, useState } from 'react'
import './HomePage.css'
import { getValueForm } from '../helpers/getValueForm'
import Card from "../components/Card"
import NavbarBot from '../components/NavbarBot'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import FakeCard from '../components/FakeCard'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTypes } from '../helpers/getTypes'

export default function Homepage() {
  const [queryParams, setQueryParams] = useSearchParams()
  const [lodgings, setLodgings] = useState([])
  const [loading, setLoading] = useState(true)

  const types = getTypes()

  useEffect(() => {
    getLodgings(queryParams)
  }, [queryParams])

  async function getLodgings(params) {
    try {
      setLoading(true)
      const lodgings = await axios({
        url: "https://oxo-server.nokatotedo.my.id/pub/lodgings",
        params
      })

      setLodgings(lodgings.data.lodgings)
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  function insertInput(value) {
    const query = {}
    if(queryParams.get('typeId')) query.typeId = queryParams.get('typeId')
    if(queryParams.get('sort')) query.sort = queryParams.get('sort')
    if(queryParams.get('name')) query.name = queryParams.get('name')
    if(queryParams.get('page')) query.page = queryParams.get('page')
    if(!value.page) delete query.page

    setQueryParams(() => {
      return {
        ...query,
        ...value
      }
    })
  }

  return (
    <>
      <NavbarBot setQueryParams={setQueryParams}/>
      <ToastContainer />
      <section id="home" className="page">
        <section id="jumbotron">
          <div id="jumbotron-container">
            <div id="search">
              <h1>World's Fastest Growing Room Chain</h1>
              <form onSubmit={(e) => {
                e.preventDefault()
                const value = getValueForm(e.target)
                insertInput(value)
              }}>
                <input type="text" placeholder="Search your room" name='name' defaultValue={queryParams.get('name')}/>
                <input id="btn-submit" type='submit' value="Search" onClick={() => {
                  location.href = "#content"
                }}/>
              </form>
              <div id="filter-input">
                <h2>Continue your search</h2>
                {types.map((type, i) => <a href="#content" key={i} onClick={() => {
                  insertInput({ typeId: i+1 })
                }}><h2 className={Number(queryParams.get('typeId')) === i+1 ? "active" : ""}>{`${type} Room`}</h2></a>)}
              </div>
            </div>
          </div>
        </section>

        <section id="content">
          <div id="content-title">
            <h2>Our Lodgings</h2>
            <div id="sort-input">
              <a href="#content" onClick={() => {
                insertInput({ sort: 'desc' })
              }} className={queryParams.get('sort') === "desc" ? "active" : ""}>Terbaru</a>
              <a href="#content" onClick={() => {
                insertInput({ sort: 'asc' })
              }} className={queryParams.get('sort') === "asc" ? "active" : ""}>Terlama</a>
            </div>
          </div>
          <div id="card-container">
            {loading ? [1,2,3,4,5].map((i) => <FakeCard key={i}/>) : lodgings.map(lodging => <Card lodging={lodging} key={lodging.id} />)}
          </div>
          <div id="pagination-input">
            <a href="#content" onClick={() => {
              const page = Number(queryParams.get('page')) ? Number(queryParams.get('page')) : 1
              if(page > 1) {
                insertInput({ page: page - 1 })
              }
            }}><i className="fa-solid fa-arrow-left"></i></a>
            <p>{Number(queryParams.get('page')) ? Number(queryParams.get('page')) : 1}</p>
            <a href="#content" onClick={() => {
              const page = Number(queryParams.get('page')) ? Number(queryParams.get('page')) : 1
              insertInput({ page: page + 1 })
            }}><i className="fa-solid fa-arrow-right"></i></a>
          </div>
        </section> 
      </section>
    </>
  )
}
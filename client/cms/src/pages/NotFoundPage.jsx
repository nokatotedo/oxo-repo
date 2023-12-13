import Navbar from '../components/Navbar'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <section id="error" className="page">
        <h1>Error: Not Found</h1>
        <p>Please return to homepage again</p>
      </section>
    </>
  )
}
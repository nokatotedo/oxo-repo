import './NavbarBot.css'

export default function NavbarBot({ setQueryParams }) {
  const locations = ["Jakarta", "Padang", "Surabaya", "Bogor", "Palembang"]

  return (
    <nav>
      <div id="nav-bot">
        <ul>
          {locations.map((location, i) => {
            return (
              <li key={i}><a href="#">{location}</a></li>
            )
          })}
          <li><a href="#content" onClick={() => {
            setQueryParams({})
          }}>All Cities</a></li>
        </ul>
      </div>
    </nav>
  )
}
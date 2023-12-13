import SliderImage from "./SliderImage"
import './Slider.css'

export default function Slider({ imgUrl, name }) {
  function scroll(direction) {
    const widths = [...document.querySelectorAll('#details-img img')].map(width => width.offsetWidth)
    const totalWidth = widths.length !== 0 ? widths.reduce((a, b) => a + b) : 0
    let position = document.getElementById('details-img').scrollLeft

    if(direction === "right") {
      position += 1000
    } else if(direction === "left") {
      position -= 1000
    }

    if(position >= totalWidth) {
      position = totalWidth - 1000
    }
    if(position <= 0) {
      position = 0
    }

    document.getElementById('details-img').scrollLeft = position
  }

  return (
    <div id="details-scroll">
      <div id="arrow-container">
        <i className="fa-solid fa-arrow-left" id="arrow-left" onClick={() => scroll("left")}></i>
        <i className="fa-solid fa-arrow-right" id="arrow-right" onClick={() => scroll("right")}></i>
      </div>
      <div id="details-img">
        <SliderImage imgUrl={imgUrl} name={name}/>
      </div>
    </div>
  )
}
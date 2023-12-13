import './Button.css'

/* eslint-disable react/prop-types */
export default function Button({ type, value }) {
  return (
    <div id='button'>
      <button type={type}>{value}</button>
    </div>
  )
}
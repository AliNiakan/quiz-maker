import React from 'react'
import { Link } from 'react-router-dom'; 
import './Error.css'

const Error = ({ message, title }) => {
  return (
    <div className='error-container'>
      <h1 className='error-title'>{title}</h1>  
      <p className='error-message'>{message}</p>
      <Link to='/'>بازگشت به صفحه اصلی</Link>
    </div>
  )
}

export default Error
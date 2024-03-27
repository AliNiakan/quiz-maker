import React, { useState, useContext } from 'react'
import AuthContext from '../../context/AuthContext';
import './AddExam.css'
import { useNavigate } from 'react-router-dom';
import Error from '../Error/Error';
import config from '../../config.json';
const URL = config.api_url;


const AddExam = () => {
  const [examTitle, setExamTitle] = useState('');
  const { authTokens } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setExamTitle(e.target.value);
  };


  const fetchAddExam = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${URL}/quiz/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: examTitle }),
      });
      const data = await response.json()
      if (response.ok) {
        navigate('/my-exams');
      } else {
        console.error('Failed to fetch exams data.');
        alert(data.detail[0].msg)
      }
    } catch (error) {
      console.error('An error occurred while fetching exams data:', error);
    }
  };


  if (!authTokens?.access_token) {
    return <Error title='عدم دسترسی' message='شما اجازه دسترسی به این صفحه را ندارید' />
  }

  return (
    <div className='add-exam-container'>
      <form className='add-exam'>
        <label htmlFor="exam-title" className="add-exam-label">نام آزمون را وارد کنید</label>
        <input
          type="text"
          id="exam-title"
          name="exam-title"
          className="add-exam-input"
          value={examTitle}
          onChange={handleInputChange} />
        <button className='add-exam-submit' onClick={fetchAddExam}>تایید</button>
      </form>
    </div>
  )
}

export default AddExam
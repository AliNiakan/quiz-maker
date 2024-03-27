import React from 'react'
import './PasswordCheck.css'

const PasswordCheck = ({ password, setPassword,fetchQuestions }) => {
    return (
        <div className='password-check-container'>
            <h1>این آزمون نیاز به رمز ورود دارد <br /> (رمز را از طراح سوال دریافت کنید) </h1>
            <label>رمز ورود : </label>
            <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} />

            <button onClick={fetchQuestions}>ورود</button>
        </div>
    )
}

export default PasswordCheck
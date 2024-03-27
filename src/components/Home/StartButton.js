import React from 'react'
import "./StartButton.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const StartButton = () => {
    return (
        <div className='start-container'>
                <Link to='/my-exams' className='start-btn'>
                    ساخت آزمون
                    <FontAwesomeIcon icon={faPlus} className='plus-icon' />
                </Link>
        </div >
    )
}

export default StartButton
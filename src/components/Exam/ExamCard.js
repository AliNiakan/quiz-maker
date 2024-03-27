import React from 'react'
import "./ExamCard.css"
import { Link } from 'react-router-dom';

const ExamCard = ({ title, count, url }) => {

    return (
        <Link to={url} className='exam-card'>

            <h3 className='ec-title'>{title}</h3>
            <p className='ec-count'>
                تعداد سوالات :
                <span>{count}</span>
            </p>

        </Link >

    )
}

export default ExamCard
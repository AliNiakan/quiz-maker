import React, { useEffect, useState } from 'react'
import './ResultCard.css';

const ResultCard = ({ totalScore, username, userId, userScore }) => {
    return (
        <div className='result-card'>
            <p className='result-card-name'>{username}</p>
            <div className='result-card-score'>
                نتیجه :
                <span className='score-number'>{userScore}</span>
                /
                <span className='score-number'>{totalScore}</span>
            </div>
        </div>
    )
}

export default ResultCard
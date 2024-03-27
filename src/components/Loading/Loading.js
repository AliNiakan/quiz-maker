import React from 'react'
import './Loading.css'
import { BarLoader } from 'react-spinners';
const Loading = () => {
    return (
        <div className='loading-overlay'>
            <BarLoader speedMultiplier={0.5} color="#36d7b7" loading width={1920} />
        </div>
    )
}

export default Loading
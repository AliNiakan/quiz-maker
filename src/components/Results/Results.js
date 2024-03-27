import React, { useEffect, useState, useContext } from 'react'
import ResultCard from './ResultCard';
import Error from '../Error/Error';
import './Results.css';
import AuthContext from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import config from '../../config.json';
const URL = config.api_url;



const Results = ({ loading, setLoading }) => {
    const { id } = useParams();
    const { authTokens } = useContext(AuthContext)

    const [users, setUsers] = useState([])
    const [totalScore, setTotalScore] = useState()
    console.log(users)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${URL}/quiz/pub/${id}/all/answers`,
                    {
                        headers: {
                            'Authorization': `Bearer ${authTokens?.access_token}`
                        }
                    });
                const data = await response.json();
                setUsers(data.participant_answers)
                setTotalScore(data.total_quiz_score)
            } catch (error) {
                console.error('An error occurred while fetching exams data:', error);
            }
            finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, []);


    if (!authTokens?.access_token) {
        return <Error title='عدم دسترسی' message='شما اجازه دسترسی به این صفحه را ندارید' />
    }

    return (
        <div className='results-card-container'>
            {users.map((user) =>
                <a
                    key={user.participant_id}
                    href={`/result-check/${id}/${user.participant_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ResultCard
                        key={user.participant_id}
                        totalScore={totalScore}
                        username={user.username.split('+')[0]}
                        userId={user.participant_id}
                        userScore={user.descriptive_score + user.options_score}
                    />
                </a>
            )}
        </div>
    )
}

export default Results
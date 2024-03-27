import React, { useContext, useEffect, useState } from 'react'
import ExamCard from './ExamCard'
import AuthContext from '../../context/AuthContext'
import config from '../../config.json';
const URL = config.api_url;

const Exam = ({ loading, setLoading }) => {
    const { authTokens } = useContext(AuthContext)
    const [exams, setExams] = useState([]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${URL}/quiz/all`, {
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access_token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setExams(data);
                } else {
                    console.error('Failed to fetch exams data.');
                }
            } catch (error) {
                console.error('An error occurred while fetching exams data:', error);
            }
            finally {
                setLoading(false);
            }

        };

        fetchExams();
    }, []);






    return (
        <div className='ec-container'>
            {authTokens?.access_token &&
                <ExamCard title='ساخت آزمون جدید' url='/add-exam' />
            }
            {loading ? (
                null
            ) : authTokens ? (
                exams.length > 0 ? (
                    exams.map((exam) => (
                        <ExamCard
                            key={exam.quiz_info.title}
                            url={`/exam/${exam.quiz_info.id}`}
                            title={exam.quiz_info.title}
                            count={exam.question_count}
                        />
                    ))
                ) : (
                    <h1>در حال حاضر هیچ آزمونی نساخته اید.</h1>
                )
            ) : (
                <h1>برای ساخت آزمون جدید یا دیدن آزمون های سابق خود ابتدا ثبت نام کنید!</h1>
            )}
        </div>
    )
}

export default Exam
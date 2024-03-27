import React, { useEffect, useContext, useState } from 'react'
import './ExamEditor.css'
import Error from '../Error/Error'
import QuestionCard from '../Question/QuestionCard'
import ExamOptionPanel from './ExamOptionPanel';
import AuthContext from '../../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import config from '../../config.json';

const URL = config.api_url;


const ExamEditor = ({ loading, setLoading }) => {
    const { authTokens } = useContext(AuthContext)
    const [questions, setQuestions] = useState([])
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [userAnswers, setUserAnswers] = useState({})
    const { id } = useParams();

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${URL}/quiz/${id}/questions`, {
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access_token}`
                    }
                });
                const data = await response.json();
                setQuestions(data.questions)
            } catch (error) {
                console.error('An error occurred while fetching exams data:', error);
            }
            finally {
                setLoading(false)
            }
        }

        fetchQuestions()
    }, [])

    return (
        <div>
            <Link to={`/results/${id}`} className='result-check-container' >
                <button className='result-check-button'>تصحیح کردن این آزمون</button>
            </Link >
            <Link to={`/add-question/${id}`} className='add-question-container' >
                <button className='add-question-button'>اضافه کردن سوال جدید</button>
            </Link >

            {questions && questions.length > 0 ? (
                questions.map((question) => (
                    <QuestionCard
                        key={question.id}
                        questionID={question.id}
                        examID={id}
                        text={question.text}
                        score={question.score}
                        questionType={question.question_type}
                        choices={question.choices || null}
                        loading={loading}
                        userAnswers={question.answer}
                        setUserAnswers={setUserAnswers}
                        setLoading={setLoading}
                        isCreator={true}
                    />
                ))
            ) : (
                <div>
                    <Error title={'متاسفانه سوالی موجود نمیباشد'} message={'همین حالا سوالی طرح کنید! '} />
                </div>
            )}


            <div className='exam-panel-container'>
                <button className={`exam-panel-button`} onClick={togglePanel}>ویرایش آزمون</button>
            </div>
            {isPanelOpen &&
                <ExamOptionPanel examID={id} setLoading={setLoading} loading={loading} />
            }

        </div >
    )
}

export default ExamEditor
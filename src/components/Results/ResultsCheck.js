import React, { useEffect, useState, useContext } from 'react'
import './ResultsCheck.css';
import Error from '../Error/Error';
import QuestionCard from '../Question/QuestionCard';
import AuthContext from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config.json';
const URL = config.api_url;

const ResultsCheck = ({ setLoading, loading }) => {
    const navigate = useNavigate()
    const { id, user } = useParams();
    const { authTokens } = useContext(AuthContext)

    const [questions, setQuestions] = useState([])
    const [userAnswers, setUserAnswers] = useState()
    const [examId, setExamId] = useState()
    const [multipleOptionsResultsChanges, setMultipleOptionResultsChange] = useState([])
    const [descriptiveScore, setDescriptiveScore] = useState({})

    console.log(descriptiveScore)
    console.log(multipleOptionsResultsChanges)
    console.log(questions)


    const updateUserScores = async () => {
        setLoading(true)
        const sendingData = {
            participant_id: user,
            descriptive: descriptiveScore,
            multiple_options: multipleOptionsResultsChanges
        }
        try {
            const response = await fetch(`${URL}/quiz/pub/${id}/update/user-answers`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendingData),
            });
            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
            navigate(`/results/${examId}`)
        }
    }


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${URL}/quiz/${id}/questions`,
                    {
                        headers: {
                            'Authorization': `Bearer ${authTokens?.access_token}`
                        }
                    });
                const data = await response.json();
                setExamId(data.quiz_id)
                setQuestions(data.questions)
            } catch (error) {
                console.error('An error occurred while fetching exams data:', error);
            }
            finally {
                setLoading(false)
            }
        }

        fetchQuestions()
    }, []);

    useEffect(() => {
        const getUserAnswers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${URL}/quiz/pub/${id}/participant/${user}/answers`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access_token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUserAnswers(data);
                console.log(data);
            } catch (error) {
                console.error('An error occurred while fetching user answers:', error);
            } finally {
                setLoading(false);
            }
        }

        if (id && user) {
            getUserAnswers();
        }
    }, [id, user]);



    if (!authTokens?.access_token) {
        return <Error title='عدم دسترسی' message='شما اجازه دسترسی به این صفحه را ندارید' />
    }

    return (
        <div>
            {loading ? (
                null)
                :
                (
                    questions.map((question) => {
                        const userAnswerDescriptive = userAnswers?.descriptive?.find(answer => answer.question_id === question.id);
                        const userAnswerMultipleOptions = userAnswers?.multiple_options?.find(answer => answer.question_id === question.id);
                        const questionType = userAnswerDescriptive ? userAnswerDescriptive.question_type : (userAnswerMultipleOptions ? userAnswerMultipleOptions.question_type : 'descriptive_short_answer');     console.log(userAnswerMultipleOptions)
                        const correctAnswer = question.correct_option_id || question.answer.answer;
                        return (
                            <QuestionCard
                                key={question.id}
                                questionID={question.id}
                                text={question.text}
                                questionType={questionType}
                                choices={question.choices || null}
                                loading={loading}
                                setLoading={setLoading}
                                score={question.score}
                                isCorrect={userAnswerMultipleOptions ? userAnswerMultipleOptions.is_correct : null}
                                resultCheckMode={true}
                                userAnswerId={userAnswerDescriptive ? userAnswerDescriptive.id : (userAnswerMultipleOptions ? userAnswerMultipleOptions.id : null)}
                                correctAnswer={correctAnswer}
                                userAnswers={userAnswerDescriptive ? userAnswerDescriptive.answer : (userAnswerMultipleOptions ? userAnswerMultipleOptions.option_id : null)}
                                setMultipleOptionResultsChange={setMultipleOptionResultsChange}
                                multipleOptionsResultsChanges={multipleOptionsResultsChanges}
                                setDescriptiveScore={setDescriptiveScore}
                                descriptiveScore={descriptiveScore}
                            />

                        );
                    })

                )
            }
            <div className='update-score-container'>
                <button className='update-score-btn' onClick={updateUserScores}>ارسال</button>
            </div>

        </div>
    )
}

export default ResultsCheck
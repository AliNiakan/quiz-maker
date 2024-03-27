import React, { useState, useContext, useEffect } from 'react'
import AuthContext from '../../context/AuthContext';
import QuestionCard from '../Question/QuestionCard';
import './UserExam.css'
import Error from '../Error/Error';
import { useParams, useNavigate } from 'react-router-dom';
import PasswordCheck from './PasswordCheck';
import config from '../../config.json';
const URL = config.api_url;

const UserExam = ({ loading, setLoading }) => {
    const navigate = useNavigate()
    const { name } = useParams()
    const { authTokens } = useContext(AuthContext)
    const [questions, setQuestions] = useState([])
    const [seconds, setSeconds] = useState(1);
    const [minutes, setMinutes] = useState();
    const [endAtDate, setEndAtDate] = useState()
    const [title, setTitle] = useState('')
    const [examId, setExamId] = useState()
    const [username, setUsername] = useState()
    const [userAnswers, setUserAnswers] = useState({});
    const [needPassword, setNeedPassword] = useState()
    const [password, setPassword] = useState()
    const [hasError, setHasError] = useState(false);

    const calculateRemainingTime = () => {
        const currentTime = new Date();
        const endTime = new Date(endAtDate);

        const difference = endTime - currentTime;
        if (difference > 0) {
            const remainingSeconds = Math.floor((difference / 1000) % 60);
            const remainingMinutes = Math.floor((difference / 1000 / 60) % 60);

            setSeconds(remainingSeconds);
            setMinutes(remainingMinutes);
        } else {
            setSeconds(0);
            setMinutes(0);
        }
    };
    useEffect(() => {
        if (endAtDate) {
            const interval = setInterval(() => {
                calculateRemainingTime();
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [endAtDate]);
    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            } else if (minutes > 0) {
                setMinutes(minutes - 1);
                setSeconds(59);
            }

            if (minutes === 0 && seconds === 0) {
                clearInterval(timer);
            }
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [seconds, minutes]);


    useEffect(() => {
        const checkPasswordStatus = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${URL}/quiz/pub/${name}/password-status`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setExamId(data.quiz_id)
                setNeedPassword(data.need_password)
                if (!data || !data.quiz_id) {
                    setHasError(true);
                }
            } catch (error) {
                setHasError(true);
                console.log(error)
            }
            finally {
                setLoading(false)
            } 
        }
        checkPasswordStatus()
    }, [name])

    useEffect(() => {
        if (!needPassword && examId) {
            fetchQuestions();
        }
    }, [needPassword, examId]);


    const fetchQuestions = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${URL}/quiz/pub/${examId}/get-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password }),
            });
            const data = await response.json();
            console.log(data)
            if (data.type === "wrong_quiz_password") {
                alert('رمز اشتباه است.');
                setLoading(false);
                return;
            }
            setEndAtDate(data.end_at)
            setQuestions(data.questions)
            setTitle(data.quiz_title)
            setNeedPassword(false)
        } catch (error) {
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }



    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const submitAnswers = async () => {
        setLoading(true)
        const formData = {
            participant_info: {
                username: username
            },
            descriptive: [],
            multiple_options: []
        };
        questions.forEach((question) => {
            if (question.question_type === 'descriptive_long_answer' || question.question_type === 'descriptive_short_answer') {
                formData.descriptive.push({
                    question_id: question.id,
                    answer: userAnswers[question.id]
                });
            } else if (question.question_type === 'multiple_options') {
                formData.multiple_options.push({
                    question_id: question.id,
                    option_id: userAnswers.id
                });
            }
        });
        console.log(formData)

        try {
            const response = await fetch(`${URL}/quiz/pub/${examId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json()
            console.log(data)
            if (response.ok) {
                alert(`${username} عزیز امتحان شما ثبت شد.`)
                navigate('/')
                console.log('Answers submitted successfully');
            } else {
                console.error('Error submitting answers');
            }
        } catch (error) {
            console.error('An error occurred while submitting answers:', error);
        }
        finally {
            setLoading(false)
        }
    }


    if (needPassword) {
        return <PasswordCheck password={password} setPassword={setPassword} fetchQuestions={fetchQuestions} />
    }
    if (hasError) {
        return (
            <Error
                title={'این آزمون دارای مشکلی میباشد'}
                message={'با طراح یا ادمین های سایت در ارتباط باشید.'}
            />
        );
    }

    if (minutes === 0) {
        return <Error title={'خطا'} message={'زمان این آزمون به پایان رسیده'} />
    }


    return (
        <div>
            {loading
                ? null :
                <>
                    <div className='user-exam-title-container'>
                        <h1 className='user-exam-title'>{title}</h1>
                    </div>

                    <div className='user-exam-username-container'>
                        <p>لطفا نام و نام خانوادگی خود را وارد کنید</p>
                        <label>نام و نام خانوادگی : </label>
                        <input value={username} onChange={handleUsernameChange} type='text' />
                    </div>

                    <div className='cooldown-timer'>
                        زمان باقی مانده:
                        <br />
                        {`${minutes}:${seconds}`}
                    </div>
                    {questions.map((question) => (
                        <QuestionCard
                            key={question.id}
                            questionID={question.id}
                            text={question.text}
                            questionType={question.question_type}
                            choices={question.choices || null}
                            loading={loading}
                            setLoading={setLoading}
                            userAnswers={userAnswers}
                            setUserAnswers={setUserAnswers}
                            score={question.score}
                            isCreator={false}
                        />
                    ))}
                    <div className='user-exam-done-btn-container'>
                        <button
                            className={`user-exam-done-btn ${!username || loading ? 'disabled' : ''}`}
                            disabled={!username || loading}
                            onClick={submitAnswers}
                        >
                            {loading ? 'لطفا منتظر بمانید...' : '✔  تایید جواب ها'}
                            <br />
                            {!username
                                ? 'نام و نام خانوادگی خود را وارد کنید !'
                                : ' (فشردن این دکمه به منزله پایان امتحان میباشد)'}
                        </button>

                    </div>
                </>
            }

        </div>
    )
}

export default UserExam
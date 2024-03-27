import React, { useState, useEffect, useContext } from 'react';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from "react-multi-date-picker/plugins/analog_time_picker";
import transition from "react-element-popper/animations/transition"
import './ExamOptionPanel.css'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext';
import config from '../../config.json';
const URL = config.api_url;


const ExamOptionPanel = ({ examID, loading, setLoading }) => {
    const { authTokens } = useContext(AuthContext)
    const [examDate, setExamDate] = useState(new Date());
    const [examDuration, setExamDuration] = useState("");
    const [examTitle, setExamTitle] = useState("");
    const [examActive, setExamActive] = useState(false);
    const [examLink, setExamLink] = useState(false);
    const [passwordActivated, setPasswordActivated] = useState(false);
    const [password, setPassword] = useState("");
    const [isShuffle, setIsShuffle] = useState(false);
    const [initialPasswordActivated, setInitialPasswordActivated] = useState(false);
    const [initialPassword, setInitialPassword] = useState("");
    const isPasswordActivatedChanged = passwordActivated !== initialPasswordActivated;
    const isPasswordChanged = password !== initialPassword;
    const [dataToBeSent, setDataToBeSent] = useState({})

    const navigate = useNavigate();

    const handleExamDateChange = (date) => {
        setExamDate(date);
        const startDate = new Date(date);
        const formattedStartDate = startDate.toISOString();
        setDataToBeSent((prevData) => ({
            ...prevData,
            start_at: formattedStartDate,
        }));
    }


    const handleExamDurationChange = (e) => {
        const value = e.target.value;

        setExamDuration(value);
    }

    const handleExamTitleChange = (e) => {
        const value = e.target.value;
        setDataToBeSent((prevData) => ({
            ...prevData,
            title: value,
        }));
        setExamTitle(value);

    }

    const handleExamLinkChange = (e) => {
        const value = e.target.value;
        setDataToBeSent((prevData) => ({
            ...prevData,
            quiz_path: value,
        }));
        setExamLink(value);
    }

    const toggleShuffle = () => {
        setDataToBeSent((prevData) => ({
            ...prevData,
            shuffle_options: !prevData.shuffle_options,
        }));
        setIsShuffle(!isShuffle);
    }


    const toggleExamActivation = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${URL}/quiz/${examID}/change-activation-status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access_token}`
                }
            })
            const data = await response.json()
            console.log(data)
            setExamActive(!examActive);

        } catch (error) {
            console.log(error)
        }

        finally {
            setLoading(false)
        }
    }

    const togglePasswordActivation = () => {
        setPasswordActivated(!passwordActivated);
    }



    useEffect(() => {
        const fetchExamInformation = async () => {
            const response = await fetch(`${URL}/quiz/${examID}`, {
                headers: {
                    'Authorization': `Bearer ${authTokens?.access_token}`
                }
            })
            const data = await response.json()
            const { start_at, title, is_active, quiz_path, need_password, password, end_at, shuffle_options } = data;
            setExamDate(new Date(start_at));
            setExamTitle(title);
            setExamActive(is_active);
            setExamLink(quiz_path);
            setIsShuffle(shuffle_options)
            setPasswordActivated(need_password);
            setPassword(password);
            setInitialPasswordActivated(need_password);
            setInitialPassword(password);
            const endDate = new Date(end_at);
            const startDate = new Date(start_at);
            const timeDifferenceInMilliseconds = endDate - startDate;
            const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);
            console.log(timeDifferenceInMinutes)

            setExamDuration(timeDifferenceInMinutes)
        }

        fetchExamInformation()
    }, [examID, authTokens, setLoading])

    const updateExamInformation = async () => {
        setLoading(true);
        try {
            const endDate = new Date(examDate);
            endDate.setMinutes(endDate.getMinutes() + parseInt(examDuration, 10));

            const updatedDataToBeSent = {
                ...dataToBeSent,
                end_at: endDate,
                start_at: examDate,
            };
            console.dir(updatedDataToBeSent)
            const response = await fetch(`${URL}/quiz/${examID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDataToBeSent)
            })
            const data = await response.json()
            console.log(data)


            if (isPasswordActivatedChanged || isPasswordChanged) {
                await fetch(`${URL}/quiz/set/password/${examID}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: password,
                        quiz_lock: passwordActivated
                    })
                })
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false);

        }
    }

    const deleteExam = async () => {
        const confirmation = window.confirm('آیا از پاک کردن این امتحان مطمئن هستید؟');

        if (confirmation) {
            setLoading(true);

            try {
                const response = await fetch(`${URL}/quiz/delete/${examID}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access_token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    navigate('/my-exams');
                }
            } catch (error) {
                alert('Something went wrong');
            } finally {
                setLoading(false);
            }
        } else {
            return
        }
    };

    return (
        <div className="exam-option-container">

            <div className='exam-title-container'>
                <label >نام آزمون :</label>
                <input className='exam-title-input' type='text' value={examTitle} onChange={handleExamTitleChange}></input>

            </div>
            <div className='date-picker-container'>
                <label className='date-label'>تاریخ و ساعت امتحان :</label>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={examDate}
                    onChange={handleExamDateChange}
                    format="YYYY/MM/DD HH:mm:ss"
                    plugins={[<TimePicker position='bottom' />]}
                    animations={[
                        transition({
                            from: 35,
                            transition: "all 400ms cubic-bezier(0.335, 0.010, 0.030, 1.360)",
                        }),
                    ]}
                />
            </div>

            <div className="duration-input-container">
                <label className="date-label">مدت زمان امتحان (دقیقه):</label>
                <input
                    type="number"
                    value={examDuration}
                    onChange={handleExamDurationChange}
                    className="duration-input"
                />
            </div>



            <div className='link-exam-container'>
                <label>لینک آزمون : </label>
                <input onChange={handleExamLinkChange} value={examLink} className='link-exam-input'></input>
                <p>{`https://{YOURDOMAIN}/userexam/${examLink}`}</p>
            </div>

            <div className='shuffle-btn-container'>
                <label className="date-label">تصادفی شدن گزینه ها:</label>
                <button
                    className={`exam-toggle-button ${isShuffle ? 'active' : 'inactive'}`}
                    onClick={toggleShuffle}
                >
                    {isShuffle ? 'فعال' : 'غیرفعال'}
                </button>
            </div>


            <div className='active-exam-container'>
                <label className="date-label">وضعیت آزمون:</label>
                <button
                    className={`exam-toggle-button ${examActive ? 'active' : 'inactive'}`}
                    onClick={toggleExamActivation}
                >
                    {examActive ? 'فعال' : 'غیرفعال'}
                </button>
            </div>

            <div className='password-exam-container'>
                <div className='password-toggle-container'>
                    <label className="date-label">وضعیت رمز عبور:</label>
                    <button
                        className={`password-toggle-button ${passwordActivated ? 'active' : 'inactive'}`}
                        onClick={togglePasswordActivation}
                    >
                        {passwordActivated ? 'فعال' : 'غیرفعال'}
                    </button>
                </div>
                {passwordActivated && (
                    <div className='password-input-container'>
                        <label>رمز عبور:</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="password-input"
                        />
                    </div>
                )}
            </div>


            <button onClick={deleteExam} className='delete-exam-btn'>حذف آزمون</button>
            <button onClick={updateExamInformation} disabled={loading} className='submit-exam-btn'>
                {loading ? 'در حال ذخیره تغییرات...' : 'اعمال تغییرات'}
            </button>


        </div>
    );
};
export default ExamOptionPanel;
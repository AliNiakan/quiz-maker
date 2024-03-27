import React, { useState, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import './AddQuestion.css'
import AuthContext from '../../context/AuthContext'
import config from '../../config.json';
const URL = config.api_url;

const AddQuestion = ({ loading, setLoading }) => {
    const { id } = useParams();
    const { authTokens } = useContext(AuthContext)
    const [questionType, setQuestionType] = useState('multiple-option');
    const [questionText, setQuestionText] = useState('');
    const [descriptiveAnswerText, setDescriptiveAnswerText] = useState('');
    const [multipleOptionCounter, setMultipleOptionCounter] = useState(0);
    const [score, setScore] = useState();
    const [options, setOptions] = useState([]);
    const [correctOption, setCorrectOption] = useState(1);
    const navigate = useNavigate();

    const handleQuestionTypeChange = (event) => {
        setQuestionType(event.target.value);
    };
    const handleQuestionChange = (event) => {
        setQuestionText(event.target.value);
    };
    const handleDescriptiveAnswerChange = (event) => {
        setDescriptiveAnswerText(event.target.value);
    };
    const handleScoreChange = (event) => {
        setScore(event.target.value);
    }

    const addQuestion = async () => {
        if (!questionText || !score) {
            alert('لطفا اطلاعات سوال را کامل بنویسید')
            return
        }
        setLoading(true)

        if (questionType === 'multiple-option') {

            try {
                await fetch(`${URL}/quiz/add/question/multiple-option`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access_token}`

                    },
                    body: JSON.stringify({
                        question: questionText,
                        quiz_id: id,
                        options: options,
                        score: score,
                        correct_option_index: correctOption - 1
                    }),

                });
                navigate(`/exam/${id}`);


            } catch (error) {
                alert('Something went wrong')
                console.log(error)
            }
            finally {
                setLoading(false)
            }

        } else if (questionType === 'descriptive-short') {
            try {
                await fetch(`${URL}/quiz/add/question/descriptive-short`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access_token}`

                    },
                    body: JSON.stringify({
                        question: questionText,
                        answer: descriptiveAnswerText,
                        score: score,
                        quiz_id: id
                    }),
                });

                navigate(`/exam/${id}`);


            } catch (error) {
                alert('Something went wrong')
                console.log(error);
            }
            finally {
                setLoading(false)
            }
        }
        else if (questionType === 'descriptive-long') {
            try {
                await fetch(`${URL}/quiz/add/question/descriptive-long`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access_token}`

                    },
                    body: JSON.stringify({
                        question: questionText,
                        answer: descriptiveAnswerText,
                        score: score,
                        quiz_id: id
                    }),
                });



                navigate(`/exam/${id}`);

            } catch (error) {
                alert('Something went wrong')
                console.log(error);
            }
            finally {
                setLoading(false)
            }
        }
    };

    const addOption = () => {
        setMultipleOptionCounter(multipleOptionCounter + 1);
        setOptions([...options, { text: '', id: `option${multipleOptionCounter + 1}` }]);
    };

    const removeOption = () => {
        if (multipleOptionCounter > 0) {
            if (correctOption === options.length) {
                setCorrectOption(correctOption - 1);
            }
            setMultipleOptionCounter(multipleOptionCounter - 1);
            setOptions(options.slice(0, options.length - 1));
        }
    };

    const handleOptionChange = (event, index) => {
        const updatedOptions = [...options];
        updatedOptions[index].text = event.target.value;
        setOptions(updatedOptions);
    };

    const optionInputs = options.map((option, index) => (
        <div key={option.id} className='add-question-mp'>
            <label htmlFor={option.id}>{`گزینه ${index + 1}:`}</label>
            <input
                key={option.id}
                type='text'
                id={option.id}
                value={option.text}
                onChange={(e) => handleOptionChange(e, index)}
            />
        </div>
    ));

    const handleCorrectOptionChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= options.length) {
            setCorrectOption(value);
        }
    };


    let addQuestionContent
    switch (questionType) {
        case 'multiple-option':
            addQuestionContent = (
                <div>
                    {optionInputs}
                    <div className='mp-option-buttons'>
                        <button className='add-option-button' onClick={addOption}>+</button>
                        <button className='remove-option-button' onClick={removeOption}>-</button>
                    </div>

                    {multipleOptionCounter > 0 &&
                        <div className='correct-option-input'>
                            <label htmlFor='correct-option'> گزینه صحیح:</label>
                            <input
                                type='number'
                                id='correct-option'
                                min='1'
                                max={options.length}
                                value={correctOption}
                                onChange={handleCorrectOptionChange}
                            />
                        </div>
                    }
                </div>
            );
            break;

        case 'descriptive-short':
            addQuestionContent = (
                <div className='add-question-descriptive'>
                    <label htmlFor="descriptive-answer">جواب:</label>
                    <textarea
                        id="descriptive-answer"
                        className='descriptive-answer'
                        onChange={handleDescriptiveAnswerChange}
                        value={descriptiveAnswerText} />
                </div>
            );
            break;

        case 'descriptive-long':
            addQuestionContent = (
                <div className='add-question-descriptive'>
                    <label htmlFor="descriptive-answer">جواب:</label>
                    <textarea
                        id="descriptive-answer"
                        className='descriptive-answer long'
                        onChange={handleDescriptiveAnswerChange}
                        value={descriptiveAnswerText} />
                </div>
            );
            break;

        default:
            addQuestionContent = null;
            break;

    }
    return (
        <div className="add-question-container">
            <div className="add-question-title">
                <label htmlFor="question-input" className="add-question-label">
                    متن سوال :
                </label>
                <input
                    type="text"
                    placeholder='متن سوال خود را اینجا بنویسید...'
                    className="add-question-input"
                    id="question-input"
                    onChange={handleQuestionChange}
                    value={questionText} />
            </div>

            <div className="add-question-score">
                <label htmlFor="score-input" className="add-question-score">
                    این سوال چند نمره دارد ؟
                </label>
                <input
                    type="number"
                    placeholder='مثال : 2'
                    className="add-question-input"
                    id="question-input"
                    onChange={handleScoreChange}
                    value={score} />
            </div>

            <label htmlFor="question-type-select" className="add-question-label">
                نوع سوال را انتخاب کنید:
            </label>
            <select
                id="question-type-select"
                value={questionType}
                onChange={handleQuestionTypeChange}
            >
                <option value="descriptive-short">تشریحی کوتاه پاسخ</option>
                <option value="descriptive-long">تشریحی بلند پاسخ</option>
                <option value="multiple-option">چند گزینه ای</option>
            </select>

            {addQuestionContent}
            <br />
            <button onClick={addQuestion} className='add-question-submit-btn'>تایید</button>
            <Link to={`/exam/${id}`}>
                <button className='back-btn'>بازگشت</button>
            </Link>

        </div>
    );
}

export default AddQuestion
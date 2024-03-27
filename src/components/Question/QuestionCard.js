import React, { useState, useContext, useEffect } from 'react'
import './QuestionCard.css'
import AuthContext from '../../context/AuthContext';
import config from '../../config.json';
const URL = config.api_url;


const QuestionCard = ({
  text,
  questionType,
  choices,
  questionID,
  examID,
  score,
  isCorrect,
  correctAnswer,
  setLoading,
  isCreator,
  userAnswerId,
  resultCheckMode,
  userAnswers,
  setUserAnswers,
  setMultipleOptionResultsChange,
  multipleOptionsResultsChanges,
  setDescriptiveScore,
  descriptiveScore

}) => {
  const { authTokens } = useContext(AuthContext)
  const [selectedOption, setSelectedOption] = useState(null);
  const [editorMode, setEditorMode] = useState(false)
  const [newQuestionText, setNewQuestionText] = useState('')
  const [questionScore, setQuestionScore] = useState(null)
  const [initialChoices, setInitialChoices] = useState([])
  const [correctOption, setCorrectOption] = useState(1)
  const [initialIsCorrect, setInitialIsCorrect] = useState()
  const [userAnswerForId, setUserAnswerForId] = useState(userAnswers && userAnswers.answer ? userAnswers.answer : null)
  useEffect(() => {
    if (questionType === 'multiple_options' && choices && choices.length > 0) {
      setInitialChoices(choices.map(choice => ({ id: choice.id, text: choice.text })));
    }
    setInitialIsCorrect(isCorrect)
  }, [choices, questionType]);

  const handleAnswerChange = (event) => {
    const value = event.target.value;

    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: value,
    }));
  };

  const handleAnswerTextChange = (e, index) => {
    const updatedAnswerTexts = [...initialChoices];
    updatedAnswerTexts[index] = { ...updatedAnswerTexts[index], text: e.target.value };
    setInitialChoices(updatedAnswerTexts);
  };

  const handleOptionChange = (index, choiceId) => {
    setSelectedOption(parseInt(index));
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: index,
      id: choiceId
    }));
  };


  const handleCorrectOptionChange = (event) => {
    const value = event.target.value
    setCorrectOption(value)
  }

  const editQuestion = () => {
    setEditorMode(!editorMode);
  };

  const handleMultipleOptionResultChange = () => {
    if (multipleOptionsResultsChanges.includes(userAnswerId)) {
      const updatedResults = multipleOptionsResultsChanges.filter(result => result !== userAnswerId);
      setMultipleOptionResultsChange(updatedResults);
      setInitialIsCorrect(isCorrect => !isCorrect)
    }
    else {
      setMultipleOptionResultsChange([...multipleOptionsResultsChanges, userAnswerId]);
      setInitialIsCorrect(isCorrect => !isCorrect)

    }

  }

  const handleDescriptiveScore = (e) => {
    const inputValue = parseInt(e.target.value, 10);
    if (inputValue > score) {
      e.target.value = score;
    }

    setDescriptiveScore({
      ...descriptiveScore,
      [userAnswerId]: {
        score: e.target.value
      }
    })
  }

  const handleQuestionChange = (event) => {
    const value = event.target.value
    setNewQuestionText(value)
  }

  const handleScoreChange = (event) => {
    const value = event.target.value
    setQuestionScore(value)
  }

  const addOption = () => {
    setInitialChoices([...initialChoices, ' ']);
  };

  const removeOption = () => {
    if (initialChoices.length > 2) {
      const updatedChoices = [...initialChoices];
      updatedChoices.pop();
      setInitialChoices(updatedChoices);
    }
  };

  const updateMultipleOptionQuestion = async () => {
    console.log('ACTIVATING MULTIPLEEEEEEE')
    setLoading(true)
    const tempOptions = initialChoices.map(choice => ({
      id: choice.id,
      text: choice.text
    }));
    const sendingData = {
      text: newQuestionText ? newQuestionText : text,
      options: tempOptions,
      new_score: questionScore ? questionScore : score,
      correct_option_index: parseInt(correctOption)
    }
    console.log(tempOptions)
    try {
      const response = await fetch(`${URL}/quiz/${examID}/edit/question/${questionID}/multiple-option`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authTokens?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendingData),
      });
      const data = await response.json()
      console.log(data)

    } catch (error) {
      alert('Something went wrong')

    }
    finally {
      setLoading(false)
      window.location.reload();

    }
  }

  const updateDescriptiveQuestion = async () => {


    setLoading(true)
    const sendingData = {
      text: newQuestionText ? newQuestionText : text,
      answer: userAnswerForId,
      new_score: questionScore ? questionScore : score,
    }
    try {
      await fetch(`${URL}/quiz/${examID}/edit/question/${questionID}/descriptive`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authTokens?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendingData),
      });
      window.location.reload()
    } catch (error) {
      alert('Something went wrong')

    }
    finally {
      setLoading(false)
    }
  }

  let questionContent;
  switch (questionType) {
    case 'multiple_options':
      questionContent = (
        <div>
          {editorMode ? (
            <input
              onChange={handleQuestionChange}
              className="question-title edit-mode"
              value={newQuestionText ? newQuestionText : text}
            />
          ) : (
            <h3 className="question-title">{text}</h3>
          )}


          {resultCheckMode ? (
            <ul className="options">
              {initialChoices.map((choice, index) => (
                <li key={`option_${choice.id}`} className={resultCheckMode && correctOption === index ? 'user-option' : ''}>
                  <p>
                    {index + 1}. {choice.text}
                  </p>
                </li>
              ))}
              <p className='correct-answer'>جواب صحیح : {initialChoices.find(c => c.id === userAnswers)?.text}</p>

            </ul>
          ) : (
            <ul className="options">
              {initialChoices.map((choice, index) => (
                <li key={`option_${choice.id}`}>
                  {editorMode ? (
                    <>
                      {index + 1}
                      <input
                        type="text"
                        name={`option_${choice.id}`}
                        value={choice.text}
                        onChange={(e) => handleAnswerTextChange(e, index)}
                      />
                    </>
                  ) : (
                    <label>
                      {index + 1}.
                      <input
                        type="radio"
                        name={`options_${text}`}
                        value={index}
                        checked={selectedOption === index}
                        onChange={() => handleOptionChange(index, choice.id)}
                      />
                      {choice.text}
                    </label>
                  )}
                </li>
              ))}
            </ul>
          )}


          {editorMode &&
            <div className='edit-score-container'>
              <label>نمره سوال : </label>
              <input type='number' className='edit-score-input' value={questionScore ? questionScore : score} onChange={handleScoreChange} />
            </div>
          }

          {editorMode &&
            <div className='edit-correct-option-btn'>
              <label className=''>گزینه صحیح : </label>
              <input
                onChange={handleCorrectOptionChange}
                value={correctOption}
                type='number'
                className='edit-correct-option-input' />
            </div>
          }

          {editorMode &&
            <div className='edit-option-btn'>
              <button className='add-option-button editor-mode' onClick={addOption}>+</button>
              <button className='remove-option-button editor-mode' onClick={removeOption}>-</button>
            </div>
          }

          {resultCheckMode &&
            <div className='result-check-btn-container'>
              <label>تغییر وضعیت سوال به : </label>
              <button
                onClick={handleMultipleOptionResultChange}>
                {initialIsCorrect ? 'نادرست' : 'درست'}
              </button>
            </div>
          }
          {editorMode &&
            <div className='done-editing-container'>
              <button
                onClick={updateMultipleOptionQuestion}

                className='done-question-button'>تایید</button>
            </div>
          }
        </div>
      );
      break;

    case 'descriptive_long_answer':
      questionContent = (
        <div className='descriptive-container'>
          {editorMode ?
            <input onChange={handleQuestionChange}
              className="question-title edit-mode"
              value={newQuestionText ? newQuestionText : text} />
            :
            <h3 className="question-title">{text}</h3>
          }
          <input
            onChange={(e) => setUserAnswerForId(e.target.value) || handleAnswerChange(e)}
            value={userAnswerForId || ''}
            type='text'
            className="answer-input"
          />
          {editorMode &&
            <div className='done-editing-container'>
              <button
                onClick={updateDescriptiveQuestion}

                className='done-question-button'>تایید</button>
            </div>
          }
        </div>
      );
      break;

    case 'descriptive_short_answer':
      questionContent = (
        <div>
          {editorMode ?
            <input onChange={handleQuestionChange}
              className="question-title edit-mode"
              value={newQuestionText ? newQuestionText : text} />
            :
            <h3 className="question-title">{text}</h3>
          }
          {resultCheckMode ?
            <p className="answer-input short" >{userAnswers}</p>
            :
            <input
              onChange={(e) => setUserAnswerForId(e.target.value) || handleAnswerChange(e)}
              value={userAnswerForId || ''}
              type='text'
              className="answer-input short"
            />

          }
          {resultCheckMode &&
            <>
              <p className='correct-answer'>جواب صحیح: {correctAnswer}</p>
              <label for="score">نمره: </label>
              <input
                className="score-input"
                id="score"
                name="score"
                type="number"
                max={score}
                min="0"
                onChange={handleDescriptiveScore}
              />
            </>
          }
          {editorMode &&
            <div className='done-editing-container'>
              <button
                onClick={updateDescriptiveQuestion}
                className='done-question-button'>تایید</button>
            </div>
          }
        </div>
      );
      break;


    default:
      questionContent = (
        <div>
          <h3 className="question-title"> مشکلی در دریافت سوال وجود دارد</h3>
          <p>This question type is not supported.</p>
        </div>
      );

  }

  const deleteQuestion = async () => {
    try {
      const response = await fetch(`${URL}/quiz/delete/question/${questionID}/quiz/${examID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens?.access_token}`
        }
      });
      const data = response.json()
      console.log(data)
    } catch (error) {
      alert('Something went wrong')
    }
  }

  return (
    <div className="question-card">
      {isCreator &&
        <div className='edit-buttons'>
          <button onClick={deleteQuestion} className='delete-question-button'>حذف</button>
          <button onClick={editQuestion} className='edit-question-button'>{editorMode ? 'لغو' : 'ویرایش'}</button>

        </div>
      }

      {questionContent}
      <p>نمره سوال : {score}</p>


    </div >
  );
}

export default QuestionCard
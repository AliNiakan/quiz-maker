import React, { useState, useContext, useEffect } from 'react'
import "./Authentication.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/AuthContext';
import config from '../../config.json';
const URL = config.api_url;



const Login = ({ togglePopup, showPopup }) => {
    const { loginUser, loginData } = useContext(AuthContext);
    console.log(loginData)
    const [isRegister, setIsRegister] = useState(true)
    const [isCodeSended, setIsCodeSended] = useState(false)
    const [errorMessages, setErrorMessages] = useState([]);
    const [errorLocations, setErrorLocations] = useState([]);

    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        password: '',
        verify_code: ''
    });
    const errors = {
        'value_error.email': 'ایمیل اشتباه است',
        'value_error': 'مقدار مورد نظر را اشتباه وارد کردید',
        'string_too_short.full_name': 'نام کوتاه است',
        'string_too_short.password': 'رمز عبور کوتاه است',
        'string_pattern_mismatch.password': 'رمز قوی نیست',
        'email_exists.manuall': 'ایمیل در حال حاضر وجود دارد',
        'wrong_credentials.manuall': 'اطلاعات وارد شده اشتباه است',
        "wrong_verify_code.verify_code": 'کد دریافتی اشتباه است.',
        "int_parsing.verify_code": 'کد دریافتی را وارد کنید .',
        "string_pattern_mismatch.password": `رمز قوی نیست,حداقل از یکی از این حروف استفاده کنید: '' ^.* [@$! %*?&].* $'"`
    }
    const handleErrors = (errorsMe) => {
        const errorType = `${errorsMe[0].type}.${errorsMe[0].loc[1]}`
        console.log(errorType)
        const errorMessage = errors[errorType] || 'خطای ناشناخته رخ داده است';
        console.log(errorMessage)
        return errorMessage
    }


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrorLocations([]);
    }

    const toggleRegister = () => {
        setIsRegister(!isRegister)
        setErrorMessages([])
    }
    const sendVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${URL}/user/register/send-code`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await response.json()
            console.log(data)
            if (response.status !== 200) {
                const errorMessage = handleErrors(data.detail)
                setErrorMessages([errorMessage]);
                setErrorLocations(['']);
            }
            else {
                setIsCodeSended(true)
            }
        } catch (error) {
            setErrorMessages('Type the data correctly')
        }


    };

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${URL}/user/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    full_name: formData.full_name,
                    password: formData.password,
                    verify_code: formData.verify_code
                })

            });
            const data = await response.json()
            console.log(formData)
            console.log(data)
            console.log(response.status)
            if (!response.ok) {
                const errorMessage = handleErrors(data.detail)
                setErrorMessages([errorMessage]);
                setErrorLocations(['']);
            }
            else {
                alert('با موفقیت ثبت نام شدید , حالا وارد حساب خود شوید')
                window.location.reload()
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessages('Type the data correctly')

        }


    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const email = formData.email
            const password = formData.password
            const response = await loginUser(email, password);
            if (response.access_token && response.refresh_token) {
                togglePopup()
            } else {
                const errorMessage = handleErrors(loginData.detail);
                setErrorMessages([errorMessage]);
                setErrorLocations(['']);
            }
        } catch (error) {
            setErrorMessages('Type the data correctly')

        }


    };

    return (
        <div className="register-container">
            {showPopup && (
                <div className="popup" >
                    <div className="popup-content" >
                        <button className="close-button" onClick={togglePopup}>
                            <FontAwesomeIcon icon={faX} className='close-icon' />
                        </button>
                        <h2 className='popup-title'>{isRegister ? 'ثبت نام' : 'ورود'}</h2>
                        {errorMessages.length > 0 &&
                            <p className='error-message'>
                                {errorMessages}
                            </p>
                        }



                        <form onSubmit={isCodeSended ? registerUser : (isRegister ? sendVerifyCode : loginHandler)}>
                            <label htmlFor="email">ایمیل:</label>
                            <input
                                className={errorLocations.includes('email') ? 'warning' : ''}
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                readOnly={isCodeSended} />

                            {isRegister && isCodeSended &&
                                <>
                                    <label htmlFor="verify_code">کد دریافت شده را وارد کنید:</label>
                                    <input
                                        className={errorLocations.includes('verify_code') ? 'warning' : ''}
                                        type="text"
                                        id="verify_code"
                                        name="verify_code"
                                        value={formData.verify_code}
                                        onChange={handleFormChange}
                                    />

                                    <label htmlFor="full_name">نام و نام خانوادگی:</label>
                                    <input
                                        className={errorLocations.includes('full_name') ? 'warning' : ''}
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleFormChange}
                                    />

                                    <label htmlFor="password">رمز عبور:</label>
                                    <input
                                        className={errorLocations.includes('password') ? 'warning' : ''}
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                    />

                                </>
                            }
                            {!isRegister && <>
                                <label htmlFor="password">رمز عبور:</label>
                                <input className={errorLocations.includes('password') ? 'warning' : ''} type="password" id="password" name="password" value={formData.password} onChange={handleFormChange} />
                            </>}
                            <button type="submit">تایید</button>
                        </form>
                        {isRegister ?
                            <p>قبلا ثبت نام کرده اید؟ <a onClick={toggleRegister}>ورود</a></p>
                            :
                            <p>تا به حال ثبت نام نکرده اید؟<a onClick={toggleRegister}>ثبت نام</a></p>

                        }

                    </div>

                </div>

            )}
        </div>
    )
}

export default Login
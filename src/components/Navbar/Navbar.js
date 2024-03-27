import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ togglePopup }) => {
    const { logoutUser, authTokens } = useContext(AuthContext);

    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <header>
            <div className="navbar">
                <h1 className="navbar-title">
                    <span style={{ color: '#0047AB' }}>آزمون</span>&nbsp;
                    <span style={{ color: '#00BFFF' }}>ساز</span>
                </h1>

                <button className="menu-toggle" onClick={toggleNav}>
                    ☰
                </button>
                <nav className={`nav-links ${isNavOpen ? 'open' : ''}`}>
                    {authTokens ? <button className="link-button" onClick={logoutUser}>خروج</button>
                        :
                        <button className="link-button" onClick={togglePopup}>ثبت نام</button>
                    }
                    <a href="/">خانه</a>
                    <a href="#">پشتیبانی</a>

                </nav>
            </div>
        </header>
    );
};

export default Navbar;

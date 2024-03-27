import React from 'react';
import "./Footer.css";

const Footer = () => {
    return (
        <div className='wrapper'>
            <div className="footer-content">
                <p>&copy; 2023 Azmoon builder</p>
                <ul className="footer-links">
                    <li><a href="/">خانه</a></li>
                    <li><a href="/about">درباره ما</a></li>
                    <li><a href="/contact">تماس با ما</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Footer;

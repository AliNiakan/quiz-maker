import React, { useState } from 'react';
import './App.css';
import "./Scrollbar.css"
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Exam from './components/Exam/Exam';
import LoginAndRegister from './components/Authentication/LoginAndRegister';
import Results from './components/Results/Results';
import ResultsCheck from './components/Results/ResultsCheck';
import AddQuestion from './components/Question/AddQuestion';
import AddExam from './components/Exam/AddExam';
import Loading from './components/Loading/Loading'
import ExamEditor from './components/Exam/ExamEditor';
import UserExam from './components/UserExam/UserExam';
import Error from './components/Error/Error';

import { Route, Routes } from 'react-router-dom';



function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div>

      <div className='content'>

        <header>
          <Navbar togglePopup={togglePopup} />
          {loading && <Loading />}

        </header>

        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/add-question/:id" element={<AddQuestion loading={loading} setLoading={setLoading} />} />
            <Route exact path="/exam/:id" element={<ExamEditor loading={loading} setLoading={setLoading} />} />
            <Route path="/my-exams" element={<Exam loading={loading} setLoading={setLoading} />} />
            <Route path="/add-exam" element={<AddExam />} />
            <Route exact path="/userexam/:name" element={<UserExam loading={loading} setLoading={setLoading} />} />
            <Route exact path="/results/:id" element={<Results loading={loading} setLoading={setLoading} />} />
            <Route exact path="/result-check/:id/:user" element={<ResultsCheck loading={loading} setLoading={setLoading} />} />
            <Route path="*" element={<Error title="خطای 404" message="متاسفانه چنین صفحه ای یافت نشد" />} />

          </Routes>

          {showPopup &&
            <LoginAndRegister
              togglePopup={togglePopup}
              showPopup={showPopup}
              setShowPopup={setShowPopup}
            />}
        </main>
      </div>

      <footer>
        <Footer />

      </footer>

    </div >
  );
}

export default App;

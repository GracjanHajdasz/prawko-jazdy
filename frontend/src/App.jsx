import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Komponenty
import Navbar from "./components/navbar/Navbar.jsx";
import Login from "./components/login-page/Login.jsx";
import Register from "./components/register-page/Register.jsx";
import PopUp from "./components/pop-up/PopUp.jsx";
import Scheduler from "./components/scheduler/Scheduler.jsx";
import MainPage from "./components/main-page/MainPage.jsx";
import Tests from "./components/tests/Tests.jsx";
import Exam from "./components/exam/Exam.jsx";
import Footer from "./components/footer/Footer.jsx";
import UserPanel from "./components/user-panel/UserPanel.jsx";
import PageNotFound from "./components/pagenotfound/PageNotFound.jsx";

export default function App() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const triggerPopUp = (text) => {
    setPopUpText(text);
    setShowPopUp(true);
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="app">
        {!isLoggedIn ? (
          <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} triggerPopUp={triggerPopUp} />} />
            <Route path="/register" element={<Register triggerPopUp={triggerPopUp} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/harmonogram" element={<Scheduler triggerPopUp={triggerPopUp} />} />
            <Route path="/testy" element={<Tests />} />
            <Route path="/egzamin" element={<Exam />} />
            <Route path="/panel-uzytkownika" element={<UserPanel />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        )}

        {showPopUp && (
          <PopUp
            popUpText={popUpText}
            duration={3000}
            show={showPopUp}
            setShowPopUp={setShowPopUp}
          />
        )}
      </div>
      <Footer />
    </BrowserRouter>
  );
}
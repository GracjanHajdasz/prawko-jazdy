import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
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
  const [loading, setLoading] = useState(true);

  const triggerPopUp = (text) => {
    setPopUpText(text);
    setShowPopUp(true);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get("http://localhost:5000/api/auth/verify", { 
          withCredentials: true 
        });
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return <div>Ładowanie...</div>;

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
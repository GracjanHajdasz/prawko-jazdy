import "./App.css";
import { useState } from "react";
import Navbar from "./components/navbar/Navbar.jsx";
import Login from "./components/login-page/Login.jsx";
import Register from "./components/register-page/Register.jsx";
import PopUp from "./components/pop-up/PopUp.jsx";
import Scheduler from "./components/scheduler/Scheduler.jsx";
import MainPage from "./components/main-page/MainPage.jsx";
import Tests from "./components/tests/Tests.jsx";
import Exam from "./components/exam/Exam.jsx";
import Footer from "./components/footer/Footer.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  const [clientid, setClientid] = useState("");
  const [password, setPassword] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [hasAccount, setHasAccount] = useState(true);

  return (
    <BrowserRouter>
    <Navbar />
      <div className="app">
        <Routes>
          {/* {{hasAccount ? ( */}
          <Route
            path="/login"
            element={
              <Login
                setHasAccount={setHasAccount}
                clientid={clientid}
                setClientid={setClientid}
                password={password}
                setPassword={setPassword}
                showPopUp={showPopUp}
                setShowPopUp={setShowPopUp}
                popUpText={popUpText}
                setPopUpText={setPopUpText}
              />
            }
          />
          {/* ) : ( */}
          <Route
            path="/register"
            element={
              <Register
                setHasAccount={setHasAccount}
                clientid={clientid}
                setClientid={setClientid}
                password={password}
                setPassword={setPassword}
                showPopUp={showPopUp}
                setShowPopUp={setShowPopUp}
                popUpText={popUpText}
                setPopUpText={setPopUpText}
              />
            }
          />
          <Route path="/" element={<MainPage />} />
          <Route
            path="/scheduler"
            element={
              <Scheduler
                setShowPopUp={setShowPopUp}
                setPopUpText={setPopUpText}
              />
            }
          />
          <Route path="/tests" element={<Tests />} />
          <Route path="/exam" element={<Exam />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
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

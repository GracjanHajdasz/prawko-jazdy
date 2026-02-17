import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/login-page/Login.jsx";
import Register from "./components/register-page/Register.jsx";
import PopUp from "./components/pop-up/PopUp.jsx";
import Scheduler from "./components/scheduler/Scheduler.jsx";
import MainPage from "./components/main-page/MainPage.jsx";
import Home from "./components/home/Home.jsx";
import PageNotFound from "./components/pagenotfound/PageNotFound.jsx";
import Tests from "./components/tests/Tests.jsx";

export default function App() {
  // const [clientid, setClientid] = useState("");
  // const [password, setPassword] = useState("");
  // const [showPopUp, setShowPopUp] = useState(false);
  // const [popUpText, setPopUpText] = useState("");
  // const [hasAccount, setHasAccount] = useState(true);

  return (
    <div className="app">
      <Tests />
      {/*<BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        {/*<MainPage />
      {/*<Scheduler setShowPopUp={setShowPopUp} setPopUpText={setPopUpText} />
      {/*{hasAccount ? (
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
      ) : (
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
      )}

      {showPopUp && (
        <PopUp
          popUpText={popUpText}
          duration={3000}
          show={showPopUp}
          setShowPopUp={setShowPopUp}
        />
      )}
      </BrowserRouter>*/}
    </div>
  );
}

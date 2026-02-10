import "./App.css";
import { useState } from "react";
import Login from "./components/login-page/Login.jsx";
import Register from "./components/register-page/Register.jsx";
import PopUp from "./components/pop-up/PopUp.jsx";

export default function App() {
  const [clientid, setClientid] = useState("");
  const [password, setPassword] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [hasAccount, setHasAccount] = useState(true);

  return (
    <div className="app">
      {hasAccount ? (
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
    </div>
  );
}

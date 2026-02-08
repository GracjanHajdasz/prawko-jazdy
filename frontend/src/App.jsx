import "./App.css";
import { useState, useEffect } from "react"; 
import Login from "./components/login-page/Login.jsx";
import Register from "./components/register-page/Register.jsx";
import PopUp from "./components/pop-up/PopUp.jsx";

export default function App() {
  const [hasAccount, setHasAccount] = useState(true); //checks if user has an account
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([])
  const [showPopUp, setShowPopUp] = useState(false)
  const [popUpText, setPopUpText] = useState("")

  useEffect(
    ()=>{
      console.log("users updated: ", users);
    }, [users]
  )

  return (
    <div className="app">
      {hasAccount ? <Login 
      setHasAccount={setHasAccount} 
      login={login} 
      setLogin={setLogin} 
      password={password} 
      setPassword={setPassword}
      users={users}
      setUsers={setUsers}
      showPopUp={showPopUp}
      setShowPopUp={setShowPopUp}
      popUpText={popUpText}
      setPopUpText={setPopUpText} /> : 
      <Register 
      setHasAccount={setHasAccount} 
      login={login} 
      setLogin={setLogin} 
      password={password} 
      setPassword={setPassword}
      users={users}
      setUsers={setUsers}
      showPopUp={showPopUp}
      setShowPopUp={setShowPopUp}
      popUpText={popUpText}
      setPopUpText={setPopUpText} />}

      {
        showPopUp &&
        <PopUp popUpText={popUpText} duration={3000} show={showPopUp} setShowPopUp={setShowPopUp} />
      }
    </div>
  );
}
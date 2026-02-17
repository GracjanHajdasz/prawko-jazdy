import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login({
  setHasAccount,
  clientid,
  setClientid,
  password,
  setPassword,
  setShowPopUp,
  setPopUpText,
}) {
  const [isEmpty, setIsEmpty] = useState(false);

  function saveLogin(event) {
    setClientid(event.target.value);
  }

  function savePassword(event) {
    setPassword(event.target.value);
  }

  function checkIfEmpty() {
    if (clientid === "" || password === "") {
      setIsEmpty(true);
      console.log("login or password is empty");
      setPopUpText("login lub hasło są puste");
      setShowPopUp(true);
      setIsEmpty(false);
    } else {
      handleLogin();
    }
  }

  function handleLogin() {
    console.log(`${clientid} ${password}`);
    axios
      .post("http://localhost:5000/api/auth/login", {
        clientid: clientid,
        password: password,
      })
      .then((response) => {
        setPopUpText(response.data["Msg"]);
        setShowPopUp(true);
      });
  }

  return (
    <div className="login-container">
      <h1>Zaloguj się</h1>
      <div className="input-container">
        <input className="stylized-input" type="text" placeholder="Login" onChange={saveLogin} />
        <input className="stylized-input" type="password" placeholder="Hasło" onChange={savePassword} />
      </div>
      <Link to="/register" className="switch-login-register" onClick={() => setHasAccount(false)}>
        Nie posiadasz jeszcze konta?{" "}
      </Link>
      <button className="btn" onClick={() => checkIfEmpty()}>
        Zaloguj
      </button>
    </div>
  );
}

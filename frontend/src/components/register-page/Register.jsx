import "./Register.css";
import { useState } from "react";
import axios from "axios";

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

  function checkIfUserExists() {
    axios
      .post("http://localhost:5000/api/auth/login", {
        clientid: clientid,
        password: password,
      })
      .then((response) => {
        setPopUpText(response.data["Msg"]);
        setShowPopUp(true);
      });
    setClientid("");
    setPassword("");
    setHasAccount(true);
  }

  function checkIfEmpty() {
    if (clientid === "" || password === "") {
      setIsEmpty(true);
      console.log("login or password is empty");
      setPopUpText("login lub hasło są puste");
      setShowPopUp(true);
      setIsEmpty(false);
    } else {
      checkIfUserExists();
    }
  }

  return (
    <div className="login-container">
      <h1>Zarejestruj się</h1>
      <div className="input-container">
        <input type="text" placeholder="Login" onChange={saveLogin} />
        <input type="password" placeholder="Hasło" onChange={savePassword} />
      </div>
      <p onClick={() => setHasAccount(true)}>Posiadasz już konto?</p>
      <button className="btn" onClick={() => checkIfEmpty()}>Zarejestruj się</button>
    </div>
  );
}

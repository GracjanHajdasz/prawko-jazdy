import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ triggerPopUp }) {
  const [clientid, setClientid] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  function saveLogin(event) {
    setClientid(event.target.value);
  }

  function savePassword(event) {
    setPassword(event.target.value);
  }

  function handleRegister() {
    axios
      .post("http://localhost:5000/api/auth/register", {
        clientid: clientid,
        password: password,
      })
      .then((response) => {
        triggerPopUp(response.data.msg || "Konto zostało pomyślnie utworzone!");
        
        setClientid("");
        setPassword("");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          triggerPopUp(error.response.data.error || "Błąd podczas rejestracji");
        } else {
          triggerPopUp("Błąd połączenia z serwerem");
        }
      });
  }

  function checkIfEmpty() {
    if (clientid === "" || password === "") {
      console.log("login or password is empty");
      triggerPopUp("Login lub hasło są puste");
    } else {
      handleRegister();
    }
  }

  return (
    <div className="login-container">
      <h1>Zarejestruj się</h1>
      <div className="input-container">
        <input 
          className="stylized-input" 
          type="text" 
          placeholder="Login" 
          value={clientid} 
          onChange={saveLogin} 
        />
        <input 
          className="stylized-input" 
          type="password" 
          placeholder="Hasło" 
          value={password} 
          onChange={savePassword} 
        />
      </div>
      
      <Link to="/login" className="switch-login-register">
        Posiadasz już konto?
      </Link>
      
      <button className="btn" onClick={checkIfEmpty}>
        Zarejestruj się
      </button>
    </div>
  );
}
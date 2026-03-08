import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn, triggerPopUp }) {
  const [isEmpty, setIsEmpty] = useState(false);
  const [clientid, setClientid] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

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
      
      triggerPopUp("login lub hasło są puste");
      
      setIsEmpty(false);
    } else {
      handleLogin();
    }
  }

  function handleLogin() {
    console.log(`${clientid} ${password}`);
    
    axios
      .post(
        "http://localhost:5000/api/auth/login", 
        {
          clientid: clientid,
          password: password,
        },
        {
          withCredentials: true 
        }
      )
      .then((response) => {
        localStorage.setItem("clientid", clientid);
        
        triggerPopUp(response.data.msg); 
        
        setIsLoggedIn(true); 
        
        navigate("/panel-uzytkownika"); 
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          triggerPopUp(error.response.data.error);
        } else {
          triggerPopUp("Błąd połączenia z serwerem");
        }
      });
  }

  return (
    <div className="login-container">
      <h1>Zaloguj się</h1>
      <div className="input-container">
        <input className="stylized-input" type="text" placeholder="Login" onChange={saveLogin} />
        <input className="stylized-input" type="password" placeholder="Hasło" onChange={savePassword} />
      </div>
      
      <Link to="/register" className="switch-login-register">
        Nie posiadasz jeszcze konta?{" "}
      </Link>
      
      <button className="btn" onClick={checkIfEmpty}>
        Zaloguj
      </button>
    </div>
  );
}
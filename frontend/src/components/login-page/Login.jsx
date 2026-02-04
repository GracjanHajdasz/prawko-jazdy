import "./Login.css";
import { useState } from "react";

export default function Login({ setHasAccount, login, setLogin, password, setPassword, users, setUsers }) {
    const [ isEmpty, setIsEmpty ] = useState(false)
    
    function saveLogin(event) {
        setLogin(event.target.value)
    }

    function savePassword(event) {
        setPassword(event.target.value)
    }

    function checkIfEmpty(){
        if(login === "" || password === ""){
            setIsEmpty(true)
            console.log("login or password is empty");
        } else {
            handleLogin();
        }
    }

    function handleLogin(){
        const user = users.find( (u)=>u.login === login && u.password === password )

        if(user){
            console.log("logged in as: "+login)
        } else {
            console.log("cant log in")
        }
    }
    
    return(
        <div className="login-container">
            <h1>Zaloguj się</h1>
            <div className="input-container">
                <input type="text" placeholder="Login" onChange={saveLogin}/>
                <input type="password" placeholder="Hasło" onChange={savePassword}/>
            </div>
            <p onClick={() => setHasAccount(false)}>Nie posiadasz jeszcze konta?</p>
            <button onClick={ ()=>(checkIfEmpty()) } >Zaloguj</button>
        </div>
    )
}
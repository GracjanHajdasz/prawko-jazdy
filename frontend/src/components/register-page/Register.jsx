import "./Register.css";
import { useState } from "react"

export default function Login({ setHasAccount, login, setLogin, password, setPassword, users, setUsers }) {
    const [ isLoginAvailable, setIsLoginAvailable] = useState(true)
    
    function saveLogin(event) {
        setLogin(event.target.value)
    }

    function savePassword(event) {
        setPassword(event.target.value)
    }

    function addUser(){
        const newUser = [
            ...users,
            {
                password:password,
                login:login
            }
        ];
        setUsers(newUser);
        setLogin("");
        setPassword("")
        setHasAccount(true)
    }

    function checkIfUserExists(){
        const user = users.find( (u)=>login === u.login )

        if (user) {
            setIsLoginAvailable(false)
            console.log("user already exists")
        } else {
            addUser()
        }
    }
    return(
        <div className="login-container">
            <h1>Zarejestruj się</h1>
            <div className="input-container">
                <input type="text" placeholder="Login" onChange={saveLogin}/>
                <input type="password" placeholder="Hasło" onChange={savePassword}/>
            </div>
            <p onClick={() => setHasAccount(true)}>Posiadasz już konto?</p>
            <button onClick={()=>(checkIfUserExists())} >Zarejestruj się</button>
        </div>
    )
}
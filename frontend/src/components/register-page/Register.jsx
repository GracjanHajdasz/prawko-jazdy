import "./Register.css";
import { useState } from "react"
import axios from "axios"

export default function Login({ setHasAccount, login, setLogin, password, setPassword, users, setUsers }) {
    const [ isLoginAvailable, setIsLoginAvailable] = useState(true)
    const [ isEmpty, setIsEmpty ] = useState(false)
    
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
        axios.post("http://localhost:5000/api/auth/register", {
            username: login,
            password: password
        }).then(response => console.log(response.data))
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

    function checkIfEmpty(){
        if(login === "" || password === ""){
            setIsEmpty(true)
            console.log("login or password is empty")
        } else {
            checkIfUserExists()
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
            <button onClick={()=>(checkIfEmpty())} >Zarejestruj się</button>
        </div>
    )
}
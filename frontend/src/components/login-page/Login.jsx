import "./Login.css";

export default function Login({ setHasAccount, login, setLogin, password, setPassword, users, setUsers }) {
    function saveLogin(event) {
        setLogin(event.target.value)
    }

    function savePassword(event) {
        setPassword(event.target.value)
    }
    
    return(
        <div className="login-container">
            <h1>Zaloguj się</h1>
            <div className="input-container">
                <input type="text" placeholder="Login" onChange={saveLogin}/>
                <input type="password" placeholder="Hasło" onChange={savePassword}/>
            </div>
            <p onClick={() => setHasAccount(false)}>Nie posiadasz jeszcze konta?</p>
            <button onClick={ ()=>(console.log(login+" "+password)) } >Zaloguj</button>
        </div>
    )
}
import "./Register.css";

export default function Login({ setHasAccount, login, setLogin, password, setPassword, users, setUsers }) {
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
    return(
        <div className="login-container">
            <h1>Zarejestruj się</h1>
            <div className="input-container">
                <input type="text" placeholder="Login" onChange={saveLogin}/>
                <input type="password" placeholder="Hasło" onChange={savePassword}/>
            </div>
            <p onClick={() => setHasAccount(true)}>Posiadasz już konto?</p>
            <button onClick={()=>(addUser())} >Zarejestruj się</button>
        </div>
    )
}
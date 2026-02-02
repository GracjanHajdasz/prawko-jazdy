import "./Register.css";

export default function Register({ setHasAccount }) {
    return(
        <div className="login-container">
            <h1>Zarejestruj się</h1>
            <div className="input-container">
                <input type="text" placeholder="Login"/>
                <input type="password" placeholder="Hasło"/>
            </div>
            <p onClick={() => setHasAccount(true)}>Posiadasz już konto?</p>
            <button>Zarejestruj się</button>
        </div>
    )
}
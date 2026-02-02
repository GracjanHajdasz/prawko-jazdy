import "./Login.css";

export default function Login() {
    return(
        <div className="login-container">
            <h1>Zaloguj się</h1>
            <input type="text" placeholder="Login"/>
            <input type="password" placeholder="Hasło"/>
            <p>Nie posiadasz jeszcze konta?</p>
            <button>Zaloguj</button>
            <span className="login-error-text">Błąd</span>
        </div>
    )
}
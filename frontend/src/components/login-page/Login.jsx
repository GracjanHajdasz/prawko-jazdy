import "./Login.css";

export default function Login() {
    return(
        <div className="login-container">
            <h1>Zaloguj się</h1>
            <div className="input-container">
                <input type="text" placeholder="Login"/>
                <input type="password" placeholder="Hasło"/>
            </div>
            <p>Nie posiadasz jeszcze konta?</p>
            <button>Zaloguj</button>
        </div>
    )
}
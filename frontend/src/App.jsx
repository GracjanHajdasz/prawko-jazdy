import "./App.css";
import { useState } from "react"; 
import Login from "./components/login-page/Login.jsx";
import Register from "./components/register-page/Register.jsx";

export default function App() {
  const [hasAccount, setHasAccount] = useState(true);
  return (
    <div className="app">
      {hasAccount ? <Login setHasAccount={setHasAccount}/> : <Register setHasAccount={setHasAccount}/>}
    </div>
  );
}
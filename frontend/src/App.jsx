import "./App.css";
import { useState, useEffect } from "react"; 
import Login from "./components/login-page/Login.jsx";
import Register from "./components/register-page/Register.jsx";

export default function App() {
  const [hasAccount, setHasAccount] = useState(true); //checks if user has an account
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([])

  useEffect(
    ()=>{
      console.log("users updated: ", users);
    }, [users]
  )

  return (
    <div className="app">
      {hasAccount ? <Login 
      setHasAccount={setHasAccount} 
      login={login} 
      setLogin={setLogin} 
      password={password} 
      setPassword={setPassword}
      users={users}
      setUsers={setUsers} /> : 
      <Register 
      setHasAccount={setHasAccount} 
      login={login} 
      setLogin={setLogin} 
      password={password} 
      setPassword={setPassword}
      users={users}
      setUsers={setUsers} />}
    </div>
  );
}
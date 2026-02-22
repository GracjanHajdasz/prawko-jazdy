import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout", 
        {},
        { withCredentials: true }
      );

      setIsLoggedIn(false);
      navigate("/"); 
      
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Szkoła Jazdy</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Strona główna</Link>
        </li>
        <li>
          <Link to="/harmonogram">Jazdy</Link>
        </li>
        <li>
          <Link to="/testy">Testy</Link>
        </li>
        <li>
          <Link to="/panel-uzytkownika">Panel użytkownika</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        {isLoggedIn ? (
          <Link to="/" onClick={handleLogout} className="btn-logout">
            Wyloguj się
          </Link>
        ) : (
          <Link to="/login" className="btn-login">
            Zaloguj się
          </Link>
        )}
      </div>
    </nav>
  );
}

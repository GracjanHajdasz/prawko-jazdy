import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Wylogowano użytkownika");
    navigate("/login");
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
        <button className="btn-logout" onClick={handleLogout}>
          Wyloguj
        </button>
      </div>
    </nav>
  );
}

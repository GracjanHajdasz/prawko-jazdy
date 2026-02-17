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
        <Link to="/">
          <span className="logo-icon">LOGO</span> Szkoła Jazdy
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Pulpit</Link>
        </li>
        <li>
          <Link to="/scheduler">Jazdy</Link>
        </li>
        <li>
          <Link to="/tests">Testy</Link>
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
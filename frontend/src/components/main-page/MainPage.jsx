import "./MainPage.css";
import calendarIcon from "../../assets/calendar.png";
import testsIcon from "../../assets/tests.png";
import placeholder from "../../assets/placeholder.png";
import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="main-page-container">
      <header>
        <h1>Twój kurs prawa jazdy w jednym miejscu</h1>
        <h2>
          Zarządzaj jazdami, ucz się do egzaminu oraz śledź swoje postępy szybko i wygodnie.
        </h2>
      </header>
      <main>
        <section className="main-p-section">
          <img src={placeholder} alt="calendar icon" />
          <h2>Umów się na lekcję</h2>
          <p>Wybierz instruktora i zarezerwuj dogodny termin w kalendarzu.</p>
          <Link to="/harmonogram" className="btn">
            Umów jazdę
          </Link>
        </section>
        <section className="main-p-section">
          <img src={placeholder} alt="tests icon" />
          <h2>Baza Pytań i Testy</h2>
          <p>Przygotuj się do egzaminu teoretycznego rozwiązując oficjalne zestawy.</p>
          <Link to="/testy" className="btn tests-btn">
            Rozpocznij naukę
          </Link>
        </section>
        <section className="main-p-section">
          <img src={placeholder} alt="user panel icon" />
          <h2>Twój Profil</h2>
          <p>Sprawdź liczbę wyjeżdżonych godzin, statystyki i swoje dane.</p>
          <Link to="/panel-uzytkownika" className="btn user-panel-btn">
            Zobacz postępy
          </Link>
        </section>
      </main>
    </div>
  );
}

import "./MainPage.css";
import calendarIcon from "../../assets/calendar.png";
import testsIcon from "../../assets/tests.png";
import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="main-page-container">
      <header>
        <h1>Witaj w systemie szkoly jazdy!</h1>
        <h2>
          Wybierz jedną z opcji poniżej żeby zapisać się na lekcje lub <br />
          przetestować swoją wiedzę.
        </h2>
      </header>
      <main>
        <section>
          <img src={calendarIcon} alt="calendarI icon" />
          <h2>Umów się na lekcję</h2>
          <p>Zarezerwuj termin jazdy z instruktorem</p>
          <Link to="/scheduler" className="btn">
            Zapisz się
          </Link>
        </section>
        <section>
          <img src={testsIcon} alt="tests icon" />
          <h2>Rozwiąż testy</h2>
          <p>Sprawdź swoją wiedzę rozwiązując testy</p>
          <Link to="/tests" className="btn tests-btn">
            Rozwiąż testy
          </Link>
        </section>
        <section>
          <h2>Panel użytkownika</h2>
          <p>Zarządzaj </p>
          <Link to="/user-panel" className="btn user-panel-btn">
            Przejdź do panelu <br />
            użytkownika
          </Link>
        </section>
      </main>
    </div>
  );
}

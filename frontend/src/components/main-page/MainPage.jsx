import "./MainPage.css";
import calendarIcon from "../../assets/calendar.png";
import testsIcon from "../../assets/tests.png";

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
          <button>Zapisz się</button>
        </section>
        <section>
          <img src={testsIcon} alt="tests icon" />
          <h2>Rozwiąż testy</h2>
          <p>Sprawdź swoją wiedzę rozwiązując testy</p>
          <button className="tests-btn">Rozwiąż testy</button>
        </section>
      </main>
    </div>
  );
}

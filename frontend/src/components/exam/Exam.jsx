import "./Exam.css";
import placeholder from "../../assets/placeholder.png";

export default function Exam() {
  return (
    <div className="exam-container">
      <div className="left-panel">
        <div className="top-bar">
          <div className="info-group">
            <div className="label">
              Wartość
              <br />
              punktowa
            </div>
            <div className="badge">2</div>
          </div>
          <div className="info-group">
            <div className="label">
              Aktualna
              <br />
              kategoria
            </div>
            <div className="badge">B</div>
          </div>
          <div className="info-group">
            <div className="label">
              Czas do końca
              <br />
              egzaminu
            </div>
            <div className="badge time" id="exam-time">
              24:05
            </div>
          </div>
        </div>

        <div className="image-area">
          <img src={placeholder} alt="zdjęcie do pytania" />
        </div>

        <p className="question-text">
          Czy w tej sytuacji, kierując samochodem osobowym,
          <br />
          możesz przejechać na prawy pas ruchu?
        </p>

        <div className="answer-buttons">
          <button className="btn-answer">Tak</button>
          <button className="btn-answer">Nie</button>
        </div>
      </div>

      <div className="right-panel">
        <button className="btn-end">Zakończ egzamin</button>

        <div className="questions-section">
          <div className="q-group">
            <div className="q-label">
              Pytania
              <br />
              podstawowe
            </div>
            <span className="q-badge blue">1 z 20</span>
          </div>
          <div className="q-group">
            <div className="q-label">
              Pytania
              <br />
              specjalistyczne
            </div>
            <span className="q-badge gray">0 z 12</span>
          </div>
        </div>

        <div className="timer-section">
          <div className="t-label">
            Czas na udzielenie
            <br />
            odpowiedzi
          </div>
          <span className="t-value" id="q-timer">
            10 s
          </span>
        </div>

        <button className="btn-next">Następne pytanie</button>
      </div>
    </div>
  );
}

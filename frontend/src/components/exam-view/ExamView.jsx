import "./ExamView.css";
import placeholder from "../../assets/placeholder.png";
import QuestionTile from "./question-tile/QuestionTile.jsx";

export default function ExamView() {
  return (
    <div className="exam-container">
      <section className="left-panel">
        <div className="top-bar">
          <div className="info-group">
            <span className="label">Data i czas:</span>
            <span className="badge time">01.01.2026 15:00</span>
            <span className="label">Wynik: </span>
            <span className="badge-exam-view failed">Negatywny</span>
          </div>
        </div>
        <div className="image-area">
          <img src={placeholder} alt="placeholder" />
        </div>
        <div className="answer-area">
          <p className="question-text">pytanie</p>
          <div className="answer-buttons">
            <button className="btn-answer">Tak</button>
            <button className="btn-answer">Nie</button>
          </div>
        </div>
      </section>
      <section className="right-panel">
        {[...Array(32)].map((_, i) => (
          <QuestionTile
            key={i + 1}
            questionIndex={i + 1}
            isCorrect={Math.random() > 0.5}
          />
        ))}
        <div className="explanation-area">
          <h2>Wyjasnienie</h2>
          <p>zydzi rzadza swiatem, malarz mial racje</p>
        </div>
      </section>
    </div>
  );
}

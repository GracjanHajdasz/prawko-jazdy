import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ExamView.css";
import placeholder from "../../assets/placeholder.png";
import QuestionTile from "./question-tile/QuestionTile.jsx";

export default function ExamView() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios
      .post(
        "http://localhost:5000/api/tests/getExamQuestions",
        { id: parseInt(id, 10) },
        { withCredentials: true }
      )
      .then((response) => {
        const pods = response.data.podstawowe[0] || [];
        const spec = response.data.specjalistyczne[0] || [];
        setQuestions([...pods, ...spec]);
      })
      .catch(() => {
        setError("Błąd pobierania danych egzaminu.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <div className="exam-view-container">Ładowanie...</div>;
  if (error) return <div className="exam-view-container">{error}</div>;
  if (questions.length === 0) return <div className="exam-view-container">Brak danych.</div>;

  const currentQ = questions[currentIndex];
  const isPodstawowe = currentIndex < 20;

  const mediaSource = currentQ.media && !currentQ.media.startsWith("http")
    ? `http://localhost:8000/media/${currentQ.media}`
    : currentQ.media;

  const getButtonStyle = (option) => {
    if (currentQ.poprawna_odp === option) {
      return { backgroundColor: "#4CAF50", color: "white", borderColor: "#4CAF50", opacity: 1, cursor: "default" };
    }
    if (currentQ.udzielona_odp === option && currentQ.poprawna_odp !== option) {
      return { backgroundColor: "#f44336", color: "white", borderColor: "#f44336", opacity: 1, cursor: "default" };
    }
    return { opacity: 0.6, cursor: "default" };
  };

  return (
    <div className="exam-view-container">
      <section className="left-panel">
        <div className="top-bar">
          <div className="info-group">
            <span className="label">Wynik pytania: </span>
            <span className={`badge-exam-view ${currentQ.udzielona_odp === currentQ.poprawna_odp ? "passed" : "failed"}`}>
              {currentQ.udzielona_odp === currentQ.poprawna_odp ? "Poprawny" : "Błędny"}
            </span>
          </div>
        </div>
        <div className="image-area">
          {mediaSource ? (
            mediaSource.toLowerCase().endsWith(".mp4") ? (
              <video src={mediaSource} controls autoPlay muted playsInline />
            ) : (
              <img src={mediaSource} alt="media" />
            )
          ) : (
            <img src={placeholder} alt="brak multimediów" />
          )}
        </div>
        <div className="answer-area">
          <p className="question-text">{currentQ.pytanie}</p>
          <div className="answer-buttons">
            {isPodstawowe ? (
              <>
                <button disabled style={getButtonStyle("T")} className="btn-answer">Tak</button>
                <button disabled style={getButtonStyle("N")} className="btn-answer">Nie</button>
              </>
            ) : (
              <>
                <button disabled style={getButtonStyle("A")} className="btn-answer">{currentQ.odpowiedź_a}</button>
                <button disabled style={getButtonStyle("B")} className="btn-answer">{currentQ.odpowiedź_b}</button>
                <button disabled style={getButtonStyle("C")} className="btn-answer">{currentQ.odpowiedź_c}</button>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="right-panel">
        <div className="tiles-grid">
          {questions.map((q, i) => (
            <QuestionTile
              key={i}
              questionIndex={i + 1}
              isCorrect={q.udzielona_odp === q.poprawna_odp}
              isActive={currentIndex === i}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
        <div className="explanation-area">
          <h2>Wyjaśnienie</h2>
          <p>{currentQ.wyjasnienie}</p>
        </div>
      </section>
    </div>
  );
}
import placeholder from "../../assets/placeholder.png";
import { formatTime } from "./ExamUtils";

export default function ExamLeftPanel({ examState }) {
  const {
    questions,
    currentIndex,
    answers,
    questionPhase,
    handleAnswer,
    examTimeLeft,
    finishMedia
  } = examState;

  const currentQuestion = questions[currentIndex];
  const isSpecjalistyczne = currentIndex >= 20;

  if (!currentQuestion) return null;

  return (
    <div className="left-panel">
      <div className="top-bar">
        <div className="info-group">
          <div className="label">
            Wartość
            <br />
            punktowa
          </div>
          <div className="badge">{currentQuestion.liczba_punktów}</div>
        </div>
        <div className="info-group">
          <div className="label">Kategoria</div>
          <div className="badge">B</div>
        </div>
        <div className="info-group">
          <div className="label">
            Czas do końca
            <br />
            egzaminu
          </div>
          <div className="badge time">{formatTime(examTimeLeft)}</div>
        </div>
      </div>

      <div className="image-area">
        {questionPhase === "reading" ? (
          <div className="media-placeholder">
            Naciśnij "Pomiń zapoznanie" aby zobaczyć obraz/video/multimedia
          </div>
        ) : currentQuestion.media ? (
          currentQuestion.media.toLowerCase().endsWith(".mp4") ? (
            <video 
              src={currentQuestion.media} 
              autoPlay 
              muted 
              playsInline 
              onEnded={finishMedia}
              onError={finishMedia}
            />
          ) : (
            <img src={currentQuestion.media} alt="zdjęcie do pytania" />
          )
        ) : (
          <img src={placeholder} alt="brak zdjęcia" />
        )}
      </div>

      <div className="answer-area">
        <p className="question-text">{currentQuestion.pytanie}</p>

        <div className="answer-buttons">
          {!isSpecjalistyczne ? (
            <>
              <button
                className={`btn-answer ${answers[currentIndex] === "T" ? "selected" : ""}`}
                onClick={() => handleAnswer("T")}
              >
                Tak
              </button>
              <button
                className={`btn-answer ${answers[currentIndex] === "N" ? "selected" : ""}`}
                onClick={() => handleAnswer("N")}
              >
                Nie
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn-answer ${answers[currentIndex] === "A" ? "selected" : ""}`}
                onClick={() => handleAnswer("A")}
              >
                {currentQuestion.odpowiedź_a}
              </button>
              <button
                className={`btn-answer ${answers[currentIndex] === "B" ? "selected" : ""}`}
                onClick={() => handleAnswer("B")}
              >
                {currentQuestion.odpowiedź_b}
              </button>
              <button
                className={`btn-answer ${answers[currentIndex] === "C" ? "selected" : ""}`}
                onClick={() => handleAnswer("C")}
              >
                {currentQuestion.odpowiedź_c}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
import { formatTime } from "./ExamUtils";

export default function ExamRightPanel({ examState }) {
  const {
    currentIndex,
    handleFinishExam,
    questionTimeLeft,
    questionPhase,
    goToNextQuestion,
    startMedia
  } = examState;

  const isSpecjalistyczne = currentIndex >= 20;

  return (
    <div className="right-panel">
      <button className="btn-end" onClick={handleFinishExam}>
        Zakończ egzamin
      </button>

      <div className="questions-section">
        <div className="q-group">
          <div className="q-label">Pytania<br />podstawowe</div>
          <span className={`q-badge ${!isSpecjalistyczne ? "blue" : "gray"}`}>
            {!isSpecjalistyczne ? currentIndex + 1 : 20} z 20
          </span>
        </div>

        <div className="q-group">
          <div className="q-label">Pytania<br />specjalistyczne</div>
          <span className={`q-badge ${isSpecjalistyczne ? "blue" : "gray"}`}>
            {isSpecjalistyczne ? currentIndex - 19 : 0} z 12
          </span>
        </div>
      </div>

      <div className="timer-section">
        <div className="t-label">
          {questionPhase === "reading" ? "Czas na zapoznanie się" : 
           questionPhase === "playing" ? "Odtwarzanie..." : 
           "Czas na odpowiedź"}
        </div>
        <span className="t-value">
          {questionPhase === "playing" ? "--:--" : formatTime(questionTimeLeft)}
        </span>
      </div>

      <div className="bottom-buttons">
        <button className="btn-next" onClick={goToNextQuestion} disabled={questionPhase === "reading"}>
          Następne pytanie
        </button>
        {questionPhase === "reading" && !isSpecjalistyczne && (
          <button className="btn-next" onClick={startMedia}>
            Pomiń zapoznanie
          </button>
        )}
      </div>
    </div>
  );
}
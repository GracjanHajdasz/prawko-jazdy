import { formatTime } from "./ExamUtils";

export default function ExamRightPanel({ examState }) {
  const {
    currentIndex,
    handleFinishExam,
    questionTimeLeft,
    isReadingPhase,
    goToNextQuestion
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
          Czas na {isReadingPhase ? "zapoznanie się" : "udzielenie odpowiedzi"}
        </div>
        <span className="t-value">{formatTime(questionTimeLeft)}</span>
      </div>

      <button className="btn-next" onClick={goToNextQuestion}>
        Następne pytanie
      </button>
    </div>
  );
}
import "./QuestionTile.css";

export default function QuestionTile({ questionIndex, isCorrect, onClick, isActive }) {
  return (
    <p 
      onClick={onClick} 
      className={`tile ${isCorrect ? "passed" : "failed"} ${isActive ? "active" : ""}`}
    >
      {questionIndex}
    </p>
  );
}
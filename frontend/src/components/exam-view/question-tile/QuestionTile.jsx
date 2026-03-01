import "./QuestionTile.css";

export default function QuestionTile({ questionIndex, isCorrect }) {
  return (
    <p className={`tile ${isCorrect ? "passed" : "failed"}`}>{questionIndex}</p>
  );
}

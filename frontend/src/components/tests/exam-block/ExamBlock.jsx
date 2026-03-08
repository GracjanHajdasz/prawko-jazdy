import { Link } from "react-router-dom";
import "./ExamBlock.css";

export default function ExamBlock({ id, date, status }) {
  return (
    <Link to={`/podglad/${id}`}>
      <p
        className={`exam-block ${status === "passed" ? "passed" : "failed"}`}
      >
        data: {date}{" "}
        {status === "passed" ? <span>Pozytywny</span> : <span>Negatywny</span>}
      </p>
    </Link>
  );
}
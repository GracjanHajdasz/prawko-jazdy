import "./ExamBlock.css";

export default function ExamBlock({ key, date, status }) {
  return (
    <p
      key={key}
      className={`exam-block ${status === "passed" ? "passed" : "failed"}`}
    >
      data: {date}{" "}
      {status === "passed" ? <span>Pozytywny</span> : <span>Negatywny</span>}
    </p>
  );
}

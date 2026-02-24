import "./Exam.css";
import ExamResults from "../exam-results/ExamResults";
import ExamLeftPanel from "./ExamLeftPanel";
import ExamRightPanel from "./ExamRightPanel";
import { useExam } from "./UseExam";
import { formatTime, calculateScore } from "./ExamUtils";

export default function Exam() {
  const examState = useExam();
  const { loading, questions, isExamFinished, answers, examTimeLeft } = examState;

  if (loading || questions.length === 0) return <div>Ładowanie...</div>;

  if (isExamFinished) {
    const results = calculateScore(questions, answers);
    const czasEgzaminuSekundy = 1500 - examTimeLeft;

    return (
      <ExamResults 
        sumaPunktow={results.suma}
        punktyPodstawowe={results.podstawowe}
        punktySpecjalistyczne={results.specjalistyczne}
        czasEgzaminu={formatTime(czasEgzaminuSekundy)}
      />
    );
  }

  return (
    <div className="exam-container">
      <ExamLeftPanel examState={examState} />
      <ExamRightPanel examState={examState} />
    </div>
  );
}